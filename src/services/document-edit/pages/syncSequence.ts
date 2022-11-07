import Database from "../../database"

export default async function syncSequence()
{
    const db = new Database()
    var i = 0
    
    const pages = (await db.workingDocumentPages.toArray())
    .sort((x, y) => x.sequence - y.sequence)

    for (const page in pages) {
        i++
        pages[page].sequence = i
    }

    await db.workingDocumentPages.bulkPut(pages)
}