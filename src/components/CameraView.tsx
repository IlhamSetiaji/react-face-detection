import { Card, Button, Alert, Badge } from 'react-bootstrap';

interface CameraViewProps {
  videoRef: React.RefObject<HTMLVideoElement | null>;
  isCameraActive: boolean;
  isLoading: boolean;
  isDetecting: boolean;
  currentConfidence: number;
  attemptCount: number;
  onStartCamera: () => void;
  onStopCamera: () => void;
  onCaptureAndDetect: () => void;
  onClearResults: () => void;
}

export const CameraView = ({
  videoRef,
  isCameraActive,
  isLoading,
  isDetecting,
  currentConfidence,
  attemptCount,
  onStartCamera,
  onStopCamera,
  onCaptureAndDetect,
  onClearResults,
}: CameraViewProps) => {
  return (
    <Card className="mb-4">
      <Card.Header>
        <h5 className="mb-0">
          <i className="bi bi-camera-video me-2"></i>
          Camera View
          {isCameraActive && (
            <Badge bg="success" className="ms-2">
              <i className="bi bi-circle-fill me-1"></i>
              Live
            </Badge>
          )}
        </h5>
      </Card.Header>
      <Card.Body>
        <div className="text-center">
          {/* Always render video element, but control visibility */}
          <video
            ref={videoRef}
            className="img-fluid rounded mb-3"
            style={{ 
              maxWidth: '100%', 
              maxHeight: '400px',
              width: '100%',
              backgroundColor: '#000',
              display: isCameraActive ? 'block' : 'none'
            }}
            autoPlay
            playsInline
            muted
            controls={false}
            width="640"
            height="480"
          />
          
          {isCameraActive ? (
            <div>
              <div className="d-flex justify-content-center gap-2 mb-3">
                <Button
                  variant="primary"
                  onClick={onCaptureAndDetect}
                  disabled={isDetecting}
                  size="lg"
                >
                  {isDetecting ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      Detecting...
                    </>
                  ) : (
                    <>
                      <i className="bi bi-camera me-2"></i>
                      Capture & Detect
                    </>
                  )}
                </Button>
                <Button
                  variant="outline-secondary"
                  onClick={onClearResults}
                  disabled={isDetecting}
                >
                  <i className="bi bi-arrow-clockwise me-2"></i>
                  Clear
                </Button>
                <Button
                  variant="danger"
                  onClick={onStopCamera}
                  disabled={isDetecting}
                >
                  <i className="bi bi-stop-circle me-2"></i>
                  Stop Camera
                </Button>
              </div>
              
              {isDetecting && (
                <Alert variant="info" className="mb-0">
                  <div className="d-flex align-items-center justify-content-center">
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    <div>
                      <strong>Auto-adjusting confidence...</strong>
                      <div className="small">
                        Current confidence: <Badge bg="primary">{currentConfidence.toFixed(1)}</Badge>
                        {attemptCount > 0 && attemptCount < 5 && (
                          <span className="ms-2">
                            Attempt: {attemptCount}/5
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </Alert>
              )}
            </div>
          ) : (
            <div>
              <div className="bg-light rounded p-5 mb-3">
                <i className="bi bi-camera-video display-1 text-muted"></i>
                <h6 className="text-muted mt-2">Camera not active</h6>
              </div>
              <Button
                variant="success"
                onClick={onStartCamera}
                disabled={isLoading}
                size="lg"
              >
                {isLoading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    Starting...
                  </>
                ) : (
                  <>
                    <i className="bi bi-play-circle me-2"></i>
                    Start Camera
                  </>
                )}
              </Button>
            </div>
          )}
        </div>
      </Card.Body>
    </Card>
  );
};
