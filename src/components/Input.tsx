import React, { useEffect, useRef, useState } from 'react';
import { useField } from '@unform/core'
import { DirectoryIndexType } from '../types/OrganizationTypes';
import { IoSearch } from 'react-icons/io5';
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

type RSOption = { label: string; value: any }

type ReactSelectInputProps = InputType & {
    options?: RSOption[]
    isMulti?: boolean
    placeholder?: string
}

export function ReactSelectInput({ label, width, name, background = 'neutral-100', options = [], isMulti = false, placeholder = 'Pesquisar' }: ReactSelectInputProps) {
    const containerRef = useRef<HTMLDivElement>(null)
    const [open, setOpen] = useState(false)
    const [search, setSearch] = useState('')
    const [selected, setSelected] = useState<RSOption[]>([])

    const selectedRef = useRef<RSOption[]>([])
    const optionsRef = useRef<RSOption[]>(options)
    selectedRef.current = selected
    optionsRef.current = options

    const imperativeRef = useRef({
        getValue: () => {
            const vals = selectedRef.current.map(o => o.value)
            return isMulti ? vals : vals[0]
        },
        clearValue: () => setSelected([]),
        setValue: (value: any) => {
            const opts = optionsRef.current
            if (isMulti) {
                const vals = Array.isArray(value) ? value : [value]
                setSelected(opts.filter(o => vals.some((v: any) => (v?.value ?? v) === o.value)))
            } else {
                const v = value?.value ?? value
                const opt = opts.find(o => o.value === v)
                setSelected(opt ? [opt] : [])
            }
        }
    })

    const { fieldName, defaultValue, registerField, error } = useField(name)

    useEffect(() => {
        registerField({
            name: fieldName,
            ref: imperativeRef.current,
            getValue: (ref) => ref.getValue(),
            clearValue: (ref) => ref.clearValue(),
            setValue: (ref, value) => ref.setValue(value)
        })
    }, [fieldName, registerField])

    useEffect(() => {
        if (defaultValue != null) imperativeRef.current.setValue(defaultValue)
    }, [])

    const filtered = options.filter(o => o.label.toLowerCase().includes(search.toLowerCase()))

    const toggle = (opt: RSOption) => {
        if (isMulti) {
            setSelected(prev =>
                prev.find(o => o.value === opt.value)
                    ? prev.filter(o => o.value !== opt.value)
                    : [...prev, opt]
            )
        } else {
            setSelected([opt])
            setOpen(false)
            setSearch('')
        }
    }

    useEffect(() => {
        if (!open) return
        const handler = (e: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
                setOpen(false)
                setSearch('')
            }
        }
        document.addEventListener('mousedown', handler)
        return () => document.removeEventListener('mousedown', handler)
    }, [open])

    return (
        <div className={`flex flex-col w-${width ?? 'full'} mb-2`}>
            {!!label && <FieldLabel>{label}</FieldLabel>}
            <div ref={containerRef} className="relative">
                <button
                    type="button"
                    onClick={() => setOpen(v => !v)}
                    className={cn(
                        'w-full rounded min-h-[35px] px-3 py-1 text-xs text-left border border-neutral-200 flex flex-wrap gap-1 items-center',
                        bgMap[background] ?? 'bg-neutral-100'
                    )}
                >
                    {selected.length === 0 && <span className="text-neutral-400">{placeholder}</span>}
                    {isMulti
                        ? selected.map(o => (
                            <span key={o.value} className="bg-primary/10 text-primary rounded px-1.5 py-0.5 flex items-center gap-1">
                                {o.label}
                                <button type="button" onClick={e => { e.stopPropagation(); toggle(o) }} className="hover:text-red-500 leading-none">×</button>
                            </span>
                        ))
                        : selected[0] && <span className="text-black">{selected[0].label}</span>
                    }
                    <IoSearch className="ml-auto text-neutral-400 flex-shrink-0" />
                </button>
                {open && (
                    <div className="absolute z-50 top-full left-0 mt-1 w-full bg-white border border-neutral-200 rounded shadow-lg">
                        <div className="p-2 border-b border-neutral-100">
                            <input
                                autoFocus
                                type="text"
                                className="w-full text-xs px-2 py-1 bg-neutral-100 rounded focus:outline-none"
                                placeholder="Pesquisar..."
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                            />
                        </div>
                        <div className="max-h-48 overflow-y-auto">
                            {filtered.length === 0
                                ? <div className="px-3 py-2 text-xs text-neutral-400">Nenhuma opção encontrada</div>
                                : filtered.map(opt => {
                                    const isSel = !!selected.find(o => o.value === opt.value)
                                    return (
                                        <button
                                            key={opt.value}
                                            type="button"
                                            onClick={() => toggle(opt)}
                                            className={cn(
                                                'w-full text-left px-3 py-2 text-xs text-black hover:bg-neutral-50 transition-colors',
                                                isSel && 'bg-primary/5 text-primary font-medium'
                                            )}
                                        >
                                            {opt.label}
                                        </button>
                                    )
                                })
                            }
                        </div>
                    </div>
                )}
            </div>
            {!!error && <FieldError>{error}</FieldError>}
        </div>
    )
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
