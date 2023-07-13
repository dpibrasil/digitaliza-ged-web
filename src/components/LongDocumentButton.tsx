import { IoStop, IoPlay } from "react-icons/io5";
import { useLongDocument } from "../context/LongDocumentContext";
import { ModalSwitch } from "./Modal";
import InitLongDocumentModal from "../modals/InitLongDocumentModal";

function LongDocumentButton()
{
    const longDocument = useLongDocument()

    return longDocument.longDocument ? <button onClick={() => longDocument.closeDocument()} className={"bg-red-100 hover:bg-red-200 text-red-500 p-2 rounded flex items-center justify-center gap-x-1 h-full text-xs xl:text-sm" }>
        <IoStop />
        Finalizar processo
    </button> : <ModalSwitch
        modal={InitLongDocumentModal}
        button={(props: any) => <button {...props} className={"bg-slate-100 hover:bg-slate-200 p-2 rounded flex items-center justify-center gap-x-1 h-full text-xs xl:text-sm" }>
            <IoPlay />
            Iniciar processo
        </button>}
    />
}

export default LongDocumentButton;