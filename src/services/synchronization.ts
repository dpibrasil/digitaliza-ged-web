import toast from "react-hot-toast"
import api, { catchApiErrorMessage } from "./api"

export async function syncDocumentFromQueue(data: any) {
    // create document
    const form = new FormData()

    form.append('directoryId', data.directoryId)
                
    // append indexes
    for (const key in data.indexes) {
        if (key.includes('index-')) {
            form.append(key, String(data[key]))
        }
    }

    // append file 
    form.append('file', new Blob([data.data]))
    const promise = api.post('/documents', form, {
        headers: {'Content-Type': 'multipart/form-data'}
    })
    toast.promise(promise, {
        loading: 'Salvando documento...',
        error: catchApiErrorMessage,
        success: 'Documento salvo com sucesso!'
    })
}