import { Form } from 'react-bootstrap';

interface AgeToggleProps {
  ageEnabled: boolean;
  onAgeChange: (enabled: boolean) => void;
  disabled?: boolean;
}

export const AgeToggle = ({ 
  ageEnabled, 
  onAgeChange, 
  disabled = false 
}: AgeToggleProps) => {
  return (
    <Form.Group className="mb-3">
      <Form.Check
        type="switch"
        id="age-switch"
        label={
          <span>
            <i className="bi bi-calendar-event me-2"></i>
            Enable Age Detection
          </span>
        }
        checked={ageEnabled}
        onChange={(e) => onAgeChange(e.target.checked)}
        disabled={disabled}
      />
      <Form.Text className="text-muted">
        Detect estimated age for each face
      </Form.Text>
    </Form.Group>
  );
};
