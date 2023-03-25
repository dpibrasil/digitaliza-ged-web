const readFile = (file: any, type: 'readAsArrayBuffer'|'readAsDataURL'|'readAsText'|'readAsBinaryString' = 'readAsDataURL') => new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader[type](file)
    reader.onload = () => resolve(reader.result)
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
                const files = []
                for (const file of event.target.files) {
                    files.push(await readFile(file))
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
    scanner: function()
    {
        document.getElementById('scan-modal')?.removeAttribute('class')
    }
}

export default readPage;