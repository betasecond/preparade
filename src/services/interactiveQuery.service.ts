import type { ApiResponse, PaginatedResponse, PaginationParams } from './api.types';
import { get, post } from './http-client';

/**
 * 用户查询请求参数
 */
export interface UserQueryRequest {
  /** 用户原始问题内容 */
  query: string;
  /** 会话ID，用于维持对话上下文 */
  sessionId?: string;
  /** 用户ID，已登录用户可提供 */
  userId?: string;
  /** 查询来源：web, mobile, kiosk 等 */
  source?: string;
  /** 附加上下文信息 */
  context?: Record<string, any>;
}

/**
 * 关键词识别结果
 */
export interface KeywordAnalysis {
  /** 识别的关键词 */
  keyword: string;
  /** 关键词类型：产品、服务、问题类型等 */
  type: string;
  /** 置信度得分 (0-1) */
  confidence: number;
}

/**
 * 知识条目匹配结果
 */
export interface KnowledgeMatch {
  /** 知识条目ID */
  id: string;
  /** 标准问题 */
  standardQuestion: string;
  /** 匹配相似度得分 (0-1) */
  relevanceScore: number;
  /** 知识条目最后更新时间 */
  lastUpdated: string;
  /** 知识条目标签 */
  tags?: string[];
}

/**
 * 智能问答响应结果
 */
export interface QueryResponse {
  /** 原始查询问题 */
  originalQuery: string;
  /** 识别的关键词分析 */
  keywordAnalysis: KeywordAnalysis[];
  /** 匹配到的知识条目 */
  knowledgeMatches: KnowledgeMatch[];
  /** 建议的回复内容 */
  suggestedAnswer: string;
  /** 建议回复的置信度 (0-1) */
  confidence: number;
  /** 是否触发专业人工介入 */
  needsHumanReview: boolean;
  /** 回答的知识来源参考 */
  references?: string[];
  /** 相关推荐问题 */
  relatedQuestions?: string[];
}

/**
 * 用户反馈请求
 */
export interface UserFeedbackRequest {
  /** 问题ID */
  queryId: string;
  /** 回答ID */
  responseId: string;
  /** 反馈类型: 有帮助、无帮助、部分有帮助 */
  feedbackType: 'helpful' | 'not-helpful' | 'partially-helpful';
  /** 详细反馈内容 */
  comment?: string;
  /** 用户ID */
  userId?: string;
}

/**
 * 智能问答服务接口
 * 提供与智能问答相关的所有API调用
 */
export interface InteractiveQueryService {
  /**
   * 提交用户问题并获取智能回答
   * 
   * @param request 用户查询请求参数
   * @returns 智能问答响应结果
   */
  submitQuery(request: UserQueryRequest): Promise<ApiResponse<QueryResponse>>;
  
  /**
   * 提交用户对回答的反馈
   * 
   * @param feedback 用户反馈数据
   * @returns 反馈提交结果
   */
  submitFeedback(feedback: UserFeedbackRequest): Promise<ApiResponse<{ success: boolean }>>;
  
  /**
   * 获取热门问题列表
   * 
   * @param params 分页参数
   * @returns 热门问题列表
   */
  getHotQuestions(params?: PaginationParams): Promise<ApiResponse<PaginatedResponse<{ id: string, question: string, count: number }>>>;
  
  /**
   * 获取用户历史查询记录
   * 
   * @param userId 用户ID
   * @param params 分页参数
   * @returns 用户历史查询记录
   */
  getUserQueryHistory(userId: string, params?: PaginationParams): Promise<ApiResponse<PaginatedResponse<{ id: string, query: string, timestamp: string }>>>;
}

/**
 * 智能问答服务实现
 * 提供与智能问答功能相关的所有API调用方法
 */
export class InteractiveQueryServiceImpl implements InteractiveQueryService {
  /**
   * 提交用户问题并获取智能回答
   * 
   * @param request 用户查询请求参数
   * @returns 智能问答响应结果
   */
  async submitQuery(request: UserQueryRequest): Promise<ApiResponse<QueryResponse>> {
    try {
      return await post<ApiResponse<QueryResponse>>('/query', request);
    } catch (error) {
      console.error('Error submitting query:', error);
      throw error;
    }
  }
  
  /**
   * 提交用户对回答的反馈
   * 
   * @param feedback 用户反馈数据
   * @returns 反馈提交结果
   */
  async submitFeedback(feedback: UserFeedbackRequest): Promise<ApiResponse<{ success: boolean }>> {
    try {
      return await post<ApiResponse<{ success: boolean }>>('/feedback', feedback);
    } catch (error) {
      console.error('Error submitting feedback:', error);
      throw error;
    }
  }
  
  /**
   * 获取热门问题列表
   * 
   * @param params 分页参数
   * @returns 热门问题列表
   */
  async getHotQuestions(params: PaginationParams = { page: 1, pageSize: 10 }): Promise<ApiResponse<PaginatedResponse<{ id: string, question: string, count: number }>>> {
    try {
      return await get<ApiResponse<PaginatedResponse<{ id: string, question: string, count: number }>>>('/hot-questions', params);
    } catch (error) {
      console.error('Error getting hot questions:', error);
      throw error;
    }
  }
  
  /**
   * 获取用户历史查询记录
   * 
   * @param userId 用户ID
   * @param params 分页参数
   * @returns 用户历史查询记录
   */
  async getUserQueryHistory(userId: string, params: PaginationParams = { page: 1, pageSize: 20 }): Promise<ApiResponse<PaginatedResponse<{ id: string, query: string, timestamp: string }>>> {
    try {
      return await get<ApiResponse<PaginatedResponse<{ id: string, query: string, timestamp: string }>>>('/user-history', { userId, ...params });
    } catch (error) {
      console.error('Error getting user query history:', error);
      throw error;
    }
  }
}