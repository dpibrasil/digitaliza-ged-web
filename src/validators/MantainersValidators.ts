import * as Yup from 'yup';

export const MantainersValidator = Yup.object().shape({
    name: Yup.string().required('Campo obrigatório.'),
    authorizedDomains: Yup.array().of(Yup.string().required('Campo obrigatório.').matches(new RegExp('(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z0-9][a-z0-9-]{0,61}[a-z0-9]'), 'Digite um domínio valido.'))
})
