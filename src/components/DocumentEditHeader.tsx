import { IoArrowBack, IoArrowForward, IoCaretForward, IoCloudUpload, IoDocumentAttach, IoPlay, IoPrint, IoReload, IoStop, IoTrash } from "react-icons/io5";
import { useDocument } from "../context/DocumentContext";
import { toast } from "react-hot-toast";
import EditIndexesModal from "../modals/EditIndexesModal";
import api, { catchApiErrorMessage } from "../services/api";
import { ModalSwitch } from "./Modal";
import RequirementsModalSwitch from "./RequirementsModalSwitch";
import LongDocumentHeader from "./LongDocumentHeader";
import LongDocumentButton from "./LongDocumentButton";

function DocumentEditHeader({page, setPage, pageIndex, itemsPerPage, document}: any)
{
    const documentEdit = useDocument()

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

        documentEdit.rotatePages(selectedPages, rotation)
    }

    const nextPage = () => pageIndex + itemsPerPage < documentEdit.numPages && setPage(page + 1)
    const backPage = () => page > 0 && setPage(page - 1)

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

        const promise = api.post(document ? `/documents/${document.id}/versions` : '/documents', form, {
            headers: {'Content-Type': 'multipart/form-data'}
        })
        toast.promise(promise, {
            loading: 'Salvando documento...',
            error: (e) => catchApiErrorMessage(e),
            success: 'Documento salvo com sucesso!'
        })
    }

    return <>
        <div className="grid grid-flow-col gap-x-2 text-slate-500 text-sm items-center justify-start mb-3 border-slate-200 border-b pb-3 overflow-x-auto">
            <div className="grid grid-flow-col gap-x-2 border-r pr-3 mr-1 border-slate-200">
                <input type="checkbox" onChange={handleCheckboxAllChanges} />
                <IoReload className="-scale-x-100 cursor-pointer" onClick={() => rotatePages(-90)} size={20} />
                <IoReload className="cursor-pointer" onClick={() => rotatePages(-90)} size={20} />
                <IoTrash className="cursor-pointer" onClick={deletePages} size={20} />
            </div>
            <div className="grid grid-flow-col gap-x-2 border-r pr-3 mr-1 border-slate-200 items-center text-center">
                <IoArrowBack className="cursor-pointer" onClick={backPage} />
                {page + 1}/{Math.ceil(documentEdit.numPages/itemsPerPage)}
                <IoArrowForward className="cursor-pointer" onClick={nextPage} />
            </div>
            <div className="border-r pr-3 mr-1 border-slate-200 text-center">{documentEdit.numPages} páginas.</div>
            <button onClick={exportPdf} className="bg-slate-100 p-2 hover:bg-slate-200 rounded flex items-center justify-center gap-x-1 h-full text-xs xl:text-sm">
                Exportar
                <IoCloudUpload />
            </button>
            <button onClick={() => documentEdit.addPageBy('file', 0)} className="bg-slate-100 p-2 hover:bg-slate-200 rounded flex items-center justify-center gap-x-1 h-full text-xs xl:text-sm">
                Inserir página
                <IoDocumentAttach />
            </button>
            <button onClick={() => documentEdit.addPageBy('scanner', 0)} className="bg-slate-100 p-2 hover:bg-slate-200 rounded flex items-center justify-center gap-x-1 h-full text-xs xl:text-sm">
                Escanear arquivo
                <IoPrint />
            </button>
            {document ? <button onClick={() => handleSave({})} className="bg-blue-500 text-white px-4 py-2 rounded flex items-center justify-center gap-x-1 h-full text-xs xl:text-sm">
                Atualizar documento
                <IoArrowForward />
            </button> : <ModalSwitch
                button={(props: any) => <button {...props} className="bg-blue-500 text-white px-4 py-2 rounded flex items-center justify-center gap-x-1 h-full text-xs xl:text-sm">
                    Continuar
                    <IoArrowForward />
                </button>}
                modal={EditIndexesModal}
                modalProps={{ editingDocument: true }}
            />}
            <LongDocumentButton />
            <RequirementsModalSwitch />
        </div>
        <LongDocumentHeader />
    </>
}

export default DocumentEditHeader;