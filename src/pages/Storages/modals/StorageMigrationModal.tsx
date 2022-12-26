import { Form } from "@unform/web";
import { IoArrowForward, IoFileTrayOutline } from "react-icons/io5";
import { useQuery } from "react-query";
import { Input } from "../../../components/Input";
import Modal, { ModalType } from "../../../components/Modal";
import api from "../../../services/api";
import { StorageType } from "../../../types/StorageTypes";

export default function StorageMigrationModal({storage, ...rest}: ModalType & {storage: StorageType})
{
    const {data} = useQuery<StorageType[]>('@storages', async () => (await api.get('/storages')).data)

    return <Modal {...rest}>
        <Form onSubmit={console.log}>
            <h1 className="text-blue-500 text-lg font-semibold">Migração de Storage</h1>
            <h2 className="font-normal text-sm text-neutral-400">Selecione o(s) storage de destino da migração</h2>
            <div className="grid grid-flow-row gap-y-3 mt-4">
                {data && data.map(s => <div key={s.id} className="bg-[#00A3FF40] hover:bg-[#00A3FF60] rounded-lg px-4 py-3 flex flex-row items-center justify-between">
                    <div className="flex items-center flex-row">
                        <div className="w-7 h-7 mr-2 flex items-center justify-center rounded-lg text-slate-900 bg-blue-500">
                            <IoFileTrayOutline size={18} />
                        </div>
                        <h1 className="text-neutral-300 text-xs font-bold">{s.name}</h1>
                    </div>
                    <div className="flex items-center">
                        <h1 className="text-xs text-neutral-300">1.56Tb</h1>
                        <h2 className="text-xs ml-2 text-neutral-200 font-semibold">1.1 mi de docs</h2>
                    </div>
                    <div className="bg-menu cursor-pointer flex items-center justify-center w-8 h-8 text-white rounded">
                        <IoArrowForward size={18} />
                    </div>
                </div>)}
            </div>
        </Form>
    </Modal>
}