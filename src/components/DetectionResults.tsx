import { Card, Alert, Badge, Row, Col, ListGroup } from 'react-bootstrap';
import type { DetectionResult } from '../types';

interface DetectionResultsProps {
  result: DetectionResult;
}

export const DetectionResults = ({ result }: DetectionResultsProps) => {
  return (
    <Card className="mt-4">
      <Card.Header>
        <h5 className="mb-0">
          <i className="bi bi-check-circle-fill text-success me-2"></i>
          Detection Results
        </h5>
      </Card.Header>
      <Card.Body>
        <Row className="mb-3">
          <Col md={4}>
            <div className="text-center">
              <h6 className="text-muted">Processing Time</h6>
              <Badge bg="info" className="fs-6">
                {result.processing_time.toFixed(3)}s
              </Badge>
            </div>
          </Col>
          <Col md={4}>
            <div className="text-center">
              <h6 className="text-muted">Image Size</h6>
              <Badge bg="secondary" className="fs-6">
                {result.original_image_size.width} × {result.original_image_size.height}
              </Badge>
            </div>
          </Col>
          <Col md={4}>
            <div className="text-center">
              <h6 className="text-muted">Faces Found</h6>
              <Badge bg={result.face_count > 0 ? 'success' : 'warning'} className="fs-6">
                {result.face_count}
              </Badge>
            </div>
          </Col>
        </Row>

        {result.faces && result.faces.length > 0 ? (
          <div>
            <h6 className="mb-3">
              <i className="bi bi-person-bounding-box me-2"></i>
              Face Details
            </h6>
            <ListGroup variant="flush">
              {result.faces.map((face, index) => (
                <ListGroup.Item key={index} className="px-0">
                  <Row>
                    <Col md={6}>
                      <strong>Face {index + 1}</strong>
                      <div className="small text-muted">
                        Confidence: <Badge bg="primary">{(face.confidence * 100).toFixed(1)}%</Badge>
                      </div>
                    </Col>
                    <Col md={6}>
                      <div className="small">
                        <div>Position: ({face.bbox.x1.toFixed(0)}, {face.bbox.y1.toFixed(0)}) to ({face.bbox.x2.toFixed(0)}, {face.bbox.y2.toFixed(0)})</div>
                        <div>Size: {face.width.toFixed(0)} × {face.height.toFixed(0)} pixels</div>
                        <div>Area: {face.area.toFixed(0)} pixels²</div>
                        {face.landmarks && (
                          <div className="text-success">
                            <i className="bi bi-check-circle me-1"></i>
                            Facial landmarks detected
                          </div>
                        )}
                        {face.emotion && (
                          <div className="mt-2">
                            <div className="text-warning">
                              <i className="bi bi-emoji-smile me-1"></i>
                              <strong>{face.emotion.dominant_emotion}</strong> ({(face.emotion.confidence * 100).toFixed(1)}%)
                            </div>
                            <div className="small text-muted mt-1">
                              <details>
                                <summary style={{ cursor: 'pointer' }}>All emotions</summary>
                                <div className="mt-1">
                                  {Object.entries(face.emotion.all_emotions)
                                    .sort(([,a], [,b]) => b - a)
                                    .map(([emotion, confidence]) => (
                                      <div key={emotion} className="d-flex justify-content-between">
                                        <span>{emotion}:</span>
                                        <span>{(confidence * 100).toFixed(1)}%</span>
                                      </div>
                                    ))}
                                </div>
                              </details>
                            </div>
                          </div>
                        )}
                      </div>
                    </Col>
                  </Row>
                </ListGroup.Item>
              ))}
            </ListGroup>
          </div>
        ) : (
          <Alert variant="warning" className="mb-0">
            <i className="bi bi-exclamation-triangle me-2"></i>
            No faces detected in the image. Try adjusting the confidence threshold.
          </Alert>
        )}
      </Card.Body>
    </Card>
  );
};
