import Database from "../../database"
import _export from "./export"

export default async function(directoryId: number, indexes: any)
{
    const db = new Database()
    const fileData = await _export('buffer')
    db.documentsQueue.add({
        directoryId, indexes,
        data: fileData,
        synced: false,
        createdAt: new Date()
    })
}