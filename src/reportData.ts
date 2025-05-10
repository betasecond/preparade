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

// 审核队列的假数据
export const reviewQueueData: ReviewItem[] = [
  {
    id: '1',
    source: '用户提问-系统未答出',
    originalQuery: '我想了解贵公司的退货政策，特别是电子产品超过30天的情况',
    suggestedAnswer: '您好，关于电子产品的退货政策，我们有以下规定：\n1. 30天内，产品完好无损可全额退款\n2. 30-90天内，非人为损坏可换新或维修\n3. 超过90天，仅限质量问题可申请维修\n\n如有特殊情况，可联系客服热线进行个案处理。',
    timestamp: '2025-05-09 15:23',
    status: 'pending'
  },
  {
    id: '2',
    source: '用户反馈-答案差评',
    originalQuery: '怎样查询我的订单状态？',
    currentAnswer: '您可以登录官网查询订单。',
    suggestedAnswer: '您好，查询订单状态有以下几种方式：\n1. 登录官网/APP，进入"我的订单"页面查看\n2. 打开订单确认短信中的追踪链接\n3. 通过客服热线400-888-8888，提供订单号进行查询\n\n如需更多帮助，请告知您的订单号，我们可以为您直接查询。',
    timestamp: '2025-05-10 09:17',
    status: 'pending',
    standardQuestion: '如何查询订单状态'
  },
  {
    id: '3',
    source: '低置信度回答',
    originalQuery: '你们的会员积分规则是怎样的？多少积分可以换购产品？',
    currentAnswer: '我们的会员可以通过购物累积积分，具体兑换规则请查看会员手册。',
    timestamp: '2025-05-08 11:45',
    status: 'pending',
    metadata: {
      tags: ['会员', '积分规则', '兑换']
    }
  },
  {
    id: '4',
    source: '用户提问-系统未答出',
    originalQuery: '在线支付失败但是钱已经扣了怎么办？',
    suggestedAnswer: '遇到支付扣款但订单显示失败的情况，请不用担心：\n1. 一般情况下，资金会在1-3个工作日自动退回您的支付账户\n2. 您可以在"我的订单"-"支付记录"中查看交易状态\n3. 如超过3个工作日未收到退款，请提供订单号和支付截图，联系我们的客服热线400-888-8888处理\n\n给您带来不便，敬请谅解。',
    timestamp: '2025-05-10 10:30',
    status: 'pending',
    standardQuestion: '支付失败但已扣款的处理方法',
    metadata: {
      tags: ['支付问题', '退款', '紧急']
    }
  },
  {
    id: '5',
    source: '用户反馈-答案差评',
    originalQuery: '产品说明书在哪里可以下载？',
    currentAnswer: '您可以在我们的官网找到产品说明书。',
    timestamp: '2025-05-09 16:50',
    status: 'pending'
  }
];

export const reportData: ReportSection[] = [
  {
    id: 'introduction',
    title: '1. 介绍',
    mainTitle: '1. Copilot 概念演示介绍',
    content: [
      { type: 'paragraph', text: '欢迎来到 Copilot 概念演示。本演示旨在通过简化的交互场景，帮助您理解智能客服助手 Copilot 的核心工作理念和关键能力。您可以通过左侧导航切换不同的演示模块和说明章节。' },
      { type: 'paragraph', text: '这个演示将重点展示 Copilot 如何辅助客服代表更高效、更规范地处理客户请求。请注意，所有数据和场景均为模拟，旨在阐释概念。' },
    ],
  },
  {
    id: 'interactive-query-demo-section',
    title: '2. 演示：智能问答',
    mainTitle: '2. 演示：Copilot 智能问答与建议',
    content: [
      { type: 'paragraph', text: '此演示模拟客户提出一个常见问题，Copilot 如何基于知识库和历史数据快速给出建议答案。' },
      { type: 'demo', demoComponent: 'InteractiveQueryDemo' },
      { type: 'heading', level: 3, text: '演示说明' },
      { type: 'list', items: [
          '**客户问题输入框:** 模拟客户提出的问题。您可以尝试输入不同的问题（预设了几个简单场景）。',
          '**Copilot分析/建议:** 当您点击"咨询Copilot"后，系统会模拟分析过程，并展示：',
          '  - **识别到的关键词:** Copilot如何理解问题。',
          '  - **匹配到的知识/案例:** （模拟）从历史数据中找到的相关内容。',
          '  - **建议回复:** Copilot基于分析给出的标准回复建议。',
          '这个过程体现了 Copilot 的 **智能搜索与匹配** 和 **基于规则的快速回复** 能力。'
        ]
      },
    ],
  },
  {
    id: 'agent-assist-demo-section',
    title: '3. 演示：客服辅助',
    mainTitle: '3. 演示：Copilot 客服实时辅助',
    content: [
      { type: 'paragraph', text: '此演示模拟客服代表在回复客户时，Copilot 如何提供实时的输入辅助和合规提醒。' },
      { type: 'demo', demoComponent: 'AgentAssistDemo' },
      { type: 'heading', level: 3, text: '演示说明' },
      { type: 'list', items: [
          '**客服回复草稿框:** 模拟客服代表正在输入的回复内容。',
          '**Copilot实时反馈:** 当您输入时，Copilot（模拟）会实时分析您的输入，并可能给出：',
          '  - **信息补全提示:** 例如，提示您询问客户订单号。',
          '  - **安抚语建议:** 当检测到负面情绪词汇时（本演示简化）。',
          '  - **合规提醒:** 例如，提示您使用了不推荐的词语或遗漏了标准问候。',
          '这个过程体现了 Copilot 的 **规则执行与提醒**、**信息补全提示** 和 **开场白/安抚话建议** 等能力。'
        ]
      },
    ],
  },
  {
    id: 'core-logic',
    title: '4. 核心逻辑回顾',
    mainTitle: '4. Copilot 核心逻辑回顾',
    content: [
      { type: 'paragraph', text: '通过以上演示，我们可以看到 Copilot 的核心逻辑在于：' },
      { type: 'list', items: [
          '**理解与分析:** 运用自然语言处理技术理解客户意图和客服输入。',
          '**数据驱动:** 依赖历史对话数据和结构化知识库进行智能匹配和推荐。',
          '**规则引擎:** 执行预设的业务规则，确保服务规范性和效率。',
          '**实时辅助:** 为客服提供即时的、上下文相关的帮助和提醒。',
        ]
      },
      { type: 'paragraph', text: '最终目标是构建一个人机协同的智能服务环境，提升整体服务质量和客户体验。' },
    ],
  },
  {
    id: 'review-queue-demo-section',
    title: '5. 演示：审核队列',
    mainTitle: '5. 演示：知识库审核队列',
    content: [
      { type: 'paragraph', text: '此演示模拟智能客服系统中的审核队列功能，管理员可以审核系统未能回答的问题、用户差评的回答以及低置信度的回答，确保知识库内容的质量和完整性。' },
      { type: 'demo', demoComponent: 'ReviewQueueDemo' },
      { type: 'heading', level: 3, text: '演示说明' },
      { type: 'list', items: [
          '**待审核列表:** 展示需要审核的问题、答案，包含问题来源、状态等信息。',
          '**审核表单:** 对选中的待审项进行详细审核，可编辑标准问题和标准答案。',
          '**元数据管理:** 添加标签、关键词和有效期限等信息。',
          '**审核操作:** 包括批准、保存并批准、拒绝/忽略以及标记需要更多信息等功能。',
          '这个过程体现了 Copilot 的 **知识库质量控制** 和 **持续学习改进** 能力。'
        ]
      },
    ],
  },
];