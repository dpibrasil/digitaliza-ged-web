import { PDFDocument, degrees } from "pdf-lib";
import Database from "../../database";
import syncSequence from "./syncSequence";

export default async function rotate(id: number|number[], rotation: number) {
    const db = new Database()
    const pages = await db.workingDocumentPages.filter((page) => Array.isArray(id) && page.id ? id.includes(page.id) : id === page.id).toArray()

    const rotatedPages = await Promise.all(pages.map(async (page) => {
        const pagePdf = await PDFDocument.load(page.data)
        
        for (const p of pagePdf.getPages()) {
            p.setRotation(degrees(p.getRotation().angle + rotation))
        }

        return {...page, data: await pagePdf.saveAsBase64()}
    }))

    db.workingDocumentPages.bulkPut(rotatedPages)
    await syncSequence()
}