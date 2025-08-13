export interface BoundingBox {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

export interface Face {
  confidence: number;
  bbox: BoundingBox;
  width: number;
  height: number;
  area: number;
  landmarks?: boolean;
}

export interface ImageSize {
  width: number;
  height: number;
}

export interface DetectionResult {
  processing_time: number;
  original_image_size: ImageSize;
  face_count: number;
  faces: Face[];
}

export interface ServerStatus {
  status: 'healthy' | 'unhealthy';
  message?: string;
}

export interface ApiError {
  error: string;
}

export interface DetectionRequest {
  image: File;
  confidence: number;
}
