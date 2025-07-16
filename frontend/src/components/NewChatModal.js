import Modal from "@mui/material/Modal";

const NewChatModal = ({ open, handleClose, username, setUsername, handleCreateChat }) => {
    return (
        <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-title"
            aria-describedby="modal-description"
        >
            <div className="modal-container">
                <div className="modal-content">
                    <h2 id="modal-title" className="modal-title">Start New Chat</h2>
                    <p id="modal-description" className="modal-description">
                        Enter the username of the person you want to chat with
                    </p>
                    <div className="modal-form">
                        <input
                            type="text"
                            placeholder="Enter username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="modal-input"
                            autoFocus
                        />
                        <div className="modal-actions">
                            <button 
                                onClick={handleClose}
                                className="modal-btn modal-btn-cancel"
                            >
                                Cancel
                            </button>
                            <button 
                                onClick={handleCreateChat}
                                className="modal-btn modal-btn-create"
                                disabled={!username.trim()}
                            >
                                Start Chat
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </Modal>
    );
}

export default NewChatModal;