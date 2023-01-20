import * as Yup from 'yup';
import { UserTypeName } from '../pages/Users';

export const UserValidators: any = {
    1: {
        name: Yup.string().required('Este campo é obrigatório.').min(3, 'Deve conter ao menos 3 caracteres.'),
        email: Yup.string().required('Este campo é obrigatório.').email('Insira um e-mail válido.'),
        password: Yup.string().min(3, 'Deve conter ao menos 6 caracteres.')
    },
    2: {
        type: Yup.string().required('Este campo é obrigatório.').equals(['admin', 'super-admin', 'operator', 'client'], 'Selecione um perfil válido.'),
        organizationId: Yup.number().required('Este campo é obrigatório.'),
        organizations: Yup.array().of(Yup.number()).required('Este campo é obrigatório.').min(1, 'Este campo é obrigatório.'),
        directories: Yup.array().of(Yup.number()).required('Este campo é obrigatório.').min(1, 'Este campo é obrigatório.')
    }
}