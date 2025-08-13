import { Container, Row, Col, Card } from 'react-bootstrap';
import { useFaceDetection } from '../hooks/useFaceDetection';
import {
  ServerStatusComponent,
  ImageUpload,
  ConfidenceSlider,
  EmotionToggle,
  ActionButtons,
  DetectionResults,
  AnnotatedImage,
  ErrorAlert,
} from '../components';

export const UploadPage = () => {
  const {
    serverStatus,
    isLoading,
    error,
    selectedFile,
    previewUrl,
    confidence,
    emotionsEnabled,
    detectionResult,
    annotatedImageUrl,
    setConfidence,
    setEmotionsEnabled,
    handleFileSelect,
    detectFaces,
    detectAndAnnotate,
    checkServerStatus,
  } = useFaceDetection();

  const isServerOnline = serverStatus.status === 'healthy';
  const isButtonDisabled = !isServerOnline || !selectedFile || isLoading;

  return (
    <div className="min-vh-100 bg-light py-4">
      <Container>
        <Row className="justify-content-center">
          <Col lg={8} xl={6}>
            <Card className="shadow-sm">
              <Card.Header className="bg-primary text-white text-center">
                <h1 className="h3 mb-0">
                  <i className="bi bi-upload me-2"></i>
                  Upload Image Detection
                </h1>
                <small className="opacity-75">
                  Upload an image and adjust confidence manually
                </small>
              </Card.Header>
              <Card.Body className="p-4">
                <ServerStatusComponent 
                  status={serverStatus} 
                  onRefresh={checkServerStatus} 
                />

                <ImageUpload
                  onFileSelect={handleFileSelect}
                  previewUrl={previewUrl}
                  disabled={isLoading}
                />

                <ConfidenceSlider
                  value={confidence}
                  onChange={setConfidence}
                  disabled={isLoading}
                />

                <EmotionToggle
                  emotionsEnabled={emotionsEnabled}
                  onEmotionsChange={setEmotionsEnabled}
                  disabled={isLoading}
                />

                <ActionButtons
                  onDetectFaces={detectFaces}
                  onDetectAndAnnotate={detectAndAnnotate}
                  disabled={isButtonDisabled}
                  isLoading={isLoading}
                />

                {error && <ErrorAlert error={error} />}

                {detectionResult && <DetectionResults result={detectionResult} />}

                {annotatedImageUrl && <AnnotatedImage imageUrl={annotatedImageUrl} />}
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};
