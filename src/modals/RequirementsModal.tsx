import { IoWarning } from "react-icons/io5";
import Modal, { ModalTitle, ModalType } from "../components/Modal"

function RequirementsModal({...props}: ModalType)
{   
    return <Modal {...props}>
        <ModalTitle title="Requisitos e obrigações" subtitle="Confira todos as exigências antes de iniciar um projeto." />
        <div className="max-w-md">
            <div className="mb-2">
                <h1 className="font-bold">Requisitos mínimos de máquina</h1>
                <ul className="list-disc pl-4">
                    <li>Processador Intel Core i5 de 8ª geração (ou equivalente)</li>
                    <li>8 GB de memória RAM</li>
                    <li>240 GB de armazenamento SSD</li>
                </ul>
            </div>
            <div className="mb-2">
                <h1 className="font-bold">Requisitos recomendados de máquina</h1>
                <li>Processador Intel Core i5 de 9ª geração (ou equivalente)</li>
                <li>12 GB de memória RAM</li>
                <li>512 GB de armazenamento SSD</li>
            </div>
            <div className="mb-2">
                <h1 className="font-bold">Navegador e sistema operacional</h1>
                <ul className="list-disc pl-4">
                    <li>Windows 10 Pro versão {">="}19XX</li>
                    <li>Opera GX versão {">"}90 <a href="https://www.opera.com/pt/gx" className="text-blue-500 underline">Faça o download</a></li>
                </ul>
            </div>
            <div className="mb-2">
                <h1 className="font-bold">Requisitos operacionais</h1>
                <ul className="list-disc pl-4">
                    <li>O projeto deve conter no máximo {process.env.REACT_APP_PAGES_LIMIT} páginas.</li>
                    <li>Feche outras aplicações ou guias do navegador durante o uso do aplicativo.</li>
                    <li>Certifique-se de que o driver de fábrica esteja atualizado. Em casos de lentidão na contagem ou qualidade de imagem, pode ser necessário atualizar o driver.</li>
                    <li>Certifique-se de que o notebook esteja conectado à energia.</li>
                    <li>Desative o modo de economia de bateria.</li>
                    <li>Conecte o scanner à porta USB 3.0.</li>
                </ul>
            </div>
            <div className="bg-orange-300 bg-opacity-25 p-3 text-orange-500 grid grid-flow-col gap-x-2 rounded items-center">
                <IoWarning size={56} />
                <h1>Certifique-se se todas exigências e recomendações. Caso não, o documento poderá ser perdido <b>PERMANENTEMENTE</b>.</h1>
            </div>
            {props.children}
        </div>
    </Modal>
}

export default RequirementsModal;