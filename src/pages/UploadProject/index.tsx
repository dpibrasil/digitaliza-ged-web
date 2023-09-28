import { IoCloudOfflineOutline } from "react-icons/io5";
import Layout from "../../components/Layout";
import { useState } from "react";
import { toast } from "react-hot-toast";
import api, { catchApiErrorMessage } from "../../services/api";
import MissingPackagesModal from "../../modals/MissingPackagesModal";
import PDFMetadata from "../../services/pdf-metadata";
import { PDFDocument } from "pdf-lib";
import { readFile } from "../../services/document-edit/readPage";

function Project({meta, data, process, parts}: any)
{
    const [progress, setProgress] = useState<number|string>('Pendente')
    const [missingPackages, setMissingPackages] = useState<number[]>([])
    const [error, setError] = useState<string|undefined>()
    const [documentId, setDocumentId] = useState<number|undefined>()
    
    async function upload()
    {
        if (!document) return toast.error('Faça upload dos arquivos.')

        if (process) {
            setProgress('Mesclando páginas...')
            const pdfDoc = await PDFDocument.create()
            for (const part of parts.sort((x: any, y: any) => x.meta.part - y.meta.part)) {
                const pdf = await PDFDocument.load(part.data.data)
                const pages = await pdfDoc.copyPages(pdf, pdf.getPageIndices())
                pages.forEach(page => pdfDoc.addPage(page))
            }
            data = await pdfDoc.save()
        } else {
            data = data.data
        }

        // create document
        const form = new FormData()
        form.append('documentId', meta.documentId)
        for (const key in meta.data) {
            form.append(key, meta.data[key])
        }
        const file = new Blob([data])
        setProgress(0)
        setError(undefined)

        // Validate indexes
        api.post('/documents-indexes/validate', form)
            .catch(e => setError(catchApiErrorMessage(e)))
            .then(() => {
                // Upload
                form.append('file', file)
                api.post('/documents', form, {
                    headers: {'Content-Type': 'multipart/form-data'},
                    onUploadProgress: (event) => {
                        setProgress(Math.round( (event.loaded * 100) / event.total ))
                    }
                })
                    .catch(e => setError(catchApiErrorMessage(e)))
                    .then(({data}: any) => setDocumentId(data.id))
            })
    }

    return <>
        {!!missingPackages.length && <MissingPackagesModal document={document} setShow={(v: boolean) => setMissingPackages(v ? missingPackages : [])} />}
        <tr>
            <td>
                <div className="flex flex-row gap-x-2 items-center">
                    <div className="bg-blue-500 rounded-full w-12 h-12 flex items-center justify-center text-white">
                        <IoCloudOfflineOutline size={24} />
                    </div>
                    <h1 className="font-semibold">{meta.name}</h1>
                </div>
            </td>
            <td>{meta.documentPagesCount} {process && ` (${parts.length} partes)`}</td>
            <td>
                <div className="grid grid-flow-col gap-x-2">
                    {error ? <div className="text-red-500 text-xs">{error}</div> : <>
                        {documentId ? <a href={'/documents/' + documentId} target="_blank" className="text-green-500 text-sm">Concluído</a> : typeof progress == 'number' && <div className="rounded-full w-100 bg-neutral-200 h-4">
                            <div className="h-full bg-blue-500 rounded-full" style={{width: progress + '%'}} />
                        </div>}
                        {typeof progress == 'number' ? progress.toFixed() + '%' : progress}
                    </>}
                </div>
            </td>
            <td>
                {!!document && progress === 'Pendente' && <button onClick={() => upload()} className="bg-blue-500 text-white px-4 py-2 rounded flex items-center justify-center gap-x-1">Upload</button>}
            </td>
        </tr>
    </>
}

function UploadProject()
{
    const [documents, setDocuments] = useState({})

    async function handleChangeInput(event: any)
    {
        var documentsEntries: any = {}

        for (const file of event.target.files) {
            const isProcess = file && file.name.includes('.ged-pp')
            if (file && file.name.includes('.ged-project') || isProcess) {
                const doc: any = await readFile(file, 'readAsArrayBuffer')
                const pdf = await PDFDocument.load(doc.data)
                const meta = await PDFMetadata.readGEDMetaData(pdf)
                const entry = { documentId: meta.documentId, meta, data: doc }

                if (isProcess) {
                    if (!Object.keys(documentsEntries).includes(meta.documentId)) {
                        documentsEntries[meta.documentId] = { process: true, documentId: meta.documentId, meta: {name: meta.name, documentPagesCount: 0, data: meta.data}, parts: [] }
                    }
                    documentsEntries[meta.documentId].parts.push(entry)
                    documentsEntries[meta.documentId].meta.documentPagesCount += Number(entry.meta.documentPagesCount)
                } else {
                    documentsEntries[meta.documentId] = entry
                }
            }
        }
        setDocuments(documentsEntries)
    }

    return <Layout title="Arquivos off-line">
        <input
            type="file"
            accept=".ged-project,.ged-pp"
            multiple={true}
            className="hidden"
            id="offline-files-input"
            onChange={handleChangeInput}
        />
        <div className="flex flex-row justify-between items-center">
            <h1 className="text-lg font-semibold">Arquivos off-line</h1>
            <label htmlFor="offline-files-input" className="bg-blue-500 text-white px-4 py-2 rounded flex items-center justify-center gap-x-1 text-sm cursor-pointer">Subir arquivos</label>
        </div>
        <table className="w-full mt-4">
            <thead>
                <tr>
                    <th>Arquivo</th>
                    <th>Páginas</th>
                    <th>Status</th>
                    <th>Ação</th>
                </tr>
            </thead>
            <tbody>
                {Object.values(documents).map((project: any) => <Project {...project} documents={documents} key={project.documentId} />)}
            </tbody>
        </table>
    </Layout>
}

export default UploadProject;