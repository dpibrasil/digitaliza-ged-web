import Database from "../../database";

export default async function deleteAll() {
    const db = new Database()
    const pages = await db.workingDocumentPages.toArray()

    const ids: any = pages.map(p => p.id).filter(i => i !== undefined)

    db.workingDocumentPages.bulkDelete(ids)   
}