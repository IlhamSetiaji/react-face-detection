import { Card, Image } from 'react-bootstrap';

interface CapturedImageProps {
  imageUrl: string;
}

export const CapturedImage = ({ imageUrl }: CapturedImageProps) => {
  return (
    <Card className="mb-4">
      <Card.Header>
        <h5 className="mb-0">
          <i className="bi bi-camera me-2"></i>
          Captured Image
        </h5>
      </Card.Header>
      <Card.Body className="text-center">
        <Image
          src={imageUrl}
          alt="Captured"
          fluid
          thumbnail
          className="mb-3"
          style={{ maxWidth: '100%', height: 'auto', maxHeight: '400px' }}
        />
      </Card.Body>
    </Card>
  );
};
