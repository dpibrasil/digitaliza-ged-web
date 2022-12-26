import { Form } from "@unform/web";
import { IoFileTrayOutline } from "react-icons/io5";
import { useQuery } from "react-query";
import { Input } from "../../../components/Input";
import Modal, { ModalType } from "../../../components/Modal";
import api from "../../../services/api";
import { StorageType } from "../../../types/StorageTypes";

export default function StorageReplicationConfigModal({storage, ...rest}: ModalType & {storage: StorageType})
{
    const {data} = useQuery<StorageType[]>('@storages', async () => (await api.get('/storages')).data)

    return <Modal {...rest}>
        <Form onSubmit={console.log}>
            <h1 className="text-blue-500 text-lg font-semibold">Você está replicando - <span className="text-neutral-100 text-lg font-semibold">{storage.name}</span></h1>
            <h2 className="font-normal text-sm text-neutral-400">Selecione o(s) storage que deseja replicar</h2>
            <div className="grid grid-flow-row gap-y-3 mt-4">
                {data && data.map(s => <div key={s.id} className="flex flex-row items-center justify-between">
                    <div className="flex items-center flex-row">
                        <div className="w-7 h-7 mr-2 flex items-center justify-center rounded-lg text-slate-900 bg-blue-500">
                            <IoFileTrayOutline size={18} />
                        </div>
                        <h1 className="text-neutral-300 text-xs font-bold">{s.name}</h1>
                    </div>
                    <div className="flex items-center">
                        <h1 className="text-xs text-neutral-400">1.56Tb</h1>
                        <h2 className="text-xs ml-2 text-neutral-300 font-semibold">1.1 mi de docs</h2>
                    </div>
                    <div>
                        <Input type="checkbox" name="replication-storage" value={s.id} /> 
                    </div>
                </div>)}
                <div className="flex flex-row items-center justify-center">
                    <button className="bg-blue-500 hover:bg-blue-600 rounded py-2 px-3 text-sm text-white">Salvar</button>
                </div>
            </div>
        </Form>
    </Modal>
}