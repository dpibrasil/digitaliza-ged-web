import { Form } from "@unform/web";
import { Input } from "../../../components/Input";
import Modal, { ModalTitle, ModalType } from "../../../components/Modal";
import StepByStep from "../../../components/StepByStep";
import {  DirectoryIndexType, DirectoryType, OrganizationType } from "../../../types/OrganizationTypes";
import { IoCreateOutline, IoDocumentText, IoTrashOutline } from "react-icons/io5";
import DirectoryIndexEdit from "../../../components/DirectoryIndexEdit";
import { useEffect, useState } from "react";
import api, { catchApiErrorMessage } from "../../../services/api";
import toast from "react-hot-toast";
import { useMap } from "react-use";
import Database from "../../../services/database";

function IndexPreview({index, setEditingIndex, indexActions}: {index: DirectoryIndexType & any, indexActions: any, setEditingIndex: (index: any) => void})
{
    function handleDelete()
    {
        if (window.confirm(`Você tem certeza que quer deletar o índice ${index.name}?`)) {
            indexActions.remove(index.key)
        }
    }

    return <div key={index.name} className="w-full flex flex-row justify-between">
        <div className="flex flex-row items-center justify-start">
            <div className="bg-blue-500 bg-opacity-10 text-blue-500 rounded-lg w-10 h-10 flex items-center justify-center">
                <IoDocumentText size={24} />
            </div>
            <div className="flex flex-col ml-2">
                <h1 className="font-medium text-sm">{index.name}</h1>
                <h2 className="text-slate-500 text-[11px]">
                    {index.type} • índice {index.notNullable ? 'obrigatório' : 'opcional'}
                    {index.type === 'list' && ` • ${index.listValues ? index.listValues.length : 0} ${index.listValues && index.listValues.length === 1 ? 'opção' : 'opções'}`}
                    {index.type === 'list' && index.listOptions && ` • ${index.listOptions ? index.listOptions.length : 0} ${index.listOptions && index.listOptions.length === 1 ? 'nova opção' : 'novas opções'}`}
                </h2>
            </div>
        </div>
        <div className="grid grid-flow-col gap-x-1">
            {!index.id && <div onClick={handleDelete} className="bg-blue-500 bg-opacity-10 text-blue-500 cursor-pointer rounded-lg w-10 h-10 flex items-center justify-center">
                <IoTrashOutline size={24} />
            </div>}
            <div onClick={() => setEditingIndex(index.key)} className="bg-blue-500 bg-opacity-10 text-blue-500 cursor-pointer rounded-lg w-10 h-10 flex items-center justify-center">
                <IoCreateOutline size={24} />
            </div>
        </div>
    </div>
}

function EditDirectoryModal({organization, directory, ...rest}: ModalType & {organization: OrganizationType, directory?: DirectoryType})
{
    const [indexes, indexActions] = useMap<any>({})    
    const [name, setName] = useState('')
    const [editingIndex, setEditingIndex] = useState(-1)
    const editing = !!directory?.id

    useEffect(() => {
        if (directory) {
            api.get('/directories/' + directory.id)
            .then(({data}) => {
                setName(data.name)
                indexActions.setAll(Object.fromEntries(data.indexes?.map((index: any) => [index.id, {...index, key: index.id}])))
            })
        }
    }, [directory])

    async function handleSubmit()
    {
        async function Promise() {
            const data = {name, organizationId: organization.id}
            const {data: d} = await (editing ? api.put('/directories/' + directory.id, data) : api.post('/directories', data))

            const i: any[] = Object.values(indexes)

            for (var indexData of i) {
                indexData = {directoryId: d.id, ...indexData}
                const {data: index} = await (indexData.id ? api.put('/directory-indexes/' + indexData.id, indexData) : api.post('/directory-indexes', indexData))

                for (const option of (indexData.listOptions ?? [])) {
                    if (option && option.value && !option.id) {
                        await api.post(`/directory-indexes/${index.id}/list-values`, {value: option.value})
                        .catch(e => toast.error(catchApiErrorMessage(e)))
                    }
                }
            }
        }

        toast.promise(Promise(), {
            success: () => {
                rest.setShow(false)
                const database = new Database()
                database.sync()
                return 'Diretório salvo com sucesso!'
            },
            error: catchApiErrorMessage,
            loading: 'Salvando diretório...'
        })
    }

    console.log('Pre salvar: ', indexes[248])

    return <Modal {...rest}>
        <ModalTitle title={directory?.id ? 'Editando diretório' : 'Criando diretório'} subtitle="Preencha os campos corretamente abaixo" />
        <div className="mt-10">
            <StepByStep.Container elementClassName="min-w-[400px] min-h-[300px]">
                <StepByStep.Step name="Criação de diretório" subtitle="Configurações do diretório">
                    <Form onSubmit={() => {}}>
                        <Input
                            label="Nome do diretório"
                            placeholder="Ex.: Licitações"
                            name="name"
                            value={name}
                            onChange={(event) => setName(event.target.value)}
                        />
                    </Form>
                    <h1 className="text-slate-500 text-[12px]">{editing ? `Editando diretório ${directory.name} em: ${organization.name}` : `Criando o diretório em: ${organization.name}`}</h1>
                    <div className="flex items-center justify-center">
                        <img alt="Adicionar" className="w-[250px]" src={process.env.PUBLIC_URL + '/static/add.png'} />
                    </div>
                </StepByStep.Step>
                <StepByStep.Step name="Índices" subtitle="Crie os índices">
                    <DirectoryIndexEdit indexActions={indexActions} setEditingIndex={setEditingIndex} />
                </StepByStep.Step>
                <StepByStep.Step name="Revisão" subtitle="Revise o diretório">
                    {editingIndex === -1 ? <>
                        <h1 className="font-semibold">Relatórios</h1>
                        <div className="grid grid-flow-row mt-3 gap-y-2">
                            {Object.values(indexes).map((index: any) => <IndexPreview key={index.key} index={index} indexActions={indexActions} setEditingIndex={setEditingIndex} />)}
                        </div>
                    </> : <DirectoryIndexEdit index={indexes[editingIndex]} indexActions={indexActions} setEditingIndex={setEditingIndex} />}
                </StepByStep.Step>
                <StepByStep.Step name="Diretório criado" subtitle="Diretório criado">
                    <div className="flex flex-col items-center justify-center">
                        <h1 className="font-semibold text-lg">O diretório está pronto para ser criado</h1>
                        <button className="bg-blue-500 hover:bg-blue-600 rounded p-2 text-sm text-white mb-4 mt-2" onClick={handleSubmit}>Salvar diretório</button>
                        <img alt="Concluído" className="h-64" src={process.env.PUBLIC_URL + '/static/job-done.png'} />
                    </div>
                </StepByStep.Step>
            </StepByStep.Container>
        </div>
    </Modal>
}

export default EditDirectoryModal;