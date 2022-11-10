import { Form } from "@unform/web";
import { useEffect, useRef, useState } from "react";
import { IndexInput, SelectInput } from "../components/Input";
import Modal, { ModalTitle, ModalType } from "../components/Modal";
import api, { catchApiErrorMessage } from "../services/api";
import { DirectoryType } from "../types/OrganizationTypes";
import Database from "../services/database";
import { useLiveQuery } from "dexie-react-hooks";
import * as Yup from 'yup';

type EditIndexesModalProps = {
    directoryId: number,
    values: ({id: number, value: any})[],
    handleSubmit: (data: any) => void
}

function EditIndexesModal({directoryId: defaultDirectoryId, values, handleSubmit, ...props}: ModalType & EditIndexesModalProps)
{   
    const db = new Database()
    const formRef = useRef<any>(null)
    const [indexes, setIndexes] = useState<DirectoryType[]|undefined>()

    const [organizationId, setOrganizationId] = useState(0)
    const [directoryId, setDirectoryId] = useState<number>(defaultDirectoryId)
    const organizations = useLiveQuery(() => db.organizations.toArray())
    const directories = useLiveQuery(() => db.directories.where({organizationId}).toArray(), [organizationId])

    // sempre desseleciona diretório quando atualiza empresa
    useEffect(() => setDirectoryId(0), [organizationId])

    // busca indíces quando atualiza diretório
    useEffect(() => {
        if (directoryId) {
            api.get('/directories/' + directoryId)
            .then(({data}) => setIndexes(data.indexes))
            .catch(catchApiErrorMessage)
        } else {
            setIndexes([])
        }
    }, [directoryId])

    // coloca valor padrão nos índices
    useEffect(() => {
        if (values) {
            const defaultValue: any = Object.fromEntries(values.map(value => (['index-' + value.id, value.value])))
            formRef.current.setData(defaultValue)
        }
    }, [values])

    async function validate(data: any) {
        try {
            const schema = Yup.object().shape({
                organizationId: Yup.number().required('Este campo é obrigatório.').moreThan(0, 'Este campo é obrigatório.'),
                directoryId: Yup.number().required('Este campo é obrigatório.').moreThan(0, 'Este campo é obrigatório.')
            })
            await schema.validate(data, {abortEarly: false})
            handleSubmit(data)
        } catch (err) {
            if (err instanceof Yup.ValidationError) {
                formRef.current.setErrors(Object.fromEntries(err.inner.map(error => [error.path, error.message])))
            }
        }
    }

    return <Modal {...props}>
        <ModalTitle title="Editando índices" />
        <Form ref={formRef} onSubmit={validate}>
            {!defaultDirectoryId && <>
                <SelectInput
                    name="organizationId"
                    value={organizationId}
                    onChange={(event) => setOrganizationId(Number(event.target.value))}
                    label="Empresa"
                >
                    <option value={0}>---</option>
                    {organizations?.map(organization => <option value={organization.id}>{organization.name}</option>)}
                </SelectInput>
                <SelectInput
                    name="directoryId"
                    value={directoryId}
                    onChange={(event) => setDirectoryId(Number(event.target.value))}
                    label="Diretório"
                >
                    <option value={0}>---</option>
                    {directories?.map(directory => <option value={directory.id}>{directory.name}</option>)}
                </SelectInput>
            </>}
            {indexes && indexes.map((index: any) => <IndexInput index={index} indexName={'index-' + index.id} />)}
            <button className="bg-green-500 rounded text-white px-3 py-2 text-sm">Salvar</button>
        </Form>
    </Modal>
}

export default EditIndexesModal;