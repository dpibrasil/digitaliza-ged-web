import React from "react";
import { IconType } from "react-icons";
import { IoSearch, IoDocument, IoBusiness, IoFileTray, IoPeople } from "react-icons/io5";
import { NavLink, useMatch } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { UserTypeName } from "../pages/Users";

function MenuItem({name, icon: Icon, to}: {name: string, icon: IconType, to: string}) {

    const active = !!useMatch(to)

    return <NavLink to={to}>
        <div className={"menu-item py-3 px-6 hover:bg-menu-active text-white flex flex-row items-center justify-start " + (active && 'bg-menu-active')}>
            <Icon size={20} color={active ? '#6993FF' : "#4A4B68"} />
            <h1 className={"m-0 ml-2 opacity-60 text-[13px] " + (active ? 'text-white' : 'text-menu-item-text')}>{name}</h1>
        </div>
    </NavLink>
}

type LayoutType = {
    children: any,
    title?: string
}

function Layout(props: LayoutType)
{
    const auth = useAuth()
    const userType = auth?.userData?.type

    return <div className="flex h-screen">
        <div id="menu" className="bg-menu p-0 w-64 h-screen">
            <div className="bg-menu-active text-white px-6 py-4 mb-10">
                <h1 className="text-sm">DIGITALIZA</h1>
            </div>
            <h1 className="text-xs m-2 ml-6 text-menu-text font-semibold">Sistema</h1>
            <MenuItem name="Pesquisa" to="/" icon={IoSearch} />
            <MenuItem name="Criar documento" to="/documents/create" icon={IoDocument} />
            <MenuItem name="Empresas" to="/organizations" icon={IoBusiness} />
            <MenuItem name="Storages" to="/storages" icon={IoFileTray} />
            <MenuItem name="Usuários" to="/users" icon={IoPeople} />
        </div>
        <div className="w-full h-full h-max-screen overflow-auto">
            <div className="header w-full">
                <div className="relative bg-blue-500 w-full h-14 px-24 flex items-center justify-between">
                    <div className="grid grid-flow-col auto-cols-max gap-4 h-full items-center">
                        <img className="h-8" alt="Digitaliza" src={process.env.PUBLIC_URL + '/static/logo-icon.svg'} />
                        {!!props.title && <div className="flex flex-row bg-white self-end">
                            <div className="bg-blue-500 w-2 rounded-br-lg"></div>
                            <div id="header-title" className="bg-white rounded-t-lg h-10 px-4 flex items-center justify-center">
                                <h1 className="font-normal text-sm">{props.title}</h1>
                            </div>
                            <div className="bg-blue-500 w-2 rounded-bl-lg"></div>
                        </div>}
                    </div>
                    <div className="grid grid-flow-col gap-2">
                        <div className="flex flex-col">
                            <h1 className="text-[10px] font-normal text-blue-200">{auth?.userData?.name}</h1>
                            <h2 className="text-[12px] font-normal text-white">{!!userType && UserTypeName[userType]}</h2>
                        </div>
                        <div className="w-8 h-8 rounded bg-blue-400 border-white border flex items-center justify-center">
                            <h1 className="text-white font-sm">{auth?.userData?.name.slice(0, 1)}</h1>
                        </div>
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
