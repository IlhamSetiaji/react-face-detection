import { useState, useEffect, useCallback } from 'react';
import { apiService } from '../services/apiService';
import type { DetectionResult, ServerStatus } from '../types';

export const useFaceDetection = () => {
  const [serverStatus, setServerStatus] = useState<ServerStatus>({ status: 'unhealthy' });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [confidence, setConfidence] = useState(0.5);
  const [emotionsEnabled, setEmotionsEnabled] = useState(true);
  const [ageEnabled, setAgeEnabled] = useState(false);
  const [detectionResult, setDetectionResult] = useState<DetectionResult | null>(null);
  const [annotatedImageUrl, setAnnotatedImageUrl] = useState<string | null>(null);

  const checkServerStatus = useCallback(async () => {
    try {
      const status = await apiService.checkServerStatus();
      setServerStatus(status);
    } catch (error) {
      setServerStatus({ 
        status: 'unhealthy', 
        message: error instanceof Error ? error.message : 'Unknown error' 
      });
    }
  }, []);

  const handleFileSelect = useCallback((file: File | null) => {
    setSelectedFile(file);
    setError(null);
    setDetectionResult(null);
    setAnnotatedImageUrl(null);

    if (file) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    } else {
      setPreviewUrl(null);
    }
  }, []);

  const detectFaces = useCallback(async () => {
    if (!selectedFile) {
      setError('Please select an image first');
      return;
    }

    setIsLoading(true);
    setError(null);
    setDetectionResult(null);

    try {
      const result = await apiService.detectFaces({
        image: selectedFile,
        confidence,
        emotions: emotionsEnabled,
        age: ageEnabled,
      });
      setDetectionResult(result);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to detect faces');
    } finally {
      setIsLoading(false);
    }
  }, [selectedFile, confidence, emotionsEnabled, ageEnabled]);

  const detectAndAnnotate = useCallback(async () => {
    if (!selectedFile) {
      setError('Please select an image first');
      return;
    }

    setIsLoading(true);
    setError(null);
    setAnnotatedImageUrl(null);

    try {
      const blob = await apiService.detectAndAnnotate({
        image: selectedFile,
        confidence,
        emotions: emotionsEnabled,
        age: ageEnabled,
      });
      const url = URL.createObjectURL(blob);
      setAnnotatedImageUrl(url);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to generate annotated image');
    } finally {
      setIsLoading(false);
    }
  }, [selectedFile, confidence, emotionsEnabled, ageEnabled]);

  useEffect(() => {
    checkServerStatus();
  }, [checkServerStatus]);

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
      if (annotatedImageUrl) {
        URL.revokeObjectURL(annotatedImageUrl);
      }
    };
  }, [previewUrl, annotatedImageUrl]);

  return {
    serverStatus,
    isLoading,
    error,
    selectedFile,
    previewUrl,
    confidence,
    emotionsEnabled,
    ageEnabled,
    detectionResult,
    annotatedImageUrl,
    setConfidence,
    setEmotionsEnabled,
    setAgeEnabled,
    handleFileSelect,
    detectFaces,
    detectAndAnnotate,
    checkServerStatus,
  };
};
