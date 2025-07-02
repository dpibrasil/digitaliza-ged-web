import { Form } from "@unform/web";
import { Input, ReactSelectInput } from "../../../components/Input";
import Modal, { ModalTitle, ModalType } from "../../../components/Modal";
import { OrganizationType } from "../../../types/OrganizationTypes";
import api, { catchApiErrorMessage } from "../../../services/api";
import toast from "react-hot-toast";

const downloadPDFReport = async (payload: any, organization: OrganizationType) => {
    const { data } = await api.get(`/organizations/${organization.id}/report`, {
        params: payload
    })
    const blob = new Blob([data], { type: 'application/pdf' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `report-${organization.name}.pdf`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
}

function GenerateReportModal({ organization, ...rest }: ModalType & { organization: OrganizationType }) {
    function handleSubmit(payload: any) {
        const promise = downloadPDFReport(payload, organization)
        toast.promise(promise, {
            loading: 'Gerando relatório...',
            success: 'Relatório criado com sucesso.',
            error: catchApiErrorMessage,
        })
    }

    return <Modal {...rest}>
        <ModalTitle title="Gerar relatório" subtitle="Preencha os campos corretamente abaixo" />
        <Form onSubmit={handleSubmit}>
            <div className="grid grid-flow-col gap-1">
                <Input
                    type="datetime-local"
                    name="start-date"
                    label="Data inicial"
                />
                <Input
                    type="datetime-local"
                    name="end-date"
                    label="Data final"
                />
            </div>
            <ReactSelectInput
                name="directories"
                label="Diretórios"
                isMulti={true}
                options={organization.directories.map(d => ({ label: d.name, value: d.id }))}
            />
            <button className="bg-blue-500 hover:bg-blue-600 rounded p-2 text-sm text-white mb-4 mt-2" onClick={handleSubmit}>Gerar relatório</button>
        </Form>
    </Modal>
}

export default GenerateReportModal;