import axios from 'axios';
import type { ReportSection, ReviewItem } from '../reportData';

const apiClient = axios.create({
  baseURL: 'http://localhost:3000',
  headers: {
    'Content-Type': 'application/json',
  },
});

export const getReports = (): Promise<ReportSection[]> => {
  return apiClient.get('/reports').then(res => res.data);
}

export const getReviewQueue = (): Promise<ReviewItem[]> => {
  return apiClient.get('/reviewQueue').then(res => res.data);
}

export const getReviewItemById = (id: string): Promise<ReviewItem> => {
  return apiClient.get(`/reviewQueue/${id}`).then(res => res.data);
}

export const updateReviewItem = (id: string, data: Partial<ReviewItem>): Promise<ReviewItem> => {
  return apiClient.patch(`/reviewQueue/${id}`, data).then(res => res.data);
}

export interface ServiceQA {
  id: number;
  question: string;
  answer: string;
  keywords?: string[];
}

export const getServiceQA = (): Promise<ServiceQA[]> => {
  return apiClient.get('/serviceQA').then(res => res.data);
} 