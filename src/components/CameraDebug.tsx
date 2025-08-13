import { useEffect, useRef, useState } from 'react';
import { Card, Button, Alert } from 'react-bootstrap';

export const CameraDebug = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isActive, setIsActive] = useState(false);

  const startSimpleCamera = async () => {
    try {
      setError(null);
      console.log('Starting simple camera...');
      
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          width: { min: 640, ideal: 1280 },
          height: { min: 480, ideal: 720 }
        } 
      });
      
      console.log('Got media stream:', mediaStream);
      setStream(mediaStream);
      
      if (videoRef.current) {
        console.log('Setting video source...');
        videoRef.current.srcObject = mediaStream;
        
        videoRef.current.onloadedmetadata = () => {
          console.log('Video metadata loaded, playing...');
          videoRef.current?.play().then(() => {
            console.log('Video is playing');
            setIsActive(true);
          }).catch(err => {
            console.error('Play error:', err);
            setError('Failed to play video: ' + err.message);
          });
        };
      }
    } catch (err) {
      console.error('Camera error:', err);
      setError(err instanceof Error ? err.message : 'Camera access failed');
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsActive(false);
  };

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  return (
    <Card>
      <Card.Header>
        <h5>Camera Debug Component</h5>
      </Card.Header>
      <Card.Body>
        {error && <Alert variant="danger">{error}</Alert>}
        
        <div className="text-center mb-3">
          <video
            ref={videoRef}
            style={{
              width: '100%',
              maxWidth: '640px',
              height: 'auto',
              border: '2px solid #ccc',
              borderRadius: '8px',
              backgroundColor: '#000'
            }}
            playsInline
            muted
          />
        </div>
        
        <div className="text-center">
          {!isActive ? (
            <Button variant="primary" onClick={startSimpleCamera}>
              Start Simple Camera
            </Button>
          ) : (
            <Button variant="danger" onClick={stopCamera}>
              Stop Camera
            </Button>
          )}
        </div>
        
        <div className="mt-3 small text-muted">
          <div>Stream active: {stream ? 'Yes' : 'No'}</div>
          <div>Video active: {isActive ? 'Yes' : 'No'}</div>
          <div>Video element: {videoRef.current ? 'Available' : 'Not available'}</div>
        </div>
      </Card.Body>
    </Card>
  );
};
