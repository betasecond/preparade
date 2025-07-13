import axios from 'axios';
import type { ReportSection, ReviewItem, ServiceQA } from '../reportData';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000',
  headers: {
    'Content-Type': 'application/json',
  },
});

export const getReports = async (): Promise<ReportSection[]> => {
  const response = await apiClient.get<ReportSection[]>('/reports');
  return response.data;
}

export const getReviewQueue = async (): Promise<ReviewItem[]> => {
  const response = await apiClient.get<ReviewItem[]>('/reviewQueue');
  return response.data;
}

export const getReviewItemById = async (id: string): Promise<ReviewItem> => {
  const response = await apiClient.get<ReviewItem>(`/reviewQueue/${id}`);
  return response.data;
}

export const updateReviewItem = async (id: string, data: Partial<ReviewItem>): Promise<ReviewItem> => {
  const response = await apiClient.patch<ReviewItem>(`/reviewQueue/${id}`, data);
  return response.data;
}

export const getServiceQA = async (): Promise<ServiceQA[]> => {
  const response = await apiClient.get<ServiceQA[]>('/serviceQA');
  return response.data;
} 