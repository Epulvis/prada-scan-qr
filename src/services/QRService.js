class QRService {
    async sendQRData(id, opsi, signal) {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}`, {
                method: 'POST',
                headers: { 'Content-Type': 'text/plain' },
                body: JSON.stringify({ id, opsi}),
                signal,
                keepalive: true,
                cache: 'no-store',
            });

            if (!response.ok) throw new Error('Gagal mengirim data');

            return response.json();
        } catch (error) {
            if (error.name === 'AbortError') {
                throw error;
            }
            return { success: false, message: error.message || 'Terjadi kesalahan' };
        }
    }
}

export default QRService;
