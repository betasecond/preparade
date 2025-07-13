export interface ReportContentItem {
  type: 'heading' | 'paragraph' | 'list' | 'subheading' | 'demo';
  level?: 2 | 3 | 4;
  text?: string;
  items?: string[];
  ordered?: boolean;
  demoComponent?: 'InteractiveQueryDemo' | 'AgentAssistDemo' | 'ReviewQueueDemo'; // Specify which demo component
}

export interface ReportSection {
  id: string;
  title: string;
  mainTitle: string;
  content: ReportContentItem[];
}

// 为审核队列添加数据模型
export interface ReviewItem {
  id: string;
  source: string; // 来源：用户提问-系统未答出、用户反馈-答案差评、低置信度回答 等
  originalQuery: string; // 原始用户问题
  currentAnswer?: string; // 系统当前给出的答案（如果有）
  suggestedAnswer?: string; // 推荐/修正后的答案
  timestamp: string; // 问题发生或提交审核的时间
  status: 'pending' | 'approved' | 'rejected' | 'needsInfo'; // 状态
  standardQuestion?: string; // 标准问题
  metadata?: {
    tags?: string[];
    keywords?: string[];
    expirationDate?: string;
  }
}