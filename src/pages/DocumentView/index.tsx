import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { IoCreate } from "react-icons/io5";
import { useParams } from "react-router-dom";
import Layout from "../../components/Layout";
import { ModalSwitch } from "../../components/Modal";
import PDFViewer from "../../components/PDFViewer";
import EditIndexesModal from "../../modals/EditIndexesModal";
import api, { catchApiErrorMessage } from "../../services/api";
import { displayIndex } from "../../services/helpers";
import { DocumentType } from "../../types/DocumentTypes";

function DocumentView()
{
    const [document, setDocument] = useState<DocumentType|null>(null)
    const {documentId} = useParams()

    useEffect(() => {
        api.get('/documents/' + documentId)
        .then(({data}) => setDocument(data))
        .catch(e => catchApiErrorMessage(e))
    }, [documentId])

    async function handleEditIndexes(data: any) {
        if (!document) return
        const promise = api.put(`/documents/${document.id}/indexes`, data)

        toast.promise(promise, {
            success: ({data}) => {
                setDocument({...document, indexes: data})
                return 'Índices salvos com sucesso!'
            },
            error: catchApiErrorMessage,
            loading: 'Salvando índices...'
        })
    }

    return <Layout title="Documento">
        {document ? <>
            <h1 className="text-lg font-semibold mb-4">Visualização do documento</h1>
            <div className="grid grid-cols-5 gap-x-8 gap-y-6">
                <div className="bg-menu rounded-lg p-6 col-span-5 md:col-span-2">
                    <div className="flex items-center justify-start">
                        <img alt="Cliente" className="w-10 h-10 rounded-lg bg-white" />
                        <div className="flex flex-col ml-3">
                            <h1 className="text-slate-400 text-sm">Cliente:</h1>
                            <h2 className="text-slate-400 text-sm">{document.organization.name}</h2>
                        </div>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="indexes-table mt-2">
                            <tbody>
                                <tr>
                                    <th>Grupo:</th>
                                    <td>Digitaliza</td>
                                </tr>
                                <tr>
                                    <th>Criado por:</th>
                                    <td>{document.editor.name}</td>
                                </tr>
                                <tr>
                                    <th>Criado em:</th>
                                    <td>{new Date(document.createdAt).toLocaleDateString()}</td>
                                </tr>
                                <tr>
                                    <th>Atualizado em:</th>
                                    <td>{new Date(document.updatedAt).toLocaleDateString()}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
                <div className="bg-menu col-span-5 md:col-span-3 rounded-lg p-6">
                    <div className="flex flex-row justify-between w-full items-center">
                        <h1 className="text-white font-medium">Índices</h1>
                        <ModalSwitch
                            modal={EditIndexesModal}
                            modalProps={{directoryId: document.directoryId, values: document.indexes, handleSubmit: handleEditIndexes}}
                            button={(props: any) => <button {...props} className="bg-white hover:bg-neutral-100 py-2 px-3 text-slate-600 rounded flex flex-row align-center justify-center">
                                <h1 className="text-[12px] mr-2">Editar índices</h1>
                                <IoCreate size={16} />
                            </button>}
                        />
                    </div>
                    <div className="overflow-x-auto">
                        <table className="indexes-table mt-2">
                            <tbody>
                                {document.indexes
                                    .sort((a, b) => a.id - b.id)
                                    .map(index => (
                                        <tr key={index.id}>
                                            <th>{index.name}</th>
                                            <td>{displayIndex(index, index.value)}</td>
                                        </tr>
                                    ))}
                            </tbody>
                        </table>
                    </div>
                </div>
                <PDFViewer document={document} url={`${api.defaults.baseURL}/documents/${document.id}/file`} />
            </div>
        </> : <>Carregando...</>}
    </Layout>
}

export default DocumentView;