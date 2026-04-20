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

    return <div className="flex flex-col sm:flex-row w-full">
        <div className="flex flex-row sm:flex-col sm:border-r border-b sm:border-b-0 border-slate-200 pb-3 sm:pb-0 mb-3 sm:mb-0 gap-2 sm:gap-0 overflow-x-auto">
            <div className="flex flex-row sm:flex-col sm:gap-y-8 sm:pr-4 gap-x-2">
                {steps.map(step => <div onClick={() => setCurrentStep(step.index)} key={step.index} className="flex flex-row items-center justify-start cursor-pointer shrink-0">
                    <div className={`w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center text-sm ${step.index === currentStep ? 'bg-blue-500 text-white' : 'bg-neutral-200 text-blue-500'} rounded-lg`}>{step.index}</div>
                    <div className="flex flex-col ml-2 sm:ml-3 hidden sm:flex">
                        <h1 className="text-sm font-medium">{step.name}</h1>
                        {!!step.subtitle && <h2 className="text-[11px] font-normal">{step.subtitle}</h2>}
                    </div>
                </div>)}
            </div>
        </div>
        <div className="flex flex-col justify-between sm:ml-4 w-full min-w-0">
            <div className="w-full">
                {props.children.map((v, i) => <div key={i} className={i === currentStep - 1 ? `w-full ${elementClassName ?? ''}` : 'hidden'}>
                    {v}
                </div>)}
            </div>
            <div className="flex flex-row items-center justify-between mt-6">
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