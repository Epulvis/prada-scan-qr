class QRService {
    async sendQRData(id, opsi) {
        try {
            const response = await fetch(import.meta.env.VITE_API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ id, opsi }),
            });
            if (!response.ok) {
                throw new Error('Gagal mengirim data');
            }
            return await response.json();
        } catch (error) {
            return { success: false, message: error.message };
        }
    }
}

export default QRService;
