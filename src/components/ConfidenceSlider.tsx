import { Form, Row, Col } from 'react-bootstrap';

interface ConfidenceSliderProps {
  value: number;
  onChange: (value: number) => void;
  disabled?: boolean;
}

export const ConfidenceSlider = ({ value, onChange, disabled = false }: ConfidenceSliderProps) => {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onChange(parseFloat(event.target.value));
  };

  return (
    <Form.Group className="mb-3">
      <Form.Label>
        <i className="bi bi-sliders me-2"></i>
        Confidence Threshold
      </Form.Label>
      <Row className="align-items-center">
        <Col>
          <Form.Range
            min={0.1}
            max={1.0}
            step={0.1}
            value={value}
            onChange={handleChange}
            disabled={disabled}
          />
        </Col>
        <Col xs="auto">
          <div className="text-muted small">
            Confidence: <strong>{value.toFixed(1)}</strong>
          </div>
        </Col>
      </Row>
    </Form.Group>
  );
};
