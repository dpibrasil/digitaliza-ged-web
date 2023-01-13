import { useEffect, useState } from "react"
import toast from "react-hot-toast"
import { IoCreateOutline, IoTrashOutline } from "react-icons/io5"
import { SearchInput } from "../../components/Input"
import Layout from "../../components/Layout"
import { ModalSwitch } from "../../components/Modal"
import api, { catchApiErrorMessage } from "../../services/api"
import { UserType } from "../../types/UserTypes"
import UserDeleteModal from "./modals/UserDeleteModal"
import UserEditModal from "./modals/UserEditModal"

export const UserTypeColor: any = {
    admin: 'purple',
    superAdmin: 'yellow',
    operator: 'green',
    client: 'red'
}

export const UserTypeName: any = {
    admin: 'Administrador',
    superAdmin: 'Super-Admin',
    operator: 'Scanner',
    client: 'Cliente'
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
        {users ? <>
            <div className="justify-between items-center flex">
                <div className="flex items-center">
                    <h1 className="text-lg font-semibold mr-10">Usuários ({users.length})</h1>
                    <SearchInput onChange={(event) => setSearchQuery(event.target.value)} />
                </div>
                <ModalSwitch
                    modal={UserEditModal}
                    button={(props: any) => <button {...props} className="bg-green-500 hover:bg-green-600 text-white text-sm rounded py-2 px-4">Criar usuário</button>}
                />
            </div>
            <table className="w-full mt-4">
                    <thead>
                        <tr>
                            <th>Nome ID</th>
                            <th>Empresa/Secundária</th>
                            <th>e-mail/Cell</th>
                            <th>CPF</th>
                            <th>Cargo</th>
                            <th>Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredUsers.map(user => <tr key={user.id}>
                            <th>{user.name}</th>
                            <td></td>
                            <td>{user.email}</td>
                            <td>{}</td>
                            <td>
                                <div className="flex">
                                    <h1 className={`bg-${UserTypeColor[user.type]}-100 text-${UserTypeColor[user.type]}-500 rounded p-2`}>{UserTypeName
                                    [user.type]}</h1>
                                </div>
                            </td>
                            <td>
                                <div className="grid auto-col-max grid-flow-col justify-start gap-x-1 cursor-pointer">
                                    <div className="w-min bg-neutral-100 text-blue-500 p-1 rounded">
                                        <IoCreateOutline />
                                    </div>
                                    <ModalSwitch
                                        modal={UserDeleteModal}
                                        button={(props: any) => <div {...props} className="w-min bg-neutral-100 text-blue-500 p-1 rounded">
                                        <IoTrashOutline />
                                    </div>}
                                    />
                                </div>
                            </td>
                        </tr>)}
                    </tbody>
            </table>
        </> : <>Carregando...</>}
    </Layout>
}

export default Users