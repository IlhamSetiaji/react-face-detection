import { Container, Row, Col, Card } from 'react-bootstrap';
import { useRealtimeDetection } from '../hooks/useRealtimeDetection';
import { useFaceDetection } from '../hooks/useFaceDetection';
import {
  ServerStatusComponent,
  ErrorAlert,
  RealtimeDetectionView,
  DetectionResults,
} from '../components';

export const RealtimeDetectionPage = () => {
  const { checkServerStatus, serverStatus } = useFaceDetection();
  const {
    isLoading,
    error,
    isCameraActive,
    detectionResult,
    isDetecting,
    currentConfidence,
    emotionsEnabled,
    ageEnabled,
    fps,
    videoRef,
    canvasRef,
    startRealtimeDetection,
    stopRealtimeDetection,
    setConfidence,
    setEmotions,
    setAge,
  } = useRealtimeDetection();

  return (
    <div className="min-vh-100 bg-light py-4">
      <Container>
        <Row className="justify-content-center">
          <Col lg={10} xl={8}>
            <Card className="shadow-sm mb-4">
              <Card.Header className="bg-primary text-white text-center">
                <h1 className="h3 mb-0">
                  <i className="bi bi-broadcast me-2"></i>
                  Real-time Face Detection
                </h1>
                <small className="opacity-75">
                  Live video stream with instant face detection overlay
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
              <Col lg={8}>
                <RealtimeDetectionView
                  videoRef={videoRef}
                  canvasRef={canvasRef}
                  isCameraActive={isCameraActive}
                  isLoading={isLoading}
                  isDetecting={isDetecting}
                  currentConfidence={currentConfidence}
                  emotionsEnabled={emotionsEnabled}
                  ageEnabled={ageEnabled}
                  fps={fps}
                  onStartDetection={startRealtimeDetection}
                  onStopDetection={stopRealtimeDetection}
                  onConfidenceChange={setConfidence}
                  onEmotionsChange={setEmotions}
                  onAgeChange={setAge}
                />
              </Col>
              
              <Col lg={4}>
                {detectionResult && <DetectionResults result={detectionResult} />}
              </Col>
            </Row>
          </Col>
        </Row>
      </Container>
    </div>
  );
};
