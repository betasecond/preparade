import { ApiResponse, PaginatedResponse, PaginationParams, FilterParams } from './api.types';
import { ReviewItem } from '../reportData';
import { get, post } from './http-client';

/**
 * 审核队列筛选参数接口
 * 继承基础过滤参数接口，添加审核队列特定的过滤条件
 */
export interface ReviewQueueFilterParams extends FilterParams {
  /** 审核状态 */
  status?: 'pending' | 'approved' | 'rejected' | 'needsInfo';
  /** 来源类型 */
  source?: string;
  /** 标签 */
  tags?: string[];
}

/**
 * 知识条目创建/更新请求接口
 */
export interface KnowledgeItemRequest {
  /** 原始问题 */
  originalQuery: string;
  /** 标准问题 */
  standardQuestion: string;
  /** 标准答案 */
  standardAnswer: string;
  /** 元数据 */
  metadata?: {
    /** 标签列表 */
    tags?: string[];
    /** 关键词列表 */
    keywords?: string[];
    /** 过期日期 */
    expirationDate?: string;
    /** 适用业务线 */
    businessLines?: string[];
    /** 优先级 */
    priority?: number;
  };
}

/**
 * 审核项目响应接口
 * 扩展了基本的审核项目数据
 */
export interface ReviewItemResponse extends ReviewItem {
  /** 相关知识条目 */
  relatedKnowledgeItems?: {
    /** 知识条目ID */
    id: string;
    /** 标准问题 */
    question: string;
    /** 相似度得分 */
    similarityScore: number;
  }[];
  /** 审核历史记录 */
  reviewHistory?: {
    /** 审核人ID */
    reviewerId: string;
    /** 审核人名称 */
    reviewerName: string;
    /** 审核时间 */
    timestamp: string;
    /** 审核动作 */
    action: string;
    /** 审核备注 */
    comment?: string;
  }[];
}

/**
 * 审核决定请求接口
 */
export interface ReviewDecisionRequest {
  /** 审核项ID */
  itemId: string;
  /** 审核决定：批准、拒绝、需要更多信息 */
  decision: 'approve' | 'reject' | 'needsInfo';
  /** 标准问题（如果批准） */
  standardQuestion?: string;
  /** 标准答案（如果批准） */
  suggestedAnswer?: string;
  /** 元数据更新 */
  metadata?: {
    tags?: string[];
    keywords?: string[];
    expirationDate?: string;
  };
  /** 审核备注 */
  comment?: string;
}

/**
 * 批量操作请求接口
 */
export interface BatchOperationRequest {
  /** 操作类型 */
  operation: 'approve' | 'reject' | 'markNeedsInfo';
  /** 项目ID列表 */
  itemIds: string[];
  /** 操作备注 */
  comment?: string;
}

/**
 * 审核队列服务接口
 * 提供与审核队列相关的所有API调用
 */
export interface ReviewQueueService {
  /**
   * 获取审核队列列表
   * 
   * @param params 分页和过滤参数
   * @returns 分页的审核项目列表
   */
  getReviewItems(params?: PaginationParams & ReviewQueueFilterParams): Promise<ApiResponse<PaginatedResponse<ReviewItem>>>;
  
  /**
   * 获取单个审核项详情
   * 
   * @param itemId 审核项ID
   * @returns 审核项详细信息
   */
  getReviewItemDetail(itemId: string): Promise<ApiResponse<ReviewItemResponse>>;
  
  /**
   * 提交审核决定
   * 
   * @param request 审核决定请求
   * @returns 操作结果
   */
  submitReviewDecision(request: ReviewDecisionRequest): Promise<ApiResponse<{ success: boolean, knowledgeItemId?: string }>>;
  
  /**
   * 批量操作审核项
   * 
   * @param request 批量操作请求
   * @returns 操作结果
   */
  batchOperation(request: BatchOperationRequest): Promise<ApiResponse<{ success: boolean, processedCount: number }>>;
  
  /**
   * 获取审核标签列表
   * 
   * @returns 标签列表
   */
  getReviewTags(): Promise<ApiResponse<string[]>>;
  
