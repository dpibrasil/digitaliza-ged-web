import { Form } from "@unform/web";
import { useEffect, useRef, useState } from "react";
import { Input } from "../components/Input";
import Modal, { ModalTitle, ModalType } from "../components/Modal";
import api, { catchApiErrorMessage } from "../services/api";
import { DirectoryType } from "../types/OrganizationTypes";
import * as Yup from 'yup';

type EditIndexesModalProps = {
    directoryId: number,
    values: ({id: number, value: any})[],
    handleSubmit: (data: any) => void
}

function EditIndexesModal({directoryId, values, handleSubmit, ...props}: ModalType & EditIndexesModalProps)
{   
    const formRef = useRef<any>(null)
    const [indexes, setIndexes] = useState<DirectoryType[]|undefined>()

    useEffect(() => {
        api.get('/directories/' + directoryId)
        .then(({data}) => setIndexes(data.indexes))
        .catch(catchApiErrorMessage)
    }, [directoryId])

    useEffect(() => {
        const defaultValue: any = Object.fromEntries(values.map(value => (['index-' + value.id, value.value])))
        formRef.current.setData(defaultValue)
    }, [values, formRef.current])

    async function validate(data: any) {
        // todo: validate
        handleSubmit(data)
    }

    return <Modal {...props}>
        <ModalTitle title="Editando índices" />
        <Form ref={formRef} onSubmit={validate}>
            {indexes && indexes.map(index => <Input name={'index-' + index.id} label={index.name} type="text" />)}
            <button className="bg-green-500 rounded text-white px-3 py-2 text-sm">Salvar</button>
        </Form>
    </Modal>
}

export default EditIndexesModal;