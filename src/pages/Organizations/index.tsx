import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import { useList } from "react-use";
import { SearchInput } from "../../components/Input";
import Layout from "../../components/Layout";
import { ModalSwitch } from "../../components/Modal";
import api, { catchApiErrorMessage } from "../../services/api";
import { OrganizationType } from "../../types/OrganizationTypes";
import EditOrganizationModal from "./modals/EditOrganizationModal";

function Organizations()
{
    const [organizations, {push: addOrganization, set: setOrganizations}] = useList<OrganizationType>()
    const [searchQuery, setSearchQuery] = useState<string>('')

    const filteredOrganizations = organizations.filter(o => searchQuery.length ? o.name.toLowerCase().includes(searchQuery.toLocaleLowerCase()) : true)

    useEffect(() => {
        api.get('/organizations')
        .then(({data}) => setOrganizations(data))
        .catch(e => toast.error(catchApiErrorMessage(e)))
    }, [setOrganizations])

    return <Layout title="Empresas">
        {organizations == null ? <>Carregando...</> : <>
            <div className="flex justify-between items-center">
                <h1 className="text-lg font-semibold m-0">Empresas ({organizations.length})</h1>
                <SearchInput onChange={(event) => setSearchQuery(event.target.value)} />
                <ModalSwitch modalProps={{addOrganization}} modal={EditOrganizationModal} button={(props: any) => <button className="bg-green-500 hover:bg-green-600 text-white text-sm rounded py-2 px-4" {...props}>Criar empresa</button>} />
            </div>
            <table className="w-full mt-4">
                <thead>
                    <tr>
                        <th></th>
                        <th>ID</th>
                        <th>Nome</th>
                        <th>CNPJ</th>
                        <th>Detalhes</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredOrganizations.map(organization => <tr key={organization.id}>
                        <td></td>
                        <th>{organization.id}</th>
                        <td>{organization.name}</td>
                        <td></td>
                        <td>
                            <Link to={'/organizations/' + organization.id}>
                                <button className="rounded px-3 py-2 bg-neutral-100">Ver</button>
                            </Link>
                        </td>
                    </tr>)}
                </tbody>
            </table>
        </>}
    </Layout>
}

export default Organizations;