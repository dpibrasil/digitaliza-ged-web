import { useState } from "react";
import { IoSearch, IoDocument, IoBusiness, IoFileTray, IoPeople, IoAlbums, IoFileTrayStacked, IoDownload, IoLogOutOutline, IoReload, IoCloudOffline, IoArchive } from "react-icons/io5";
import { NavLink, useMatch } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { UserTypeName } from "../pages/Users";
import RequireUserType from "./RequireUserType";
import SyncQueue from "./SyncQueue";
import Database from "../services/database";
import { toast } from "react-hot-toast";
import { catchApiErrorMessage } from "../services/api";

function MenuItem({ name, icon: Icon, to }: { name: string, icon: any, to: string }) {
    const active = !!useMatch(to)

    return <NavLink to={to}>
        <div className={"menu-item py-3 px-6 flex flex-row items-center justify-start transition-colors " + (active ? 'bg-menu-active' : 'hover:bg-menu-active/60')}>
            <Icon size={20} color={active ? '#6993FF' : "#4A4B68"} />
            <span className={"m-0 ml-2 text-[13px] " + (active ? 'text-white' : 'text-menu-item-text')}>{name}</span>
        </div>
    </NavLink>
}

type LayoutType = {
    children: any,
    title?: string
}

function Layout(props: LayoutType) {
    const auth = useAuth()
    const db = new Database()
    const [showSyncQueue, setShowSyncQueue] = useState(false)
    const [showDisconnectPopUp, setShowDisconnectPopUp] = useState(false)
    const userType = auth?.userData?.type

    const dbSync = () => {
        toast.promise(db.sync(), {
            loading: 'Sincronizando...',
            error: catchApiErrorMessage,
            success: 'Índices sincronizados com sucesso.'
        })
    }

    return <div className="flex h-screen">
        <div id="menu" className="bg-menu p-0 w-64 h-screen flex flex-col justify-between shrink-0">
            <div>
                <div className="bg-menu-active text-white px-6 py-4 mb-10">
                    <img src="/static/digitaliza-icon.svg" alt="" />
                </div>
                <span className="block text-xs m-2 ml-6 text-menu-text font-semibold tracking-wider">DIGITALIZA</span>
                <MenuItem name="Pesquisa" to="/" icon={IoSearch} />
                <RequireUserType type="operator">
                    <MenuItem name="Criar documento" to="/documents/create" icon={IoDocument} />
                    <MenuItem name="Arquivos off-line" to="/upload-project" icon={IoCloudOffline} />
                </RequireUserType>
                <RequireUserType type="admin">
                    <MenuItem name="Empresas" to="/organizations" icon={IoBusiness} />
                    <MenuItem name="Usuários" to="/users" icon={IoPeople} />
                </RequireUserType>
                <RequireUserType type="super-admin">
                    <MenuItem name="Storages" to="/storages" icon={IoFileTray} />
                    <MenuItem name="Mantedores" to="/mantainers" icon={IoAlbums} />
                    <MenuItem name="Backups" to="/backups" icon={IoArchive} />
                </RequireUserType>
            </div>
            <a target="_blank" href="//dpibrasil.com" className="w-full pb-6 flex flex-col items-center">
                <img className="h-4 mb-2" src={process.env.PUBLIC_URL + '/static/dpi.svg'} alt="DPI Brasil" />
                <span className="text-white text-center text-xs">Criado por DPI Brasil</span>
            </a>
        </div>
        <div className="w-full h-full h-max-screen overflow-auto">
            <div className="header w-full shadow-sm">
                <div className="relative bg-primary w-full h-14 px-24 flex items-center justify-between">
                    <div className="grid grid-flow-col auto-cols-max gap-4 h-full items-center">
                        <img className="h-8" alt="Digitaliza" src={process.env.PUBLIC_URL + '/static/logo-icon.svg'} />
                        {!!props.title && <div className="flex flex-row bg-white self-end">
                            <div className="bg-primary w-2 rounded-br-lg"></div>
                            <div id="header-title" className="bg-white rounded-t-lg h-10 px-4 flex items-center justify-center">
                                <span className="font-normal text-sm text-slate-700">{props.title}</span>
                            </div>
                            <div className="bg-primary w-2 rounded-bl-lg"></div>
                        </div>}
                    </div>
                    <div className="grid gap-4 grid-flow-col items-center">
                        <button type="button" onClick={dbSync} className="text-blue-200 hover:text-white transition-colors cursor-pointer" title="Sincronizar">
                            <IoReload size={22} />
                        </button>
                        <a href="https://github.com/tonimoreiraa/digitaliza-agent/releases/download/v0.0.1-stable/digitaliza-setup.zip" download={'digitaliza-setup.zip'} title="Baixar instalador do serviço Digitaliza" className="text-blue-200 hover:text-white transition-colors">
                            <IoDownload size={22} />
                        </a>
                        <button type="button" onClick={() => setShowSyncQueue(!showSyncQueue)} className="text-blue-200 hover:text-white transition-colors cursor-pointer" title="Fila de sincronização">
                            <IoFileTrayStacked size={22} />
                        </button>
                        {showSyncQueue && <SyncQueue />}
                        <button type="button" className="grid grid-flow-col gap-2 items-center" onClick={() => setShowDisconnectPopUp(!showDisconnectPopUp)}>
                            <div className="flex flex-col text-right">
                                <span className="text-[10px] font-normal text-blue-200">{auth?.userData?.name}</span>
                                <span className="text-[12px] font-normal text-white">{!!userType && UserTypeName[userType]}</span>
                            </div>
                            <div className="w-8 h-8 rounded bg-blue-400 border-white border flex items-center justify-center">
                                <span className="text-white text-sm font-medium">{auth?.userData?.name.slice(0, 1)}</span>
                            </div>
                        </button>
                        {showDisconnectPopUp && <div className="fixed top-14 right-24 shadow-lg bg-menu text-neutral-300 px-6 py-4 pr-16 rounded-b-lg rounded-tl-lg">
                            <p className="font-semibold text-base mb-2">Deseja sair?</p>
                            <button type="button" className="flex flex-row items-center justify-start cursor-pointer gap-1.5 hover:text-white transition-colors" onClick={() => auth.signOut()}>
                                <IoLogOutOutline className="text-primary" size={20} />
                                <span className="font-light text-sm">Desconectar</span>
                            </button>
                        </div>}
                    </div>
                </div>
            </div>
            <div className="w-full h-full lg:px-24 lg:py-8 px-4 py-12">
                {props.children}
            </div>
        </div>
    </div>
}

export default Layout
