import { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import { DocumentType } from "../../types/DocumentTypes";
import { useParams } from "react-router-dom";
import api from "../../services/api";
import { useDocument } from "../../context/DocumentContext";
import { Document as RenderDocument } from 'react-pdf';
import Page from "./Page";
import DocumentEditHeader from "../../components/DocumentEditHeader";

const itemsPerPage = 50

function DocumentEdit()
{
    const [page, setPage] = useState(0)
    const pageIndex = page*itemsPerPage

    const [document, setDocument] = useState<DocumentType|null>(null)

    const params = useParams()
    const documentEdit = useDocument()

    // Caso esteja atualizando documento, leia o documento
    useEffect(() => {
        if (params.documentId) {
            api.get('/documents/' + params.documentId)
            .then(({data}) => setDocument(data))
        }
    }, [params])

    useEffect(() => {
        window.document.getElementById('pdf-preview-grid')?.scrollTo(0, 1)
    }, [page])

    return <Layout title="Editando documento">
        <h1 className="text-lg font-semibold mb-3">{document ? `Editando documento de ${document.organization.name} com ID ${document.id}` : 'Editando novo arquivo'}</h1>
        <DocumentEditHeader {...{page, setPage, pageIndex, itemsPerPage, document}} />
        {documentEdit.output ? (
            documentEdit.updating ? <div className="font-semibold text-sm text-center">Atualizando...</div> : <RenderDocument className="h-full" file={{ data: documentEdit.output }}>
            <div className="grid lg:grid-cols-3 2xl:grid-cols-6 xl:grid-cols-4 grid-cols-1 sm:grid-cols-2 gap-5 h-full overflow-y-auto items-start pb-24" id="pdf-preview-grid">
                {Array.from({length: pageIndex + itemsPerPage > documentEdit.numPages ? documentEdit.numPages - pageIndex : itemsPerPage}, (x, i) => i).map(i => <Page key={i} index={pageIndex + i} />)}
            </div>
        </RenderDocument>
        ) : <div className="flex items-center justify-center flex-col w-full">
        <h1 className="font-semibold text-lg">{'Não foi encontrado páginas :('}</h1>
        <h2 className="text-slate-500 text-sm mt-1">Verifique o documento e selecione ou adicione páginas</h2>
        <img src={process.env.PUBLIC_URL + '/static/no-pages.svg'} className="h-96 mt-8" alt="Nenhum página encontrada" />
    </div>}
    </Layout>
}

export default DocumentEdit;