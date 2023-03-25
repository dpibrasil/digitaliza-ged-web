import { PDFDocument } from 'pdf-lib';
import React from 'react';
import { useList } from 'react-use';
import Database from '../services/database';
import readPage from '../services/document-edit/readPage';
import { downloadBase64 } from '../services/download';

interface Props {
    pages: string[],
    add: (data: string, position?: number) => void,
    remove: (position: number) => void,
    clear: () => void,
    exportDocument: (type?: 'base64'|'buffer') => Promise<string|Uint8Array>,
    downloadProject: () => Promise<void>,
    addPageBy: (by: 'file'|'scanner', position: number) => Promise<void>,
    save: (directoryId: number, indexes: any) => void
}

const DocumentContext = React.createContext<Props>({} as Props)

export const DocumentContextProvider: React.FC<any> = (props) => {

    const [pages, { insertAt, removeAt, clear }] = useList<string>([])

    const add = (data: string, position = 0) => insertAt(position, data)
    const remove = (position: number) => removeAt(position)

    const exportDocument = async (type: 'base64'|'buffer' = 'base64') => {
        const pdf = await PDFDocument.create()

        for (const data of pages) {
            // Create a new page with the same size as the image
            const image = data.includes('image/jp') ? await pdf.embedJpg(data) : await pdf.embedPng(data)
            const { width, height } = image.scale(0.5)
            const page = pdf.addPage([width, height])

            // Draw the image onto the page
            const pngDims = image.scale(0.5)
            page.drawImage(image, {
                x: 0,
                y: 0,
                width: pngDims.width,
                height: pngDims.height,
            })
        }

        return type === 'base64' ? pdf.saveAsBase64({dataUri: true}) : pdf.save()
    }

    const downloadProject = async () => {
        const data: any = await exportDocument('base64')
        downloadBase64(data, 'draft.gedproject')
    }

    const save = async (directoryId: number, indexes: any) => {
        const buffer = await exportDocument('buffer')
        const db = new Database()
        db.documentsQueue.add({
            directoryId, indexes,
            data: buffer,
            synced: false,
            createdAt: new Date()
        })
    }

    const addPageBy = async (by: 'file'|'scanner', position: number = 0) => {
        const data: any = await readPage[by]()
        for (const page of data) {
            add(page, position)
        }
    }
    
    // const importFromDocument = async (id: number|string) => {
    //     const { data } = await api.get(`/documents/${id}/file`, {responseType: 'arraybuffer'})
    //     const i = Buffer.from(data, 'binary')
    //     const pdfDoc = await PDFDocument.load(i)
    // } 

    return <DocumentContext.Provider value={{pages, add, remove, clear, exportDocument, downloadProject, addPageBy, save}}>
        {props.children}
    </DocumentContext.Provider>
}

export const useDocument = () => React.useContext(DocumentContext)