import { Container, Row, Col, Card } from 'react-bootstrap';
import { useCamera } from '../hooks/useCamera';
import { useFaceDetection } from '../hooks/useFaceDetection';
import {
  ServerStatusComponent,
  ErrorAlert,
  DetectionResults,
  CameraView,
  CapturedImage,
  AnnotatedImage,
} from '../components';

export const CameraPage = () => {
  const { checkServerStatus, serverStatus } = useFaceDetection();
  const {
    isLoading,
    error,
    isCameraActive,
    detectionResult,
    capturedImage,
    annotatedImageUrl,
    isDetecting,
    currentConfidence,
    attemptCount,
    videoRef,
    startCamera,
    stopCamera,
    captureAndDetect,
    clearResults,
  } = useCamera();

  return (
    <div className="min-vh-100 bg-light py-4">
      <Container>
        <Row className="justify-content-center">
          <Col lg={10} xl={8}>
            <Card className="shadow-sm mb-4">
              <Card.Header className="bg-success text-white text-center">
                <h1 className="h3 mb-0">
                  <i className="bi bi-camera-video me-2"></i>
                  Camera Face Detection
                </h1>
                <small className="opacity-75">
                  Automatic confidence adjustment for optimal detection
                </small>
              </Card.Header>
              <Card.Body className="p-4">
                <ServerStatusComponent 
                  status={serverStatus} 
                  onRefresh={checkServerStatus} 
                />

                {error && <ErrorAlert error={error} />}
              </Card.Body>
            </Card>

            <Row>
              <Col lg={6}>
                <CameraView
                  videoRef={videoRef}
                  isCameraActive={isCameraActive}
                  isLoading={isLoading}
                  isDetecting={isDetecting}
                  currentConfidence={currentConfidence}
                  attemptCount={attemptCount}
                  onStartCamera={startCamera}
                  onStopCamera={stopCamera}
                  onCaptureAndDetect={captureAndDetect}
                  onClearResults={clearResults}
                />
              </Col>
              
              <Col lg={6}>
                {capturedImage && <CapturedImage imageUrl={capturedImage} />}
                
                {detectionResult && <DetectionResults result={detectionResult} />}
                
                {annotatedImageUrl && <AnnotatedImage imageUrl={annotatedImageUrl} />}
              </Col>
            </Row>
          </Col>
        </Row>
      </Container>
    </div>
  );
};
