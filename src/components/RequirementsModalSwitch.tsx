import { IoInformation } from "react-icons/io5";
import RequirementsModal from "../modals/RequirementsModal";
import { useEffect, useRef, useState } from "react";
import { useLocalStorage } from "react-use";

function RequirementsModalSwitch()
{
    const inputRef = useRef<any>()
    const [show, setShow] = useState(false)
    const [defaultShowModal, setDefaultShowModal] = useLocalStorage('@first-time-requirements-modal', true)

    useEffect(() => {
        if (defaultShowModal) setShow(true)
    }, [defaultShowModal])

    const ToggleComponent = <button onClick={() => setShow(true)} className="bg-slate-100 p-2 hover:bg-slate-200 rounded flex items-center justify-center gap-x-1 h-full">
        <IoInformation size={18} />
    </button>

    function onClose()
    {
        if (inputRef.current?.checked) {
            setDefaultShowModal(false)
        }
    }

    return show ? <>
        <RequirementsModal onClose={onClose} setShow={setShow}>
            {defaultShowModal && <div className="flex mt-2 flex-row gap-x-2 items-center">
                <input type="checkbox" ref={inputRef} />
                <p>Não mostrar este aviso novamente.</p>
            </div>}
        </RequirementsModal>
        {ToggleComponent}
    </> : ToggleComponent
}

export default RequirementsModalSwitch;