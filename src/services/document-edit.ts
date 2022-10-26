import Database from "./database"

const toBase64 = (file: any) => new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result)
    reader.onerror = error => reject(error)
})

export async function importPageByFile()
{
    const db = new Database()
    const input = window.document.createElement('input')
    input.type = 'file'
    input.classList.add('hidden')
    input.multiple = true
    input.click()

    input.addEventListener('change', async () => {
        if (!input.files) return
        for (const index in input.files) {
            const file = input.files[index]
            const data = await toBase64(file)
            db.workingDocumentPages.add({
                sequence: 1,
                type: 'base64',
                data
            })
        }
    }, false)
}