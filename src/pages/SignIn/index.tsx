import  { useRef } from "react";
import { AuthInput as Input } from "../../components/Input";
import { Form } from '@unform/web';
import { ValidationError } from "yup";
import api, { catchApiErrorMessage } from "../../services/api";
import toast from 'react-hot-toast';
import { useAuth } from "../../context/AuthContext";
import { Link } from "react-router-dom";
import { SignInValidator } from "../../validators/AuthValidators";

function SignIn() {
    const formRef = useRef<any>(null)
    const auth = useAuth()

    async function handleSubmit(data: object) {  
        if (!formRef.current) return
        formRef.current.setErrors({})
        try {
            const payload = await SignInValidator.validate(data, {abortEarly: false})
    
            // authenticate
            const res = await api.post('/auth/login', payload)
            auth.signIn(res.data.user, res.data.token)
        } catch (err: any) {
            if (err.isAxiosError) {
                toast.error(catchApiErrorMessage(err))
            }
            if (err instanceof ValidationError) {
                formRef.current.setErrors(Object.fromEntries(err.inner.map(e => [e.path, e.message])))
            }
        }
    }

    return <Form ref={formRef} onSubmit={handleSubmit}>
    <div className="h-screen w-100 flex flex-row">
        <div className="lg:basis-3/5 md:basis-1/4 hidden md:flex bg-blue-500 items-center justify-center lg:p-28 p-10">
            <img alt="Login" src={process.env.PUBLIC_URL + '/static/auth-banner.png'} className="max-w-full max-h-full" />
        </div>
        <div className="basis-full lg:basis-2/5 md:basis-3/4 flex flex-col items-center justify-between p-10">
            <div className="h-full w-full max-w-[250]  flex items-center justify-center flex-col">
                <img src={process.env.PUBLIC_URL + '/static/digitaliza.svg'} className="w-100" alt="Digitaliza" />
                    <Input background="slate-100" name="email" label="E-mail" type="email" placeholder="Ex.: exemplo@digitaliza.com.br" />
                    <Input background="slate-100" name="password" label="Senha" type="password" placeholder="············" />
                    <button className="w-full text-white bg-blue-500 p-3 rounded">Entrar</button>
            </div>
            <div className="w-full grid md:grid-cols-4 grid-cols-2 gap-0.5 text-center text-neutral-500">
                <Link to="/terms">Termos</Link>
                <Link to="/privacy">Privacidade</Link>
                <Link to="/contact">Contato</Link>
                <Link to="/suport">Suporte</Link>
            </div>
        </div>
    </div>
    </Form>
}

export default SignIn;