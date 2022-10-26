import { IoCreateOutline, IoDownloadOutline, IoGrid, IoTrashOutline } from "react-icons/io5"
import { SearchInput } from "../../components/Input"
import Layout from "../../components/Layout"
import { ModalSwitch } from "../../components/Modal"
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
    const user = {
        name: 'Gabryel',
        empresa: 'Prefeitura Santana',
        email: 'gabryel@dpi.com',
        cpf: 'SSP',
        cargo: 'admin'
    }
    return <Layout>
        <div className="justify-between items-center flex">
            <div className="flex items-center">
                <h1 className="text-lg font-semibold mr-10">Usuários(150)</h1>
                <SearchInput />
            </div>
            <div className=" text-slate-300 grid grid-flow-col items-center gap-x-9 cursor-pointer">
                <IoGrid size={20}/>
                <h1 className="text-[12px] text-gray-400 font-bold">Exportar</h1>
                <button className="bg-green-500 hover:bg-green-600 text-white text-sm rounded py-2 px-4">Criar usuário</button>
            </div>
        </div>
        <div>
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
                      <tr >
                        <th>{user.name}</th>
                        <td>{user.empresa}</td>
                        <td>{user.email}</td>
                        <td>{user.cpf}</td>
                        <td>
                            <div className="flex">
                                <h1 className={`bg-${UserTypeColor[user.cargo]}-100 text-${UserTypeColor[user.cargo]}-500 rounded p-2`}>{UserTypeName
                                [user.cargo]}</h1>
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
                    </tr>
                </tbody>
            </table>
        </div>
    </Layout>
}

export default Users