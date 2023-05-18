import { useEffect, useState } from "react";
import { IoArrowBack, IoArrowForward, IoCloudUpload, IoCloudUploadOutline, IoDocumentAttach, IoPrint, IoReload, IoTrash } from "react-icons/io5";
import Layout from "../../components/Layout";
import { DocumentType } from "../../types/DocumentTypes";
import { useParams } from "react-router-dom";
import api, { catchApiErrorMessage } from "../../services/api";
import EditIndexesModal from "../../modals/EditIndexesModal";
import { ModalSwitch } from "../../components/Modal";
import toast from "react-hot-toast";
import { useDocument } from "../../context/DocumentContext";
import { Document as RenderDocument } from 'react-pdf';
import Page from "./Page";

function DocumentEdit()
{
    const itemsPerPage = 50
    const [page, setPage] = useState(0)
    const pageIndex = page*itemsPerPage
    const [document, setDocument] = useState<DocumentType|null>(null)
    const [largeUpload, setLargeUpload] = useState(false)
    const params = useParams()
    const documentEdit = useDocument()

    useEffect(() => {
        if (params.documentId) {
            api.get('/documents/' + params.documentId)
            .then(({data}) => {
                setDocument(data)
            })
        }
    }, [params])

    useEffect(() => {
        window.document.getElementById('pdf-preview-grid')?.scrollTo(0, 1)
    }, [page])

    const exportPdf = async () => documentEdit.downloadProject()

    async function handleSave(data: any)
    {
        if (!documentEdit.output) return
        // create document
        const form = new FormData()
        for (const key in data) {
            form.append(key, data[key])
        }
        form.append('file', new Blob([documentEdit.output]))

        const promise = api.post('/documents', form, {
            headers: {'Content-Type': 'multipart/form-data'}
        })
        toast.promise(promise, {
            loading: 'Salvando documento...',
            error: (e) => {
                const error = catchApiErrorMessage(e)
                return error
            },
            success: () => {
                return 'Documento salvo com sucesso!'
            }
        })
    }

    function getSelectedPages()
    {
        const inputs = window.document.querySelectorAll('input[type="checkbox"][name="page"]')
        const selectedPages = Array.from(inputs).filter((i: any) => i.checked).map((i: any) => Number(i.value))
        if (!selectedPages.length) {
            toast.error('Nenhuma página selecionada')
            return false
        }
        return selectedPages
    }

    function handleCheckboxAllChanges(event: any)
    {
        const inputs = window.document.querySelectorAll('input[type="checkbox"][name="page"]')
        inputs.forEach((input: any) => input.checked = event.target.checked)
    }

    async function deletePages()
    {
        const selectedPages = getSelectedPages()
        if (!selectedPages) return

        if (!window.confirm(`Você tem certeza que quer deletar ${selectedPages.length === 1 ? 'a página selecionada?' : `as ${selectedPages.length} páginas selecionadas?`}`)) return false

        documentEdit.deletePages(selectedPages)
    }

    async function rotatePages(rotation: number)
    {
        const selectedPages = getSelectedPages()
        if (!selectedPages) return

        // const promise = documentEdit.rotate(selectedPages, rotation)
        // toast.promise(promise, {
        //     error: (e) => e.message,
        //     loading: 'Rotacionando páginas...',
        //     success: 'Páginas rotacionadas com sucesso!'
        // })
    }

    const nextPage = () => pageIndex + itemsPerPage < documentEdit.numPages && setPage(page + 1)
    const backPage = () => page > 0 && setPage(page - 1)

    function handleScroll(event: any)
    {
        const element = event.target

        if (element.scrollHeight - element.scrollTop === element.clientHeight || element.scrollTop == 0 && documentEdit.numPages >= page && page !== 0) {
            return element.scrollTop == 0 ? backPage() : nextPage()
        }
    }

    return <Layout title="Editando documento">
        <h1 className="text-lg font-semibold mb-3">{document ? `Editando documento de ${document.organization.name} com ID ${document.id}` : 'Editando novo arquivo'}</h1>
        <div className="grid grid-flow-col gap-x-2 text-slate-500 text-sm items-center justify-start mb-3 border-slate-200 border-b pb-3">
            <div className="grid grid-flow-col gap-x-2 border-r pr-3 mr-1 border-slate-200">
                <input type="checkbox" onChange={handleCheckboxAllChanges} />
                <IoReload className="-scale-x-100 cursor-pointer" onClick={() => rotatePages(-90)} size={20} />
                <IoReload className="cursor-pointer" onClick={() => rotatePages(-90)} size={20} />
                <IoTrash className="cursor-pointer" onClick={deletePages} size={20} />
            </div>
            <div className="grid grid-flow-col gap-x-2 border-r pr-3 mr-1 border-slate-200 items-center">
                <IoArrowBack className="cursor-pointer" onClick={backPage} />
                {page + 1}/{Math.ceil(documentEdit.numPages/itemsPerPage)}
                <IoArrowForward className="cursor-pointer" onClick={nextPage} />
            </div>
            <button onClick={exportPdf} className="bg-slate-100 p-2 hover:bg-slate-200 rounded flex items-center justify-center gap-x-1">
                Exportar
                <IoCloudUpload />
            </button>
            <button onClick={() => documentEdit.addPageBy('file', 0)} className="bg-slate-100 p-2 hover:bg-slate-200 rounded flex items-center justify-center gap-x-1">
                Inserir página
                <IoDocumentAttach />
            </button>
            <button onClick={() => documentEdit.addPageBy('scanner', 0)} className="bg-slate-100 p-2 hover:bg-slate-200 rounded flex items-center justify-center gap-x-1">
                Escanear arquivo
                <IoPrint />
            </button>
            <button onClick={() => setLargeUpload(!largeUpload)} className={`${largeUpload ? 'bg-green-500 hover:bg-green-600 text-white' : 'bg-slate-100 hover:bg-slate-200'} flex-row px-4 py-2 rounded flex items-center justify-center gap-x-1`}>
                Carregamento {largeUpload ? 'otimizado' : 'normal'}
                {largeUpload ? <IoCloudUploadOutline /> : <IoCloudUpload />}
            </button>
            {document ? <button onClick={() => handleSave({})} className="bg-blue-500 text-white px-4 py-2 rounded flex items-center justify-center gap-x-1">
                Atualizar documento
                <IoArrowForward />
            </button> : <ModalSwitch
                button={(props: any) => <button {...props} className="bg-blue-500 text-white px-4 py-2 rounded flex items-center justify-center gap-x-1">
                    Continuar
                    <IoArrowForward />
                </button>}
                modal={EditIndexesModal}
                modalProps={{handleSubmit: handleSave, editingDocument: true}}
            />}
        </div>
        {documentEdit.output ? (
            documentEdit.updating ? <div className="font-semibold text-sm text-center">Atualizando...</div> : <RenderDocument className="h-full" file={{ data: documentEdit.output }}>
                <div className="grid lg:grid-cols-3 2xl:grid-cols-6 xl:grid-cols-4 grid-cols-1 sm:grid-cols-2 gap-5 h-full overflow-y-auto items-start pb-24" onScroll={handleScroll} id="pdf-preview-grid">
                    {Array.from({length: pageIndex + itemsPerPage > documentEdit.numPages ? documentEdit.numPages - pageIndex : itemsPerPage}, (x, i) => i).map(i => <Page key={i} index={pageIndex + i} />)}
                </div>
            </RenderDocument>
        ) : <div className="font-semibold text-sm text-center">Iniciando PDF...</div>}
    </Layout>
}

export default DocumentEdit;