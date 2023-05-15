import { PDFDocument } from 'pdf-lib';
import React, { useEffect, useState } from 'react';
import readPage from '../services/document-edit/readPage';
import { downloadBase64 } from '../services/download';
import { toast } from 'react-hot-toast';
import api from '../services/api';

interface Props {
    numPages: number,
    exportDocument: (type?: 'base64'|'buffer') => Promise<string|Uint8Array>,
    downloadProject: () => Promise<void>,
    addPageBy: (by: 'file'|'scanner', position: number) => Promise<void>,
    pdfDoc: PDFDocument | null | undefined,
    output: Uint8Array|null,
    deletePages: (indices: number[]) => Promise<string | undefined>,
    updating: boolean,
    add: (data: any, position: number) => Promise<void>
}

const DocumentContext = React.createContext<Props>({} as Props)

export const DocumentContextProvider: React.FC<any> = (props) => {

    const [numPages, setNumPages] = useState<number>(0)
    const [pdfDoc, setPdfDoc] = useState<PDFDocument | null | undefined>()
    const [output, setOutput] = useState<Uint8Array|null>(null)
    const [updating, setUpdating] = useState<boolean>(false)

    const startUpdate = () => setUpdating(true)
    const endUpdate = () => setUpdating(false)

    useEffect(() => {
        pdfDoc?.save().then(output => {
            setOutput(output)
            setNumPages(pdfDoc.getPageCount())
            endUpdate()
        })
    }, [pdfDoc])

    useEffect(() => {
        // initalizate pdf
        startUpdate()
        PDFDocument.create().then(pdf => setPdfDoc(pdf))
    }, [])

    const exportDocument = async (type: 'base64'|'buffer' = 'base64') => {
        if (!pdfDoc) {
            throw Error('O PDF não está carregado.')
        }
        const output = type === 'base64' ? pdfDoc.saveAsBase64({dataUri: true}) : pdfDoc.save()
            return output
    }

    const downloadProject = async () => {
        const data: any = await exportDocument('base64')
        downloadBase64(data, 'draft.pdf')
    }

    const addPageBy = async (by: 'file'|'scanner', position: number = 0) => {
        const data: any = await readPage[by](position)
        if (data) add(data, position)
    }

    const add = async (data: any, position: number = 0) => {
        if (!pdfDoc) {
            toast.error('Aguarde o PDF iniciar.')
            return
        }
        if (!data) {
            toast.error('Você não selecionou arquivos.')
            return
        }
        startUpdate()

        const newPdf = await PDFDocument.create()
        
        const originalPages = await newPdf.copyPages(pdfDoc, pdfDoc.getPageIndices())
        for (var i = 0; i <= originalPages.length; i++) {
            if (i !== 0) {
                const originalPage = originalPages[i - 1]
                newPdf.addPage(originalPage)
            }

            // import PDF Document
            if (i == position && data.includes('application/pdf')) {
                const importPdf = await PDFDocument.load(data)
                const importPdfPages = await newPdf.copyPages(importPdf, importPdf.getPageIndices())

                for (const page of importPdfPages) newPdf.addPage(page)
            }

            // import images
            if (i == position && data.includes('image')) {
                const image =  await newPdf[data.includes('image/jp') ? 'embedJpg' : 'embedPng'](data)
                const { width, height } = image.scale(1)
                const page = newPdf.addPage([width, height])

                page.drawImage(image, {
                    x: 0,
                    y: 0,
                    width: width,
                    height: height,
                })
            }
        }
        setPdfDoc(newPdf)
    }

    const deletePages = async (indices: number[]) => {
        if (!output || !pdfDoc) return toast.error('Aguarde o PDF iniciar.')
        if (numPages == indices.length) {
            return toast.error('Você não pode deletar todas páginas de um documento.')
        }
        startUpdate()
        const pdf = await PDFDocument.create()

        const filteredIndices = pdfDoc.getPageIndices().filter(i => !indices.includes(i))
        const pages = await pdf.copyPages(pdfDoc, filteredIndices)
        pages.forEach(page => pdf.addPage(page))

        setPdfDoc(pdf)
    }
    
    const importFromDocument = async (id: number|string) => {
        startUpdate()
        const { data } = await api.get(`/documents/${id}/file`, {responseType: 'arraybuffer'})
        const i = Buffer.from(data, 'binary')
        // const pdfDoc = await PDFDocument.load(i)
    } 

    return <DocumentContext.Provider value={{ exportDocument, pdfDoc, downloadProject, addPageBy, output, numPages, deletePages, updating, add }}>
        {props.children}
    </DocumentContext.Provider>
}

export const useDocument = () => React.useContext(DocumentContext)