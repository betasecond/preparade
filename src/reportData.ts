export interface ReportContentItem {
  type: 'heading' | 'paragraph' | 'list' | 'subheading' | 'demo';
  level?: 2 | 3 | 4;
  text?: string;
  items?: string[];
  ordered?: boolean;
  demoComponent?: 'InteractiveQueryDemo' | 'AgentAssistDemo'; // Specify which demo component
}

export interface ReportSection {
  id: string;
  title: string;
  mainTitle: string;
  content: ReportContentItem[];
}

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
];