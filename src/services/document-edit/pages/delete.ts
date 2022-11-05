import Database from "../../database";
import syncSequence from "./syncSequence";

export default async function (id: number|number[]) {
    const db = new Database()

    db.workingDocumentPages.bulkDelete(Array.isArray(id) ? id : [id])
    await syncSequence()
}