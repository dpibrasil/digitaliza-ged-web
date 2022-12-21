import React, { useEffect, useRef, useState } from "react";
import { Form } from "@unform/web";
import { Input, SelectInput } from "../../../components/Input";
import Modal, { ModalTitle, ModalType } from "../../../components/Modal";
import api, { catchApiErrorMessage } from "../../../services/api";
import toast from "react-hot-toast";
import { OrganizationType } from "../../../types/OrganizationTypes";
import { ValidationError } from "yup";
import { OrganizationValidator } from "../../../validators/OrganizationValidators";

type OrganizationModalType = {
    addOrganization?: (data: any) => {},
    organization?: OrganizationType
}

function EditOrganizationModal({organization, ...props}: ModalType & OrganizationModalType)
{
    const formRef = useRef<any>(null)
    const [storages, setStorages] = useState<any[]>([])

    useEffect(() => {
        api.get('/storages').then(({data}) => setStorages(data))
    }, [])

    useEffect(() => {
        if (organization && formRef.current) {
            formRef.current.setData(organization)
        }
    }, [formRef, organization])

    async function handleSubmit(data: any) {
        // validation schema
        
        try {
            // validate
            const payload: any = await OrganizationValidator.validate(data, {abortEarly: false})
            
            // make request
            const promise = organization ? api.put('/organizations/' + organization.id, payload) : api.post('/organizations', payload)
            toast.promise(promise, {
                loading: 'Salvando empresa...',
                error: catchApiErrorMessage,
                success: ({data}) => {
                    if (props.addOrganization) props.addOrganization(data)
                    props.setShow(false)
                    return 'Empresa salva com sucesso!'
                }
            })
        } catch (err) {
            if (err instanceof ValidationError) {
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
            <button className="bg-blue-500 rounded text-white px-3 py-2 text-sm">Salvar</button>
        </Form>
    </Modal>
}

export default EditOrganizationModal;