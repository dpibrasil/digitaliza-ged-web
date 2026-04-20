import React, { useEffect, useRef, useState } from 'react';
import { useField } from '@unform/core'
import { DirectoryIndexType } from '../types/OrganizationTypes';
import { IoSearch } from 'react-icons/io5';
import Select from 'react-select'
import { cn } from '../lib/utils';
import {
    Select as ShadSelect,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from './ui/select';

export { SelectItem } from './ui/select';

type InputType = {
    label?: string,
    name: string
    width?: string,
    background?: 'white' | 'neutral-100' | 'neutral-200' | 'slate-100'
}

const bgMap: Record<string, string> = {
    'white': 'bg-white',
    'neutral-100': 'bg-neutral-100',
    'neutral-200': 'bg-neutral-200',
    'slate-100': 'bg-slate-100',
}

const FieldLabel = ({ children }: { children: React.ReactNode }) => (
    <label className="text-xs font-semibold mb-1 text-primary-text">{children}</label>
)

const FieldError = ({ children }: { children: React.ReactNode }) => (
    <span className="text-red-500 text-xs mt-1">{children}</span>
)

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
        {!!label && <FieldLabel>{label}</FieldLabel>}
        <input
            ref={inputRef}
            defaultValue={defaultValue}
            {...rest}
            className={cn(
                'rounded py-1 px-3 h-12 text-sm border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-primary/30',
                bgMap[background] ?? 'bg-white'
            )}
        />
        {!!error && <FieldError>{error}</FieldError>}
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
            setValue: (target, value: any) => {
                if (rest.type?.includes('date')) {
                    target.valueAsDate = new Date(value)
                } else {
                    target[rest.type === 'checkbox' ? 'checked' : 'value'] = value
                }
            },
            getValue: (target) => {
                if (rest.type === 'number' && target.value === '') return null
                return target[rest.type === 'checkbox' ? 'checked' : 'value']
            }
        })
    }, [fieldName, registerField])

    return <div className={`flex flex-col w-${width ?? 'full'} mb-2`}>
        {!!label && <FieldLabel>{label}</FieldLabel>}
        <input
            defaultValue={rest.type?.includes('date') ? new Date(defaultValue) : defaultValue}
            {...rest}
            ref={inputRef}
            className={cn(
                'rounded py-1 px-3 min-h-[35px] text-sm text-black border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-primary/30',
                bgMap[background] ?? 'bg-neutral-100',
                rest.type === 'checkbox' && 'hidden'
            )}
            id={'input-' + name}
        />
        {rest.type === 'checkbox' && <label className="checkbox" htmlFor={'input-' + name}></label>}
        {!!error && <FieldError>{error}</FieldError>}
    </div>
}

export function ReactSelectInput({label, width, name, background = 'neutral-100', ...rest}: InputType & any)
{
    const inputRef = useRef(null)
    const { fieldName, defaultValue, registerField, error } = useField(name)

    useEffect(() => {
        registerField({
            name: fieldName,
            ref: inputRef.current,
            getValue: (ref) => {
                const d = ref.getValue().map((v: any) => v.value)
                return rest.isMulti ? d : d[0]
            },
            clearValue: (ref) => ref.clearValue(),
            setValue: (ref, value) => ref.setValue(value)
        })
    }, [fieldName, registerField])

    return <div className={`flex flex-col w-${width ?? 'full'} mb-2`}>
        {!!label && <FieldLabel>{label}</FieldLabel>}
        <Select
            {...rest}
            ref={inputRef}
            defaultValue={defaultValue}
            classNamePrefix={cn(
                'rounded text-black text-xs',
                bgMap[background] ?? 'bg-neutral-100',
                !rest.isMulti && 'react-select-mono'
            )}
            placeholder="Pesquisar"
        />
        {!!error && <FieldError>{error}</FieldError>}
    </div>
}

type SelectInputProps = InputType & {
    placeholder?: string,
    children?: React.ReactNode,
    value?: string,
    onValueChange?: (value: string) => void,
    disabled?: boolean,
}

