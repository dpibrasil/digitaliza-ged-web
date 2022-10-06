import React from "react";
import { IconType } from "react-icons";
import { IoSearch, IoDocument, IoBusiness, IoFileTray, IoPeople } from "react-icons/io5";
import { NavLink, useMatch } from "react-router-dom";

function MenuItem({name, icon: Icon, to}: {name: string, icon: IconType, to: string}) {

    const active = !!useMatch(to)

    return <NavLink to={to}>
        <div className={"menu-item py-3 px-6 hover:bg-menu-active text-white flex flex-row items-center justify-start " + (active && 'bg-menu-active')}>
            <Icon size={20} color={active ? '#6993FF' : "#4A4B68"} />
            <h1 className={"m-0 ml-2 opacity-60 text-[13px] " + (active ? 'text-white' : 'text-menu-item-text')}>{name}</h1>
        </div>
    </NavLink>
}

function Layout(props: any)
{
    return <div className="flex">
        <div id="menu" className="bg-menu p-0 w-64 h-screen">
            <h1 className="text-xs m-2 ml-6 text-menu-text font-semibold">Sistema</h1>
            <MenuItem name="Pesquisa" to="/" icon={IoSearch} />
            <MenuItem name="Criar documento" to="/documents/create" icon={IoDocument} />
            <MenuItem name="Empresas" to="/clients" icon={IoBusiness} />
            <MenuItem name="Storages" to="/storages" icon={IoFileTray} />
            <MenuItem name="Usuários" to="/users" icon={IoPeople} />
        </div>
        <div className="w-full h-screen">
            <div className="header w-full">
                <div className="bg-blue-500 w-full h-14 px-24"></div>
            </div>
            <div className="w-full h-full lg:px-24 lg:py-8 px-4 py-12 ">
                {props.children}
            </div>
        </div>
    </div>
}

export default Layout
