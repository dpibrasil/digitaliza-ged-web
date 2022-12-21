import * as Yup from "yup";

export const DirectoryIndexSchema = Yup.object().shape({index: Yup.object().shape({
    name: Yup.string().min(3).required('Campo obrigatório.'),
    type: Yup.string().required('Campo obrigatório.'),
    displayAs: Yup.string(),
    notNullable: Yup.boolean().required('Campo obrigatório.')
})})

export const IndexSchema = Yup.object().shape({
    organizationId: Yup.number().required('Este campo é obrigatório.').moreThan(0, 'Este campo é obrigatório.'),
    directoryId: Yup.number().required('Este campo é obrigatório.').moreThan(0, 'Este campo é obrigatório.')
})