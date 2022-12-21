import { Form } from "@unform/web";
import { useRef } from "react";
import { IoTrash } from "react-icons/io5";
import { useSet } from "react-use";
import { Input } from "../../../components/Input";
import Modal, { ModalTitle, ModalType } from "../../../components/Modal";
import StepByStep from "../../../components/StepByStep";
import {ValidationError} from 'yup';
import api, { catchApiErrorMessage } from "../../../services/api";
import { toast } from "react-hot-toast";
import { MantainerType } from "../../../types/MantainerTypes";
import { MantainersValidator } from "../../../validators/MantainersValidators";

function MantainerEditModal({mantainer, ...props}: ModalType & {mantainer?: MantainerType})
{
    const formRef = useRef<any>()
    const [domains, {add: addDomain, remove: removeDomain}] = useSet()

    async function handleValidate()
    {
        formRef.current.setErrors({})
        const data = formRef.current.getData()
        data.authorizedDomains = Object.values(data.authorizedDomains)
        try {
            await MantainersValidator.validate(data, {abortEarly: false})
        } catch (err) {
            if (err instanceof ValidationError) {
                formRef.current.setErrors(Object.fromEntries(err.inner.map(error => [error.path, error.message])))
            }
            return false
        }

        return data
    }

    async function handleSubmit()
    {
        const data = await handleValidate()
        if (data) {
            const promise = mantainer ? api.put('/mantainers/' + mantainer.id, data) : api.post('/mantainers', data)
            toast.promise(promise, {
                loading: 'Salvando mantedor...',
                error: catchApiErrorMessage,
                success: 'Mantedor salvo.'
            })
        }
    }

    return <Modal {...props}>
        <ModalTitle title="Criar mantedor" subtitle="Preencha os campos corretamente abaixo." />
        <Form ref={formRef} onSubmit={handleSubmit} initialData={mantainer}>
            <StepByStep.Container validate={handleValidate}>
                <StepByStep.Step name="Criação de mantedor" subtitle="Configurações do mantedor">
                    <Input type="text" name="name" label="Nome do mantedor" placeholder="Digitaliza" />
                    <label className="text-xs font-semibold mb-1 text-primary-text">Domínios autorizados</label>
                    <div className="overflow-y-scroll max-h-24 mb-2">
                        {Array.from(domains).map((k) => <div className="flex items-center justify-between w-full">
                            <Input name={`authorizedDomains[${k}]`} placeholder="Ex.: ged.digitalizasantana.com.br" />
                            <div onClick={() => removeDomain(k)} className="bg-neutral-100 cursor-pointer flex items-center justify-center w-8 h-8 rounded ml-2">
                                <IoTrash />
                            </div>
                        </div>)}
                    </div>
                    <button type="button" onClick={() => addDomain(domains.size)} className="bg-emerald-500 hover:bg-emerald-600 rounded w-full py-3 text-sm text-white">Adicionar domínio</button>
                </StepByStep.Step>
                <StepByStep.Step name="Mantedor criado">
                    <button className="bg-emerald-500 hover:bg-emerald-600 rounded w-full py-3 text-sm text-white">Salvar mantedor</button>
                </StepByStep.Step>
            </StepByStep.Container>
        </Form>
    </Modal>
}

export default MantainerEditModal;