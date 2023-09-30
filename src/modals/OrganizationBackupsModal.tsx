import { IoArchive, IoDownloadOutline, IoTrashOutline } from "react-icons/io5"
import Modal, { ModalTitle, ModalType } from "../components/Modal"
import { useQuery } from "react-query"
import api, { catchApiErrorMessage } from "../services/api"
import { filesize } from "filesize"
import toast from "react-hot-toast"
import { downloadData } from "../services/download"

interface Props extends ModalType {
    organizationId: number
}

export async function downloadBackup(backupId: number)
{
    const promise = api.get('/backups/' + backupId, { responseType: 'blob' })
    toast.promise(promise, {
        loading: 'Baixando backup, isto pode demorar alguns minutos',
        error: catchApiErrorMessage,
        success: ({ data }) => {
            downloadData(data, `backup-${backupId}.zip`)
            return 'Download concluído.'
        }
    })
}

export default function OrganizationBackupsModal({ organizationId, ...props }: Props)
{
    const { data, refetch } = useQuery(
        '@backup-' + organizationId,
        async () => (await api.get('/backups/organization/' + organizationId)).data
    )

    async function handleCreateBackup()
    {
        const promise = api.post('/backups', { organizationId })

        toast.promise(promise, {
            loading: 'Criando backup, isto pode demorar alguns minutos',
            error: catchApiErrorMessage,
            success: () => {
                refetch()
                return 'Backup concluído.'
            }
        })
    }

    async function handleDeleteBackup(backupId: number)
    {
        const promise = api.delete('/backups/' + backupId)

        toast.promise(promise, {
            loading: 'Deletando backup...',
            error: catchApiErrorMessage,
            success: () => {
                refetch()
                return 'Backup apagado com sucesso.'
            }
        })
    }

    return <Modal {...props}>
        <ModalTitle
            title="Histórico de backups"
            subtitle={ data && 'Exibindo dados da empresa ' + data.name }
        />
        {!!data && <>
            <div className="grid grid-flow-row overflow-auto max-h-80 gap-3">
                {data.backups.reverse().map((backup: any) => <div key={backup.id} className="w-full flex flex-row justify-between">
                    <div className="flex flex-row items-center justify-start">
                        <div className="bg-blue-500 bg-opacity-10 text-blue-500 rounded-lg w-10 h-10 flex items-center justify-center">
                            <IoArchive size={24} />
                        </div>
                        <div className="flex flex-col ml-2">
                            <h1 className="font-medium text-sm">Backup {new Date(backup.created_at).toLocaleString()}</h1>
                            <h2 className="text-slate-500 text-[11px]">{filesize(backup.size)}</h2>
                        </div>
                    </div>
                    <div className="grid grid-flow-col gap-x-1">
                        <div
                            onClick={() => handleDeleteBackup(backup.id)}
                            className="bg-blue-500 bg-opacity-10 text-blue-500 cursor-pointer rounded-lg w-10 h-10 flex items-center justify-center"
                        >
                            <IoTrashOutline size={24} />
                        </div>
                        <div
                            onClick={() => downloadBackup(backup.id)}
                            className="bg-blue-500 bg-opacity-10 text-blue-500 cursor-pointer rounded-lg w-10 h-10 flex items-center justify-center"
                        >
                            <IoDownloadOutline size={24} />
                        </div>
                    </div>
                </div>)}
            </div>
            <button onClick={handleCreateBackup} type="button" className="bg-blue-500 mt-2 w-full hover:bg-blue-600 text-white text-sm rounded py-2 px-4">
                Criar backup agora
            </button>
        </>}
    </Modal>
}