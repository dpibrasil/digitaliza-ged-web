import { useLiveQuery } from "dexie-react-hooks";
import React, { useState } from "react";
import { IndexInput, Input, SelectInput } from "../../components/Input";
import Layout from "../../components/Layout";
import Database from "../../services/database";
import { DirectoryIndexType, DirectoryType } from "../../types/OrganizationTypes";

function Search()
{
    const [organizationId, setOrganizationId] = useState(0)
    const [directoryId, setDirectoryId] = useState(0)
    const [searchResult, setSearchResult] = useState<any>()

    const db = new Database()
    const organizations = useLiveQuery(() => db.organizations.toArray())
    const directories = useLiveQuery(() => db.directories.where({organizationId}).toArray(), [organizationId])
    const directory: DirectoryType|undefined = directories?.find(d => d.id === directoryId)

    return <Layout>
        <h1 className="text-lg font-semibold mb-4">Pesquisa de documentos</h1>
        <div className="bg-neutral-100 rounded-lg p-4 w-full grid grid-flow-col gap-4">
            <Input name="createdAt" label="Intervalo de data de criação" />
            <SelectInput name="userId" label="Usuário">
                <option>Teste</option>
            </SelectInput>
            <SelectInput
                placeholder="Selecione uma empresa"
                name="organizationId"
                label="Empresa"
                onChange={(event) => setOrganizationId(Number(event.target.value))}
            >
                {organizations?.map(organization => <option key={organization.id} value={organization.id}>{organization.name}</option>)}
            </SelectInput>
            <SelectInput
                placeholder="Selecione um grupo"
                name="groupId"
                label="Grupo"
                onChange={(event) => setDirectoryId(Number(event.target.value))}
            >
                {directories?.map(directory => <option key={directory.id} value={directory.id}>{directory.name}</option>)}
            </SelectInput>
        </div>
        {directory && <>
            <h1 className="text-lg font-semibold mt-6">Índices</h1>
            <div className="bg-neutral-100 rounded-lg p-4 w-full mt-4 grid grid-flow-col justify-start gap-4">
                {directory.indexes.map((index: DirectoryIndexType) => <IndexInput key={index.id} index={index} />)}
            </div>
        </>}
    </Layout>
}

export default Search;