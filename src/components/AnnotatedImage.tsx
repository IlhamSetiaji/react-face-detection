import { Card, Button, Image } from 'react-bootstrap';

interface AnnotatedImageProps {
  imageUrl: string;
}

export const AnnotatedImage = ({ imageUrl }: AnnotatedImageProps) => {
  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = 'annotated_image.jpg';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Card className="mt-4">
      <Card.Header>
        <h5 className="mb-0">
          <i className="bi bi-check-circle-fill text-success me-2"></i>
          Annotated Image Generated
        </h5>
      </Card.Header>
      <Card.Body className="text-center">
        <Image
          src={imageUrl}
          alt="Annotated"
          fluid
          thumbnail
          className="mb-3"
          style={{ maxWidth: '100%', height: 'auto' }}
        />
        <div>
          <Button
            variant="success"
            onClick={handleDownload}
            size="lg"
          >
            <i className="bi bi-download me-2"></i>
            Download Image
          </Button>
        </div>
      </Card.Body>
    </Card>
  );
};
