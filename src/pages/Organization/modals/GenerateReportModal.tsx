import { Form } from "@unform/web";
import { Input, ReactSelectInput } from "../../../components/Input";
import Modal, { ModalTitle, ModalType } from "../../../components/Modal";
import { OrganizationType } from "../../../types/OrganizationTypes";
import api from "../../../services/api";
import { useState } from "react";

function GenerateReportModal({ organization, ...rest }: ModalType & { organization: OrganizationType }) {
    const [directories, setDirectories] = useState()

    console.log(directories)
    async function handleSubmit(payload: any) {
        const { data } = await api.get(`/organizations/${organization.id}/report`, {
            params: payload
        })

        console.log(data)

        return
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