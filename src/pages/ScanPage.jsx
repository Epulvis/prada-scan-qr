import { useSearchParams, useNavigate } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import QRService from '../services/QRService';
import QRModal from '../components/QRModal';
import jsQR from 'jsqr';

function ScanPage() {
    const [searchParams] = useSearchParams();
    const opsi = searchParams.get('opsi');

    const [qrData, setQrData] = useState('');
    const [modalData, setModalData] = useState({ open: false, message: '' });
    const [isSending, setIsSending] = useState(false);

    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const scanningRef = useRef(false);
    const abortControllerRef = useRef(null);

    const navigate = useNavigate();

    useEffect(() => {
        startScanning();
        return stopScanning;
    }, []);

    useEffect(() => {
        if (qrData) handleSend(qrData);
    }, [qrData]);

    const startScanning = async () => {
        if (scanningRef.current) return;
        scanningRef.current = true;

        const video = videoRef.current;
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d', { willReadFrequently: true });

        try {
            if (!video.srcObject) {
                const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
                video.srcObject = stream;
                await video.play();
            }

            const scanFrame = () => {
                if (!scanningRef.current) return;

                if (video.readyState === video.HAVE_ENOUGH_DATA) {
                    canvas.width = video.videoWidth;
                    canvas.height = video.videoHeight;
                    context.drawImage(video, 0, 0, canvas.width, canvas.height);

                    const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
                    const code = jsQR(imageData.data, imageData.width, imageData.height);

                    if (code) {
                        scanningRef.current = false;
                        setQrData(code.data);
                    } else {
                        requestAnimationFrame(scanFrame);
                    }
                } else {
                    requestAnimationFrame(scanFrame);
                }
            };

            requestAnimationFrame(scanFrame);

        } catch (error) {
            setModalData({ open: true, message: 'Gagal mengakses kamera.' });
        }
    };

    const stopScanning = () => {
        scanningRef.current = false;
        const video = videoRef.current;
        if (video?.srcObject) {
            video.srcObject.getTracks().forEach(track => track.stop());
            video.srcObject = null;
        }
        setQrData('');
    };

    const resetScanner = () => {
        stopScanning();
        setQrData('');
        startScanning();
    };

    const handleSend = async (data) => {
        if (isSending) return;
        setIsSending(true);

        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
        }

        abortControllerRef.current = new AbortController();
        const { signal } = abortControllerRef.current;

        const service = new QRService();
        try {
            const response = await service.sendQRData(data, opsi, signal);
            setModalData({ open: true, message: response.message });
        } catch (error) {
            if (error.name !== 'AbortError') {
                setModalData({ open: true, message: 'Gagal mengirim data QR. Silakan coba lagi.' });
            }
        }

        setIsSending(false);
        resetScanner();
    };

    return (
        <div className='grid grid-cols-[1fr] grid-rows-8'>
            <div className='grid-class-1'>
                <video 
                    ref={videoRef} 
                    className='w-full max-w-lg'
                ></video>
                <canvas 
                    ref={canvasRef} 
                    className='hidden'
                ></canvas>
            </div>
            <div className='grid-class-2'>
                <button 
                    onClick={() => { stopScanning(); navigate('/'); }}
                    className='rounded-md bg-white px-3.5 py-2.5 text-sm font-semibold text-gray-900 shadow-xs hover:bg-gray-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white'
                >
                    Kembali
                </button>
            </div>
            {isSending && 
                <div className='overlay'>
                    <p className="text-blue-500">Mengirim data...</p>
                </div>}
            <QRModal open={modalData.open} message={modalData.message} onClose={() => setModalData({ open: false, message: '' })} />
        </div>
    );
}
//position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center'
export default ScanPage;
