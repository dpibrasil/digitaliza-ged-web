import { useEffect, useState } from "react";
import { useLiveQuery } from "dexie-react-hooks";
import Dropdown from "rc-dropdown";
import { IoArrowForward, IoCloudUpload, IoDocumentAttach, IoPrint, IoReload, IoTrash } from "react-icons/io5";
import DropdownMenu from "../../components/DropdownMenu";
import Layout from "../../components/Layout";
import Database from "../../services/database";
import documentEdit from "../../services/document-edit/pages";
import b64toBlob from "../../services/document-edit/b64toBlob";
import { DocumentType, WorkingDocumentPageType } from "../../types/DocumentTypes";
import { Document, Page as DocumentPage } from 'react-pdf/dist/esm/entry.webpack';
import { downloadBase64 } from "../../services/download";
import { useParams } from "react-router-dom";
import api from "../../services/api";
import EditIndexesModal from "../../modals/EditIndexesModal";
import { ModalSwitch } from "../../components/Modal";
import p from "../../services/document-edit/pages";

const db = new Database()

function Page({id, sequence, data}: WorkingDocumentPageType)
{
    const blob = b64toBlob(data)
    const url = URL.createObjectURL(blob)

    function handleDelete() {
        if (id) documentEdit.delete(id)
    }

    return <Dropdown
        trigger={['click']}
        overlay={<DropdownMenu.Container>
            <DropdownMenu.Item onClick={handleDelete} name="Deletar" />
            <DropdownMenu.Item name="Girar" />
        </DropdownMenu.Container>}
        animation="slide-up"
    >
        <div className="flex w-[200px] flex-col items-center justify-center">
            <div className="bg-blue-500 w-[160px] h-[200px] flex rounded-lg items-center justify-center">
                <Document file={{url}}>
                    <DocumentPage height={190} pageNumber={1} />
                </Document>
            </div>
            <h1 className="text-center">{sequence}</h1>
        </div>
    </Dropdown>
}

function DocumentEdit()
{
    const [document, setDocument] = useState<DocumentType|null>(null)
    const params = useParams()
    const db = new Database()

    useEffect(() => {
        if (params.documentId) {
            api.get('/documents/' + params.documentId)
            .then(({data}) => setDocument(data))
        }
    }, [params])

    const pages = useLiveQuery(() => db.workingDocumentPages.toArray())

    async function exportPdf()
    {
        downloadBase64(await documentEdit.export('base64'), 'preview.pdf')
    }

    async function handleSave(data: any)
    {
        if (document) {
            // update document
        } else {
            // create document
            await documentEdit.save(data.directoryId, data)
        }
    }

    return <Layout>
        <h1 className="text-lg font-semibold mb-3">{document ? `Editando documento de ${document.organization.name} com ID ${document.id}` : 'Editando novo arquivo'}</h1>
        <div className="grid grid-flow-col gap-x-2 text-slate-500 text-sm items-center justify-start mb-3 border-slate-200 border-b pb-3">
            <div className="grid grid-flow-col gap-x-2 border-r pr-3 mr-1 border-slate-200">
                <IoReload size={20} />
                <IoReload size={20} />
                <IoTrash size={20} />
            </div>
            <button onClick={exportPdf} className="bg-slate-100 p-2 hover:bg-slate-200 rounded flex items-center justify-center">
                Exportar
                <IoCloudUpload />
            </button>
            <Dropdown
                trigger={['click']}
                overlay={<DropdownMenu.Container>
                    <DropdownMenu.Item onClick={() => p.add('url')} name="A partir da URL" />
                    <DropdownMenu.Item onClick={() => p.add('scanner')} name="A partir do scanner" />
                    <DropdownMenu.Item onClick={() => p.add('file')} name="A partir do arquivo" />
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