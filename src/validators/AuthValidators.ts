import * as Yup from 'yup';

export const SignInValidator = Yup.object().shape({
    email: Yup.string().email('Digite um e-mail válido.').required('Este campo é obrigatório.'),
    password: Yup.string().min(6, 'Digite ao menos 6 caracteres.').required('Este campo é obrigatório.'),
})