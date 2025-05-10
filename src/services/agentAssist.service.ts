import { ApiResponse } from './api.types';
import { get, post } from './http-client';

/**
 * 对话上下文接口
 * 包含客服与用户之间的对话上下文信息
 */
export interface ConversationContext {
  /** 会话ID */
  sessionId: string;
  /** 客户ID */
  customerId?: string;
  /** 客服ID */
  agentId: string;
  /** 对话历史 */
  history: ConversationMessage[];
  /** 客户信息 */
  customerInfo?: {
    /** 客户名称 */
    name?: string;
    /** VIP等级 */
    vipLevel?: number;
    /** 历史订单数 */
    orderCount?: number;
    /** 客户标签 */
    tags?: string[];
  };
  /** 相关订单信息 */
  orderInfo?: {
    /** 订单ID */
    orderId?: string;
    /** 订单状态 */
    status?: string;
    /** 订单金额 */
    amount?: number;
    /** 下单时间 */
    orderDate?: string;
  };
  /** 对话主题分类 */
  topics?: string[];
}

/**
 * 对话消息类型
 */
export interface ConversationMessage {
  /** 消息ID */
  id: string;
  /** 发送者类型: 用户或客服 */
  sender: 'customer' | 'agent' | 'system';
  /** 消息内容 */
  content: string;
  /** 发送时间 */
  timestamp: string;
  /** 消息类型: 文本、图片、文件等 */
  type: 'text' | 'image' | 'file' | 'system-notice';
  /** 消息状态: 发送中、已发送、已读等 */
  status?: 'sending' | 'sent' | 'read' | 'failed';
  /** 情感分析结果 */
  sentiment?: {
    /** 情感类型: 积极、消极、中性 */
    type: 'positive' | 'negative' | 'neutral';
    /** 情感强度 (0-1) */
    score: number;
  };
}

/**
 * 实时辅助请求参数
 */
export interface AssistRequest {
  /** 当前对话上下文 */
  context: ConversationContext;
  /** 当前正在编辑的回复草稿 */
  currentDraft: string;
  /** 光标位置 */
  cursorPosition?: number;
  /** 请求辅助的类型 */
  assistType?: 'auto' | 'completion' | 'sentiment' | 'compliance';
}

/**
 * 辅助建议类型
 */
export type SuggestionType = 'completion' | 'sentiment' | 'compliance' | 'information' | 'greeting' | 'closing';

/**
 * 辅助建议接口
 */
export interface Suggestion {
  /** 建议ID */
  id: string;
  /** 建议类型 */
  type: SuggestionType;
  /** 建议内容 */
  content: string;
  /** 建议的优先级 1-5，1为最高 */
  priority: number;
  /** 建议的置信度 (0-1) */
  confidence: number;
  /** 触发建议的原因 */
  reason?: string;
  /** 建议来源的知识库ID或规则ID */
  sourceId?: string;
}

/**
 * 辅助响应接口
 */
export interface AssistResponse {
  /** 建议列表 */
  suggestions: Suggestion[];
  /** 情感分析 */
  sentimentAnalysis?: {
    /** 检测到的情感类型 */
    type: 'positive' | 'negative' | 'neutral';
    /** 情感强度 (0-1) */
    score: number;
    /** 检测到的关键情感词 */
    keywords?: string[];
  };
  /** 合规性分析 */
  complianceAnalysis?: {
    /** 是否存在合规问题 */
    hasIssues: boolean;
    /** 问题列表 */
    issues?: {
      /** 问题类型 */
      type: string;
      /** 问题描述 */
      description: string;
      /** 严重程度: 低、中、高 */
      severity: 'low' | 'medium' | 'high';
      /** 建议的修正方式 */
      suggestion?: string;
    }[];
  };
  /** 信息完整性检查 */
  informationCompleteness?: {
    /** 缺失的关键信息 */
    missingInfo?: string[];
    /** 收集信息的建议问题 */
    suggestedQuestions?: string[];
  };
}

/**
 * 知识库搜索请求
 */
