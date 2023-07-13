import { IoCaretForward } from "react-icons/io5";
import { useLongDocument } from "../context/LongDocumentContext";

function LongDocumentHeader()
{
    const longDocument = useLongDocument()
    if (!longDocument.longDocument) return <></>

    return <div className="grid grid-flow-col gap-x-2 text-slate-500 text-sm items-center justify-start mb-3 border-slate-200 border-b pb-3">
        <h1>Processo: <b>{longDocument.document?.name}</b></h1>
        <div className="border-x px-3 mr-1 border-slate-200 text-center">{longDocument.totalPages} páginas salvas.</div>
        <button onClick={() => longDocument.closeCurrentPart()} className="bg-slate-100 p-2 hover:bg-slate-200 rounded flex items-center justify-center gap-x-1 h-full text-xs xl:text-sm">
            <IoCaretForward size={18} />
            Finalizar e exportar parte {longDocument.currentPart}
        </button>
    </div>
}

export default LongDocumentHeader;