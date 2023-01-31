import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { IoWarning } from "react-icons/io5";
import Modal from "../components/Modal";
import { catchApiErrorMessage } from "../services/api";
import { addPageByImages } from "../services/document-edit/pages/add";
import { agentApi as api } from "../services/api";

function ScanModal()
{
    const [duplex, setDuplex] = useState(true)
    const [serviceInstalled, setServiceInstalled] = useState(true)

    useEffect(() => {
        api.get('/conn')
        .then(() => setServiceInstalled(true))
        .catch(e => setServiceInstalled(false))
    }, [])

    function setShow(show: boolean)
    {
        const element = document.getElementById('scan-modal')
        element?.setAttribute('class', show ? '' : 'hidden')
    }
    
    async function handleSubmit()
    {
        const promise = api.get('/acquire', {params: {duplex}})

        toast.promise(promise, {
            loading: 'Escaneando...',
            error: catchApiErrorMessage,
            success: ({data}) => {
                addPageByImages(data.map((d: string) => ('data:image/jpeg;base64,' + d)))
                setShow(false)
                return 'Página importada.'
            }
        })

    }

    return <div className="hidden" id="scan-modal">
        {/* @ts-ignore */}
        <Modal setShow={setShow}>
            {!serviceInstalled ? <div className="flex flex-col items-center justify-center">
                <IoWarning size={48} className="text-yellow-400" />
                <h1 className="font-bold text-lg mt-2">Falha ao procurar scanners.</h1>
                <h2 className="font-normal text-sm mt-1">Você precisa instalar o serviço Digitaliza para continuar.</h2>
            </div> : <div className="grid grid-flow-row gap-y-3">
                <h1 className="font-bold text-lg mt-2">Escanear arquivo.</h1>
                <div className="grid grid-flow-col justify-between">
                    <label className="text-xs font-semibold mb-1 text-primary-text">Duplex</label>
                    <input
                        type="checkbox"
                        name="duplex"
                        className="hidden"
                        onChange={(event: any) => setDuplex(event.target.checked)}
                        checked={duplex}
                    />
                    <label className="checkbox" htmlFor="duplex"></label>
                </div>
            <button onClick={handleSubmit} className="bg-blue-500 hover:bg-blue-600 disabled:bg-neutral-100 disabled:text-neutral-400 disabled:cursor-not-allowed rounded w-full py-3 text-sm text-white">Escanear agora</button>
            </div>}
        </Modal>
    </div>
}

export default ScanModal;