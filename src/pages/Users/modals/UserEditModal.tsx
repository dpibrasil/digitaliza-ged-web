import { Form } from "@unform/web";
import { useLiveQuery } from "dexie-react-hooks";
import { useRef, useState } from "react";
import { UserTypeName } from "..";
import { Input, ReactSelectInput, SelectInput } from "../../../components/Input";
import Modal, { ModalTitle, ModalType } from "../../../components/Modal";
import StepByStep from "../../../components/StepByStep";
import Database from "../../../services/database";
import * as Yup from 'yup';
import api, { catchApiErrorMessage } from "../../../services/api";
import toast from "react-hot-toast";

function UserEditModal(props: ModalType)
{
    const db = new Database()
    const organizations = useLiveQuery(() => db.organizations.toArray())
    const [selectedOrganizations, setSelectedOrganizations] = useState<number[]>([])
    const directories = useLiveQuery(() => db.directories.filter((d => selectedOrganizations.includes(d.organizationId))).toArray(), [selectedOrganizations])
    const formRef = useRef<any>()

    async function createUser(data: any)
    {
        const {data: user} = await api.post('/users', {
            name: data.name,
            type: data.type,
            email: data.email,
            password: data.password
        })

        return Promise.all([...data.organizations.map((o: number) => api.post(`/users/${user.id}/organizations`, {organizationId: o})), ...data.directories.map((o: number) => api.post(`/users/${user.id}/directories`, {directoryId: o}))])
    }

    async function handleSubmit(step: number, currentStep: number): Promise<boolean>
    {
        const data = formRef.current.getData()
        formRef.current.setErrors({})
        try {
            const schemas: any = {
                1: {
                    name: Yup.string().required('Este campo é obrigatório.').min(3, 'Deve conter ao menos 3 caracteres.'),
                    email: Yup.string().required('Este campo é obrigatório.').email('Insira um e-mail válido.'),
                    password: Yup.string().required('Este campo é obrigatório.').min(3, 'Deve conter ao menos 6 caracteres.')
                },
                2: {
                    type: Yup.string().required('Este campo é obrigatório.').equals(Object.keys(UserTypeName), 'Selecione um perfil válido.'),
                    organizationId: Yup.number().required('Este campo é obrigatório.'),
                    organizations: Yup.array().of(Yup.number()).required('Este campo é obrigatório.').min(1, 'Este campo é obrigatório.'),
                    directories: Yup.array().of(Yup.number()).required('Este campo é obrigatório.').min(1, 'Este campo é obrigatório.')
                }
            }
            const schema = Yup.object().shape(schemas[currentStep])
            await schema.validate(data, {abortEarly: false})
            
            if (step === 3) {
                toast.promise(createUser(data), {
                    error: catchApiErrorMessage,
                    success: 'Usuário salvo.',
                    loading: 'Salvando usuário...'
                })
            }
        } catch (err) {
            if (err instanceof Yup.ValidationError) {
                formRef.current.setErrors(Object.fromEntries(err.inner.map(error => [error.path, error.message])))
            }
            return false
        }
        return true
    }

    return <Modal {...props}>
        <ModalTitle title="Criar usuário" subtitle="Preencha os campos coretamente abaixo." />
        <Form ref={formRef} onSubmit={() => {}}>
            <StepByStep.Container validate={handleSubmit} elementClassName="min-w-[400px] min-h-[300px]">
                <StepByStep.Step name="Criação de usuário" subtitle="Informações de usuário">
                    <Input
                        label="E-mail"
                        name="email"
                        type="email"
                        placeholder="Ex.: exemplo@digitaliza.com"
                    />
                    <Input
                        label="Senha"
                        type="password"
                        name="password"
                        placeholder="••••••••••"
                    />
                    <Input
                        label="Nome completo"
                        name="name"
                        placeholder="Ex.: Maria Castelo"
                    />
                </StepByStep.Step>
                <StepByStep.Step name="Acesso" subtitle="Indique os acessos">
                    <div className="grid grid-flow-col gap-1">
                        <SelectInput name="type" label="Cargo/Função" placeholder="---">
                            {Object.entries(UserTypeName).map((i: any) => <option key={i[0]} value={i[0]}>{i[1]}</option>)}
                        </SelectInput>
                        <SelectInput name="organizationId" label="Empresa principal" placeholder="---">
                            {organizations?.map(organization => <option key={organization.id} value={organization.id}>{organization.name}</option>)}
                        </SelectInput>
                    </div>
                    <ReactSelectInput
                        name="organizations"
                        label="Empresas com acesso"
                        onChange={(value: any) => setSelectedOrganizations(value.map((v: any) => v.value))}
                        isMulti={true}
                        options={(organizations ?? []).map(organization => ({label: organization.name, value: organization.id}))}
                    />
                    <ReactSelectInput
                        name="directories"
                        label="Diretórios com acesso"
                        isMulti={true}
                        options={(directories ?? []).map((directory: any) => ({
                            label: organizations?.find((o => o.id === directory.organizationId))?.name + ' ➝ ' + directory.name,
                            value: directory.id
                        }))}
                    />
                    <h2 className="text-sm font-light text-neutral-500 w-80">Os diretórios disponíveis irão aparecer de acordo com <b>a empresa selecionada</b></h2>
                </StepByStep.Step>
                <StepByStep.Step name="Perfil criado" subtitle="Perfil criado">
                    <div className="flex flex-col items-center justify-center">
                        <h1 className="font-semibold text-lg">Salvando usuário...</h1>
                        <img alt="Concluído" className="h-64" src={process.env.PUBLIC_URL + '/static/edit-user.png'} />
                    </div>
                </StepByStep.Step>
            </StepByStep.Container>
        </Form>
    </Modal>
}

export default UserEditModal;