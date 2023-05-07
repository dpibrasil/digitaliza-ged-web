import { useEffect, useState } from "react";
import Dropdown from "rc-dropdown";
import { IoArrowForward, IoCloudUpload, IoCloudUploadOutline, IoDocumentAttach, IoPrint, IoReload, IoTrash } from "react-icons/io5";
import DropdownMenu from "../../components/DropdownMenu";
import Layout from "../../components/Layout";
import { DocumentType } from "../../types/DocumentTypes";
import { useParams } from "react-router-dom";
import api, { catchApiErrorMessage } from "../../services/api";
import EditIndexesModal from "../../modals/EditIndexesModal";
import { ModalSwitch } from "../../components/Modal";
import Page from "./Page";
import toast from "react-hot-toast";
import { useDocument } from "../../context/DocumentContext";
import b64toBlob from "../../services/document-edit/b64toBlob";
import { downloadBase64 } from "../../services/download";
import { v4 as uuid } from 'uuid';
import { useAuth } from "../../context/AuthContext";
import { Buffer } from "buffer";

const DOC_PACKAGE_SIZE = Number(process.env.REACT_APP_DOCUMENT_PACKAGE_SIZE)

function DocumentEdit()
{
    const auth = useAuth()
    const [document, setDocument] = useState<DocumentType|null>(null)
    const [largeUpload, setLargeUpload] = useState(false)
    const params = useParams()
    const documentEdit = useDocument()

    useEffect(() => {
        if (params.documentId) {
            api.get('/documents/' + params.documentId)
            .then(({data}) => {
                setDocument(data)
            })
        }
    }, [params])

    const exportPdf = async () => documentEdit.downloadProject()

    async function handleSave(data: any)
    {
        if (document) {
            // update document
            const form = new FormData()
            const file = await documentEdit.exportDocument('buffer')
            form.append('file', new Blob([file]), 'document.pdf')
            const promise = api.post(`/documents/${document.id}/versions`, form, {
                headers: {'Content-Type': 'multipart/form-data'}
            })
            toast.promise(promise, {
                loading: 'Salvando...',
                error: catchApiErrorMessage,
                success: ({data}) => {
                    window.location.href = `/documents/${document.id}`
                    return `Documento salvo com versão ${data.version}.`
                }
            })
        } else if (data.export) {
            const startDate = new Date()
            var documentId = uuid()
            const packagesLength = Math.ceil(documentEdit.pages.length / DOC_PACKAGE_SIZE)
            
            for (var i = 1; i <= packagesLength; i++) {
                const zip = require('jszip')()

                // add pages to zip
                const pages: number[] = []
                for (
                    var x = (i - 1) * DOC_PACKAGE_SIZE + (i === 1 ? 0 : 1);
                    (x <= DOC_PACKAGE_SIZE * (i - 1) + DOC_PACKAGE_SIZE) && x < documentEdit.pages.length;
                    x++
                ) {
                    pages.push(x)
                    zip.file(`page-${documentId}-${i}-${x}`, b64toBlob(documentEdit.pages[x]), { binary: true })
                }

                // add meta data
                const meta = { documentId, packagesLength, package: i, pages, data }
                zip.file('meta', JSON.stringify(meta))

                // export
                const zipOutput = await zip.generateAsync({ type: 'base64' })
                downloadBase64('data:application/zip;base64, ' + zipOutput, `${documentId}-${i}.ged-part-project`)
            }
            downloadBase64('data:application/txt;base64, ' + Buffer.from(`ID do Documento: ${documentId};\nTotal de pacotes: ${packagesLength};\nTamanho do pacote: ${DOC_PACKAGE_SIZE};\nTotal de páginas: ${documentEdit.pages.length}\nUsuário: ${auth.userData?.name} (${auth.userData?.id});\nData de início da exportação: ${startDate.toLocaleString()};\nData de finalização da exportação: ${new Date().toLocaleString()};\nDados de indexação: ${JSON.stringify(data)}`).toString('base64'), `${documentId}-log.txt`)
        } else if (largeUpload) {
            toast.promise((async () => {
                // upload images to server
                const {data: pdf} = await api.post('/pdfs')
                for (const pageIndex in documentEdit.pages) {
                    const image = b64toBlob(documentEdit.pages[pageIndex])
                    const form = new FormData()
                    form.append('index', pageIndex)
                    form.append('image', image)
                    await api.post(`/pdfs/${pdf.id}/image`, form)
                }

                // export pdfId from server
                const {data: output} = await api.get(`/pdfs/${pdf.id}/export`)

                // create document
                const form = new FormData()
                for (const key in data) {
                    form.append(key, data[key])
                }
                form.append('pdfId', output.id)

                const {data: document} = await api.post('/documents', form, {
                    headers: {'Content-Type': 'multipart/form-data'}
                })
                documentEdit.clear()
                return document
            })(), {
                loading: 'Carregando arquivo para nuvem...',
                success: (document) => {
                    window.location.href = `/documents/${document.id}`
                    return `Documento salvo com sucesso.`
                },
                error: catchApiErrorMessage,
            })
        } else {
            // create document
            await documentEdit.save(data.directoryId, data)
            documentEdit.clear()
        }
    }

    function getSelectedPages()
    {
        const inputs = window.document.querySelectorAll('input[type="checkbox"][name="page"]')
        const selectedPages = Array.from(inputs).filter((i: any) => i.checked).map((i: any) => Number(i.value))
        if (!selectedPages.length) {
            toast.error('Nenhuma página selecionada')
            return false
        }
        return selectedPages
    }

    function handleCheckboxAllChanges(event: any)
    {
        const inputs = window.document.querySelectorAll('input[type="checkbox"][name="page"]')
        inputs.forEach((input: any) => input.checked = event.target.checked)
    }

    async function deletePages()
    {
        const selectedPages = getSelectedPages()
        if (!selectedPages) return

        if (!window.confirm(`Você tem certeza que quer deletar ${selectedPages.length === 1 ? 'a página selecionada?' : `as ${selectedPages.length} páginas selecionadas?`}`)) return false

        documentEdit.set(documentEdit.pages.filter((_, i) => !selectedPages.includes(i)))
    }

    async function rotatePages(rotation: number)
    {
        const selectedPages = getSelectedPages()
        if (!selectedPages) return

        // const promise = documentEdit.rotate(selectedPages, rotation)
        // toast.promise(promise, {
        //     error: (e) => e.message,
        //     loading: 'Rotacionando páginas...',
        //     success: 'Páginas rotacionadas com sucesso!'
        // })
    }

    return <Layout title="Editando documento">
        <h1 className="text-lg font-semibold mb-3">{document ? `Editando documento de ${document.organization.name} com ID ${document.id}` : 'Editando novo arquivo'}</h1>
        <div className="grid grid-flow-col gap-x-2 text-slate-500 text-sm items-center justify-start mb-3 border-slate-200 border-b pb-3">
            <div className="grid grid-flow-col gap-x-2 border-r pr-3 mr-1 border-slate-200">
                <input type="checkbox" onChange={handleCheckboxAllChanges} />
                <IoReload className="-scale-x-100 cursor-pointer" onClick={() => rotatePages(-90)} size={20} />
                <IoReload className="cursor-pointer" onClick={() => rotatePages(-90)} size={20} />
                <IoTrash className="cursor-pointer" onClick={deletePages} size={20} />
            </div>
            <button onClick={exportPdf} className="bg-slate-100 p-2 hover:bg-slate-200 rounded flex items-center justify-center gap-x-1">
                Exportar
                <IoCloudUpload />
            </button>
            <Dropdown
                trigger={['click']}
                overlay={<DropdownMenu.Container>
                    {/* <DropdownMenu.Item onClick={() => documentEdit.addPageBy('url', 0)} name="A partir da URL" /> */}
                    <DropdownMenu.Item onClick={() => documentEdit.addPageBy('scanner', 0)} name="A partir do scanner" />
                    <DropdownMenu.Item onClick={() => documentEdit.addPageBy('file', 0)} name="A partir do arquivo" />
                </DropdownMenu.Container>}
                animation="slide-up"
            >
                <button className="bg-slate-100 p-2 hover:bg-slate-200 rounded flex items-center justify-center gap-x-1">
                    Inserir página
                    <IoDocumentAttach />
                </button>
            </Dropdown>
            <button onClick={() => documentEdit.addPageBy('scanner', 0)} className="bg-slate-100 p-2 hover:bg-slate-200 rounded flex items-center justify-center gap-x-1">
                Escanear arquivo
                <IoPrint />
            </button>
            <button onClick={() => setLargeUpload(!largeUpload)} className={`${largeUpload ? 'bg-green-500 hover:bg-green-600 text-white' : 'bg-slate-100 hover:bg-slate-200'} flex-row px-4 py-2 rounded flex items-center justify-center gap-x-1`}>
                Carregamento {largeUpload ? 'otimizado' : 'normal'}
                {largeUpload ? <IoCloudUploadOutline /> : <IoCloudUpload />}
            </button>
            {document ? <button onClick={() => handleSave({})} className="bg-blue-500 text-white px-4 py-2 rounded flex items-center justify-center gap-x-1">
                Atualizar documento
                <IoArrowForward />
            </button> : <ModalSwitch
                button={(props: any) => <button {...props} className="bg-blue-500 text-white px-4 py-2 rounded flex items-center justify-center gap-x-1">
                    Continuar
                    <IoArrowForward />
                </button>}
                modal={EditIndexesModal}
                modalProps={{handleSubmit: handleSave, editingDocument: true}}
            />}
        </div>
        {documentEdit.pages && documentEdit.pages.length ? <div className="grid lg:grid-cols-3 2xl:grid-cols-6 xl:grid-cols-4 grid-cols-1 sm:grid-cols-2 gap-5">
            {documentEdit.pages.map((page, index) => <Page key={index} data={page} index={index} />)}
        </div> : <div className="flex items-center justify-center flex-col w-full">
            <h1 className="font-semibold text-lg">{'Não foi encontrado páginas :('}</h1>
            <h2 className="text-slate-500 text-sm mt-1">Verifique o documento e selecione ou adicione páginas</h2>
            <img src={process.env.PUBLIC_URL + '/static/no-pages.svg'} className="h-96 mt-8" alt="Nenhum página encontrada" />
        </div>}
    </Layout>
}

export default DocumentEdit;