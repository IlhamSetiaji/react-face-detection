import { Form, Image } from 'react-bootstrap';

interface ImageUploadProps {
  onFileSelect: (file: File | null) => void;
  previewUrl: string | null;
  disabled?: boolean;
}

export const ImageUpload = ({ onFileSelect, previewUrl, disabled = false }: ImageUploadProps) => {
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    onFileSelect(file);
  };

  return (
    <Form.Group className="mb-3">
      <Form.Label>
        <i className="bi bi-image me-2"></i>
        Select Image
      </Form.Label>
      <Form.Control
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        disabled={disabled}
        className="mb-3"
      />
      {previewUrl && (
        <div className="text-center">
          <Image
            src={previewUrl}
            alt="Preview"
            fluid
            thumbnail
            style={{ maxHeight: '300px' }}
          />
        </div>
      )}
    </Form.Group>
  );
};
