/**
 * API 响应基础接口
 * 所有 API 响应都应继承此接口以保持一致性
 */
export interface ApiResponse<T> {
  /** 响应状态码，200表示成功 */
  code: number;
  /** 响应消息，用于描述请求处理结果 */
  message: string;
  /** 响应数据 */
  data: T;
  /** 请求标识符，用于日志跟踪和问题排查 */
  requestId?: string;
  /** 服务器处理时间 (ms) */
  processTime?: number;
}

/**
 * 分页响应接口
 * 用于所有需要分页的数据列表接口
 */
export interface PaginatedResponse<T> {
  /** 当前页数据列表 */
  items: T[];
  /** 总记录数 */
  total: number;
  /** 当前页码 */
  page: number;
  /** 每页记录数 */
  pageSize: number;
  /** 总页数 */
  totalPages: number;
  /** 是否有下一页 */
  hasMore: boolean;
}

/**
 * 分页请求参数接口
 * 用于所有需要分页的查询接口
 */
export interface PaginationParams {
  /** 页码，从1开始 */
  page: number;
  /** 每页记录数 */
  pageSize: number;
  /** 排序字段 */
  sortBy?: string;
  /** 排序方向: asc | desc */
  sortOrder?: 'asc' | 'desc';
}

/**
 * 过滤参数接口
 * 提供灵活的数据过滤功能
 */
export interface FilterParams {
  /** 搜索关键字，一般用于全文检索 */
  keyword?: string;
  /** 日期范围起始时间 */
  startDate?: string;
  /** 日期范围截止时间 */
  endDate?: string;
  /** 过滤条件，可以包含任意键值对 */
  [key: string]: any;
}
