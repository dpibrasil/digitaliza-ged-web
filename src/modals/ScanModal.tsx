import { useState } from "react";
import { toast } from "react-hot-toast";
import Modal, { ModalTitle } from "../components/Modal";
import { Button } from "../components/ui/button";
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
                documentEdit.add(data.map((d: any) => ({file: {type: 'image/jpeg', name: 'image.jpeg'}, data: 'data:image/jpeg;base64,' + d})), position)
                setShow(false)
                return 'Página importada.'
            }
        })
    }

    return <div className="hidden" id="scan-modal">
        <Modal setShow={setShow}>
            <ModalTitle title="Escanear arquivo" />
            <div className="grid grid-flow-row gap-y-3">
                <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold text-primary-text">Frente e verso</label>
                    <input
                        type="checkbox"
                        name="duplex"
                        className="hidden"
                        checked={duplex}
                        readOnly
                    />
                    <label className="checkbox" htmlFor="duplex" onClick={() => setDuplex(!duplex)}></label>
                </div>
                <Button
                    type="button"
                    variant="default"
                    className="w-full"
                    onClick={handleSubmit}
                >
                    Escanear agora
                </Button>
            </div>
        </Modal>
    </div>
}

export default ScanModal;
