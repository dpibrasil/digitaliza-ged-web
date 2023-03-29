import * as pdfjs from 'pdfjs-dist'

export async function pdf2png(pdfData: string)
{
    pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`

    const pdf = await pdfjs.getDocument(pdfData).promise
    const pngImages = []
    for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i)
        const viewport = page.getViewport({ scale: 1 })
        const canvas = document.createElement('canvas')
        const ctx: any = canvas.getContext('2d')
        canvas.width = viewport.width
        canvas.height = viewport.height
        const renderContext = {
          canvasContext: ctx,
          viewport: viewport,
        }
        await page.render(renderContext).promise
        const base64String = canvas.toDataURL()
        pngImages.push(base64String)
    }

    return pngImages
}