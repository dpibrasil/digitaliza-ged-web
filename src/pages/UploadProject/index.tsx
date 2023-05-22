import { IoCloudOfflineOutline } from "react-icons/io5";
import Layout from "../../components/Layout";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import api, { catchApiErrorMessage } from "../../services/api";
import MissingPackagesModal from "../../modals/MissingPackagesModal";

function Project({meta, data}: any)
{
    const [progress, setProgress] = useState<number|string>('Pendente')
    const [missingPackages, setMissingPackages] = useState<number[]>([])
    const [error, setError] = useState<string|undefined>()
    
    function upload()
    {
        if (!document) return toast.error('Faça upload dos arquivos.')
        
        // create document
        const form = new FormData()
        for (const key in meta.data) {
            form.append(key, meta.data[key])
        }
        form.append('file', new Blob([data]))
        setProgress(0)
        setError(undefined)

        api.post('/documents', form, {
            headers: {'Content-Type': 'multipart/form-data'},
            onUploadProgress: (event) => {
                setProgress(Math.round( (event.loaded * 100) / event.total ))
            }
        })
        .catch(e => setError(catchApiErrorMessage(e)))
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
            <td>{meta.documentPagesCount}</td>
            <td>
                <div className="grid grid-flow-col gap-x-2">
                    {error ? <div className="text-red-500 text-xs">{error}</div> : <>
                        {typeof progress == 'number' && <div className="rounded-full w-100 bg-neutral-200 h-4">
                            <div className="h-full bg-blue-500 rounded-full" style={{width: progress + '%'}} />
                        </div>}
                        {typeof progress == 'number' ? progress.toFixed() + '%' : progress}
                    </>}
                </div>
            </td>
            <td>
                {!!document && progress === 'Pendente' && <button onClick={upload} className="bg-blue-500 text-white px-4 py-2 rounded flex items-center justify-center gap-x-1">Upload</button>}
            </td>
        </tr>
    </>
}

function UploadProject()
{
    const [documents, setDocuments] = useState({})

    async function handleChangeInput(event: any)
    {
        const jszip = require('jszip')
        var documentsEntries: any = {}

        for (const file of event.target.files) {
            if (file && file.name.includes('.ged-project')) {
                const zip = await jszip.loadAsync(file)
                const meta = JSON.parse(await zip.file('meta').async('string'))
                const doc = await zip.file('data').async('uint8array')

                documentsEntries[meta.documentId] = { documentId: meta.documentId, meta, data: doc }
            }
        }
        setDocuments(documentsEntries)
    }

    console.log(documents)
    return <Layout title="Arquivos off-line">
        <input
            type="file"
            accept=".ged-project"
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
                    <th>Processo</th>
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