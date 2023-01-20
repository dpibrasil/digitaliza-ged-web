import React, { useState } from "react";

type ContainerProps = {
    children: any[],
    elementClassName?: string,
    validate?: (step: number, currentStep: number, next: boolean) => Promise<boolean>
}

function Container({elementClassName, validate, ...props}: ContainerProps)
{
    const steps = props.children.map((step, index) => ({
        index: index + 1,
        name: step.props.name,
        subtitle: step.props.subtitle,
        element: step.props.children
    }))
    const [currentStep, setCurrentStep] = useState(1)

    async function changeStep(step: number)
    {
        if (step > steps.length || step <= 0) return false
        if (validate && !await validate(step, currentStep, step - currentStep >= 0)) {
            return false
        }

        setCurrentStep(step)
    }

    const backStep = () => changeStep(currentStep - 1)
    const nextStep = () => changeStep(currentStep + 1)

    return <div className="flex flex-row`">
        <div className="border-r border-slate-200">
            <div className="grid grid-flow-row gap-y-8 pr-4 h-0">
                {steps.map(step => <div onClick={() => setCurrentStep(step.index)} key={step.index} className="flex flex-row items-center justify-start cursor-pointer">
                    <div className={`w-10 h-10 flex items-center justify-center bg-${step.index === currentStep ? 'blue-500 text-white' : 'neutral-200 text-blue-500'} rounded-lg`}>{step.index}</div>
                    <div className="flex flex-col ml-3">
                        <h1 className="text-sm font-medium">{step.name}</h1>
                        {!!step.subtitle && <h2 className="text-[11px] font-normal">{step.subtitle}</h2>}
                    </div>
                </div>)}
            </div>
        </div>
        <div className="flex flex-col justify-between ml-4">
            <div className={elementClassName}>
                {props.children.map((v, i) => <div key={i} className={i === currentStep - 1 ? elementClassName : 'hidden'}>
                    {v}
                </div>)}
            </div>
            <div className="flex flex-row items-center justify-between px-4 mt-6">
                <button type="button" onClick={backStep}  className="bg-neutral-200 hover:bg-neutral-300 text-neutral-600 text-sm rounded py-2 px-4">Voltar</button>
                <button type="button" onClick={nextStep} className="bg-blue-500 hover:bg-blue-600 text-white text-sm rounded py-2 px-4">Próximo</button>
            </div>
        </div>
    </div>
}

type StepProps = {
    name: string,
    subtitle?: string,
    children: React.ReactNode
}

function Step(props: StepProps)
{
    return <>{props.children}</>
}

const StepByStep = {Container, Step}

export default StepByStep;