import { useState } from 'react';
import { IoArrowBack, IoArrowDown, IoArrowForward, IoArrowUp, IoCreate, IoDownload, IoReload, IoSearch } from 'react-icons/io5';
import { Document, Page } from 'react-pdf/dist/esm/entry.webpack';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { downloadData } from '../services/download';
import { DocumentType } from '../types/DocumentTypes';

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

    const setPage = (i: number) => i <= numPages && i >= 1  ? setPageNumber(i) : undefined
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

    return <div className="col-span-5">
        <div className="bg-blue-500 px-6 py-4 rounded-t-lg text-menu grid items-center grid-flow-col justify-start gap-x-4 overflow-x-auto">
            <IoReload />
            <IoReload />
            <IoSearch />
            <div className="flex flex-row items-center">
                <div className="bg-white grid grid-flow-col gap-x-2 p-2 rounded items-center">
                    <IoArrowUp className="cursor-pointer" onClick={backPage} />
                    <IoArrowDown className="cursor-pointer" onClick={nextPage} />
                    <select value={pageNumber} className="text-sm text-menu">
                        {Array.from(Array(numPages).keys()).map(i => <option key={i + 1}>{i + 1}</option>)}
                    </select>
                </div>
                <h1 className="text-sm text-white font-normal ml-1">de {numPages}</h1>
            </div>
            <div className="w-[1px] h-full bg-white mx-2"></div>
            <button onClick={handleDownload} className="bg-white hover:bg-neutral-100 py-2 px-3 text-slate-600 rounded flex flex-row align-center justify-center">
                <h1 className="text-[12px] mr-2">Exportar</h1>
                <IoDownload size={16} />
            </button>
            <button onClick={handleDownloadProject} className="bg-white hover:bg-neutral-100 py-2 px-3 text-slate-600 rounded flex flex-row align-center justify-center">
                <h1 className="text-[12px] mr-2">Baixar projeto</h1>
                <IoDownload size={16} />
            </button>
            <Link to={`/documents/${document.id}/edit`} className="bg-white hover:bg-neutral-100 py-2 px-3 text-slate-600 rounded flex flex-row align-center justify-center">
                <h1 className="text-[12px] mr-2">Editar documento</h1>
                <IoCreate size={16} />
            </Link>
        </div>
        <div className="bg-menu mb-8 text-white p-6 rounded-b-lg flex items-center justify-center flex-col">
            <Document file={{url: url, httpHeaders: api.defaults.headers}} onLoadSuccess={onDocumentLoadSuccess}>
                <Page width={500} pageNumber={pageNumber} rotate={rotation} />
            </Document>
            <div className="grid grid-flow-col mt-4 items-center">
                <button onClick={backPage} className="bg-green-500 hover:bg-green-600 py-2 px-3 text-white rounded flex flex-row align-center justify-center">
                    <IoArrowBack size={18} />
                </button>
                <h1 className="text-white mx-4">{pageNumber} de {numPages}</h1>
                <button onClick={nextPage} className="bg-green-500 hover:bg-green-600 py-2 px-3 text-white rounded flex flex-row align-center justify-center">
                    <IoArrowForward size={18} />
                </button>
            </div>
        </div>
    </div>
}

export default PDFViewer;