import { useRef } from "react";
import { AuthInput as Input } from "../../components/Input";
import { Form } from '@unform/web';
import { ValidationError } from "yup";
import api, { catchApiErrorMessage } from "../../services/api";
import toast from 'react-hot-toast';
import { useAuth } from "../../context/AuthContext";
import { Link } from "react-router-dom";
import { SignInValidator } from "../../validators/AuthValidators";
import { Button } from "../../components/ui/button";

function SignIn() {
    const formRef = useRef<any>(null)
    const auth = useAuth()

    async function handleSubmit(data: object) {
        if (!formRef.current) return
        formRef.current.setErrors({})
        try {
            const payload = await SignInValidator.validate(data, {abortEarly: false})
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
        <div className="h-screen w-full flex flex-row">
            <div className="lg:basis-3/5 md:basis-1/4 hidden md:flex bg-primary items-center justify-center lg:p-28 p-10">
                <img alt="Login" src={process.env.PUBLIC_URL + '/static/auth-banner.png'} className="max-w-full max-h-full" />
            </div>
            <div className="basis-full lg:basis-2/5 md:basis-3/4 flex flex-col items-center justify-between p-10">
                <div className="h-full w-full max-w-xs flex items-center justify-center flex-col gap-1">
                    <img src={process.env.PUBLIC_URL + '/static/digitaliza.svg'} className="w-full mb-4" alt="Digitaliza" />
                    <Input background="slate-100" name="email" label="E-mail" type="email" placeholder="Ex.: exemplo@digitaliza.com.br" />
                    <Input background="slate-100" name="password" label="Senha" type="password" placeholder="············" />
                    <Button type="submit" variant="default" className="w-full mt-2">Entrar</Button>
                </div>
                <div className="w-full grid md:grid-cols-4 grid-cols-2 gap-0.5 text-center text-neutral-400 text-sm">
                    <Link to="/terms" className="hover:text-neutral-600 transition-colors">Termos</Link>
                    <Link to="/privacy" className="hover:text-neutral-600 transition-colors">Privacidade</Link>
                    <Link to="/contact" className="hover:text-neutral-600 transition-colors">Contato</Link>
                    <Link to="/suport" className="hover:text-neutral-600 transition-colors">Suporte</Link>
                </div>
            </div>
        </div>
    </Form>
}

export default SignIn;
