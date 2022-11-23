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
    setShow: (show: boolean) => {}
}

function Modal(props: ModalType)
{
    return <div className="fixed top-0 left-0 bg-black/25 w-screen h-screen flex items-center justify-center z-50">
        <div className="drop-shadow-xl bg-white p-4 rounded-lg">
            <button onClick={() => props.setShow(false)} className="bg-neutral-200 hover:bg-neutral-300 text-neutral-500 cursor-pointer p-1 rounded float-right">
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
    return <div className="mb-2">,
        {!!title && <h1 className="font-semibold text-lg">{title}</h1>}
        {!!subtitle && <h2 className="font-normal text-base text-neutral-400">{subtitle}</h2>}
    </div>
}

export default Modal;