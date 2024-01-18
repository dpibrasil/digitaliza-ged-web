import { useEffect, useRef, useState } from "react";
import { Input, SelectInput } from "./Input";
import { ValidationError } from "yup";
import { Form } from "@unform/web";
import { SubmitHandler } from "@unform/core";
import { DirectoryIndexType } from "../types/OrganizationTypes";
import uuid from 'react-uuid';
import { toast } from "react-hot-toast";
import { DirectoryIndexSchema } from "../validators/IndexesValidators";
import DirectoryIndexOptionsEdit from "./DirectoryIndexOptionsEdit";

type DirectoryIndexEditProps = {
    indexActions: any,
    setEditingIndex: any,
    index?: DirectoryIndexType & {key: string}
}

function DirectoryIndexEdit({indexActions, index, setEditingIndex}: DirectoryIndexEditProps)
{
    const formRef = useRef<any>(null)
    const [indexType, setIndexType] = useState(index ? index.type : 'text')

    useEffect(() => index ? formRef.current.setData({index}) : undefined, [index])

    const handleSubmit: SubmitHandler<any> = async (data: any) => {
        try {
            formRef.current.setErrors({})
            
            const payload: any = await DirectoryIndexSchema.validate(data, {abortEarly: false})
            /* @ts-ignore */
            payload.index.listValues = index?.listValues
            payload.index.key = index ? index.key : uuid()
            payload.index.id = index && index.id
            indexActions.set(payload.index.key, payload.index)
            formRef.current.reset()
            setEditingIndex(-1)
            toast.success(`Índice ${payload.index.name} salvo`)
        } catch (err) {
            if (err instanceof ValidationError) {
                formRef.current.setErrors(Object.fromEntries(err.inner.map(error => [error.path, error.message])))
            }
        }
    }

    return <Form ref={formRef} onSubmit={handleSubmit}>
        <Input
            label="Nome do índice"
            name="index.name"
            type="text"
            placeholder="Ex.: Valor"
        />
        <div className="flex flex-row items-center justify-between w-full">
            <label className="text-xs font-bold mb-1">Índice obrigatório</label>
            <Input width="10px" name="index.notNullable" type="checkbox" />
        </div>
        <div className="grid grid-cols-2 gap-1">
            <SelectInput
                name="index.type"
                label="Tipo de índice"
                onChange={(event: any) => setIndexType(event.target.value)}
            >
                <option value="string">Texto</option>
                <option value="number">Númerico</option>
                <option value="boolean">Boolean (Sim/Não)</option>
                <option value="list">Selecionar (lista)</option>
                <option value="datetime">Data e hora</option>
            </SelectInput>
            <SelectInput
                name="index.displayAs"
                label="Exibir como"
                placeholder="Padrão"
            >
                {indexType === 'number' && <>
                    <option value="integer">Número inteiro</option>
                    <option value="float">Número decimal</option>
                    <option value="brl-money">Valor em reais (R$ 00,00)</option>
                    <option value="cpf-cnpj">CPF/CNPJ</option>
                    <option value="rg">RG</option>
                </>}
                {indexType === 'datetime' && <>
                    <option value="date">Data</option>
                    <option value="datetime">Data e hora</option>
                </>}
                {indexType === 'string' && <option value="url">URL</option>}
            </SelectInput>
            {indexType === 'number' && <>
                <Input
                    label="Número mínimo"
                    type="number"
                    name="index.min"
                />
                <Input
                    label="Número máximo"
                    type="number"
                    name="index.max"
                />
            </>}
            {indexType === 'string' && <>
                <Input
                    label="Comprimento mínimo"
                    type="number"
                    name="index.minLength"
                />
                <Input
                    label="Comprimento máximo"
                    type="number"
                    name="index.maxLength"
                />
            </>}
        </div>
        {indexType === 'list' && <DirectoryIndexOptionsEdit index={index} />}
        <button className="bg-emerald-500 hover:bg-emerald-600 rounded w-full py-3 text-sm text-white">{index ? 'Salvar' : 'Adicionar'} índice</button>
    </Form>
}

export default DirectoryIndexEdit