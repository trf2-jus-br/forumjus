import { useEffect, useRef } from 'react';
import jsQR from 'jsqr';

const QRCodeReader = ({ onScanComplete }) => {
    const videoRef = useRef(null);

    useEffect(() => {
        const startVideo = async () => {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
                videoRef.current.srcObject = stream;
                videoRef.current.play();

                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');

                const scan = () => {
                    if (videoRef.current.readyState === videoRef.current.HAVE_ENOUGH_DATA) {
                        canvas.width = videoRef.current.videoWidth;
                        canvas.height = videoRef.current.videoHeight;
                        ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
                        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                        const code = jsQR(imageData.data, imageData.width, imageData.height, {
                            inversionAttempts: "dontInvert",
                        });
                        
                        if (code) {
                            onScanComplete(code.data);
                            stream.getTracks().forEach(track => track.stop());
                        } else {
                            requestAnimationFrame(scan);
                        }
                    } else {
                        requestAnimationFrame(scan);
                    }
                };

                scan();
            } catch (error) {
                console.error(error);
            }
        };

        startVideo();

        return () => {
            if (videoRef.current && videoRef.current.srcObject) {
                videoRef.current.srcObject.getTracks().forEach(track => track.stop());
            }
        };
    }, [onScanComplete]);

    return <video ref={videoRef} style={{ width: '100%' }} />;
};

export default QRCodeReader;
