import { IoReload, IoTrash } from "react-icons/io5"
import {FiFilePlus} from "react-icons/fi";
import { useState } from "react";
import Dropdown from "rc-dropdown";
import DropdownMenu from "../../components/DropdownMenu";
import { useDocument } from "../../context/DocumentContext";
import { Page as RenderPage } from "react-pdf";

export default function Page({data, index}: any)
{
    const [showOptions, setShowOptions] = useState(false)
    const documentEdit = useDocument()
    const [fullScreen, setFullScreen] = useState(false)

    function handleDelete() {
        if (!window.confirm(`Você tem certeza que quer deletar a página ${index + 1}?`)) return false
        documentEdit.deletePages([index])
    }

    const handleClick = () => setShowOptions(!showOptions)

    return <div className="flex flex-row items-center justify-center gap-x-1">
        <div className="flex w-[200px] flex-col items-center justify-center">
            <div onClick={handleClick} onDoubleClick={() => setFullScreen(!fullScreen)} className={`bg-blue-500 p-1 flex rounded-lg items-center justify-center cursor-pointer hover:bg-blue-600 ${fullScreen && (`z-[1000] fixed top-1 left-[14rem]`)}`}>
                <RenderPage
                    width={fullScreen ? undefined : 800}
                    height={fullScreen ? window.innerHeight - 16 : undefined}
                    scale={fullScreen ? 1 : 0.2}
                    pageIndex={index}
                    loading="Carregando página..."
                />
            </div>
            <div className="grid grid-flow-col items-center justify-center gap-1">
                <input type="checkbox" name="page" value={index} />
                <h1 className="text-center">{index + 1}</h1>
            </div>
        </div>
        {showOptions && <div className="bg-blue-600 text-white grid grid-flow-row gap-2 rounded p-2">
            <IoTrash className="cursor-pointer" onClick={handleDelete} />
            <IoReload className="cursor-pointer -scale-x-100" onClick={() => documentEdit.rotatePages([index], -90)} />
            <IoReload className="cursor-pointer" onClick={() => documentEdit.rotatePages([index], 90)} />
            <Dropdown
                trigger={['click']}
                overlay={<DropdownMenu.Container>
                    {/* <DropdownMenu.Item onClick={() => addPage('url', sequence)} name="A partir da URL" /> */}
                    <DropdownMenu.Item onClick={() => documentEdit.addPageBy('scanner', index + 1)} name="A partir do scanner" />
                    <DropdownMenu.Item onClick={() => documentEdit.addPageBy('file', index + 1)} name="A partir do arquivo" />
                </DropdownMenu.Container>}
                animation="slide-up"
            >
                <FiFilePlus className="cursor-pointer" />
            </Dropdown>
        </div>}
    </div>
}