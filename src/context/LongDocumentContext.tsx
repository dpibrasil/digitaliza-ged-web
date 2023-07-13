import React, { useState } from 'react';
import { useDocument } from './DocumentContext';
import { v4 as uuid } from "uuid";
import PDFMeta from '../services/pdf-metadata'
import { downloadBase64, downloadData } from '../services/download';
import { useAuth } from './AuthContext';
import { catchApiErrorMessage } from '../services/api';
import { toast } from 'react-hot-toast';
import { Buffer } from 'buffer';

interface Props {
    document?: {
        data: object,
        name: string
    },
    currentPart: number,
    initDocument: (name: string, data: object) => void,
    closeDocument: () => void,
    longDocument: boolean,
    closeCurrentPart: () => void,
    totalPages: number
}

const LongDocumentContext = React.createContext<Props>({} as Props)

export const LongDocumentContextProvider: React.FC<any> = (props) => {

    const documentEdit = useDocument()
    const auth = useAuth()
    const [documentId, setDocumentId] = useState<string|null>()
    const [document, setDocument] = useState<Props['document']>()
    const [currentPart, setPart] = useState(0)
    const [totalPages, setTotalPages] = useState(0)
    const longDocument = !!currentPart

    async function closeCurrentPart()
    {
        const startDate = new Date()
        try {
            if (!documentEdit.pdfDoc) return
        
            const name = document?.name

            // add meta data
            const meta = {
                name,
                documentId,
                documentPagesCount: documentEdit.numPages,
                data: document?.data,
                pages: documentEdit.pdfDoc.getPageIndices(),
                process: true,
                part: currentPart
            }
            const output = await PDFMeta.setGEDMetaData(documentEdit.pdfDoc, meta)
            downloadData(output, `${name}-part-${currentPart}.ged-process-project`)
            downloadBase64('data:application/txt;base64, ' + Buffer.from(`Nome do documento: ${name};\nID do documento: ${documentId};\nNavegador: ${navigator.userAgent};\nPlataforma: ${navigator.platform};\nTotal de páginas: ${documentEdit.numPages}\nUsuário: ${auth.userData?.name} (${auth.userData?.id});\nData de início da exportação: ${startDate.toLocaleString()};\nData de finalização da exportação: ${new Date().toLocaleString()};\nDados de indexação: ${JSON.stringify(meta)}`).toString('base64'), `${name}-part-${currentPart}-log.txt`)
            setTotalPages(totalPages + documentEdit.numPages)
            setPart(currentPart + 1)
            documentEdit.clear()

        } catch (e) {
            toast.error(catchApiErrorMessage(e))
        }
    }

    function initDocument(name: string, data: object)
    {
        setPart(1)
        setDocumentId(uuid())
        setDocument({name, data})
    }

    function closeDocument()
    {
        setPart(0)
        setTotalPages(0)
        setDocument(undefined)
    }

    return <LongDocumentContext.Provider value={{ document, currentPart, initDocument, closeDocument, longDocument, closeCurrentPart, totalPages }}>
        {props.children}
    </LongDocumentContext.Provider>
}

export const useLongDocument = () => React.useContext(LongDocumentContext)