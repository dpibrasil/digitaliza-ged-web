import { useState } from "react";
import { IoCreateOutline, IoTrashOutline } from "react-icons/io5";
import { useQuery } from "react-query";
import { SearchInput } from "../../components/Input";
import Layout from "../../components/Layout";
import { ModalSwitch } from "../../components/Modal";
import api from "../../services/api";
import MantainerEditModal from "./modals/MantainerEditModal";

const months = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro']

function Mantainers()
{
    const {data: mantainers} = useQuery('mantainers', async() => (await api.get('/mantainers')).data)
    const [searchQuery, setSearchQuery] = useState<string>('')
    const filteredMantainers = (mantainers ?? []).filter((u: any) => searchQuery.length ? u.name.toLowerCase().includes(searchQuery.toLocaleLowerCase()) : true)

    return <Layout title="Mantedores">
        {mantainers ? <>
            <div className="justify-between items-center flex">
                <div className="flex items-center">
                    <h1 className="text-lg font-semibold mr-10">Mantedores ({mantainers.length})</h1>
                    <SearchInput onChange={(event) => setSearchQuery(event.target.value)} />
                </div>
                <ModalSwitch
                    modal={MantainerEditModal}
                    button={(props: any) => <button {...props} className="bg-green-500 hover:bg-green-600 text-white text-sm rounded py-2 px-4">Criar mantedor</button>}
                />
            </div>
            <table className="w-full mt-4">
                    <thead>
                        <th>Nome</th>
                        <th>Domínios</th>
                        <th>Data de abertura</th>
                        <th>Status</th>
                        <th>Ações</th>
                    </thead>
                    <tbody>
                        {filteredMantainers.map((mantainer: any) => <tr>
                            <th>{mantainer.name}</th>
                            <td>
                                <h1 className="text-xs font-semibold">{mantainer.authorizedDomains[0]}</h1>
                                {mantainer.authorizedDomains.length == 1 ? <h2 className="text-xs font-normal text-neutral-400">domínio único</h2> : <h2 className="text-xs font-normal text-blue-500">mostrar mais</h2>}
                            </td>
                            <td>
                                <h1 className="text-xs font-semibold">{new Date(mantainer.createdAt).getFullYear()}</h1>
                                <h2 className="text-xs font-normal text-neutral-400">{new Date(mantainer.createdAt).getDate()} de {months[new Date(mantainer.createdAt).getMonth()]}</h2>
                            </td>
                            <td>
                                <div className="flex">
                                    <h1 className={`bg-green-100 text-green-500 rounded p-2`}>Ativo</h1>
                                </div>
                            </td>
                            <td>
                                <div className="grid auto-col-max grid-flow-col justify-start gap-x-1 cursor-pointer">
                                    <div className="w-min bg-neutral-100 text-blue-500 p-1 rounded">
                                        <IoCreateOutline />
                                    </div>
                                    {/* <ModalSwitch
                                        modal={UserDeleteModal}
                                        button={(props: any) => <div {...props} className="w-min bg-neutral-100 text-blue-500 p-1 rounded">
                                        <IoTrashOutline />
                                    </div>}
                                    /> */}
                                </div>
                            </td>
                        </tr>)}
                    </tbody>
            </table>
        </> : <>Carregando...</>}
    </Layout>
}

export default Mantainers;