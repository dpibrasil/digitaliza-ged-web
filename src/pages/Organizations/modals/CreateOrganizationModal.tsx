import React, { useEffect, useRef, useState } from "react";
import { Form } from "@unform/web";
import { Input, SelectInput } from "../../../components/Input";
import Modal, { ModalTitle, ModalType } from "../../../components/Modal";
import * as Yup from 'yup';
import api, { catchApiErrorMessage } from "../../../services/api";
import toast from "react-hot-toast";

function CreateOrganizationModal(props: ModalType & {addOrganization: (data: any) => {}})
{
    const formRef = useRef<any>(null)
    const [storages, setStorages] = useState<any[]>([])

    useEffect(() => {
        api.get('/storages').then(({data}) => setStorages(data))
    }, [])

    async function handleSubmit(data: any) {
        // validation schema
        const schema = Yup.object().shape({
            name: Yup.string().required('Este campo é obrigatório.'),
            storageId: Yup.number().required('Este campo é obrigatório.')
        })
        try {
            // validate
            const payload: any = await schema.validate(data, {abortEarly: false})
            
            // make request
            const promise = api.post('/organizations', payload)
            toast.promise(promise, {
                loading: 'Criando empresa...',
                error: catchApiErrorMessage,
                success: ({data}) => {
                    props.addOrganization(data)
                    props.setShow(false)
                    return 'Empresa criada com sucesso!'
                }
            })
        } catch (err) {
            if (err instanceof Yup.ValidationError) {
                formRef.current.setErrors(Object.fromEntries(err.inner.map(error => [error.path, error.message])))
            }
        }
    }

    return <Modal {...props}>
        <Form ref={formRef} onSubmit={handleSubmit}>
            <ModalTitle title="Dados da empresa" subtitle="Preencha com os dados da empresa" />
            <Input label="Nome da empresa" name="name" placeholder="Ex.: Digitaliza" />
            <SelectInput label="Storage" name="storageId">
                {storages.map(storage => <option key={storage.id} value={storage.id}>{storage.name}</option>)}
            </SelectInput>
            <Input label="CNPJ da Empresa" name="cnpj" />
            <button className="bg-blue-500 rounded text-white px-3 py-2 text-sm">Salvar</button>
        </Form>
    </Modal>
}

export default CreateOrganizationModal;