import b64toBlob from "../../services/document-edit/b64toBlob";
import { WorkingDocumentPageType } from "../../types/DocumentTypes";
import { Document, Page as DocumentPage } from 'react-pdf/dist/esm/entry.webpack';
import { IoReload, IoTrash } from "react-icons/io5"
import {FiFilePlus} from "react-icons/fi";
import { useMemo, useState } from "react";
import {delete as deletePage, add as addPage, rotate as rotatePage} from "../../services/document-edit/pages";
import Dropdown from "rc-dropdown";
import DropdownMenu from "../../components/DropdownMenu";

export default function Page({id, sequence, data}: WorkingDocumentPageType)
{
    const [showOptions, setShowOptions] = useState(false)

    const View = useMemo(() => {
        const blob = b64toBlob(data)
        const url = URL.createObjectURL(blob)
        return <Document className="text-white" loading="Carregando página..." file={{url}}>
            <DocumentPage loading="Carregando página..." height={190} width={150} pageNumber={1} />
        </Document>
    }, [data])

    function handleDelete() {
        if (!window.confirm(`Você tem certeza que quer deletar a página ${sequence}?`)) return false
        if (id) deletePage(id)
    }

    const handleClick = () => setShowOptions(!showOptions)

    return <div className="flex flex-row items-center justify-center">
        <div className="flex w-[200px] flex-col items-center justify-center">
            <div onClick={handleClick} className="bg-blue-500 p-1 flex rounded-lg items-center justify-center cursor-pointer hover:bg-blue-600">
                {View}
            </div>
            <div className="grid grid-flow-col items-center justify-center gap-1">
                <input type="checkbox" name="page" value={id} />
                <h1 className="text-center">{sequence}</h1>
            </div>
        </div>
        {showOptions && <div className="bg-blue-600 text-white grid grid-flow-row gap-2 rounded p-2">
            <IoTrash className="cursor-pointer" onClick={handleDelete} />
            <IoReload className="cursor-pointer -scale-x-100" onClick={() => rotatePage(id ?? 0, -90)} />
            <IoReload className="cursor-pointer" onClick={() => rotatePage(id ?? 0, 90)} />
            <Dropdown
                trigger={['click']}
                overlay={<DropdownMenu.Container>
                    <DropdownMenu.Item onClick={() => addPage('url', sequence)} name="A partir da URL" />
                    <DropdownMenu.Item onClick={() => addPage('scanner', sequence)} name="A partir do scanner" />
                    <DropdownMenu.Item onClick={() => addPage('file', sequence)} name="A partir do arquivo" />
                </DropdownMenu.Container>}
                animation="slide-up"
            >
                <FiFilePlus className="cursor-pointer" />
            </Dropdown>
        </div>}
    </div>
}