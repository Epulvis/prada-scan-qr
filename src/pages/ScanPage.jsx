import { useSearchParams, useNavigate } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import QRService from '../services/QRService';
import QRModal from '../components/QRModal';
import { Html5Qrcode } from "html5-qrcode";

function ScanPage() {
    const [searchParams] = useSearchParams();
    const opsi = searchParams.get('opsi');
    const [qrData, setQrData] = useState('');
    const [modalData, setModalData] = useState({ open: false, message: '' });
    const navigate = useNavigate();
    const scannerRef = useRef(null);
    const [isScannerRunning, setIsScannerRunning] = useState(false);

    useEffect(() => {
        const qrScannerContainer = document.getElementById("qr-scanner-container");

        // Pastikan scanner hanya diinisialisasi sekali
        if (qrScannerContainer && !scannerRef.current) {
            const html5QrCode = new Html5Qrcode("qr-scanner-container");
            scannerRef.current = html5QrCode;

            html5QrCode.start(
                { facingMode: "environment" },
                {
                    fps: 10,
                    qrbox: { width: 250, height: 250 }
                },
                (decodedText) => {
                    setQrData(decodedText);
                    html5QrCode.stop().then(() => {
                        setIsScannerRunning(false);
                    }).catch(err => console.error('Error stopping scanner:', err));
                },
                (errorMessage) => {
                    console.warn('QR Code scan error:', errorMessage);
                }
            ).then(() => {
                setIsScannerRunning(true);
            }).catch(err => {
                console.error('QR Scanner Error:', err);
            });
        }

        // Cleanup function untuk menghentikan scanner saat komponen di-unmount
        return () => {
            if (scannerRef.current && isScannerRunning) {
                scannerRef.current.stop().then(() => {
                    setIsScannerRunning(false);
                    console.log('Scanner stopped successfully.');
                }).catch(err => {
                    console.error('Error stopping scanner:', err);
                });
            }
        };
    }, [isScannerRunning]);

    const handleSend = async () => {
        const service = new QRService();
        const response = await service.sendQRData(qrData, opsi);

        setModalData({
            open: true,
            message: response.message,
        });
    };

    const handleCloseModal = () => {
        setModalData({ open: false, message: '' });
    };

    return (
        <div>
            <h1>Scan QR untuk Event</h1>
            <p>Opsi: {opsi}</p>
            <div id="qr-scanner-container" style={{ width: '100%', maxWidth: '500px', height: '300px', border: '1px solid black' }}></div>
            <p>QR Terdeteksi: {qrData}</p>
            <button onClick={handleSend}>Kirim</button>
            <button onClick={() => navigate('/')}>Kembali</button>

            <QRModal open={modalData.open} message={modalData.message} onClose={handleCloseModal} />
        </div>
    );
}

export default ScanPage;