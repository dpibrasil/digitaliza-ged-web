import { PDFDocument, degrees } from 'pdf-lib';
import React, { useEffect, useState } from 'react';
import readPage from '../services/document-edit/readPage';
import { downloadData } from '../services/download';
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
    add: (data: any, position: number) => Promise<void>,
    clear: () => void,
    rotatePages: (indices: number[], rotation: number) => void
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
        if (pdfDoc) {
            pdfDoc.save().then(output => {
                setOutput(output)
                setNumPages(pdfDoc.getPageCount())
                endUpdate()
            })
        } else {
            setOutput(null)
        }
    }, [pdfDoc])

    const exportDocument = async (type: 'base64'|'buffer' = 'base64') => {
        if (!pdfDoc) {
            throw Error('O PDF não está carregado.')
        }
        const output = type === 'base64' ? pdfDoc.saveAsBase64({dataUri: true}) : pdfDoc.save()
            return output
    }

    const clear = () => {
        startUpdate()
        setPdfDoc(undefined)
    }

    const downloadProject = async () => {
        if (output) downloadData(output, 'draft.pdf')
    }

    const addPageBy = async (by: 'file'|'scanner', position: number = 0) => {
        const data: any = await readPage[by](position)
        if (data) add(data, position)
    }

    const add = async (data: any, position: number = 0) => {
        const basePdf = pdfDoc ? pdfDoc : await PDFDocument.create()

        data = Array.isArray(data) ? data : [data]
        if (!data) {
            toast.error('Você não selecionou arquivos.')
            return
        }
        startUpdate()

        try {
            const newPdf = await PDFDocument.create()
        
            const originalPages = pdfDoc ? await newPdf.copyPages(basePdf, basePdf.getPageIndices()) : []
            for (var i = 0; i <= (pdfDoc ? originalPages.length : 1); i++) {
                if (i !== 0 && pdfDoc) {
                    const originalPage = originalPages[i - 1]
                    newPdf.addPage(originalPage)
                }
    
                for (const d of data) {
                    // import PDF Document
                    if (i == position && d.file.type == 'application/pdf') {
                        const importPdf = await PDFDocument.load(d.data)
                        const importPdfPages = await newPdf.copyPages(importPdf, importPdf.getPageIndices())
    
                        for (const page of importPdfPages) newPdf.addPage(page)
                    }
    
                    // import images
                    if (i == position && d.file.type.includes('image')) {
                        const image =  await newPdf[d.file.type.includes('image/jp') ? 'embedJpg' : 'embedPng'](d.data)
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
            }
            setPdfDoc(newPdf)
        } catch (e: any) {
            toast.error(e.message)
            endUpdate()
        }
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

    const rotatePages = async (indices: number[], rotation: number) => {
        startUpdate()
        if (!output || !pdfDoc) return toast.error('Aguarde o PDF iniciar.')
        const pdf = await PDFDocument.load(output)
        const pages = pdf.getPages().filter((v, i) => indices.includes(i))
        pages.forEach(page => page.setRotation(degrees(page.getRotation().angle + rotation)))
        setPdfDoc(pdf)
    }
    
    // const importFromDocument = async (id: number|string) => {
    //     startUpdate()
    //     const { data } = await api.get(`/documents/${id}/file`, {responseType: 'arraybuffer'})
    //     const i = Buffer.from(data, 'binary')
    //     // const pdfDoc = await PDFDocument.load(i)
    // } 

    return <DocumentContext.Provider value={{ clear, exportDocument, pdfDoc, downloadProject, addPageBy, output, numPages, deletePages, updating, add, rotatePages }}>
        {props.children}
    </DocumentContext.Provider>
}

export const useDocument = () => React.useContext(DocumentContext)