import React, { useEffect, useState } from "react";
import { IoClose } from "react-icons/io5";
import ReactGA from 'react-ga4';
import { Button } from "./ui/button";

export function ModalSwitch({modal: ModalComponent, button: ButtonTrigger, modalProps = {}}: {modal: any, button: any, modalProps?: any})
{
    const ToggleComponent = <ButtonTrigger onClick={() => setShow(true)} />
    const [show, setShow] = useState(false)

    return show ? <>
        <ModalComponent setShow={setShow} {...modalProps} />
        {ToggleComponent}
    </> : ToggleComponent
}

export interface ModalType {
    children?: any,
    mode?: 'dark'|'light',
    setShow: (show: boolean) => void,
    onClose?: () => void
}

function Modal({mode = 'dark', onClose, ...props}: ModalType)
{
    const handleClose = () => {
        if (onClose) onClose()
        props.setShow(false)
    }

    return <div className="fixed top-0 left-0 bg-black/25 w-screen h-screen flex items-center justify-center z-50">
        <div className={`modal ${mode} drop-shadow-xl ${mode === 'dark' ? 'bg-menu text-white' : 'bg-white'} p-4 rounded-lg w-full max-w-lg mx-4`}>
            <div className="flex justify-end mb-1">
                <Button
                    type="button"
                    variant="ghost-blue"
                    size="icon-sm"
                    onClick={handleClose}
                    aria-label="Fechar"
                >
                    <IoClose size={16} />
                </Button>
            </div>
            <div className="py-2 px-4 w-full h-full">{props.children}</div>
        </div>
    </div>
}

export function ModalTitle({title, subtitle}: {title: string, subtitle?: string})
{
    useEffect(() => {
        ReactGA.send({hitType: 'modalview', modal: title})
    }, [title])
    return <div className="mb-4">
        {!!title && <p className="font-semibold text-lg text-primary">{title}</p>}
        {!!subtitle && <p className="font-normal text-sm text-neutral-400 mt-0.5">{subtitle}</p>}
    </div>
}

export default Modal;
