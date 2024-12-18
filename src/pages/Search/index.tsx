import { Form } from "@unform/web";
import { useLiveQuery } from "dexie-react-hooks";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {  IoDownloadOutline, IoSearch } from "react-icons/io5";
import { SearchIndexInput, Input, SelectInput } from "../../components/Input";
import Layout from "../../components/Layout";
import { ModalSwitch } from "../../components/Modal";
import { Pagination, ResultsTable } from "../../components/SearchComponents";
import api, { catchApiErrorMessage } from "../../services/api";
import Database from "../../services/database";
import { DirectoryIndexType, DirectoryType } from "../../types/OrganizationTypes";
import { UserType } from "../../types/UserTypes";
import ExportSelectedDocumentsModal from "./modals/ExportSelectedDocumentsModal";
import { useAuth } from "../../context/AuthContext";

function Search()
{
    const auth = useAuth()
    const [organizationId, setOrganizationId] = useState(0)
    const [directoryId, setDirectoryId] = useState(0)
    const [searchResult, setSearchResult] = useState<any>()
    const [searchQuery, setSearchQuery] = useState<any>()
    const [users, setUsers] = useState<UserType[]|null>(null)

    useEffect(() => {
        if (auth.userData?.type != 'client') {
            api.get('/users')
                .then(({data}) => setUsers(data))
                .catch(e => toast.error(catchApiErrorMessage(e)))
        }
    }, [])

    const db = new Database()
    const organizations = useLiveQuery(() => db.organizations.toArray())
    const directories = useLiveQuery(() => db.directories.where({organizationId}).toArray(), [organizationId])
    const directory: DirectoryType|undefined = directories?.find(d => d.id === directoryId)

    async function changePagination(page: number = 1, limit: number) {
        const {data: results} = await api.post('/documents/search', {...searchQuery, pageLimit: limit ?? searchQuery.pageLimit, page})
        setSearchResult(results)
    }

    async function handleSubmit(data: any)
    {
        setSearchResult(undefined)
        if (!directory) return
        for (const index of directory.indexes) {
            const key = 'index' + index.id
            const {value, operator} = data['indexes'][key]
            if (data['indexes'][key]) {
                delete data['indexes'][key]
                if ([null, undefined, '---', '', []].includes(value)) {
                    data['indexes'][index.id] = undefined
                } else if (index.type === 'boolean') {
                    data['indexes'][index.id] = {operator, value: Boolean(value)}
                } else if (index.type === 'number') {
                    data['indexes'][index.id] = {operator, value: operator === 'interval' ? value.map((v: any) => Number(v)) : Number(value)}
                } else {
                    data['indexes'][index.id] = {operator, value: value}
                }
            }
        }
        if (data.userId === '---') delete data.userId

        const {data: results} = await api.post('/documents/search', data)
        setSearchResult(results)
        setSearchQuery(data)
    }


    return <Layout title="Pesquisa">
        <Form onSubmit={handleSubmit}>
            <h1 className="text-lg font-semibold mb-4">Pesquisa de documentos</h1>
            <div className="bg-neutral-100 rounded-lg p-4 w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-4">
                <Input
                    background="white"
                    name="createdAt"
                    type="datetime-local"
                    label="Intervalo de data de criação"
                />
                {auth.userData?.type != 'client' && <SelectInput
                    background="white"
                    name="userId"
                    label="Usuário"
                    placeholder="---"
                >
                    {users?.sort((x: any, y: any) => x.name.localeCompare(y.name)).map(user => <option key={user.id}>{user.name}</option>)}
                </SelectInput>}
                <SelectInput
                    background="white"
                    placeholder="Selecione uma empresa"
                    name="organizationId"
                    label="Empresa"
                    onChange={(event) => setOrganizationId(Number(event.target.value))}
                >
                    {organizations?.sort((x: any, y: any) => x.name.localeCompare(y.name)).map(organization => <option key={organization.id} value={organization.id}>{organization.name}</option>)}
                </SelectInput>
                <SelectInput
                    background="white"
                    placeholder="Selecione um diretório"
                    name="directoryId"
                    label="Diretório"
                    onChange={(event) => setDirectoryId(Number(event.target.value))}
                >
                    {directories?.sort((x: any, y: any) => x.name.localeCompare(y.name)).map(directory => <option key={directory.id} value={directory.id}>{directory.name}</option>)}
                </SelectInput>
            </div>
            {directory ? <>
                <h1 className="text-lg font-semibold mt-6">Índices</h1>
                <div className="bg-neutral-100 rounded-lg p-4 w-full mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-5 justify-start gap-4">
                    {directory.indexes.map((index: DirectoryIndexType) => <SearchIndexInput key={index.id} index={index} />)}
                </div>
                <div className="flex w-full justify-end">
                    <button className="bg-green-500 py-2 px-3 text-white rounded flex flex-row align-center justify-center mt-2">
                        <IoSearch size={18} />
                        <h1 className="text-sm ml-1">Pesquisar</h1>
                    </button>
                </div>
            </> : <div className="flex items-center justify-center mt-8">
                <img alt="Pesquisa" style={{height: '50vh'}} src={process.env.PUBLIC_URL + '/static/search.svg'} />
            </div>}
            {searchResult && <div className="mt-4">
                <div className="flex flex-row justify-between items-center">
                    <h1 className="text-lg font-semibold my-6">Listagem de documentos</h1>
                    <ModalSwitch modal={ExportSelectedDocumentsModal} modalProps={{directory}} button={(props: any) => <button {...props} className="bg-blue-500 py-2 px-3 text-white rounded flex flex-row align-center justify-center mt-2">
                        <IoDownloadOutline size={18} />
                        <h1 className="text-sm ml-1">Exportar selecionados</h1>
                    </button>} />
                </div>
                <ResultsTable searchResult={searchResult} />
                <Pagination searchResult={searchResult} changePagination={changePagination} />
            </div>}
        </Form>
    </Layout>
}

export default Search;