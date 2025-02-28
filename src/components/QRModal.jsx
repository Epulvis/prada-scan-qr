function QRModal({ open, message, onClose }) {
    if (!open) return null;

    return (
        <div style={styles.overlay}>
            <div style={styles.modal}>
                <p>{message}</p>
                <button onClick={onClose}>Tutup</button>
            </div>
        </div>
    );
}

const styles = {
    overlay: {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.5)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modal: {
        backgroundColor: '#fff',
        padding: '20px',
        borderRadius: '8px',
        textAlign: 'center',
    },
};

export default QRModal;
