import { useState, useEffect, useRef, useCallback } from 'react';
import { cameraService } from '../services/cameraService';
import { apiService } from '../services/apiService';
import type { DetectionResult } from '../types';

export const useCamera = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [detectionResult, setDetectionResult] = useState<DetectionResult | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [annotatedImageUrl, setAnnotatedImageUrl] = useState<string | null>(null);
  const [isDetecting, setIsDetecting] = useState(false);
  const [currentConfidence, setCurrentConfidence] = useState(0.5);
  const [attemptCount, setAttemptCount] = useState(0);
  
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const startCamera = useCallback(async () => {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setError('Camera is not supported in this browser');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Wait a bit for the component to fully render
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Check if video element is available
      if (!videoRef.current) {
        throw new Error('Video element not ready. Please try again in a moment.');
      }
      
      // Use the same approach as the working debug component
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { min: 640, ideal: 1280 },
          height: { min: 480, ideal: 720 },
          facingMode: 'user'
        }
      });

      streamRef.current = stream;

      const video = videoRef.current;
      if (!video) {
        throw new Error('Video element became unavailable');
      }
      
      video.srcObject = stream;
      
      // Use the exact same approach as the working debug component
      video.onloadedmetadata = () => {
        video.play().then(() => {
          setIsCameraActive(true);
        }).catch((playError) => {
          setError('Failed to play video: ' + playError.message);
        });
      };
      
      video.onerror = () => {
        setError('Video element error occurred');
      };
        
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to start camera');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => {
        track.stop();
      });
      streamRef.current = null;
    }
    
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    
    // Clean up URLs when stopping camera using functional updates
    setCapturedImage(prevUrl => {
      if (prevUrl) URL.revokeObjectURL(prevUrl);
      return null;
    });
    setAnnotatedImageUrl(prevUrl => {
      if (prevUrl) URL.revokeObjectURL(prevUrl);
      return null;
    });
    
    setIsCameraActive(false);
    setDetectionResult(null);
    setAttemptCount(0);
    setCurrentConfidence(0.5);
    setError(null);
  }, []);

  const detectWithAutoAdjustment = useCallback(async (imageBlob: Blob, confidence: number, attempt: number = 1): Promise<DetectionResult | null> => {
    try {
      const imageFile = new File([imageBlob], 'camera-capture.jpg', { type: 'image/jpeg' });
      const result = await apiService.detectFaces({
        image: imageFile,
        confidence
      });

      // If we found faces, return the result
      if (result.face_count > 0) {
        return result;
      }

      // If no faces found and we haven't exceeded max attempts
      if (attempt < 5) {
        let newConfidence = confidence;
        
        // Strategy: Start with lower confidence, then try higher if needed
        if (attempt === 1) {
          newConfidence = 0.3; // Try lower confidence first
        } else if (attempt === 2) {
          newConfidence = 0.2; // Even lower
        } else if (attempt === 3) {
          newConfidence = 0.1; // Minimum
        } else if (attempt === 4) {
          newConfidence = 0.7; // Try higher confidence
        }

        setCurrentConfidence(newConfidence);
        
        // Wait a bit before next attempt
        await new Promise(resolve => setTimeout(resolve, 500));
        
        return detectWithAutoAdjustment(imageBlob, newConfidence, attempt + 1);
      }

      // Return the last result even if no faces found
      return result;
    } catch (error) {
      throw error;
    }
  }, []);

  const captureAndDetect = useCallback(async () => {
    if (!videoRef.current || !isCameraActive) {
      setError('Camera is not active');
      return;
    }

    setIsDetecting(true);
    setError(null);
    
    // Clean up previous URLs before creating new ones using functional updates
    setCapturedImage(prevUrl => {
      if (prevUrl) URL.revokeObjectURL(prevUrl);
      return null;
    });
    setAnnotatedImageUrl(prevUrl => {
      if (prevUrl) URL.revokeObjectURL(prevUrl);
      return null;
    });
    
    setDetectionResult(null);
    setAttemptCount(0);
    setCurrentConfidence(0.5);

    try {
      // Capture image from video
      const imageBlob = await cameraService.captureImage(videoRef.current);
      const imageUrl = URL.createObjectURL(imageBlob);
      setCapturedImage(imageUrl);

      // Detect faces with automatic confidence adjustment
      const result = await detectWithAutoAdjustment(imageBlob, 0.5);
      
      if (result) {
        setDetectionResult(result);
        setAttemptCount(5); // Mark as completed
        
        // If faces were detected, also generate annotated image
        if (result.face_count > 0) {
          try {
            const imageFile = new File([imageBlob], 'camera-capture.jpg', { type: 'image/jpeg' });
            const annotatedBlob = await apiService.detectAndAnnotate({
              image: imageFile,
              confidence: currentConfidence
            });
                        const annotatedUrl = URL.createObjectURL(annotatedBlob);
            setAnnotatedImageUrl(annotatedUrl);
          } catch (annotationError) {
            console.error('Failed to generate annotated image:', annotationError);
            // Don't set error here as we still have detection results
          }
        }
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to capture and detect');
    } finally {
      setIsDetecting(false);
    }
  }, [isCameraActive, detectWithAutoAdjustment, currentConfidence]);

  const clearResults = useCallback(() => {
    // Clean up old URLs before clearing using functional updates
    setCapturedImage(prevUrl => {
      if (prevUrl) URL.revokeObjectURL(prevUrl);
      return null;
    });
    setAnnotatedImageUrl(prevUrl => {
      if (prevUrl) URL.revokeObjectURL(prevUrl);
      return null;
    });
    
    setDetectionResult(null);
    setError(null);
    setAttemptCount(0);
    setCurrentConfidence(0.5);
  }, []);

  // Cleanup on unmount only
  useEffect(() => {
    return () => {
      stopCamera();
      // Note: stopCamera already handles URL cleanup
    };
  }, [stopCamera]);

  return {
    isLoading,
    error,
    isCameraActive,
    detectionResult,
    capturedImage,
    annotatedImageUrl,
    isDetecting,
    currentConfidence,
    attemptCount,
    videoRef,
    startCamera,
    stopCamera,
    captureAndDetect,
    clearResults,
  };
};
