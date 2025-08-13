import { Form } from 'react-bootstrap';

interface EmotionToggleProps {
  emotionsEnabled: boolean;
  onEmotionsChange: (enabled: boolean) => void;
  disabled?: boolean;
}

export const EmotionToggle = ({ 
  emotionsEnabled, 
  onEmotionsChange, 
  disabled = false 
}: EmotionToggleProps) => {
  return (
    <Form.Group className="mb-3">
      <Form.Check
        type="switch"
        id="emotions-switch"
        label={
          <span>
            <i className="bi bi-emoji-smile me-2"></i>
            Enable Emotion Detection
          </span>
        }
        checked={emotionsEnabled}
        onChange={(e) => onEmotionsChange(e.target.checked)}
        disabled={disabled}
      />
      <Form.Text className="text-muted">
        Detect emotions along with faces (happy, sad, angry, etc.)
      </Form.Text>
    </Form.Group>
  );
};
