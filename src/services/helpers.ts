import { DirectoryIndexType } from "../types/OrganizationTypes";

export function displayIndex(index: DirectoryIndexType, indexValue: any) {

    if ([null, '', undefined].includes(indexValue)) return null
    if (index.displayAs === null) return indexValue

    // Boleano
    if (index.type === 'boolean') return Boolean(indexValue) ? 'Sim' : 'Não'

    // Date
    if (index.type === 'datetime') {
        if (index.displayAs !== 'date') {
            return new Date(indexValue).toLocaleDateString()
        } else {
            return new Date(indexValue).toLocaleString()
        }
    }

    // Valor em reais
    if (index.displayAs === 'brl-money') return parseFloat(indexValue).toLocaleString('pt-br', { style: 'currency', currency: 'BRL' })

    // Número inteiro
    if (index.displayAs === 'integer') return parseInt(indexValue)

    // Número decimal
    if (index.displayAs === 'decimal') return String(indexValue).replace('.', ',')

    // CPF
    if (index.displayAs === 'cpf-cnpj' && String(indexValue).length === 11) return String(indexValue).replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4")

    // CNPJ
    if (index.displayAs === 'cpf-cnpj' && String(indexValue).length === 14) return String(indexValue).replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, "$1 $2 $3/$4-$5")

    return indexValue
}