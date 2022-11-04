import Database from "../../database";
import syncSequence from "./syncSequence";

export default async function (id: number) {
    const db = new Database()
    db.workingDocumentPages.delete(id)
    await syncSequence()
}