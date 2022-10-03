import React from "react";
import { Input } from "../../components/Input";

function SignIn() {
    return <div className="h-screen w-100 flex flex-row">
        <div className="lg:basis-3/5 md:basis-1/4 hidden md:flex bg-blue-500 items-center justify-center lg:p-28 p-10">
            <img src={process.env.PUBLIC_URL + '/static/auth-banner.png'} className="max-w-full max-h-full" />
        </div>
        <div className="basis-full lg:basis-2/5 md:basis-3/4 flex flex-col items-center justify-between p-10">
            <div className="h-full w-full max-w-[250]  flex items-center justify-center flex-col">
                <img src={process.env.PUBLIC_URL + '/static/digitaliza.svg'} className="w-100" alt="Digitaliza" />
                <Input label="E-mail" type="email" placeholder="Ex.: exemplo@digitaliza.com.br" />
                <Input label="Senha" type="password" placeholder="············" />
                <button className="w-full text-white bg-blue-500 p-3 rounded">Entrar</button>
            </div>
            <div className="w-full grid md:grid-cols-4 grid-cols-2 gap-0.5 text-center text-neutral-500">
                <a>Termos</a>
                <a>Privacidade</a>
                <a>Contato</a>
                <a>Suporte</a>
            </div>
        </div>
    </div>
}

export default SignIn;