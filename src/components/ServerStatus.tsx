import { Alert, Button } from 'react-bootstrap';
import type { ServerStatus } from '../types';

interface ServerStatusProps {
  status: ServerStatus;
  onRefresh: () => void;
}

export const ServerStatusComponent = ({ status, onRefresh }: ServerStatusProps) => {
  const isOnline = status.status === 'healthy';

  return (
    <Alert variant={isOnline ? 'success' : 'danger'} className="d-flex justify-content-between align-items-center">
      <div>
        {isOnline ? (
          <>
            <i className="bi bi-check-circle-fill me-2"></i>
            Server is online and ready!
          </>
        ) : (
          <>
            <i className="bi bi-x-circle-fill me-2"></i>
            Server is offline. {status.message || 'Please start the Flask app.'}
          </>
        )}
      </div>
      <Button 
        variant={isOnline ? 'outline-success' : 'outline-danger'} 
        size="sm" 
        onClick={onRefresh}
      >
        <i className="bi bi-arrow-clockwise me-1"></i>
        Refresh
      </Button>
    </Alert>
  );
};
