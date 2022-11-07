import b64toBlob from "../../services/document-edit/b64toBlob";
import { WorkingDocumentPageType } from "../../types/DocumentTypes";
import { Document, Page as DocumentPage } from 'react-pdf/dist/esm/entry.webpack';
import { IoAdd, IoReload, IoTrash } from "react-icons/io5"
import { useState } from "react";
import {delete as deletePage} from "../../services/document-edit/pages";

export default function Page({id, sequence, data}: WorkingDocumentPageType)
{
    const [showOptions, setShowOptions] = useState(false)
    const blob = b64toBlob(data)
    const url = URL.createObjectURL(blob)

    function handleDelete() {
        if (id) deletePage(id)
    }

    const handleClick = () => setShowOptions(!showOptions)

    return <div className="flex flex-row items-center justify-center">
        <div className="flex w-[200px] flex-col items-center justify-center">
            <div onClick={handleClick} className="bg-blue-500 w-[160px] h-[200px] flex rounded-lg items-center justify-center cursor-pointer hover:bg-blue-600">
                <Document file={{url}}>
                    <DocumentPage height={190} pageNumber={1} />
                </Document>
            </div>
            <div className="grid grid-flow-col items-center justify-center gap-1">
                <input type="checkbox" name="page" value={id} />
                <h1 className="text-center">{sequence}</h1>
            </div>
        </div>
        {showOptions && <div className="bg-blue-600 text-white grid grid-flow-row gap-2 rounded p-2">
            <IoTrash onClick={handleDelete} />
            <IoReload />
            <IoAdd />
        </div>}
    </div>
}