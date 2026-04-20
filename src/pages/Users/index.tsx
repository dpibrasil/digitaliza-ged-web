import { useEffect, useState } from "react"
import toast from "react-hot-toast"
import { IoCreateOutline, IoTrashOutline } from "react-icons/io5"
import { SearchInput } from "../../components/Input"
import Layout from "../../components/Layout"
import { ModalSwitch } from "../../components/Modal"
import { Button } from "../../components/ui/button"
import { Badge, BadgeProps } from "../../components/ui/badge"
import Loading from "../../components/Loading"
import api, { catchApiErrorMessage } from "../../services/api"
import { UserType } from "../../types/UserTypes"
import UserDeleteModal from "./modals/UserDeleteModal"
import UserEditModal from "./modals/UserEditModal"

export const UserTypeColor: any = {
    admin: 'purple',
    'super-admin': 'yellow',
    operator: 'green',
    client: 'red'
}

export const UserTypeName: any = {
    admin: 'Administrador',
    'super-admin': 'Super-Admin',
    operator: 'Scanner',
    client: 'Cliente'
}

const userTypeBadgeVariant: Record<string, BadgeProps['variant']> = {
    admin: 'purple',
    'super-admin': 'warning',
    operator: 'success',
    client: 'danger',
}

function Users () {
    const [users, setUsers] = useState<UserType[]|undefined>()
    const [searchQuery, setSearchQuery] = useState<string>('')

    const filteredUsers = (users ?? []).filter(u => searchQuery.length ? u.name.toLowerCase().includes(searchQuery.toLocaleLowerCase()) : true)

    useEffect(() => {
        api.get('/users')
        .then(({data}) => setUsers(data))
        .catch(e => toast.error(catchApiErrorMessage(e)))
    }, [])

    return <Layout title="Usuários">
        {!users ? <Loading /> : <>
            <div className="flex justify-between items-center gap-4 mb-4">
                <div className="flex items-center gap-4">
                    <h1 className="text-lg font-semibold shrink-0">Usuários ({users.length})</h1>
                    <SearchInput onChange={(event) => setSearchQuery(event.target.value)} />
                </div>
                <ModalSwitch
                    modal={UserEditModal}
                    button={(props: any) => (
                        <Button type="button" variant="success" size="sm" {...props}>Criar usuário</Button>
                    )}
                />
            </div>
            <div className="overflow-x-auto rounded-lg border border-neutral-200">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="bg-neutral-50 border-b border-neutral-200">
                            <th className="py-3 px-4 text-left font-medium text-neutral-500 uppercase text-xs">Nome</th>
                            <th className="py-3 px-4 text-left font-medium text-neutral-500 uppercase text-xs">Empresa</th>
                            <th className="py-3 px-4 text-left font-medium text-neutral-500 uppercase text-xs">E-mail</th>
                            <th className="py-3 px-4 text-left font-medium text-neutral-500 uppercase text-xs">CPF</th>
                            <th className="py-3 px-4 text-left font-medium text-neutral-500 uppercase text-xs">Cargo</th>
                            <th className="py-3 px-4 text-left font-medium text-neutral-500 uppercase text-xs">Ações</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-100">
                        {filteredUsers.map((user, i) => (
                            <tr key={user.id} className={`hover:bg-blue-50 transition-colors ${i % 2 === 0 ? 'bg-white' : 'bg-neutral-50/50'}`}>
                                <td className="py-3 px-4 font-medium text-neutral-700">{user.name}</td>
                                <td className="py-3 px-4 text-neutral-600"></td>
                                <td className="py-3 px-4 text-neutral-600">{user.email}</td>
                                <td className="py-3 px-4 text-neutral-600"></td>
                                <td className="py-3 px-4">
                                    <Badge variant={userTypeBadgeVariant[user.type]}>
                                        {UserTypeName[user.type]}
                                    </Badge>
                                </td>
                                <td className="py-3 px-4">
                                    <div className="flex items-center gap-1">
                                        <ModalSwitch
                                            modal={UserEditModal}
                                            modalProps={{userId: user.id}}
                                            button={(props: any) => (
                                                <Button type="button" variant="ghost-blue" size="icon" {...props}>
                                                    <IoCreateOutline size={15} />
                                                </Button>
                                            )}
                                        />
                                        <ModalSwitch
                                            modal={UserDeleteModal}
                                            button={(props: any) => (
                                                <Button type="button" variant="ghost-blue" size="icon" {...props}>
                                                    <IoTrashOutline size={15} />
                                                </Button>
                                            )}
                                        />
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </>}
    </Layout>
}

export default Users
