import { useEffect, useState } from "react"
import toast from "react-hot-toast"
import { IoCreateOutline, IoDownloadOutline, IoGrid, IoTrashOutline } from "react-icons/io5"
import { SearchInput } from "../../components/Input"
import Layout from "../../components/Layout"
import { ModalSwitch } from "../../components/Modal"
import api, { catchApiErrorMessage } from "../../services/api"
import { UserType } from "../../types/UserTypes"
import UserDeleteModal from "./modals/UserDeleteModal"

const UserTypeColor: any = {
    admin: 'purple',
    superAdmin: 'yellow',
    operator: 'green',
    client: 'red'
}

const UserTypeName: any = {
    admin: 'Administrador',
    superAdmin: 'Super-Admin',
    operator: 'Scanner',
    client: 'Cliente'
}

function Users () {

    const [users, setUsers] = useState<UserType[]|undefined>()

    useEffect(() => {
        api.get('/users')
        .then(({data}) => setUsers(data))
        .catch(e => toast.error(catchApiErrorMessage(e)))
    }, [])

    return <Layout>
        {users ? <>
            <div className="justify-between items-center flex">
                <div className="flex items-center">
                    <h1 className="text-lg font-semibold mr-10">Usuários ({users.length})</h1>
                    <SearchInput />
                </div>
                <div className=" text-slate-300 grid grid-flow-col items-center gap-x-9 cursor-pointer">
                    <IoGrid size={20}/>
                    <h1 className="text-[12px] text-gray-400 font-bold">Exportar</h1>
                    <button className="bg-green-500 hover:bg-green-600 text-white text-sm rounded py-2 px-4">Criar usuário</button>
                </div>
            </div>
            <table className="w-full mt-4">
                    <thead>
                        <th>Nome ID</th>
                        <th>Empresa/Secundária</th>
                        <th>e-mail/Cell</th>
                        <th>CPF</th>
                        <th>Cargo</th>
                        <th>Ações</th>
                    </thead>
                    <tbody>
                        {users.map(user => <tr>
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