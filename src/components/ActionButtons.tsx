import { Button, ButtonGroup } from 'react-bootstrap';

interface ActionButtonsProps {
  onDetectFaces: () => void;
  onDetectAndAnnotate: () => void;
  disabled: boolean;
  isLoading: boolean;
}

export const ActionButtons = ({ 
  onDetectFaces, 
  onDetectAndAnnotate, 
  disabled, 
  isLoading 
}: ActionButtonsProps) => {
  return (
    <div className="d-grid gap-2 d-md-flex justify-content-md-center mb-4">
      <ButtonGroup>
        <Button
          variant="primary"
          onClick={onDetectFaces}
          disabled={disabled || isLoading}
          size="lg"
        >
          {isLoading ? (
            <>
              <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
              Processing...
            </>
          ) : (
            <>
              <i className="bi bi-search me-2"></i>
              Detect Faces (JSON)
            </>
          )}
        </Button>
        <Button
          variant="success"
          onClick={onDetectAndAnnotate}
          disabled={disabled || isLoading}
          size="lg"
        >
          {isLoading ? (
            <>
              <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
              Processing...
            </>
          ) : (
            <>
              <i className="bi bi-image me-2"></i>
              Get Annotated Image
            </>
          )}
        </Button>
      </ButtonGroup>
    </div>
  );
};
