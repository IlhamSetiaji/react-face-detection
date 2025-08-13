import type { DetectionResult, ServerStatus, DetectionRequest } from '../types';

const API_BASE_URL = 'http://localhost:5000';

class ApiService {
  private async makeRequest<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, options);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Unknown error occurred' }));
      throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`);
    }
    
    return response.json();
  }

  private async makeRequestBlob(endpoint: string, options?: RequestInit): Promise<Blob> {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, options);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Unknown error occurred' }));
      throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`);
    }
    
    return response.blob();
  }

  async checkServerStatus(): Promise<ServerStatus> {
    try {
      return await this.makeRequest<ServerStatus>('/health');
    } catch (error) {
      return {
        status: 'unhealthy',
        message: error instanceof Error ? error.message : 'Server is offline'
      };
    }
  }

  async detectFaces(request: DetectionRequest): Promise<DetectionResult> {
    const formData = new FormData();
    formData.append('image', request.image);
    formData.append('confidence', request.confidence.toString());
    
    if (request.emotions) {
      formData.append('emotions', 'true');
    }

    return this.makeRequest<DetectionResult>('/detect', {
      method: 'POST',
      body: formData,
    });
  }

  async detectAndAnnotate(request: DetectionRequest): Promise<Blob> {
    const formData = new FormData();
    formData.append('image', request.image);
    formData.append('confidence', request.confidence.toString());
    
    if (request.emotions) {
      formData.append('emotions', 'true');
    }

    return this.makeRequestBlob('/detect-and-annotate', {
      method: 'POST',
      body: formData,
    });
  }
}

export const apiService = new ApiService();
