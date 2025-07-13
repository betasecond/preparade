import axios from 'axios';
import type { ReportSection, ReviewItem, ServiceQA } from '../reportData';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000',
  headers: {
    'Content-Type': 'application/json',
  },
});

console.log('Current API Base URL:', import.meta.env.VITE_API_BASE_URL);

export const getReports = async (): Promise<ReportSection[]> => {
  const response = await apiClient.get<ReportSection[] | { data: ReportSection[] }>('/reports');
  // 检查返回的数据是否是一个包含 data 属性的对象
  if (response.data && typeof response.data === 'object' && 'data' in response.data && Array.isArray(response.data.data)) {
    return response.data.data;
  }
  // 否则，假定它就是我们期望的数组
  return response.data as ReportSection[];
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
