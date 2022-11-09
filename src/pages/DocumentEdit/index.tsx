import { useEffect, useState } from "react";
import { useLiveQuery } from "dexie-react-hooks";
import Dropdown from "rc-dropdown";
import { IoArrowForward, IoCloudUpload, IoDocumentAttach, IoPrint, IoReload, IoTrash } from "react-icons/io5";
import DropdownMenu from "../../components/DropdownMenu";
import Layout from "../../components/Layout";
import Database from "../../services/database";
import * as documentEdit from "../../services/document-edit/pages";
import { DocumentType } from "../../types/DocumentTypes";
import { downloadBase64 } from "../../services/download";
import { useParams } from "react-router-dom";
import api from "../../services/api";
import EditIndexesModal from "../../modals/EditIndexesModal";
import { ModalSwitch } from "../../components/Modal";
import Page from "./Page";
import toast from "react-hot-toast";

function DocumentEdit()
{
    const db = new Database()
    const [document, setDocument] = useState<DocumentType|null>(null)
    const params = useParams()
    const query = useLiveQuery(() => db.workingDocumentPages.toArray())
    const pages = query?.sort((x, y) => x.sequence - y.sequence)

    useEffect(() => {
        if (params.documentId) {
            api.get('/documents/' + params.documentId)
            .then(({data}) => setDocument(data))
        }
    }, [params])

    const exportPdf = async () => downloadBase64(await documentEdit.export('base64'), 'preview.pdf') 

    async function handleSave(data: any)
    {
        if (document) {
            // update document
        } else {
            // create document
            await documentEdit.save(data.directoryId, data)
        }
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

        if (!window.confirm(`Você tem certeza que quer deletar ${selectedPages.length == 1 ? 'a página selecionada?' : `as ${selectedPages.length} páginas selecionadas?`}`)) return false

        const promise = documentEdit.delete(selectedPages)
        toast.promise(promise, {
            error: (e) => e.message,
            loading: 'Deletando páginas...',
            success: 'Páginas deletadas com sucesso!'
        })
    }

    async function rotatePages(rotation: number)
    {
        const selectedPages = getSelectedPages()
        if (!selectedPages) return

        const promise = documentEdit.rotate(selectedPages, rotation)
        toast.promise(promise, {
            error: (e) => e.message,
            loading: 'Rotacionando páginas...',
            success: 'Páginas rotacionadas com sucesso!'
        })
    }

    return <Layout>
        <h1 className="text-lg font-semibold mb-3">{document ? `Editando documento de ${document.organization.name} com ID ${document.id}` : 'Editando novo arquivo'}</h1>
        <div className="grid grid-flow-col gap-x-2 text-slate-500 text-sm items-center justify-start mb-3 border-slate-200 border-b pb-3">
            <div className="grid grid-flow-col gap-x-2 border-r pr-3 mr-1 border-slate-200">
                <input type="checkbox" onChange={handleCheckboxAllChanges} />
                <IoReload className="-scale-x-100 cursor-pointer" onClick={() => rotatePages(-90)} size={20} />
                <IoReload className="cursor-pointer" onClick={() => rotatePages(-90)} size={20} />
                <IoTrash className="cursor-pointer" onClick={deletePages} size={20} />
            </div>
            <button onClick={exportPdf} className="bg-slate-100 p-2 hover:bg-slate-200 rounded flex items-center justify-center">
                Exportar
                <IoCloudUpload />
            </button>
            <Dropdown
                trigger={['click']}
                overlay={<DropdownMenu.Container>
                    <DropdownMenu.Item onClick={() => documentEdit.add('url')} name="A partir da URL" />
                    <DropdownMenu.Item onClick={() => documentEdit.add('scanner')} name="A partir do scanner" />
                    <DropdownMenu.Item onClick={() => documentEdit.add('file')} name="A partir do arquivo" />
                </DropdownMenu.Container>}
                animation="slide-up"
            >
                <button className="bg-slate-100 p-2 hover:bg-slate-200 rounded flex items-center justify-center">
                    Inserir página
                    <IoDocumentAttach />
                </button>
            </Dropdown>
            <button className="bg-slate-100 p-2 hover:bg-slate-200 rounded flex items-center justify-center">
                Escanear arquivo
                <IoPrint />
            </button>
            <ModalSwitch
                button={(props: any) => <button {...props} className="bg-blue-500 text-white px-4 py-2 rounded flex items-center justify-center">
                    Continuar
                    <IoArrowForward />
                </button>}
                modal={EditIndexesModal}
                modalProps={{directoryId: document?.directoryId, handleSubmit: handleSave}}
            />
        </div>
        <div className="grid lg:grid-cols-3 2xl:grid-cols-6 xl:grid-cols-4 grid-cols-1 sm:grid-cols-2 gap-5">
            {pages && pages.map(page => <Page key={page.id} {...page} />)}
        </div>
    </Layout>
}

export default DocumentEdit;