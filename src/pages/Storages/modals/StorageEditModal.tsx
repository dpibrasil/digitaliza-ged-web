import { Form } from "@unform/web";
import { useRef } from "react";
import { toast } from "react-hot-toast";
import { Input } from "../../../components/Input";
import Modal, { ModalTitle, ModalType } from "../../../components/Modal";
import SelectStoragePath from "../../../components/SelectStoragePath";
import StepByStep from "../../../components/StepByStep";
import api, { catchApiErrorMessage } from "../../../services/api";

export default function StorageEditModal({...rest}: ModalType)
{
    const formRef = useRef<any>()

    async function handleSubmit()
    {
        const data = formRef.current.getData()

        const promise = api.post('/storages', data)

        toast.promise(promise, {
            success: 'Storage salvo.',
            error: catchApiErrorMessage,
            loading: 'Salvando storage...'
        })
    }

    return <Modal {...rest}>
        <ModalTitle title="Criar storage" subtitle="Preencha os campos corretamente abaixo." />
        <Form ref={formRef} onSubmit={handleSubmit}>
            <StepByStep.Container>
                <StepByStep.Step name="Criação do storage" subtitle="Configurações do storage">
                    <Input
                        label="Nome do storage"
                        name="name"
                        type="text"
                    />
                </StepByStep.Step>
                <StepByStep.Step name="Local do storage" subtitle="Selecione o disco">
                    <SelectStoragePath name="path" />
                </StepByStep.Step>
                <StepByStep.Step name="Criar storage" subtitle="Criar storage">
                    <button>Salvar</button>
                </StepByStep.Step>
            </StepByStep.Container>
        </Form>
    </Modal>
}