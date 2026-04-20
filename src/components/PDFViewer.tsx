import { useState } from 'react';
import { IoArrowBack, IoArrowDown, IoArrowForward, IoArrowUp, IoCreate, IoDownload, IoReload, IoSearch } from 'react-icons/io5';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { downloadData } from '../services/download';
import { DocumentType } from '../types/DocumentTypes';
import { Button } from './ui/button';

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

type PDFViewerType = {
    url: string,
    document: DocumentType
}

function PDFViewer({url, document}: PDFViewerType)
{
    const [numPages, setNumPages] = useState(0)
    const [pageNumber, setPageNumber] = useState(1)
    const [rotation, setRotation] = useState(0)

    const onDocumentLoadSuccess = ({ numPages }: any) => setNumPages(numPages)

    const setPage = (i: number) => i <= numPages && i >= 1 ? setPageNumber(i) : undefined
    const nextPage = () => setPage(pageNumber + 1)
    const backPage = () => setPage(pageNumber - 1)

    async function handleDownload() {
        const response = await api.get(url, { responseType: 'blob' })
        downloadData(response.data, `${document.organization.name.slice(0, 5)}-${document.directory.name.slice(0, 5)}-${document.id}.pdf`)
    }

    async function handleDownloadProject() {
        const response = await api.get(url.replace('/file', '/project'), { responseType: 'blob' })
        downloadData(response.data, `${document.organization.name.slice(0, 5)}-${document.directory.name.slice(0, 5)}-${document.id}.ged-project`)
    }

    const handleRotate = (r: number) => setRotation(prev => prev + r)

    return <div className="col-span-5">
        <div className="bg-primary px-6 py-4 rounded-t-lg text-menu grid items-center grid-flow-col justify-start gap-x-4 overflow-x-auto">
            <button type="button" onClick={() => handleRotate(90)} className="text-white hover:text-blue-200 transition-colors">
                <IoReload />
            </button>
            <button type="button" onClick={() => handleRotate(-90)} className="text-white hover:text-blue-200 transition-colors">
                <IoReload className="transform scale-x-[-1]" />
            </button>
            <IoSearch className="text-white" />
            <div className="flex flex-row items-center">
                <div className="bg-white grid grid-flow-col gap-x-2 p-2 rounded items-center">
                    <button type="button" onClick={backPage}><IoArrowUp className="cursor-pointer" /></button>
                    <button type="button" onClick={nextPage}><IoArrowDown className="cursor-pointer" /></button>
                    <select value={pageNumber} className="text-sm text-menu" onChange={e => setPage(Number(e.target.value))}>
                        {Array.from(Array(numPages).keys()).map(i => <option key={i + 1}>{i + 1}</option>)}
                    </select>
                </div>
                <span className="text-sm text-white font-normal ml-1">de {numPages}</span>
            </div>
            <div className="w-[1px] h-full bg-white/30 mx-2"></div>
            <Button type="button" variant="outline" size="sm" onClick={handleDownload} className="gap-1.5">
                Exportar
                <IoDownload size={14} />
            </Button>
            <Button type="button" variant="outline" size="sm" onClick={handleDownloadProject} className="gap-1.5">
                Baixar projeto
                <IoDownload size={14} />
            </Button>
            <Link to={`/documents/${document.id}/edit`}>
                <Button type="button" variant="outline" size="sm" className="gap-1.5">
                    Editar documento
                    <IoCreate size={14} />
                </Button>
            </Link>
        </div>
        <div className="bg-menu mb-8 text-white p-6 rounded-b-lg flex items-center justify-center flex-col">
            <Document file={{url: url, httpHeaders: api.defaults.headers} as any} onLoadSuccess={onDocumentLoadSuccess}>
                <Page width={500} pageNumber={pageNumber} rotate={rotation} />
            </Document>
            <div className="grid grid-flow-col mt-4 items-center gap-4">
                <Button type="button" variant="success" size="sm" onClick={backPage}>
                    <IoArrowBack size={16} />
                </Button>
                <span className="text-white text-sm">{pageNumber} de {numPages}</span>
                <Button type="button" variant="success" size="sm" onClick={nextPage}>
                    <IoArrowForward size={16} />
                </Button>
            </div>
        </div>
    </div>
}

export default PDFViewer;
