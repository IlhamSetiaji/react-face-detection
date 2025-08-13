import { Card, Button, Row, Col, Form } from 'react-bootstrap';
import type { RefObject } from 'react';

interface RealtimeDetectionViewProps {
  videoRef: RefObject<HTMLVideoElement | null>;
  canvasRef: RefObject<HTMLCanvasElement | null>;
  isCameraActive: boolean;
  isLoading: boolean;
  isDetecting: boolean;
  currentConfidence: number;
  emotionsEnabled: boolean;
  fps: number;
  onStartDetection: () => void;
  onStopDetection: () => void;
  onConfidenceChange: (confidence: number) => void;
  onEmotionsChange: (enabled: boolean) => void;
}

export const RealtimeDetectionView = ({
  videoRef,
  canvasRef,
  isCameraActive,
  isLoading,
  isDetecting,
  currentConfidence,
  emotionsEnabled,
  fps,
  onStartDetection,
  onStopDetection,
  onConfidenceChange,
  onEmotionsChange,
}: RealtimeDetectionViewProps) => {
  return (
    <>
      <Card className="h-100">
        <Card.Header>
          <Row className="align-items-center">
            <Col>
              <h5 className="mb-0">
                <i className="bi bi-camera-video me-2"></i>
                Live Camera Feed
              </h5>
            </Col>
            <Col xs="auto">
              {isDetecting && (
                <small className="text-success">
                  <i className="bi bi-circle-fill me-1 blink"></i>
                  FPS: {fps.toFixed(1)}
                </small>
              )}
            </Col>
          </Row>
        </Card.Header>
        <Card.Body className="p-3">
          <div className="position-relative mb-3" style={{ aspectRatio: '16/12' }}>
            {/* Video element (always visible when camera is active) */}
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-100 h-100 border rounded"
              style={{ 
                objectFit: 'cover',
                backgroundColor: '#000'
              }}
            />
            
            {/* Canvas overlay for real-time detection */}
            {isDetecting && (
              <canvas
                ref={canvasRef}
                className="position-absolute top-0 start-0 w-100 h-100"
                style={{ 
                  pointerEvents: 'none'
                }}
              />
            )}
            
            {!isCameraActive && (
              <div className="position-absolute top-50 start-50 translate-middle text-center text-muted">
                <i className="bi bi-camera-video-off" style={{ fontSize: '3rem' }}></i>
                <p className="mt-2 mb-0">Camera not started</p>
              </div>
            )}
          </div>

          {/* Controls */}
          <Row className="g-3">
            <Col md={4}>
              <Form.Group>
                <Form.Label>
                  Detection Confidence: {(currentConfidence * 100).toFixed(0)}%
                </Form.Label>
                <Form.Range
                  min={0.1}
                  max={0.9}
                  step={0.05}
                  value={currentConfidence}
                  onChange={(e) => onConfidenceChange(parseFloat(e.target.value))}
                  disabled={isDetecting}
                />
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group>
                <Form.Check
                  type="switch"
                  id="emotions-switch"
                  label="Enable Emotion Detection"
                  checked={emotionsEnabled}
                  onChange={(e) => onEmotionsChange(e.target.checked)}
                  disabled={isDetecting}
                />
                <small className="text-muted">
                  Detect emotions along with faces
                </small>
              </Form.Group>
            </Col>
            <Col md={4} className="d-flex align-items-end">
              {!isCameraActive ? (
                <Button
                  variant="success"
                  onClick={onStartDetection}
                  disabled={isLoading}
                  className="w-100"
                >
                  {isLoading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" />
                      Starting Camera...
                    </>
                  ) : (
                    <>
                      <i className="bi bi-play-fill me-2"></i>
                      Start Real-time Detection
                    </>
                  )}
                </Button>
              ) : (
                <Button
                  variant="danger"
                  onClick={onStopDetection}
                  className="w-100"
                >
                  <i className="bi bi-stop-fill me-2"></i>
                  Stop Detection
                </Button>
              )}
            </Col>
          </Row>
        </Card.Body>
      </Card>
      
      <style>{`
        .blink {
          animation: blink 1s linear infinite;
        }
        @keyframes blink {
          0%, 50% { opacity: 1; }
          51%, 100% { opacity: 0.3; }
        }
      `}</style>
    </>
  );
};
