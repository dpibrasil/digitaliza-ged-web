import { PDFDocument } from "pdf-lib"
import toast from "react-hot-toast"
import Database from "../../database"
import syncSequence from './syncSequence'

type AddType = 'file'|'scanner'|'url'

async function add(documents: string[]|Uint8Array[]|ArrayBuffer[], position?: number) {
    const db = new Database()
    var sequence = position ?? Math.max(1, ...((await db.workingDocumentPages.toArray()).map(p => p.sequence)))
    const x = Math.pow(10, -documents.length.toString().length - 1)

    for (const document of documents) {
        const pdf = await PDFDocument.load(document)
        const pagesIndices = pdf.getPageIndices()
        const pages = []
        for (const i of pagesIndices) {
            const pagePdf = await PDFDocument.create()
            const [page] = await pagePdf.copyPages(pdf, [i])
            pagePdf.addPage(page)
            const pageb64 = await pagePdf.saveAsBase64()
            sequence = sequence + x
            pages.push({
                type: 'base64',
                data: pageb64,
                sequence
            })
        }
        db.workingDocumentPages.bulkAdd(pages)
    }
}

const readFile = (file: any, type: 'readAsArrayBuffer'|'readAsDataURL'|'readAsText'|'readAsBinaryString' = 'readAsDataURL') => new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader[type](file)
    reader.onload = () => resolve(reader.result)
    reader.onerror = (error: any) => reject(error)
})

const getDataBy: any = {
    file: function()
    {
        const input = window.document.createElement('input')
        input.type = 'file'
        input.classList.add('hidden')
        input.multiple = true
        input.accept = '.pdf'
        return new Promise((resolve) => {
            // file changed
            input.addEventListener('change', async (event: any) => {
                const files = []
                for (const file of event.target.files) {
                    files.push(await readFile(file))
                }
                resolve(files)
            }, false)
            input.click()

            // cancel event
            window.document.body.onfocus = () => {
                window.document.body.onfocus = null
                resolve(false)
            }
        })
    }
}

export default async function (by: AddType, position?: number) {
    console.log('ADICIONANDO PÁGINA DE ' + by)
    toast.promise((async () => {
        const data = await getDataBy[by]()
        if (!data || !data.length) return toast.error('Nenhum documento selecionado.')
        console.log(data)
        await add(data, position)
        await syncSequence()
    })(), {
        loading: 'Adicionando documento...',
        error: (e) => e.message,
        success: 'Página(s) adicionada(s) com sucesso!'
    })
}