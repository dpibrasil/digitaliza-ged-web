import { IoArrowUp } from "react-icons/io5";
import Modal, { ModalType } from "../components/Modal";

function MissingPackagesModal({document, ...props}: ModalType & {document: any})
{
    const packages = Array.from(Array(document.packagesLength).keys()).map(i => i + 1)
    const missingPackages = Array.from(Array(document.packagesLength).keys()).map(i => i + 1).filter(i => !document.packages[i])

    return <Modal {...props}>
        <div className="relative">
            <img className="absolute right-0 top-[-250px] h-80" src={process.env.PUBLIC_URL + '/static/ex.svg'} />
        </div>
        <h1 className="text-base"><b className="text-base">Atenção!</b> Alguns arquivos estão pendentes.</h1>
        <h2 className="text-sm text-neutral-400 w-[60%]">Os arquivos em falta no “upload” estão na cor em <span className="text-red-500 text-sm font-bold">vermelho,</span> verifique e envie os arquivos corretos.</h2>
        <div className="w-[80%] grid grid-cols-5 gap-3 mt-4">
            {packages.map(i => <div key={i} className={missingPackages.includes(i) ? "bg-red-500 items-center justify-center flex font-normal text-sm rounded h-10" : "border border-neutral-200 items-center justify-center flex font-normal text-sm rounded h-10"}>Pacote {i}</div>)}
        </div>
        <div className="mt-8 flex flex-row gap-x-2">
            <label htmlFor="offline-files-input" className="bg-blue-500 text-white px-4 py-2 rounded flex items-center justify-center gap-x-1 text-sm cursor-pointer">
                Subir arquivos
                <IoArrowUp />
            </label>
            <button onClick={() => props.setShow(false)} className="bg-blue-500 text-white px-4 py-2 rounded flex items-center justify-center gap-x-1 text-sm cursor-pointer">
                Continuar
            </button>
        </div>
    </Modal>
}

export default MissingPackagesModal;