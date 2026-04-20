import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import { useList } from "react-use";
import { SearchInput } from "../../components/Input";
import Layout from "../../components/Layout";
import { ModalSwitch } from "../../components/Modal";
import { Button } from "../../components/ui/button";
import Loading from "../../components/Loading";
import api, { catchApiErrorMessage } from "../../services/api";
import { OrganizationType } from "../../types/OrganizationTypes";
import EditOrganizationModal from "./modals/EditOrganizationModal";

function Organizations()
{
    const [organizations, {push: addOrganization, set: setOrganizations}] = useList<OrganizationType>()
    const [loaded, setLoaded] = useState(false)
    const [searchQuery, setSearchQuery] = useState<string>('')

    const filteredOrganizations = organizations.filter(o => searchQuery.length ? o.name.toLowerCase().includes(searchQuery.toLocaleLowerCase()) : true)

    useEffect(() => {
        api.get('/organizations')
        .then(({data}) => { setOrganizations(data); setLoaded(true) })
        .catch(e => toast.error(catchApiErrorMessage(e)))
    }, [setOrganizations])

    return <Layout title="Empresas">
        {!loaded ? <Loading /> : <>
            <div className="flex justify-between items-center gap-4 mb-4">
                <h1 className="text-lg font-semibold shrink-0">Empresas ({organizations.length})</h1>
                <SearchInput onChange={(event) => setSearchQuery(event.target.value)} />
                <ModalSwitch
                    modalProps={{addOrganization}}
                    modal={EditOrganizationModal}
                    button={(props: any) => (
                        <Button type="button" variant="success" size="sm" {...props}>Criar empresa</Button>
                    )}
                />
            </div>
            <div className="overflow-x-auto rounded-lg border border-neutral-200">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="bg-neutral-50 border-b border-neutral-200">
                            <th className="py-3 px-4 w-10"></th>
                            <th className="py-3 px-4 text-left font-medium text-neutral-500 uppercase text-xs">ID</th>
                            <th className="py-3 px-4 text-left font-medium text-neutral-500 uppercase text-xs">Nome</th>
                            <th className="py-3 px-4 text-left font-medium text-neutral-500 uppercase text-xs">CNPJ</th>
                            <th className="py-3 px-4 text-left font-medium text-neutral-500 uppercase text-xs">Detalhes</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-100">
                        {filteredOrganizations.map((organization, i) => (
                            <tr key={organization.id} className={`hover:bg-blue-50 transition-colors ${i % 2 === 0 ? 'bg-white' : 'bg-neutral-50/50'}`}>
                                <td className="py-3 px-4"></td>
                                <td className="py-3 px-4 font-medium text-neutral-700">{organization.id}</td>
                                <td className="py-3 px-4 text-neutral-600">{organization.name}</td>
                                <td className="py-3 px-4 text-neutral-600"></td>
                                <td className="py-3 px-4">
                                    <Link to={'/organizations/' + organization.id}>
                                        <Button type="button" variant="ghost" size="sm">Ver</Button>
                                    </Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </>}
    </Layout>
}

export default Organizations;
