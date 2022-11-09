import { PDFDocument } from "pdf-lib";
import Database from "../../database";
import deleteAll from "./deleteAll";

type ExportType = 'base64'|'buffer'
type PdfType<ExportType> =
    ExportType extends 'base64' ? string :
    ExportType extends 'buffer' ? Uint8Array :
    never

export default async function _export(exportType: ExportType = 'base64', deletePages: boolean = true): Promise<PdfType<ExportType>|any>
{
    const pdf = await PDFDocument.create()
    const db = new Database()

    for (const page of (await db.workingDocumentPages.toArray()).sort((x, y) => x.sequence - y.sequence)) {
        const pagePdf = await PDFDocument.load(page.data)
        const [p] = await pdf.copyPages(pagePdf, [0])
        pdf.addPage(p)
    }

    if (deletePages) await deleteAll()

    if (exportType === 'buffer') return await pdf.save()

    return await pdf.saveAsBase64({dataUri: true})
}