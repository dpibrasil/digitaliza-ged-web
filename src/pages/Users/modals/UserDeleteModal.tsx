import Modal, { ModalType } from "../../../components/Modal"

function UserDeleteModal(props:ModalType) {
    return <Modal {...props} >
        <div>
        <img alt="Deletar usuário" src={process.env.PUBLIC_URL+'/static/delete.svg'} ></img>
        </div>
        <div>
            <h1>Deseja mesmo apagar esse usuário?</h1>
            <h2>if you need more info, weel done please great and outstanting apps check</h2>
            <button>Excluir usuário</button>
        </div>
    </Modal>
    
}

export default UserDeleteModal