export function SelectInput({ label, placeholder, children, width, name, background = 'neutral-100', value: valueProp, onValueChange, disabled }: SelectInputProps)
{
    const { fieldName, defaultValue, registerField, error } = useField(name)
    const isControlled = valueProp !== undefined
    const [internalValue, setInternalValue] = useState<string>(String(defaultValue ?? ''))

    const valueRef = useRef<string>('')
    const currentValue = isControlled ? (valueProp ?? '') : internalValue
    valueRef.current = currentValue

    useEffect(() => {
        registerField({
            name: fieldName,
            getValue: () => valueRef.current,
            setValue: (_: any, v: any) => setInternalValue(String(v ?? ''))
        })
    }, [fieldName, registerField])

    const handleValueChange = (v: string) => {
        if (!isControlled) setInternalValue(v)
        onValueChange?.(v)
    }

    return <div className={`flex flex-col w-${width ?? 'full'} mb-2`}>
        {!!label && <FieldLabel>{label}</FieldLabel>}
        <ShadSelect value={currentValue} onValueChange={handleValueChange} disabled={disabled}>
            <SelectTrigger className={cn(bgMap[background] ?? 'bg-neutral-100')}>
                <SelectValue placeholder={placeholder ?? 'Selecionar'} />
            </SelectTrigger>
            <SelectContent>
                {children}
            </SelectContent>
        </ShadSelect>
        {!!error && <FieldError>{error}</FieldError>}
    </div>
}

type IndexInputBaseType = {indexName: string, index: DirectoryIndexType, background?: 'white' | 'neutral-100' | 'neutral-200'}

export function IndexInputBase({indexName, index, background = 'white'}: IndexInputBaseType)
{
    if (index.type === 'string') {
        return <Input background={background} type="text" name={indexName} />
    }
    else if (index.type === 'number') {
        return <Input background={background}
            type="number"
            name={indexName}
            step={index.displayAs && ['float', 'brl-money'].includes(index.displayAs) ? '.01' : 'any'}
        />
    }
    else if (index.type === 'datetime') {
        return <Input background={background} type={index.displayAs === 'date' ? 'date' : 'datetime-local'} name={indexName} />
    }
    else if (index.type === 'boolean') {
        return <SelectInput background={background} name={indexName} placeholder="---">
            <SelectItem value="true">Sim</SelectItem>
            <SelectItem value="false">Não</SelectItem>
        </SelectInput>
    }
    else if (index.type === 'list') {
        return <ReactSelectInput
            background={background}
            name={indexName}
            options={
                index.listValues
                .sort((x: any, y: any) => x.value.localeCompare(y.value), {value: ''})
                .map((value: any) => ({label: value.value, value: value.id}))
            }
        />
    } else {
        return <></>
    }
}

export function IndexInput({indexName, index, background}: IndexInputBaseType) {
    return <div>
        <FieldLabel>{index.name}</FieldLabel>
        <div className="bg-neutral-200 rounded">
            <IndexInputBase background={background} indexName={indexName} index={index} />
        </div>
    </div>
}

export function SearchIndexInput({index}: {index: DirectoryIndexType})
{
    const [isInterval, setIsInterval] = useState(false)
    const [operator, setOperator] = useState('==')
    const indexName = 'indexes.index' + index.id

    const changeOperator = (v: string) => {
        setOperator(v)
        if ((v === 'interval') !== isInterval) setIsInterval(!isInterval)
    }

    return <div className="flex flex-col w-full">
        <FieldLabel>{index.name}</FieldLabel>
        <div className="flex flex-row gap-1 items-start">
            <div className="shrink-0 w-16">
                <SelectInput background="white" value={operator} onValueChange={changeOperator} name={indexName + '.operator'}>
                    <SelectItem value="==">{"="}</SelectItem>
                    <SelectItem value="!=">{"!="}</SelectItem>
                    <SelectItem value="interval">{"<>"}</SelectItem>
                    <SelectItem value=">">{">"}</SelectItem>
                    <SelectItem value="<">{"<"}</SelectItem>
                    <SelectItem value=">=">{">="}</SelectItem>
                    <SelectItem value="<=">{"<="}</SelectItem>
                </SelectInput>
            </div>
            <div className="flex-1 min-w-0">
                {isInterval ? <div className="grid grid-cols-2 gap-1">
                    <IndexInputBase indexName={indexName + '.value[0]'} index={index} />
                    <IndexInputBase indexName={indexName + '.value[1]'} index={index} />
                </div>: <IndexInputBase indexName={indexName + '.value'} index={index} />}
            </div>
        </div>
    </div>
}

export function SearchInput(props: React.InputHTMLAttributes<HTMLInputElement>)
{
    return <div className="rounded bg-neutral-100 border border-neutral-200 pl-3 min-h-[35px] flex items-center justify-start text-neutral-400">
        <IoSearch />
        <input
            type="search"
            className="pl-1 w-full h-full bg-transparent placeholder:text-neutral-400 text-black text-sm focus:outline-none"
            placeholder="Buscar por..."
            {...props}
        />
    </div>
}
