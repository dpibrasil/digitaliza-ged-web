import { Form } from "@unform/web";
import { useRef } from "react";
import { toast } from "react-hot-toast";
import { IoDownloadOutline } from "react-icons/io5";
import { ReactSelectInput } from "../../../components/Input";
import Modal, { ModalTitle, ModalType } from "../../../components/Modal";
import api, { catchApiErrorMessage } from "../../../services/api";
import { DirectoryType } from "../../../types/OrganizationTypes";
import {downloadData } from "../../../services/download";

function ExportSelectedDocumentsModal({directory, ...props}: ModalType & {directory: DirectoryType})
{
    const formRef = useRef<any>()
    const documents: any = document.querySelectorAll('input[type="checkbox"][name="search-documents"]:checked')

    function handleSubmit(data: any)
    {
        const documentsIDs: number[] = []
        for (const document of documents) documentsIDs.push(Number(document.value))
        const promise = api.post('/documents/export-list', {...data, documents: documentsIDs}, {responseType: 'blob'})

        toast.promise(promise, {
            success: ({data: d}) => {
                downloadData(d, 'export.zip')
                return 'Exportado.'
            },
            loading: 'Exportando...',
            error: catchApiErrorMessage
        })
    }

    return <Modal {...props}>
        <ModalTitle title="Exportando documentos selecionados" subtitle={`${documents.length} documento${documents.length === 1 ? '' : 's'}`} />
        <Form ref={formRef} onSubmit={handleSubmit}>
            {directory && <ReactSelectInput
                name="indexes"
                label="Ordem de índices"
                isMulti={true}
                options={directory.indexes.map(index => ({label: index.name, value: index.id}))}
            />}
            <button type="button" onClick={() => formRef.current.submitForm()} className="bg-blue-500 w-full flex items-center justify-center flex-row rounded py-2 text-sm disabled:bg-neutral-200 disabled:text-neutral-400 disabled:cursor-not-allowed" disabled={!documents.length} title={!documents.length ? 'Selecione documentos para exportar' : ''}>
                <IoDownloadOutline size={20} />
                Exportar agora
            </button>
        </Form>
    </Modal>
}

export default ExportSelectedDocumentsModal;