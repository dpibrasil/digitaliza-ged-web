import React, { useEffect, useRef, useState } from 'react';
import { useField } from '@unform/core'
import { DirectoryIndexType } from '../types/OrganizationTypes';
import { IoSearch } from 'react-icons/io5';

type InputType = {
    label?: string,
    name: string
    width?: string,
    background?: string
}

const Error = (props: any) => <h1 className="text-red-500 text-sm mt-1">{props.children}</h1>

export function AuthInput({label, name, width, background = 'white', ...rest}: InputType & React.InputHTMLAttributes<HTMLInputElement>)
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
        <input ref={inputRef} defaultValue={defaultValue} {...rest} className={`rounded bg-${background} p-1 px-3 h-12 text-sm`} />
        {!!error && <Error>{error}</Error>}
    </div>
}

export function Input({label, width, name, background = 'neutral-100', ...rest}: InputType & React.InputHTMLAttributes<HTMLInputElement>)
{
    const inputRef = useRef(null)
    const { fieldName, defaultValue, registerField, error } = useField(name)

    useEffect(() => {
        registerField({
            name: fieldName,
            ref: inputRef.current,
            setValue: (target, value) => {
                target[rest.type == 'checkbox' ? 'checked' : 'value'] = value
            },
            getValue: (target) => {
                if (rest.type == 'number' && target.value == '') return null
                return target[rest.type == 'checkbox' ? 'checked' : 'value']
            }
        })
    }, [fieldName, registerField])

    return <div className={`flex flex-col w-${width ?? 'full'} mb-2`}>
        {!!label && <label className="text-xs font-semibold mb-1 text-primary-text">{label}</label>}
        <input defaultValue={defaultValue} {...rest} ref={inputRef} className={`rounded bg-${background} py-1 px-3 min-h-[35px] text-sm`} />
        {!!error && <Error>{error}</Error>}
    </div>
}

export function SelectInput({label, placeholder, children, width, name, background = 'neutral-100', ...rest}: InputType & React.InputHTMLAttributes<HTMLSelectElement>)
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
        <select defaultValue={defaultValue} {...rest} ref={inputRef} className={`rounded bg-${background} py-1 px-3 min-h-[35px] text-[12px]`}>
            {!!placeholder && <option>{placeholder}</option>}
            {children}
        </select>
        {!!error && <Error>{error}</Error>}
    </div>
}

type IndexInputBase = {indexName: string, index: DirectoryIndexType}

export function IndexInputBase({indexName, index}: IndexInputBase)
{
    if (index.type === 'string') {
        return <Input background="white" type="text" name={indexName} />
    }
    else if (index.type === 'number') {
        return <Input background="white"
            type="number"
            name={indexName}
            step={index.displayAs && ['float', 'brl-money'].includes(index.displayAs) ? '.01' : 'any'}
        />
    }
    else if (index.type === 'datetime') {
        return <Input background="white" type={index.displayAs === 'date' ? 'date' : 'datetime-local'} name={indexName} />
    }
    else if (index.type === 'boolean') {
        return <SelectInput background="white" name={indexName}>
            <option>---</option>
            <option value={'true'}>Sim</option>
            <option value={'false'}>Não</option>
        </SelectInput>
    }
    else if (index.type === 'list') {
        return <SelectInput background="white" name={indexName}>
            <option>---</option>
            {index.listValues.map((value: any) => <option key={value.id}>{value.value}</option>)}
        </SelectInput>
    } else {
        return <></>
    }
}

export function IndexInput({indexName, index}: IndexInputBase) {
    return <div>
        <label className="text-xs font-semibold mb-1 text-primary-text">{index.name}</label>
        <div className="bg-neutral-200 rounded">
            <IndexInputBase indexName={indexName} index={index} />
        </div>
    </div>
}

export function SearchIndexInput({index}: {index: DirectoryIndexType})
{
    const [isInterval, setIsInterval] = useState(false)
    const indexName = 'indexes.index' + index.id

    const changeOperator = (event: any) => (event.target.value === 'interval') !== isInterval ? setIsInterval(!isInterval) : undefined

    return <div className="flex flex-col w-full">
        <label className="text-xs font-semibold mb-1 text-primary-text">{index.name}</label>
        <div className="flex flex-row">
            <SelectInput background="white" onChange={changeOperator} name={indexName + '.operator'}>
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
                    <IndexInputBase indexName={indexName + '.value[0]'} index={index} />
                    <IndexInputBase indexName={indexName + '.value[1]'} index={index} />
                </div>: <IndexInputBase indexName={indexName + '.value'} index={index} />}
            </div>
        </div>
    </div>
}

export function SearchInput(props: React.InputHTMLAttributes<HTMLInputElement>)
{
    return <div className="rounded bg-neutral-100 pl-3 min-h-[35px] flex items-center justify-start text-neutral-400">
        <IoSearch />
        <input
            type="search"
            className="pl-1 w-full h-full bg-transparent placeholder:text-neutral-400 text-black text-[12px]"
            placeholder="Buscar por..."
            {...props}
        />
    </div>
}