import { useLiveQuery } from "dexie-react-hooks";
import Dropdown from "rc-dropdown";
import React from "react";
import { IoCloudUpload, IoDocumentAttach, IoPrint, IoReload, IoTrash } from "react-icons/io5";
import DropdownMenu from "../../components/DropdownMenu";
import Layout from "../../components/Layout";
import Database from "../../services/database";
import { importPageByFile } from "../../services/document-edit";
import { WorkingDocumentPageType } from "../../types/DocumentTypes";

function Page({sequence}: WorkingDocumentPageType)
{
    return <div className="flex w-[200px] flex-col item-center justify-center">
        <div className="bg-blue-500 w-[200px] h-[200px] rounded-lg"></div>
        <h1 className="text-center">{sequence}</h1>
    </div>
}

function DocumentEdit()
{
    const db = new Database()
    const pages = useLiveQuery(() => db.workingDocumentPages.toArray())

    return <Layout>
        <div className="grid grid-flow-col gap-x-2 text-slate-500 text-sm items-center justify-start mb-3 border-slate-200 border-b pb-3">
            <div className="grid grid-flow-col gap-x-2 border-r pr-3 mr-1 border-slate-200">
                <IoReload size={20} />
                <IoReload size={20} />
                <IoTrash size={20} />
            </div>
            <button className="bg-slate-100 p-2 hover:bg-slate-200 rounded flex items-center justify-center">
                Exportar
                <IoCloudUpload />
            </button>
            <Dropdown
                trigger={['click']}
                overlay={<DropdownMenu.Container>
                    <DropdownMenu.Item name="A partir da URL" />
                    <DropdownMenu.Item name="A partir do scanner" />
                    <DropdownMenu.Item onClick={importPageByFile} name="A partir do arquivo" />
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
            <button className="bg-blue-500 text-white px-4 py-2 rounded">Salvar documento</button>
        </div>
        <div className="grid lg:grid-cols-3 2xl:grid-cols-6 xl:grid-cols-4 grid-cols-1 sm:grid-cols-2 gap-5">
            {pages && pages.map(page => <Page key={page.id} {...page} />)}
        </div>
    </Layout>
}

export default DocumentEdit;