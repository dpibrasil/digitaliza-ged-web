import { DirectoryIndexType } from "../types/OrganizationTypes";

export function displayIndex(index: DirectoryIndexType, indexValue: any) {

    if ([null, '', undefined].includes(indexValue)) return null

    // List 
    if (index.type === 'list') return indexValue.value

    // Boleano
    if (index.type === 'boolean') return Boolean(indexValue) ? 'Sim' : 'Não'

    // Date
    if (index.type === 'datetime') {
        return index.displayAs === 'date' ? new Date(indexValue).toLocaleDateString() : new Date(indexValue).toLocaleString()
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
    
    if (index.displayAs === null) return indexValue
    
    return indexValue
}