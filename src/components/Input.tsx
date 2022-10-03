import React from 'react';

type Input = {
    label?: string
}

export function Input({label, ...rest}: Input & React.InputHTMLAttributes<HTMLInputElement>)
{
    return <div className="flex flex-col w-full mb-2">
        {!!label && <label className="text-xs font-bold mb-1">{label}</label>}
        <input {...rest} className="rounded bg-neutral-100 p-1 px-3 h-12 text-sm" />
    </div>
}