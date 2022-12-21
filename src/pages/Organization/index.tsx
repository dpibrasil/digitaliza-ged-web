import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { IoAdd, IoFolder } from "react-icons/io5";
import { useNavigate, useParams } from "react-router-dom";
import { SearchInput } from "../../components/Input";
import Layout from "../../components/Layout";
import { ModalSwitch } from "../../components/Modal";
import api, { catchApiErrorMessage } from "../../services/api";
import { DirectoryType, OrganizationType } from "../../types/OrganizationTypes";
import EditOrganizationModal from '../Organizations/modals/EditOrganizationModal';
import GenerateReportModal from "./modals/GenerateReportModal";
import EditDirectoryModal from "./modals/EditDirectoryModal";
import { useQuery } from "react-query";

function Organization()
{
    const {organizationId} = useParams()
    const navigate = useNavigate()

    const {data: organization, refetch} = useQuery('organzations', async () => (await api.get('/organizations/' + organizationId)).data)
    console.log(organization)

    useEffect(() => {
        refetch()
    }, [organizationId, navigate])

    return <Layout title="Empresa">
        {organization ? <>
            <div className="flex flex-row items-center justify-between pb-4 mb-4 border-b border-neutral-200">
                <div className="flex flex-row">
                    <div className="bg-red-400 rounded-md w-36 h-36">
                    
                    </div>
                    <div className="ml-4">
                        <h1 className="font-semibold text-lg">{organization.name}</h1>
                        <div className="grid grid-flow-col gap-x-4">
                            <div className="rounded border-neutral-100 border p-2 min-w-[120px]">
                                <h1 className="text-xl font-semibold">64.234</h1>
                                <h2 className="text-[11px] text-neutral-400">Documentos</h2>
                            </div>
                            <div className="rounded border-neutral-100 border p-2 min-w-[120px]">
                                <h1 className="text-xl font-semibold">64.234</h1>
                                <h2 className="text-[11px] text-neutral-400">Relatórios</h2>
                            </div>
                            <div className="rounded border-neutral-100 border p-2 min-w-[120px]">
                                <h1 className="text-xl font-semibold">64.234</h1>
                                <h2 className="text-[11px] text-neutral-400">Requisições</h2>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="grid grid-flow-col gap-x-2">
                    <ModalSwitch
                        modal={EditOrganizationModal}
                        modalProps={{organization, addOrganization: refetch}}
                        button={(props: any) => <button {...props} className="bg-neutral-100 hover:bg-neutral-200 text-neutral-500 text-sm rounded py-2 px-4">Editar</button>}
                    />
                    <ModalSwitch
                        modal={GenerateReportModal}
                        modalProps={{organization}}
                        button={(props: any) => <button {...props} className="bg-blue-500 hover:bg-blue-600 text-white text-sm rounded py-2 px-4">Gerar relatório</button>}
                    />
                </div>
            </div>
            <div className="flex flex-row items-center justify-between">
                <h1 className="text-lg font-semibold m-0">Diretórios</h1>
                <div className="grid grid-flow-col gap-2">
                    <SearchInput />
                    <ModalSwitch modalProps={{organization}} modal={EditDirectoryModal} button={(props: any) => <button {...props} className="bg-blue-500 hover:bg-blue-600 text-white text-sm rounded py-2 px-4">Criar diretório</button>} />
                </div>
            </div>
            <div className="grid grid-flow-col mt-4 gap-6">
                {organization.directories.length === 0 && <ModalSwitch modalProps={{organization}} modal={EditDirectoryModal} button={(props: any) => <div {...props} className="bg-neutral-100 text-slate-400 hover:text-slate-700 cursor-pointer rounded-xl p-8 flex items-center justify-center flex-col">
                    <IoAdd size={81} />
                    <h1 className="font-semibold mt-2">Criar diretório</h1>
                </div>} />}
                {organization.directories.map((directory: any) => <ModalSwitch modalProps={{directory, organization}} modal={EditDirectoryModal} button={(props: any) => <div {...props} key={directory.id} className="bg-neutral-100 hover:bg-neutral-200 cursor-pointer text-slate-400 rounded-xl p-8 flex items-center justify-center flex-col">
                    <IoFolder size={81} />
                    <h1 className="font-semibold text-black mt-2">{directory.name}</h1>
                    <h2 className="text-sm ">103.210 documentos</h2>
                </div>} />)}
            </div>
        </> : <>Carregando...</>}
    </Layout>
}

export default Organization;