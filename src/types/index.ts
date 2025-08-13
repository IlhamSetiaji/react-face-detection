export interface BoundingBox {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

export interface EmotionData {
  dominant_emotion: string;
  confidence: number;
  all_emotions: {
    happy: number;
    neutral: number;
    surprise: number;
    sad: number;
    angry: number;
    fear: number;
    disgust: number;
  };
}

export interface AgeData {
  estimated_age: number;
  age_range: {
    min: number;
    max: number;
  };
}

export interface Face {
  confidence: number;
  bbox: BoundingBox;
  width: number;
  height: number;
  area: number;
  landmarks?: boolean;
  emotion?: EmotionData;
  age?: AgeData;
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
  emotions?: boolean;
  age?: boolean;
}
