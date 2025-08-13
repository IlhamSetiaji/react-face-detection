import { useState, useRef, useCallback, useEffect } from 'react';
import { cameraService } from '../services/cameraService';
import { apiService } from '../services/apiService';
import type { DetectionResult, Face } from '../types';

export const useRealtimeDetection = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [detectionResult, setDetectionResult] = useState<DetectionResult | null>(null);
  const [isDetecting, setIsDetecting] = useState(false);
  const [currentConfidence, setCurrentConfidence] = useState(0.5);
  const [fps, setFps] = useState(0);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const intervalRef = useRef<number | null>(null);
  const lastDetectionTimeRef = useRef(0);
  const fpsCounterRef = useRef({ frames: 0, lastTime: 0 });
  const isDetectingRef = useRef(false);
  const detectionResultRef = useRef<DetectionResult | null>(null);

  const startCamera = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const stream = await cameraService.startCamera();
      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await new Promise(resolve => {
          if (videoRef.current) {
            videoRef.current.onloadedmetadata = resolve;
          }
        });
      }

      setIsCameraActive(true);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to start camera');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const stopCamera = useCallback(() => {
    // Stop detection loop
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    // Stop camera stream
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }

    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }

    setIsCameraActive(false);
    setIsDetecting(false);
    isDetectingRef.current = false; // Clear ref
    setDetectionResult(null);
    detectionResultRef.current = null; // Clear detection result ref
    setFps(0);
    setError(null);
  }, []);

  const drawDetectionResults = useCallback((
    canvas: HTMLCanvasElement,
    video: HTMLVideoElement,
    result: DetectionResult | null
  ) => {
    const ctx = canvas.getContext('2d');
    if (!ctx || !video.videoWidth || !video.videoHeight) return;

    // Get the actual display size of the video element
    canvas.width = video.offsetWidth;
    canvas.height = video.offsetHeight;

    // Calculate scaling factors
    const scaleX = canvas.width / video.videoWidth;
    const scaleY = canvas.height / video.videoHeight;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw face detection boxes if we have results
    if (result && result.face_count > 0 && result.faces) {
      console.log('Canvas size:', canvas.width, 'x', canvas.height);
      console.log('Video size:', video.videoWidth, 'x', video.videoHeight);
      console.log('Scale factors:', scaleX, scaleY);
      
      ctx.strokeStyle = '#ff00ff'; // Bright magenta for visibility
      ctx.lineWidth = 4;
      ctx.font = '18px Arial';
      ctx.shadowColor = 'rgba(0, 0, 0, 0.8)';
      ctx.shadowBlur = 2;

      result.faces.forEach((face: Face, index: number) => {
        console.log(`Face ${index + 1} bbox:`, face.bbox);
        
        // The API returns coordinates in the original image size
        // We need to scale them to match the current video display size
        const originalImageWidth = result.original_image_size?.width || video.videoWidth;
        const originalImageHeight = result.original_image_size?.height || video.videoHeight;
        
        // Scale from original image coordinates to video coordinates
        const videoX1 = (face.bbox.x1 / originalImageWidth) * video.videoWidth;
        const videoY1 = (face.bbox.y1 / originalImageHeight) * video.videoHeight;
        const videoX2 = (face.bbox.x2 / originalImageWidth) * video.videoWidth;
        const videoY2 = (face.bbox.y2 / originalImageHeight) * video.videoHeight;
        
        // Then scale from video coordinates to canvas display coordinates
        const x = videoX1 * scaleX;
        const y = videoY1 * scaleY;
        const width = (videoX2 - videoX1) * scaleX;
        const height = (videoY2 - videoY1) * scaleY;

        // Draw bounding box
        ctx.strokeStyle = '#00ff00'; // Green color
        ctx.lineWidth = 3;
        ctx.strokeRect(x, y, width, height);
        
        // Draw confidence label
        ctx.fillStyle = '#00ff00';
        ctx.font = '16px Arial';
        const label = `${(face.confidence * 100).toFixed(1)}%`;
        ctx.fillText(label, x, y - 5);
      });
    }

    // Update FPS counter
    fpsCounterRef.current.frames++;
    const now = performance.now();
    if (now - fpsCounterRef.current.lastTime >= 1000) {
      setFps(fpsCounterRef.current.frames);
      fpsCounterRef.current.frames = 0;
      fpsCounterRef.current.lastTime = now;
    }
  }, []);

  const detectFaces = useCallback(async (videoElement: HTMLVideoElement) => {
    try {
      // Capture frame from video
      const imageBlob = await cameraService.captureImage(videoElement);
      const imageFile = new File([imageBlob], 'realtime-frame.jpg', { type: 'image/jpeg' });

      // Detect faces
      const result = await apiService.detectFaces({
        image: imageFile,
        confidence: currentConfidence
      });

      setDetectionResult(result);
      detectionResultRef.current = result; // Update ref immediately
      return result;
    } catch (error) {
      console.error('❌ Detection error:', error);
      return null;
    }
  }, [currentConfidence]);

  const detectionLoop = useCallback(() => {
    if (!videoRef.current || !canvasRef.current) {
      console.log('Detection loop: missing refs');
      return;
    }

    const video = videoRef.current;
    const canvas = canvasRef.current;

    // Check if detection is still active using ref
    if (!isDetectingRef.current) {
      console.log('Detection loop: not detecting (ref check)');
      return;
    }

    // Always draw the current detection result (even if it's old)
    drawDetectionResults(canvas, video, detectionResultRef.current);

    // Only run detection every 500ms to avoid overwhelming API
    const now = performance.now();
    if (now - lastDetectionTimeRef.current >= 500) {
      lastDetectionTimeRef.current = now;
      
      if (video.readyState === video.HAVE_ENOUGH_DATA) {
        // Run face detection
        detectFaces(video).then(() => {
          // The result will be stored in state by detectFaces function
          // No need to manually call drawDetectionResults here since it happens every frame
        }).catch(error => {
          console.error('Detection error in loop:', error);
        });
      }
    }

    // Continue the loop at a reasonable framerate (30 FPS instead of unlimited)
    if (isDetectingRef.current) {
      setTimeout(() => {
        animationFrameRef.current = requestAnimationFrame(detectionLoop);
      }, 1000 / 30); // 30 FPS
    }
  }, [detectFaces, drawDetectionResults]);

  const startRealtimeDetection = useCallback(async () => {
    try {
      console.log('Starting real-time detection...');
      
      if (!isCameraActive) {
        console.log('Camera not active, starting camera...');
        await startCamera();
        // Wait a bit for camera to be fully ready
        await new Promise(resolve => setTimeout(resolve, 500));
      }
      
      console.log('Setting isDetecting to true...');
      setIsDetecting(true);
      isDetectingRef.current = true; // Set ref immediately
      setError(null);
      
      // Start the detection loop after a short delay
      setTimeout(() => {
        console.log('Starting detection loop...');
        if (videoRef.current && canvasRef.current) {
          console.log('Video and canvas refs available, starting loop');
          detectionLoop();
        } else {
          console.log('Video or canvas ref missing!');
        }
      }, 100);
    } catch (error) {
      console.error('Error starting real-time detection:', error);
      setError(error instanceof Error ? error.message : 'Failed to start real-time detection');
    }
  }, [isCameraActive, startCamera, detectionLoop]);

  const stopRealtimeDetection = useCallback(() => {
    stopCamera();
  }, [stopCamera]);

  const setConfidence = useCallback((confidence: number) => {
    setCurrentConfidence(confidence);
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, [stopCamera]);

  return {
    isLoading,
    error,
    isCameraActive,
    detectionResult,
    isDetecting,
    currentConfidence,
    fps,
    videoRef,
    canvasRef,
    startRealtimeDetection,
    stopRealtimeDetection,
    setConfidence,
  };
};
