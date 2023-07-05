import { PDFDocument, PDFHexString, PDFName } from "pdf-lib";

const key = PDFName.of('GEDMeta')

async function setGEDMetaData(pdfDoc: PDFDocument, data: any) {
    /* @ts-ignore */
    const metaData = pdfDoc.getInfoDict()
    
    metaData.set(key, PDFHexString.fromText(JSON.stringify(data)))

    return pdfDoc.save()
}

async function readGEDMetaData(pdfDoc: PDFDocument)
{
    /* @ts-ignore */
    const metaData = pdfDoc.getInfoDict()
    const gedMeta = metaData.lookup(key).decodeText()

    return gedMeta
}

export default { setGEDMetaData, readGEDMetaData }