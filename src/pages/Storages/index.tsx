import { useState } from "react";
import { IoCreateOutline, IoDocumentsOutline, IoFileTrayOutline, IoRepeat, IoTrashOutline } from "react-icons/io5";
import { useQuery } from "react-query";
import { SearchInput } from "../../components/Input";
import Layout from "../../components/Layout";
import { ModalSwitch } from "../../components/Modal";
import api from "../../services/api";
import { StorageType } from "../../types/StorageTypes";
import StorageEditModal from "./modals/StorageEditModal";
import StorageMigrationModal from "./modals/StorageMigrationModal";
import StorageReplicationConfigModal from "./modals/StorageReplicationConfigModal";

function Storages()
{
    const {data, isLoading} = useQuery<StorageType[]>('@storages', async () => (await api.get('/storages')).data)
    const [searchQuery, setSearchQuery] = useState<string>('')
    const filteredStorages = (data ?? []).filter((u) => searchQuery.length ? u.name.toLowerCase().includes(searchQuery.toLocaleLowerCase()) : true)

    return <Layout title="Storages">
        {data && <>
            <div className="justify-between items-center flex">
                <div className="flex items-center">
                    <h1 className="text-lg font-semibold mr-10">Storages ({data.length})</h1>
                    <SearchInput onChange={(event) => setSearchQuery(event.target.value)} />
                </div>
                <ModalSwitch
                    modal={StorageEditModal}
                    button={(props: any) => <button {...props} className="bg-green-500 hover:bg-green-600 text-white text-sm rounded py-2 px-4">Criar storage</button>}
                />
            </div>
            <table className="w-full mt-4">
                <thead>
                    <tr>
                        <th>Nome ID</th>
                        <th>Armazenamento utilizado</th>
                        <th>Tempo de atividade</th>
                        <th>Status</th>
                        <th>Ações</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredStorages.map((storage) => <tr key={storage.id}>
                        <th>
                            <div className="flex items-center justify-start">
                                <div className="w-5 h-5 mr-1 flex items-center justify-center rounded bg-slate-900 text-blue-500">
                                    <IoFileTrayOutline />
                                </div>
                                <h1 className="font-semibold text-xs text-slate-900">{storage.name}</h1>
                            </div>
                        </th>
                        <td>
                            <h1 className="font-semibold text-xs text-slate-900">1,2TB</h1>
                            <h1 className="font-light text-xs text-neutral-400 mt-1">{Number(storage.documentsCount).toLocaleString()} docs</h1>
                        </td>
                        <td>
                            <h1 className="font-semibold text-xs text-slate-900">6 horas e dois minutos</h1>
                            <h1 className="font-light text-xs text-neutral-400 mt-1">10/12/22 às 16h47</h1>
                        </td>
                        <td>
                            <div className="flex">
                                <h1 className={`bg-green-100 text-xs text-green-500 rounded px-2 py-1`}>Ativo</h1>
                            </div>
                        </td>
                        <td>
                            <div className="grid grid-flow-col gap-x-1 justify-start">
                                <ModalSwitch
                                    modal={StorageMigrationModal}
                                    modalProps={{storage}}
                                    button={(props: any) => <div {...props} className="w-min bg-neutral-100 text-blue-500 p-1 rounded cursor-pointer">
                                        <IoRepeat />
                                    </div>}
                                />
                                <ModalSwitch
                                    modal={StorageReplicationConfigModal}
                                    modalProps={{storage}}
                                    button={(props: any) => <div {...props} className="w-min bg-neutral-100 text-blue-500 p-1 rounded cursor-pointer">
                                        <IoDocumentsOutline />
                                    </div>}
                                />
                                <ModalSwitch
                                    modal={StorageEditModal}
                                    modalProps={{storage}}
                                    button={(props: any) => <div {...props} className="w-min bg-neutral-100 text-blue-500 p-1 rounded cursor-pointer">
                                        <IoCreateOutline />
                                    </div>}
                                />
                                <div className="w-min bg-neutral-100 text-blue-500 p-1 rounded cursor-pointer">
                                    <IoTrashOutline />
                                </div>
                            </div>
                        </td>
                    </tr>)}
                </tbody>
            </table>
        </>}
    </Layout>
}

export default Storages;