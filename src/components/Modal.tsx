import React, { useEffect, useState } from "react";
import { IoClose } from "react-icons/io5";
import ReactGA from 'react-ga4';

export function ModalSwitch({modal: ModalComponent, button: Button, modalProps = {}}: {modal: any, button: any, modalProps?: any})
{
    const ToggleComponent = <Button onClick={() => setShow(true)} />
    const [show, setShow] = useState(false)

    return show ? <>
        <ModalComponent setShow={setShow} {...modalProps} />
        {ToggleComponent}
    </> : ToggleComponent
}

export interface ModalType {
    children: any,
    mode?: 'dark'|'light',
    setShow: (show: boolean) => {}
}

function Modal({mode = 'dark', ...props}: ModalType)
{
    return <div className="fixed top-0 left-0 bg-black/25 w-screen h-screen flex items-center justify-center z-50">
        <div className={`modal ${mode} drop-shadow-xl ${mode == 'dark' ? 'bg-menu text-white' : 'bg-white'} p-4 rounded-lg `}>
            <button onClick={() => props.setShow(false)} className="bg-blue-500 hover:bg-blue-600 text-white cursor-pointer p-1 rounded float-right">
                <IoClose />
            </button>
            <div className="py-4 px-8 w-full h-full min-w-[450px]">{props.children}</div>
        </div>
    </div>
}

export function ModalTitle({title, subtitle}: {title: string, subtitle?: string})
{
    useEffect(() => {
        ReactGA.send({hitType: 'modalview', modal: title})
    }, [title])
    return <div className="mb-4">
        {!!title && <h1 className="font-semibold text-lg text-blue-500">{title}</h1>}
        {!!subtitle && <h2 className="font-normal text-sm text-neutral-200">{subtitle}</h2>}
    </div>
}

export default Modal;