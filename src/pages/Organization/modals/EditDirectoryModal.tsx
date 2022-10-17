import { Form } from "@unform/web";
import { Input } from "../../../components/Input";
import Modal, { ModalTitle, ModalType } from "../../../components/Modal";
import StepByStep from "../../../components/StepByStep";
import {  DirectoryIndexType, DirectoryType, OrganizationType } from "../../../types/OrganizationTypes";
import { IoCreateOutline, IoDocumentText, IoTrashOutline } from "react-icons/io5";
import DirectoryIndexEdit from "../../../components/DirectoryIndexEdit";
import { useState } from "react";
import api, { catchApiErrorMessage } from "../../../services/api";
import toast from "react-hot-toast";

function IndexPreview({index, setEditingIndex}: {index: DirectoryIndexType & any, setEditingIndex: (index: any) => void})
{
    return <div key={index.name} className="w-full flex flex-row justify-between">
        <div className="flex flex-row items-center justify-start">
            <div className="bg-blue-100 text-blue-500 rounded-lg w-10 h-10 flex items-center justify-center">
                <IoDocumentText size={24} />
            </div>
            <div className="flex flex-col ml-2">
                <h1 className="font-medium text-sm">{index.name}</h1>
                <h2 className="text-neutral-700 text-[11px]">{index.type} • índice {index.notNullable ? 'obrigatório' : 'opcional'}</h2>
            </div>
        </div>
        <div className="grid grid-flow-col gap-x-1">
            {!index.id && <div onClick={() => setEditingIndex(index.key)} className="bg-blue-100 text-blue-500 cursor-pointer rounded-lg w-10 h-10 flex items-center justify-center">
                <IoTrashOutline size={24} />
            </div>}
            <div onClick={() => setEditingIndex(index.key)} className="bg-blue-100 text-blue-500 cursor-pointer rounded-lg w-10 h-10 flex items-center justify-center">
                <IoCreateOutline size={24} />
            </div>
        </div>
    </div>
}

function CreateDirectoryModal({organization, directory, ...rest}: ModalType & {organization: OrganizationType, directory?: DirectoryType})
{
    const [indexes, setIndexes] = useState<any>({})
    const [name, setName] = useState('')
    const [editingIndex, setEditingIndex] = useState(-1)

    const setIndex = (indexName: string, index: any) => {
        setIndexes({...indexes, [indexName]: index})
        setEditingIndex(-1)
    }

    async function handleSubmit()
    {
        async function Promise() {
            const {data: directory} = await api.post('/directories', {name, organizationId: organization.id})

            const i: any[] = Object.values(indexes)

            for (const indexData of i) {
                const {data: index} = await api.post('/directory-indexes', {directoryId: directory.id, ...indexData})
            }
        }

        toast.promise(Promise(), {
            success: 'Diretório salvo com sucesso!',
            error: catchApiErrorMessage,
            loading: 'Salvando diretório...'
        })
    }

    return <Modal {...rest}>
        <ModalTitle title="Criar diretório" subtitle="Preencha os campos corretamente abaixo" />
        <div className="mt-10">
            <StepByStep.Container elementClassName="min-w-[400px] min-h-[300px]">
                <StepByStep.Step name="Teste">
                    1
                </StepByStep.Step>
                <StepByStep.Step name="Teste 2">
                    2
                </StepByStep.Step>
            </StepByStep.Container>
        </div>
    </Modal>
}

export default CreateDirectoryModal;