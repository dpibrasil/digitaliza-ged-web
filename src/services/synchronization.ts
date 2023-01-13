import toast from "react-hot-toast"
import api, { catchApiErrorMessage } from "./api"
import Database from "./database"

const db = new Database()

export async function syncDocumentFromQueue(data: any) {
    // create document
    const form = new FormData()

    form.append('directoryId', data.directoryId)
                
    // append indexes
    for (const key in data.indexes) {
        if (key.includes('index-') && ![null, undefined, ''].includes(data.indexes[key])) {
            form.append(key, data.indexes[key])
        }
    }

    // append file 
    form.append('file', new Blob([data.data]))
    const promise = api.post('/documents', form, {
        headers: {'Content-Type': 'multipart/form-data'}
    })
    toast.promise(promise, {
        loading: 'Salvando documento...',
        error: (e) => {
            const error = catchApiErrorMessage(e)
            db.documentsQueue.update(data.id, {fail: error})
            return error
        },
        success: () => {
            db.documentsQueue.update(data.id, {synced: true, lastSync: new Date()})
            return 'Documento salvo com sucesso!'
        }
    })
}