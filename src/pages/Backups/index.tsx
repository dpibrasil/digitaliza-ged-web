import { IoCreateOutline, IoDownload, IoList, IoPlay } from "react-icons/io5";
import Layout from "../../components/Layout";
import { useQuery } from "react-query";
import api, { catchApiErrorMessage } from "../../services/api";
import toast from "react-hot-toast";
import { ModalSwitch } from "../../components/Modal";
import OrganizationBackupsModal, { downloadBackup } from "../../modals/OrganizationBackupsModal";

export default function Backups()
{
    const { data, refetch } = useQuery('@backups', async () => (await api.get('/backups')).data)

    async function handleCreateBackup(organizationId: number)
    {
        const promise = api.post('/backups', { organizationId }, { responseType: 'blob' })

        toast.promise(promise, {
            loading: 'Criando backup, isto pode demorar alguns minutos',
            error: catchApiErrorMessage,
            success: () => {
                refetch()
                return 'Backup concluído.'
            }
        })
    }

    return <Layout title="Backups">
        <div className="justify-between items-center flex">
            <div className="flex items-center">
                <h1 className="text-lg font-semibold mr-10">Backups</h1>
            </div>
        </div>
        {!!data && <table className="w-full mt-4">
            <thead>
                <tr>
                    <th className="py-3 px-4 text-left font-medium text-neutral-500 uppercase text-xs">Empresa</th>
                    <th className="py-3 px-4 text-left font-medium text-neutral-500 uppercase text-xs">Último backup</th>
                    <th className="py-3 px-4 text-left font-medium text-neutral-500 uppercase text-xs">Ações</th>
                </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
                {data.map((organization: any) => <tr key={organization.id}>
                    <th className="py-3 px-4 text-left font-medium text-neutral-700">{organization.name}</th>
                    <td className="py-3 px-4 text-neutral-600">
                        {!organization.backups.length && <h1 className="text-red-500 text-sm">Sem backups recentes</h1>}
                        {!!organization.backups.length && new Date(organization.backups.sort((x: any, y: any) => new Date(x.created_at).getTime() - new Date(y.created_at).getTime()).reverse()[0].created_at).toLocaleString()}
                    </td>
                    <td className="py-3 px-4">
                        <div className="grid auto-col-max grid-flow-col justify-start gap-x-1 cursor-pointer">
                            <div
                                onClick={() => downloadBackup(organization.backups[0].id)}
                                title="Baixar último backup"
                                className="w-min bg-neutral-100 text-blue-500 p-2 hover:bg-neutral-200 rounded"
                            >
                                <IoDownload size={18}/>
                            </div>
                            <div
                                title="Criar backup"
                                className="w-min bg-neutral-100 text-blue-500 p-2 hover:bg-neutral-200 rounded"
                                onClick={() => handleCreateBackup(organization.id)}
                            >
                                <IoPlay size={18} />
                            </div>
                            <ModalSwitch
                                modal={OrganizationBackupsModal}
                                modalProps={{organizationId: organization.id}}
                                button={(props: any) => <div {...props} title="Histórico de backups" className="w-min bg-neutral-100 text-blue-500 p-2 hover:bg-neutral-200 rounded">
                                    <IoList size={18} />
                                </div>}
                            />
                        </div>
                    </td>
                </tr>)}
            </tbody>
        </table>}
    </Layout>
}