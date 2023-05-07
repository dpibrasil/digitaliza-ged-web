import { IoCloudOfflineOutline } from "react-icons/io5";
import Layout from "../../components/Layout";
import { useState } from "react";
import { toast } from "react-hot-toast";
import api from "../../services/api";
import MissingPackagesModal from "../../modals/MissingPackagesModal";

function Project({name, packagesLength, totalPages, documentId, documents}: any)
{
    const document = documents[documentId]
    const [progress, setProgress] = useState<number|string>('Pendente')
    const [missingPackages, setMissingPackages] = useState<number[]>([])
    
    async function upload()
    {
        if (!document) return toast.error('Faça upload dos arquivos.')
        
        // Verifica se existe pacotes faltando
        const missingParts = Array.from(Array(document.packagesLength).keys()).map(i => i + 1).filter(i => !document.packages[i])
        if (missingParts.length) return setMissingPackages(missingParts)

        // upload images to server
        const {data: pdf} = await api.post('/pdfs')
        for (var i = 1; i <= document.packagesLength; i++) {
            for (const pageIndex of Object.keys(document.packages[i].pages)) {
                const page = document.packages[i].pages[pageIndex]
                const form = new FormData()
                form.append('index', pageIndex)
                form.append('image', page)
                await api.post(`/pdfs/${pdf.id}/image`, form)
                setProgress(i*100/document.packagesLength)
            }
        }

        // export pdfId from server
        const {data: output} = await api.get(`/pdfs/${pdf.id}/export`)

        // create document
        const form = new FormData()
        for (const key in document.data) {
            form.append(key, document.data[key])
        }
        form.append('pdfId', output.id)

        await api.post('/documents', form, {
            headers: {'Content-Type': 'multipart/form-data'}
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
                    <h1 className="font-semibold">{name}</h1>
                </div>
            </td>
            <td>{packagesLength}</td>
            <td>{totalPages}</td>
            <td>
                <div className="grid grid-flow-col gap-x-2">
                    {typeof progress == 'number' && <div className="rounded-full w-100 bg-neutral-200 h-4">
                        <div className="h-full bg-blue-500 rounded-full" style={{width: progress + '%'}} />
                    </div>}
                    {typeof progress == 'number' ? progress.toFixed() + '%' : progress}
                </div>
            </td>
            <td>
                {!!document && <button onClick={upload} className="bg-blue-500 text-white px-4 py-2 rounded flex items-center justify-center gap-x-1">Upload</button>}
            </td>
        </tr>
    </>
}

function UploadProject()
{
    const [documents, setDocuments] = useState({})

    const projects = Object.values(documents).map((i: any) => ({name: i.name, documentId: i.documentId, totalPages: i.documentPagesCount, packagesLength: i.packagesLength}))

    async function handleChangeInput(event: any)
    {
        const newDocuments: any = {...documents}
        const jszip = require('jszip')
        for (const file of event.target.files) {
            if (file.name.includes('.ged-part-project')) {
                const zip = await jszip.loadAsync(file)
                const meta = JSON.parse(await zip.file('meta').async('string'))
                const pages = Object.fromEntries(await Promise.all(meta.pages.map(async (pageNumber: number) => {
                    const pageFileName = `page-${meta.documentId}-${meta.package}-${pageNumber}`
                    const page = await zip.file(pageFileName).async('blob')
                    return [pageNumber, page]
                })))

                if (!newDocuments[meta.documentId]) newDocuments[meta.documentId] = {
                    ...meta,
                    package: undefined,
                    pages: undefined,
                    packages: {}
                }
                newDocuments[meta.documentId].packages[meta.package] = {...meta, pages}
            }
        }
        setDocuments(newDocuments)
    }

    return <Layout title="Arquivos off-line">
        <input
            type="file"
            accept=".ged-part-project"
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
                    <th>Partes</th>
                    <th>Páginas</th>
                    <th>Processo</th>
                    <th>Ação</th>
                </tr>
            </thead>
            <tbody>
                {projects.map(project => <Project {...project} documents={documents} key={project.documentId} />)}
            </tbody>
        </table>
    </Layout>
}

export default UploadProject;