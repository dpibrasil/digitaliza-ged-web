import { v4 as uuid } from "uuid";
import Modal, { ModalTitle, ModalType } from "../components/Modal";
import { useAuth } from "../context/AuthContext";
import { useDocument } from "../context/DocumentContext";
import { downloadBase64, downloadData } from "../services/download";
import { useRef, useState } from "react";
import { toast } from "react-hot-toast";
import { Buffer } from "buffer";
import jszip from 'jszip'

const DOC_PACKAGE_SIZE = Number(process.env.REACT_APP_DOCUMENT_PACKAGE_SIZE)

function Card({label, value}: {label: string, value: any})
{
    return <div className="border-2 border-blue-500 rounded-lg flex flex-row">
        <div className="flex items-center justify-center h-10 bg-blue-500 rounded-r-lg w-24 text-center text-xs">{label}</div>
        <div className="flex items-center justify-center text-neutral-300 w-full">{value}</div>
    </div>
}

function ExportDocumentModal({form, organization, directory, ...props}: ModalType & {form: any, organization: any, directory: any})
{   
    const [exporting, setExporting] = useState(false)
    const data = form.getData()
    const auth = useAuth()
    const documentEdit = useDocument()
    const inputRef = useRef<any>()

    const startDate = new Date()
    const totalPages = documentEdit.numPages
    
    async function handleExport()
    {
        if (!documentEdit.output || !documentEdit.pdfDoc) return

        const name = inputRef.current.value
        if (!name || !name.length) return toast.error('Preencha um nome para o arquivo.')
        
        var documentId = uuid()
        const zip = new jszip()

        // add pdf to zip
        console.log('convert to blob')
        const blob = new Blob([documentEdit.output])
        console.log('add file to zip')
        zip.file('data', blob)
        console.log('ok')

            
        // add meta data
        const meta = {
            name,
            documentId,
            packageSize: DOC_PACKAGE_SIZE,
            documentPagesCount: documentEdit.numPages,
            data,
            pages: documentEdit.pdfDoc.getPageIndices()
        }
        zip.file('meta', JSON.stringify(meta))

        // export
        const zipOutput = await zip.generateAsync({ type: 'uint8array' })
        downloadData(zipOutput, `${name}.ged-project`)
        downloadBase64('data:application/txt;base64, ' + Buffer.from(`Nome do documento: ${name};\nID do documento: ${documentId};\nNavegador: ${navigator.userAgent};\nPlataforma: ${navigator.platform};\nTamanho do pacote: ${DOC_PACKAGE_SIZE};\nTotal de páginas: ${documentEdit.numPages}\nUsuário: ${auth.userData?.name} (${auth.userData?.id});\nData de início da exportação: ${startDate.toLocaleString()};\nData de finalização da exportação: ${new Date().toLocaleString()};\nDados de indexação: ${JSON.stringify(data)}`).toString('base64'), `${name}-log.txt`)
    }
    
    return <Modal {...props}>
        <ModalTitle title="Dados de exportação" subtitle="Verifique os dados abaixo sobre o arquivo." />
        {exporting ? <>Exportando...</> : <>
            <div className="grid grid-cols-2 gap-x-1 gap-y-2">
                <Card label="Usuário" value={auth.userData?.name ?? ''} />
                <Card label="Data" value={startDate.toLocaleString().slice(0, -3)} />
                <Card label="Empresa" value={organization.name} />
                <Card label="Diretório" value={directory.name} />
                <Card label="Páginas" value={totalPages.toString()} />
                <div className="border-2 border-neutral-400 rounded-lg flex flex-row">
                    <div className="flex items-center justify-center h-10 bg-neutral-400 rounded-r-lg w-24 text-center text-xs text-slate-800">Nome</div>
                    <div className="flex items-center justify-center w-full">
                        <input
                            placeholder="Digite aqui"
                            className="bg-transparent px-4 flex items-center justify-center text-white w-32 outline-0"
                            ref={inputRef}
                        />
                    </div>
                </div>
            </div>
            <div className="grid grid-flow-col mt-2 gap-x-2 w-full">
                <div
                    onClick={() => props.setShow(false)}
                    className="border-2 border-neutral-300 rounded text-white px-3 py-2 text-sm flex items-center justify-center cursor-pointer">Cancelar</div>
                <div 
                    onClick={async () => {
                        setExporting(true)
                        await handleExport()
                        setExporting(false)
                    }}
                    className="bg-blue-500 rounded text-white px-3 py-2 text-sm flex items-center justify-center cursor-pointer"
                >Exportar</div>
            </div>
        </>}
    </Modal>
}

export default ExportDocumentModal;