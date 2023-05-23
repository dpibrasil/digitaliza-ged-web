import { useState } from "react";
import { toast } from "react-hot-toast";
import Modal from "../components/Modal";
import { catchApiErrorMessage } from "../services/api";
import { agentApi as api } from "../services/api";
import { useDocument } from "../context/DocumentContext";

function ScanModal()
{
    const [duplex, setDuplex] = useState(true)
    const documentEdit = useDocument()

    function setShow(show: boolean)
    {
        const element = document.getElementById('scan-modal')
        element?.setAttribute('class', show ? '' : 'hidden')
    }
    
    async function handleSubmit()
    {
        var position = Number(document.getElementById('document-position')?.getAttribute('value'))
        const promise = api.get('/acquire', {params: {duplex}})

        toast.promise(promise, {
            loading: 'Escaneando...',
            error: catchApiErrorMessage,
            success: ({data}) => {
                documentEdit.add(data.map((d: any) => ({file: {type: 'image/jpeg'}, data: 'data:image/jpeg;base64,' + d})), position)
                setShow(false)
                return 'Página importada.'
            }
        })

    }

    return <div className="hidden" id="scan-modal">
        <Modal setShow={setShow}>
            <div className="grid grid-flow-row gap-y-3">
                <h1 className="font-bold text-lg mt-2">Escanear arquivo.</h1>
                <div className="grid grid-flow-col justify-between">
                    <label className="text-xs font-semibold mb-1 text-primary-text">Frente e verso</label>
                    <input
                        type="checkbox"
                        name="duplex"
                        className="hidden"
                        checked={duplex}
                    />
                    <label className="checkbox" htmlFor="duplex" onClick={() => setDuplex(!duplex)}></label>
                </div>
            <button onClick={handleSubmit} className="bg-blue-500 hover:bg-blue-600 disabled:bg-neutral-100 disabled:text-neutral-400 disabled:cursor-not-allowed rounded w-full py-3 text-sm text-white">Escanear agora</button>
            </div>
        </Modal>
    </div>
}

export default ScanModal;