import * as Yup from 'yup';

export const OrganizationValidator = Yup.object().shape({
    name: Yup.string().required('Este campo é obrigatório.'),
    storageId: Yup.number().required('Este campo é obrigatório.')
})