import { IoArrowBack, IoArrowForward, IoCloudUpload, IoDocumentAttach, IoPrint, IoReload, IoTrash } from "react-icons/io5";
import { useDocument } from "../context/DocumentContext";
import { toast } from "react-hot-toast";
import EditIndexesModal from "../modals/EditIndexesModal";
import api, { catchApiErrorMessage } from "../services/api";
import { ModalSwitch } from "./Modal";
import { Button } from "./ui/button";
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
        <div className="flex flex-wrap gap-2 text-slate-500 text-sm items-center justify-start mb-3 border-slate-200 border-b pb-3 overflow-x-auto">
            <div className="flex items-center gap-2 border-r pr-3 mr-1 border-slate-200">
                <input type="checkbox" onChange={handleCheckboxAllChanges} />
                <button type="button" onClick={() => rotatePages(-90)} title="Girar anti-horário" className="hover:text-primary transition-colors">
                    <IoReload className="-scale-x-100" size={18} />
                </button>
                <button type="button" onClick={() => rotatePages(90)} title="Girar horário" className="hover:text-primary transition-colors">
                    <IoReload size={18} />
                </button>
                <button type="button" onClick={deletePages} title="Excluir páginas" className="hover:text-danger transition-colors">
                    <IoTrash size={18} />
                </button>
            </div>
            <div className="flex items-center gap-2 border-r pr-3 mr-1 border-slate-200">
                <button type="button" onClick={backPage} className="hover:text-primary transition-colors">
                    <IoArrowBack size={18} />
                </button>
                <span className="text-xs tabular-nums">{page + 1}/{Math.ceil(documentEdit.numPages/itemsPerPage)}</span>
                <button type="button" onClick={nextPage} className="hover:text-primary transition-colors">
                    <IoArrowForward size={18} />
                </button>
            </div>
            <span className="border-r pr-3 mr-1 border-slate-200 text-xs text-neutral-500">{documentEdit.numPages} páginas</span>
            <Button type="button" variant="ghost" size="sm" onClick={exportPdf} className="gap-1.5">
                Exportar
                <IoCloudUpload size={14} />
            </Button>
            <Button type="button" variant="ghost" size="sm" onClick={() => documentEdit.addPageBy('file', 0)} className="gap-1.5">
                Inserir página
                <IoDocumentAttach size={14} />
            </Button>
            <Button type="button" variant="ghost" size="sm" onClick={() => documentEdit.addPageBy('scanner', 0)} className="gap-1.5">
                Escanear arquivo
                <IoPrint size={14} />
            </Button>
            {document ? (
                <Button type="button" variant="default" size="sm" onClick={() => handleSave({})} className="gap-1.5">
                    Atualizar documento
                    <IoArrowForward size={14} />
                </Button>
            ) : (
                <ModalSwitch
                    button={(props: any) => (
                        <Button type="button" variant="default" size="sm" className="gap-1.5" {...props}>
                            Continuar
                            <IoArrowForward size={14} />
                        </Button>
                    )}
                    modal={EditIndexesModal}
                    modalProps={{ editingDocument: true }}
                />
            )}
            <LongDocumentButton />
            <RequirementsModalSwitch />
        </div>
        <LongDocumentHeader />
    </>
}

export default DocumentEditHeader;