  /**
   * 获取审核来源类型列表
   * 
   * @returns 来源类型列表
   */
  getReviewSources(): Promise<ApiResponse<string[]>>;
  
  /**
   * 获取审核统计数据
   * 
   * @returns 审核队列统计信息
   */
  getReviewStats(): Promise<ApiResponse<{
    /** 总审核项数 */
    totalItems: number;
    /** 待处理项目数 */
    pendingCount: number;
    /** 已批准项目数 */
    approvedCount: number;
    /** 已拒绝项目数 */
    rejectedCount: number;
    /** 需要更多信息的项目数 */
    needsInfoCount: number;
    /** 按来源的项目分布 */
    bySource: Record<string, number>;
  }>>;
}

/**
 * 审核队列服务实现
 * 提供与审核队列功能相关的所有API调用方法
 */
export class ReviewQueueServiceImpl implements ReviewQueueService {
  /**
   * 获取审核队列列表
   * 
   * @param params 分页和过滤参数
   * @returns 分页的审核项目列表
   */
  async getReviewItems(params: PaginationParams & ReviewQueueFilterParams = { page: 1, pageSize: 10 }): Promise<ApiResponse<PaginatedResponse<ReviewItem>>> {
    try {
      return await get<ApiResponse<PaginatedResponse<ReviewItem>>>('/review-queue/items', params);
    } catch (error) {
      console.error('Error getting review items:', error);
      throw error;
    }
  }
  
  /**
   * 获取单个审核项详情
   * 
   * @param itemId 审核项ID
   * @returns 审核项详细信息
   */
  async getReviewItemDetail(itemId: string): Promise<ApiResponse<ReviewItemResponse>> {
    try {
      return await get<ApiResponse<ReviewItemResponse>>(`/review-queue/items/${itemId}`);
    } catch (error) {
      console.error('Error getting review item detail:', error);
      throw error;
    }
  }
  
  /**
   * 提交审核决定
   * 
   * @param request 审核决定请求
   * @returns 操作结果
   */
  async submitReviewDecision(request: ReviewDecisionRequest): Promise<ApiResponse<{ success: boolean, knowledgeItemId?: string }>> {
    try {
      return await post<ApiResponse<{ success: boolean, knowledgeItemId?: string }>>('/review-queue/decision', request);
    } catch (error) {
      console.error('Error submitting review decision:', error);
      throw error;
    }
  }
  
  /**
   * 批量操作审核项
   * 
   * @param request 批量操作请求
   * @returns 操作结果
   */
  async batchOperation(request: BatchOperationRequest): Promise<ApiResponse<{ success: boolean, processedCount: number }>> {
    try {
      return await post<ApiResponse<{ success: boolean, processedCount: number }>>('/review-queue/batch-operation', request);
    } catch (error) {
      console.error('Error executing batch operation:', error);
      throw error;
    }
  }
  
  /**
   * 获取审核标签列表
   * 
   * @returns 标签列表
   */
  async getReviewTags(): Promise<ApiResponse<string[]>> {
    try {
      return await get<ApiResponse<string[]>>('/review-queue/tags');
    } catch (error) {
      console.error('Error getting review tags:', error);
      throw error;
    }
  }
  
  /**
   * 获取审核来源类型列表
   * 
   * @returns 来源类型列表
   */
  async getReviewSources(): Promise<ApiResponse<string[]>> {
    try {
      return await get<ApiResponse<string[]>>('/review-queue/sources');
    } catch (error) {
      console.error('Error getting review sources:', error);
      throw error;
    }
  }
  
  /**
   * 获取审核统计数据
   * 
   * @returns 审核队列统计信息
   */
  async getReviewStats(): Promise<ApiResponse<{
    totalItems: number;
    pendingCount: number;
    approvedCount: number;
    rejectedCount: number;
    needsInfoCount: number;
    bySource: Record<string, number>;
  }>> {
    try {
      return await get<ApiResponse<{
        totalItems: number;
        pendingCount: number;
        approvedCount: number;
        rejectedCount: number;
        needsInfoCount: number;
        bySource: Record<string, number>;
      }>>('/review-queue/stats');
    } catch (error) {
      console.error('Error getting review stats:', error);
      throw error;
    }
  }
}