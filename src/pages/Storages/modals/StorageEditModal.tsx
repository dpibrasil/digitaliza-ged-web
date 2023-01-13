import { Form } from "@unform/web";
import { Input } from "../../../components/Input";
import Modal, { ModalTitle, ModalType } from "../../../components/Modal";
import SelectStoragePath from "../../../components/SelectStoragePath";
import StepByStep from "../../../components/StepByStep";

export default function StorageEditModal({...rest}: ModalType)
{
    return <Modal {...rest}>
        <ModalTitle title="Criar storage" subtitle="Preencha os campos corretamente abaixo." />
        <Form onSubmit={console.log}>
            <StepByStep.Container>
                <StepByStep.Step name="Criação do storage" subtitle="Configurações do storage">
                    <Input
                        label="Nome do storage"
                        name="name"
                        type="text"
                    />
                </StepByStep.Step>
                <StepByStep.Step name="Local do storage" subtitle="Selecione o disco">
                    <SelectStoragePath />
                </StepByStep.Step>
            </StepByStep.Container>
        </Form>
    </Modal>
}