export interface KnowledgeSearchRequest {
  /** 搜索关键词 */
  query: string;
  /** 最大返回结果数 */
  limit?: number;
  /** 搜索范围标签 */
  tags?: string[];
}

/**
 * 知识库条目
 */
export interface KnowledgeItem {
  /** 知识ID */
  id: string;
  /** 知识标题 */
  title: string;
  /** 知识内容 */
  content: string;
  /** 最后更新时间 */
  lastUpdated: string;
  /** 知识标签 */
  tags?: string[];
  /** 相关性得分 (搜索结果中) */
  relevanceScore?: number;
}

/**
 * 客服辅助服务接口
 * 提供与客服辅助相关的所有API调用
 */
export interface AgentAssistService {
  /**
   * 获取实时辅助建议
   * 
   * @param request 辅助请求参数
   * @returns 辅助响应结果
   */
  getRealtimeAssistance(request: AssistRequest): Promise<ApiResponse<AssistResponse>>;
  
  /**
   * 搜索知识库
   * 
   * @param request 知识库搜索请求
   * @returns 知识条目列表
   */
  searchKnowledge(request: KnowledgeSearchRequest): Promise<ApiResponse<KnowledgeItem[]>>;
  
  /**
   * 记录客服选择应用的建议
   * 
   * @param suggestionId 被应用的建议ID
   * @param sessionId 会话ID
   * @returns 操作结果
   */
  trackSuggestionUsage(suggestionId: string, sessionId: string): Promise<ApiResponse<{ success: boolean }>>;
  
  /**
   * 获取常用回复模板
   * 
   * @param agentId 客服ID
   * @param category 模板类别
   * @returns 回复模板列表
   */
  getResponseTemplates(agentId: string, category?: string): Promise<ApiResponse<{ id: string, title: string, content: string, category: string }[]>>;
}

/**
 * 客服辅助服务实现
 * 提供与客服辅助功能相关的所有API调用方法
 */
export class AgentAssistServiceImpl implements AgentAssistService {
  /**
   * 获取实时辅助建议
   * 
   * @param request 辅助请求参数
   * @returns 辅助响应结果
   */
  async getRealtimeAssistance(request: AssistRequest): Promise<ApiResponse<AssistResponse>> {
    try {
      return await post<ApiResponse<AssistResponse>>('/agent-assist/suggestions', request);
    } catch (error) {
      console.error('Error getting assistance:', error);
      throw error;
    }
  }
  
  /**
   * 搜索知识库
   * 
   * @param request 知识库搜索请求
   * @returns 知识条目列表
   */
  async searchKnowledge(request: KnowledgeSearchRequest): Promise<ApiResponse<KnowledgeItem[]>> {
    try {
      return await get<ApiResponse<KnowledgeItem[]>>('/knowledge/search', request);
    } catch (error) {
      console.error('Error searching knowledge:', error);
      throw error;
    }
  }
  
  /**
   * 记录客服选择应用的建议
   * 
   * @param suggestionId 被应用的建议ID
   * @param sessionId 会话ID
   * @returns 操作结果
   */
  async trackSuggestionUsage(suggestionId: string, sessionId: string): Promise<ApiResponse<{ success: boolean }>> {
    try {
      return await post<ApiResponse<{ success: boolean }>>('/agent-assist/track-usage', { suggestionId, sessionId });
    } catch (error) {
      console.error('Error tracking suggestion usage:', error);
      throw error;
    }
  }
  
  /**
   * 获取常用回复模板
   * 
   * @param agentId 客服ID
   * @param category 模板类别
   * @returns 回复模板列表
   */
  async getResponseTemplates(agentId: string, category?: string): Promise<ApiResponse<{ id: string, title: string, content: string, category: string }[]>> {
    try {
      const params: any = { agentId };
      if (category) {
        params.category = category;
      }
      
      return await get<ApiResponse<{ id: string, title: string, content: string, category: string }[]>>('/agent-assist/templates', params);
    } catch (error) {
      console.error('Error getting response templates:', error);
      throw error;
    }
  }
}