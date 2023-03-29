import { pdf2png } from "../pdf2png"

const readFile = (file: any, type: 'readAsArrayBuffer'|'readAsDataURL'|'readAsText'|'readAsBinaryString' = 'readAsDataURL') => new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader[type](file)
    reader.onload = async () => {
        if (typeof reader.result == 'string' && reader.result.includes('application')) {
            return resolve(await pdf2png(reader.result))
        }
        resolve(reader.result)
    }
    reader.onerror = (error: any) => reject(error)
})

const readPage = {
    file: function()
    {
        let lock = false

        const input = window.document.createElement('input')
        input.type = 'file'
        input.classList.add('hidden')
        input.multiple = true
        input.accept = '.pdf,.png,.jpg'

        return new Promise((resolve) => {
            // file changed
            input.addEventListener('change', async (event: any) => {
                lock = true
                var files: any = []
                for (const file of event.target.files) {
                    const data = await readFile(file)
                    if (Array.isArray(data)) {
                        files = [...files, ...data]
                    } else {
                        files = [...files, data]
                    }
                }
                resolve(files)
            }, false)
            input.click()

            // cancel event
            window.addEventListener('focus', () => {
                setTimeout(() => {
                    input.remove()
                    if (!lock) resolve(false)
                }, 500)
            }, { once: true })
        })
    },
    scanner: function(position: number = 0)
    {
        document.getElementById('document-position')?.setAttribute('value', String(position))
        document.getElementById('scan-modal')?.removeAttribute('class')
    }
}

export default readPage;