import { IoChevronForward } from "react-icons/io5";
import Modal, { ModalTitle, ModalType } from "../components/Modal";
import EditIndexesModal from "./EditIndexesModal";
import { useRef, useState } from "react";
import { useLongDocument } from "../context/LongDocumentContext";
import { toast } from "react-hot-toast";

function InitLongDocumentModal(props: ModalType)
{
    const longDocument = useLongDocument()
    const inputRef = useRef<any>()
    const [showIndexesModal, setShowIndexesModal] = useState(false)

    function handleSubmit(data: any)
    {
        const name = inputRef.current?.value
        if (!name) return toast.error('Preencha um nome.')
        longDocument.initDocument(name, data)
    }

    return <>
        <Modal {...props}>
            <ModalTitle title="Iniciar processo" subtitle="Crie um novo processo longo (+2000 páginas)." />
            <div>
                <label className="text-xs font-semibold mb-1 text-primary-text">Nome do processo</label>
                <div className="bg-neutral-200 rounded">
                    <div className="flex flex-col w-full mb-2">
                        <input ref={inputRef} type="text" className="rounded bg-neutral-100 py-1 px-3 min-h-[35px] text-sm text-black false" />
                    </div>
                </div>
            </div>
            <button onClick={() => setShowIndexesModal(true)} className="bg-green-500 rounded text-white px-3 py-2 text-sm flex items-center justify-center w-full">
                <IoChevronForward />
                Preencher indexação
            </button>
        </Modal>
        {showIndexesModal && <EditIndexesModal
            setShow={(v: boolean) => setShowIndexesModal(v)}
            handleSubmit={handleSubmit}
            editingDocument={false}
        />}
    </>
}

export default InitLongDocumentModal;