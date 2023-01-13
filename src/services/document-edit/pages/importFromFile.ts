import { DocumentType } from "../../../types/DocumentTypes";
import api from "../../api";
import { processDocument } from "./add";
import { Buffer } from 'buffer';
import syncSequence from "./syncSequence";

export default async function (id: DocumentType['id'], position?: number){
    const { data } = await api.get(`/documents/${id}/file`, {responseType: 'arraybuffer'})
    const i = Buffer.from(data, 'binary')
    await processDocument([i], position)
    await syncSequence()
}