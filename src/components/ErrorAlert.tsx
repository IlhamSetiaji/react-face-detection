import { Alert } from 'react-bootstrap';

interface ErrorAlertProps {
  error: string;
  onDismiss?: () => void;
}

export const ErrorAlert = ({ error, onDismiss }: ErrorAlertProps) => {
  return (
    <Alert variant="danger" dismissible={!!onDismiss} onClose={onDismiss} className="mt-3">
      <i className="bi bi-exclamation-triangle-fill me-2"></i>
      <strong>Error:</strong> {error}
    </Alert>
  );
};
