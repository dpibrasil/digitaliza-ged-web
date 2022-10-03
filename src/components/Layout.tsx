import React from "react";

function Layout(props: any)
{
    return <>
        <div className="flex">
            <div id="menu" className="bg-slate-900 p-1 w-64 h-screen">
                adsa
            </div>
        </div>
        <h1 className="underline">adsad</h1>
        {props.children}
        Teste
    </>
}

export default Layout
