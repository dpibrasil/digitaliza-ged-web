import React, { useEffect, useRef, useState } from 'react';
import { useField } from '@unform/core'
import { DirectoryIndexType } from '../types/OrganizationTypes';

type InputType = {
    label?: string,
    name: string
    width?: string
}

const Error = (props: any) => <h1 className="text-red-500 text-sm mt-1">{props.children}</h1>

export function AuthInput({label, name, width, ...rest}: InputType & React.InputHTMLAttributes<HTMLInputElement>)
{
    const inputRef = useRef(null)
    const { fieldName, defaultValue, registerField, error } = useField(name)

    useEffect(() => {
        registerField({
            name: fieldName,
            ref: inputRef.current,
            path: 'value'
        })
    }, [fieldName, registerField])
    
    return <div className={`flex flex-col w-${width ?? 'full'} mb-2`}>
        {!!label && <label className="text-xs font-bold mb-1">{label}</label>}
        <input ref={inputRef} defaultValue={defaultValue} {...rest} className="rounded bg-neutral-100 p-1 px-3 h-12 text-sm" />
        {!!error && <Error>{error}</Error>}
    </div>
}

export function Input({label, width, name, ...rest}: InputType & React.InputHTMLAttributes<HTMLInputElement>)
{
    const inputRef = useRef(null)
    const { fieldName, defaultValue, registerField, error } = useField(name)

    useEffect(() => {
        registerField({
            name: fieldName,
            ref: inputRef.current,
            path: 'value'
        })
    }, [fieldName, registerField])

    return <div className={`flex flex-col w-${width ?? 'full'} mb-2`}>
        {!!label && <label className="text-xs font-semibold mb-1 text-primary-text">{label}</label>}
        <input defaultValue={defaultValue} {...rest} ref={inputRef} className="rounded bg-white py-1 px-3 min-h-[35px] text-sm" />
        {!!error && <Error>{error}</Error>}
    </div>
}

export function SelectInput({label, placeholder, children, width, name, ...rest}: InputType & React.InputHTMLAttributes<HTMLSelectElement>)
{
    const inputRef = useRef(null)
    const { fieldName, defaultValue, registerField, error } = useField(name)

    useEffect(() => {
        registerField({
            name: fieldName,
            ref: inputRef.current,
            path: 'value'
        })
    }, [fieldName, registerField])

    return <div className={`flex flex-col w-${width ?? 'full'} mb-2`}>
        {!!label && <label className="text-xs font-semibold mb-1 text-primary-text">{label}</label>}
        <select defaultValue={defaultValue} {...rest} ref={inputRef} className="rounded bg-white py-1 px-3 min-h-[35px] text-[12px]">
            {!!placeholder && <option>{placeholder}</option>}
            {children}
        </select>
        {!!error && <Error>{error}</Error>}
    </div>
}

function IndexInputInput({indexName, index}: {indexName: string, index: DirectoryIndexType})
{
    if (index.type === 'string') {
        return <Input type="text" name={indexName} />
    }
    else if (index.type === 'number') {
        return <Input
            type="number"
            name={indexName}
            step={index.displayAs && ['float', 'brl-money'].includes(index.displayAs) ? '.01' : 'any'}
        />
    }
    else if (index.type === 'datetime') {
        return <Input type={index.displayAs === 'date' ? 'date' : 'datetime-local'} name={indexName} />
    }
    else if (index.type === 'boolean') {
        return <SelectInput name={indexName}>
            <option>---</option>
            <option value={'true'}>Sim</option>
            <option value={'false'}>Não</option>
        </SelectInput>
    }
    else if (index.type === 'list') {
        return <SelectInput name={indexName}>
            <option>---</option>
            {index.listValues.map((value: any) => <option key={value.id}>{value.value}</option>)}
        </SelectInput>
    } else {
        return <></>
    }
}

export function IndexInput({index}: {index: DirectoryIndexType})
{
    const [isInterval, setIsInterval] = useState(false)
    const indexName = 'indexes.index' + index.id

    console.log(isInterval)

    const changeOperator = (event: any) => event.target.value == 'interval' !== isInterval ? setIsInterval(!isInterval) : undefined

    return <div className="flex flex-col w-full">
        <label className="text-xs font-semibold mb-1 text-primary-text">{index.name}</label>
        <div className="flex flex-row">
            <SelectInput onChange={changeOperator} width='0' name={indexName + '.operator'}>
                <option value="==">=</option>
                <option>!=</option>
                <option value="interval">{'<>'}</option>
                <option>{'>'}</option>
                <option>{'<'}</option>
                <option>{'>='}</option>
                <option>{'<='}</option>
            </SelectInput>
            <div className="ml-1">
                {isInterval ? <div className="grid auto-col-max grid-flow-col gap-x-1">
                    <IndexInputInput indexName={indexName + '.value[0]'} index={index} />
                    <IndexInputInput indexName={indexName + '.value[1]'} index={index} />
                </div>: <IndexInputInput indexName={indexName + '.value'} index={index} />}
            </div>
        </div>
    </div>
}