import { useEffect } from "react";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import { useList } from "react-use";
import { SearchInput } from "../../components/Input";
import Layout from "../../components/Layout";
import { ModalSwitch } from "../../components/Modal";
import api, { catchApiErrorMessage } from "../../services/api";
import { OrganizationType } from "../../types/OrganizationTypes";
import CreateOrganizationModal from "./modals/CreateOrganizationModal";

function Organizations()
{
    const [organizations, {push: addOrganization, set: setOrganizations}] = useList<OrganizationType>()

    useEffect(() => {
        api.get('/organizations')
        .then(({data}) => setOrganizations(data))
        .catch(e => toast.error(catchApiErrorMessage(e)))
    }, [])

    return <Layout>
        {organizations == null ? <>Carregando...</> : <>
            <div className="flex justify-between items-center">
                <h1 className="text-lg font-semibold m-0">Empresas ({organizations.length})</h1>
                <SearchInput />
                <ModalSwitch modalProps={{addOrganization}} modal={CreateOrganizationModal} button={(props: any) => <button className="bg-green-500 hover:bg-green-600 text-white text-sm rounded py-2 px-4" {...props}>Criar empresa</button>} />
            </div>
            <table className="w-full mt-4">
                <thead>
                    <th></th>
                    <th>ID</th>
                    <th>Nome</th>
                    <th>CNPJ</th>
                    <th>Detalhes</th>
                </thead>
                <tbody>
                    {organizations.map(organization => <tr key={organization.id}>
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