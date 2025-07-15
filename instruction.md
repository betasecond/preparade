// =============================================================================
// 文件：vite.config.ts (概念性 - 通常由 Vite CLI 生成)
// =============================================================================
/*
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
})
*/

// =============================================================================
// 文件：tailwind.config.js
// =============================================================================
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      animation: {
        'pulse-fast': 'pulse 1s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      }
    },
  },
  plugins: [],
}

// =============================================================================
// 文件：postcss.config.js
// =============================================================================
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}

// =============================================================================
// 文件：index.html
// =============================================================================
/*
<!DOCTYPE html>
<html lang="zh-CN">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>慧装易助概念演示</title>
  </head>
  <body>
    <div id="app"></div>
    <script type="module" src="/src/main.ts"></script>
  </body>
</html>
*/

// =============================================================================
// 文件：src/main.ts
// =============================================================================
/*
import { createApp } from 'vue'
import './style.css' // 引入 Tailwind CSS
import App from './App.vue'

createApp(App).mount('#app')
*/

// =============================================================================
// 文件：src/style.css
// =============================================================================
/*
@tailwind base;
@tailwind components;
@tailwind utilities;

body {
  font-family: 'Inter', 'Microsoft YaHei', 'SimSun', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  background-color: #f3f4f6; /* Light gray background for the whole page */
}

/* Custom scrollbar for webkit browsers */
/* For main content area */
/* main::-webkit-scrollbar {
  width: 8px;
}
main::-webkit-scrollbar-track {
  background: #e5e7eb;
}
main::-webkit-scrollbar-thumb {
  background-color: #9ca3af;
  border-radius: 4px;
  border: 2px solid #e5e7eb;
} */

/* For sidebar area */
/* aside::-webkit-scrollbar {
  width: 8px;
}
aside::-webkit-scrollbar-track {
  background: #374151; /* Darker track for dark sidebar */
}
aside::-webkit-scrollbar-thumb {
  background-color: #6b7280; /* Lighter thumb for dark sidebar */
  border-radius: 4px;
  border: 2px solid #374151;
} */
*/

// =============================================================================
// 文件：src/vite-env.d.ts
// =============================================================================
/*
/// <reference types="vite/client" />
*/

// =============================================================================
// 文件：src/reportData.ts
// 描述：存储报告内容的结构化数据，并指明演示组件。
// =============================================================================
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
    mainTitle: '1. 慧装易助概念演示介绍',
    content: [
      { type: 'paragraph', text: '欢迎来到 慧装易助概念演示。本演示旨在通过简化的交互场景，帮助您理解智能客服助手 慧装易助的核心工作理念和关键能力。您可以通过左侧导航切换不同的演示模块和说明章节。' },
      { type: 'paragraph', text: '这个演示将重点展示 慧装易助如何辅助客服代表更高效、更规范地处理客户请求。请注意，所有数据和场景均为模拟，旨在阐释概念。' },
    ],
  },
  {
    id: 'interactive-query-demo-section',
    title: '2. 演示：智能问答',
    mainTitle: '2. 演示：慧装易助智能问答与建议',
    content: [
      { type: 'paragraph', text: '此演示模拟客户提出一个常见问题，慧装易助如何基于知识库和历史数据快速给出建议答案。' },
      { type: 'demo', demoComponent: 'InteractiveQueryDemo' },
      { type: 'heading', level: 3, text: '演示说明' },
      { type: 'list', items: [
          '**客户问题输入框:** 模拟客户提出的问题。您可以尝试输入不同的问题（预设了几个简单场景）。',
          '**Copilot分析/建议:** 当您点击“咨询Copilot”后，系统会模拟分析过程，并展示：',
          '  - **识别到的关键词:** Copilot如何理解问题。',
          '  - **匹配到的知识/案例:** （模拟）从历史数据中找到的相关内容。',
          '  - **建议回复:** Copilot基于分析给出的标准回复建议。',
          '这个过程体现了 慧装易助的 **智能搜索与匹配** 和 **基于规则的快速回复** 能力。'
        ]
      },
    ],
  },
  {
    id: 'agent-assist-demo-section',
    title: '3. 演示：客服辅助',
    mainTitle: '3. 演示：慧装易助客服实时辅助',
    content: [
      { type: 'paragraph', text: '此演示模拟客服代表在回复客户时，慧装易助如何提供实时的输入辅助和合规提醒。' },
      { type: 'demo', demoComponent: 'AgentAssistDemo' },
      { type: 'heading', level: 3, text: '演示说明' },
      { type: 'list', items: [
          '**客服回复草稿框:** 模拟客服代表正在输入的回复内容。',
          '**Copilot实时反馈:** 当您输入时，Copilot（模拟）会实时分析您的输入，并可能给出：',
          '  - **信息补全提示:** 例如，提示您询问客户订单号。',
          '  - **安抚语建议:** 当检测到负面情绪词汇时（本演示简化）。',
          '  - **合规提醒:** 例如，提示您使用了不推荐的词语或遗漏了标准问候。',
          '这个过程体现了 慧装易助的 **规则执行与提醒**、**信息补全提示** 和 **开场白/安抚话建议** 等能力。'
        ]
      },
    ],
  },
  {
    id: 'core-logic',
    title: '4. 核心逻辑回顾',
    mainTitle: '4. 慧装易助核心逻辑回顾',
    content: [
      { type: 'paragraph', text: '通过以上演示，我们可以看到 慧装易助的核心逻辑在于：' },
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

// =============================================================================
// 文件：src/App.vue
// =============================================================================
/*
<template>
  <div class="flex h-screen bg-gray-100">
    <aside class="w-72 bg-slate-800 text-slate-100 p-6 space-y-2 overflow-y-auto shadow-lg">
      <h1 class="text-3xl font-bold mb-8 border-b border-slate-700 pb-3 text-indigo-400">
        慧装易助
      </h1>
      <nav>
        <ul>
          <li v-for="section in reportSections" :key="section.id" class="mb-1.5">
            <button
              @click="selectedSectionId = section.id"
              :class="[
                'w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ease-in-out transform focus:outline-none',
                selectedSectionId === section.id
                  ? 'bg-indigo-600 text-white shadow-md scale-105'
                  : 'hover:bg-slate-700 hover:text-indigo-300 hover:translate-x-1',
              ]"
            >
              {{ section.title }}
            </button>
          </li>
        </ul>
      </nav>
    </aside>

    <main class="flex-1 p-6 md:p-10 overflow-y-auto">
      <div v-if="currentSection" class="bg-white p-6 md:p-8 rounded-xl shadow-xl max-w-4xl mx-auto">
        <h2 class="text-2xl md:text-3xl font-bold mb-8 text-indigo-700 border-b-2 border-indigo-300 pb-4">
          {{ currentSection.mainTitle }}
        </h2>
        <div v-for="(item, index) in currentSection.content" :key="index" class="mb-5">
          <h3 v-if="item.type === 'heading' && item.level === 2" 
              class="text-xl md:text-2xl font-semibold mt-6 mb-3 text-slate-700">
            {{ item.text }}
          </h3>
          <h4 v-if="item.type === 'heading' && item.level === 3" 
              class="text-lg md:text-xl font-semibold mt-5 mb-2 text-slate-600">
            {{ item.text }}
          </h4>
          <p v-if="item.type === 'paragraph'" 
             class="text-slate-600 leading-relaxed text-sm md:text-base" 
             v-html="formatText(item.text || '')">
          </p>
          <ul v-if="item.type === 'list' && !item.ordered" 
              class="list-disc list-inside pl-5 space-y-1.5 text-slate-600 text-sm md:text-base">
            <li v-for="(listItem, i) in item.items" :key="i" v-html="formatText(listItem)"></li>
          </ul>
          <ol v-if="item.type === 'list' && item.ordered" 
              class="list-decimal list-inside pl-5 space-y-1.5 text-slate-600 text-sm md:text-base">
            <li v-for="(listItem, i) in item.items" :key="i" v-html="formatText(listItem)"></li>
          </ol>
          
          <div v-if="item.type === 'demo'" class="my-8 p-4 border border-indigo-200 rounded-lg bg-indigo-50 shadow-sm">
            <InteractiveQueryDemo v-if="item.demoComponent === 'InteractiveQueryDemo'" />
            <AgentAssistDemo v-if="item.demoComponent === 'AgentAssistDemo'" />
          </div>
        </div>
      </div>
      <div v-else class="text-center text-gray-500 mt-20">
        <p class="text-2xl">请从左侧选择一个演示模块或章节。</p>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { reportData, type ReportSection } from './reportData';
import InteractiveQueryDemo from './components/InteractiveQueryDemo.vue';
import AgentAssistDemo from './components/AgentAssistDemo.vue';

const reportSections = ref<ReportSection[]>(reportData);
const selectedSectionId = ref<string>(reportData[0]?.id || ''); 

const currentSection = computed(() => {
  return reportSections.value.find(sec => sec.id === selectedSectionId.value) || null;
});

const formatText = (text: string): string => {
  if (!text) return '';
  return text.replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-slate-700">$1</strong>');
};
</script>

<style scoped>
aside {
  scrollbar-width: thin;
  scrollbar-color: #4f46e5 #1e293b; /* thumb track */
}
aside::-webkit-scrollbar {
  width: 8px;
}
aside::-webkit-scrollbar-track {
  background: #1e293b; 
}
aside::-webkit-scrollbar-thumb {
  background-color: #4f46e5; 
  border-radius: 4px;
  border: 2px solid #1e293b;
}

main {
   scrollbar-width: thin;
   scrollbar-color: #a5b4fc #e0e7ff;
}

main::-webkit-scrollbar {
  width: 8px;
}
main::-webkit-scrollbar-track {
  background: #e0e7ff; /* Light indigo track */
}
main::-webkit-scrollbar-thumb {
  background-color: #a5b4fc; /* Indigo thumb */
  border-radius: 4px;
  border: 2px solid #e0e7ff;
}
</style>
*/

// =============================================================================
// 文件：src/components/InteractiveQueryDemo.vue
// 描述：智能问答演示组件
// =============================================================================
/*
<template>
  <div class="p-4 bg-white rounded-lg ">
    <h3 class="text-xl font-semibold mb-4 text-indigo-700">客户智能问答演示</h3>
    
    <div class="mb-4">
      <label for="customerQuery" class="block text-sm font-medium text-slate-700 mb-1">客户问题:</label>
      <textarea
        id="customerQuery"
        v-model="customerQuery"
        rows="3"
        class="w-full p-2 border border-slate-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-sm"
        placeholder="例如：我的订单什么时候发货？"
      ></textarea>
    </div>

    <button
      @click="getCopilotSuggestion"
      class="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 text-sm font-medium transition-colors"
    >
      咨询 Copilot
    </button>

    <div v-if="isLoading" class="mt-6 text-center">
      <div class="inline-block animate-pulse-fast rounded-full bg-indigo-400 h-8 w-8"></div>
      <p class="text-sm text-slate-500 mt-2">慧装易助正在分析...</p>
    </div>

    <div v-if="copilotResponse && !isLoading" class="mt-6 p-4 border border-green-300 bg-green-50 rounded-md">
      <h4 class="text-md font-semibold text-green-800 mb-2">慧装易助分析与建议:</h4>
      <div class="space-y-2 text-sm">
        <p><strong class="text-green-700">识别关键词:</strong> <span class="text-slate-600">{{ copilotResponse.keywords }}</span></p>
        <p><strong class="text-green-700">匹配知识/案例:</strong> <span class="text-slate-600">{{ copilotResponse.matchedCase }}</span></p>
        <div>
          <strong class="text-green-700">建议回复:</strong>
          <div class="mt-1 p-2 border border-slate-200 bg-slate-50 rounded text-slate-700">
            {{ copilotResponse.suggestedReply }}
          </div>
        </div>
      </div>
    </div>
     <div v-if="errorMessage && !isLoading" class="mt-6 p-3 border border-red-300 bg-red-50 rounded-md text-sm text-red-700">
      {{ errorMessage }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const customerQuery = ref('');
const isLoading = ref(false);
const copilotResponse = ref<{ keywords: string; matchedCase: string; suggestedReply: string } | null>(null);
const errorMessage = ref('');

// 模拟的知识库/规则
const knowledgeBase: Record<string, { keywords: string[]; matchedCase: string; suggestedReply: string }> = {
  order_status: {
    keywords: ['订单', '发货', '什么时候', '物流'],
    matchedCase: '案例#12345：客户询问订单发货时间。',
    suggestedReply: '您好！请您提供一下您的订单号，我为您查询最新的物流状态。通常情况下，订单会在支付成功后的24-48小时内发出。',
  },
  product_info: {
    keywords: ['产品', '信息', '功能', '规格'],
    matchedCase: '案例#67890：客户咨询XX型号产品特性。',
    suggestedReply: '您好！关于XX型号产品，它具有[主要功能A]、[主要功能B]等特点，详细规格请参考我们的产品页面：[链接]。您还有其他想了解的吗？',
  },
  refund_policy: {
    keywords: ['退款', '政策', '怎么退', '退货'],
    matchedCase: '案例#10112：客户咨询退款流程。',
    suggestedReply: '您好，关于退款政策，我们支持7天无理由退货（特殊商品除外）。请您确保商品完好未影响二次销售，您可以在订单详情页申请退款，仓库收到退货并验货通过后，款项会在3-5个工作日原路退回。',
  }
};

const getCopilotSuggestion = async () => {
  if (!customerQuery.value.trim()) {
    errorMessage.value = '请输入客户问题。';
    copilotResponse.value = null;
    return;
  }
  isLoading.value = true;
  copilotResponse.value = null;
  errorMessage.value = '';

  // 模拟API调用和分析延迟
  await new Promise(resolve => setTimeout(resolve, 1500));

  const query = customerQuery.value.toLowerCase();
  let foundMatch = false;

  for (const key in knowledgeBase) {
    const entry = knowledgeBase[key];
    if (entry.keywords.some(kw => query.includes(kw))) {
      copilotResponse.value = {
        keywords: entry.keywords.join(', '),
        matchedCase: entry.matchedCase,
        suggestedReply: entry.suggestedReply,
      };
      foundMatch = true;
      break;
    }
  }

  if (!foundMatch) {
    copilotResponse.value = {
      keywords: '未能精确匹配特定关键词',
      matchedCase: '未找到高度相似的历史案例。',
      suggestedReply: '您好，请您详细描述一下您的问题，我会尽力协助您。或者，我可以为您转接人工专家处理。',
    };
  }
  isLoading.value = false;
};
</script>
*/

// =============================================================================
// 文件：src/components/AgentAssistDemo.vue
// 描述：客服实时辅助演示组件
// =============================================================================
/*
<template>
  <div class="p-4 bg-white rounded-lg">
    <h3 class="text-xl font-semibold mb-4 text-indigo-700">客服实时辅助演示</h3>

    <div class="mb-4">
      <label for="agentResponse" class="block text-sm font-medium text-slate-700 mb-1">客服回复草稿:</label>
      <textarea
        id="agentResponse"
        v-model="agentDraft"
        @input="analyzeAgentInput"
        rows="4"
        class="w-full p-2 border border-slate-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-sm"
        placeholder="在此输入回复客户的内容..."
      ></textarea>
    </div>

    <div v-if="copilotFeedback.length > 0" class="mt-4 p-3 border border-amber-300 bg-amber-50 rounded-md">
      <h4 class="text-md font-semibold text-amber-800 mb-2">慧装易助实时反馈:</h4>
      <ul class="list-disc list-inside space-y-1 text-sm">
        <li v-for="(feedback, index) in copilotFeedback" :key="index" :class="getFeedbackClass(feedback.type)">
          <strong class="font-medium">{{ feedback.type.toUpperCase() }}:</strong> {{ feedback.message }}
        </li>
      </ul>
    </div>
     <div v-else-if="agentDraft.length > 5" class="mt-4 p-3 border border-green-300 bg-green-50 rounded-md text-sm text-green-700">
      <p><strong class="font-medium">Copilot:</strong> 内容初步看起来不错！</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';

interface Feedback {
  type: 'info' | 'warning' | 'suggestion' | 'compliance';
  message: string;
}

const agentDraft = ref('');
const copilotFeedback = ref<Feedback[]>([]);

const rules = [
  {
    condition: (text: string) => !text.toLowerCase().includes('您好') && !text.toLowerCase().includes('你好') && text.length > 3,
    feedback: { type: 'compliance', message: '提示：回复开头建议使用标准问候语，如“您好”。' } as Feedback,
  },
  {
    condition: (text: string) => text.toLowerCase().includes('不知道') || text.toLowerCase().includes('不清楚'),
    feedback: { type: 'warning', message: '注意：避免使用“不知道”、“不清楚”等消极词汇，尝试提供可行的帮助或查询。' } as Feedback,
  },
  {
    condition: (text: string) => text.length > 10 && !text.includes('订单号') && (text.includes('订单') || text.includes('物流')),
    feedback: { type: 'suggestion', message: '建议：如果涉及订单问题，可以主动询问客户的订单号以便快速查询。' } as Feedback,
  },
  {
    condition: (text: string) => text.length > 15 && !text.includes('感谢') && !text.includes('谢谢'),
    feedback: { type: 'suggestion', message: '建议：在回复结尾可以说声“感谢您的理解与支持”等礼貌用语。' } as Feedback,
  },
  {
    condition: (text: string) => text.toLowerCase().includes('垃圾') || text.toLowerCase().includes('废物'),
    feedback: { type: 'warning', message: '警告：检测到不当言辞，请注意专业沟通。' } as Feedback,
  }
];

const analyzeAgentInput = () => {
  const currentFeedback: Feedback[] = [];
  const text = agentDraft.value;

  if (!text.trim()) {
    copilotFeedback.value = [];
    return;
  }

  rules.forEach(rule => {
    if (rule.condition(text)) {
      currentFeedback.push(rule.feedback);
    }
  });
  copilotFeedback.value = currentFeedback;
};

// Watch for changes in agentDraft to trigger analysis
// Using watch for more explicit control, or can rely purely on @input
watch(agentDraft, analyzeAgentInput);


const getFeedbackClass = (type: Feedback['type']): string => {
  switch (type) {
    case 'info': return 'text-blue-700';
    case 'warning': return 'text-red-700';
    case 'suggestion': return 'text-yellow-700';
    case 'compliance': return 'text-purple-700';
    default: return 'text-slate-700';
  }
};

</script>
*/

```
**主要变化说明：**

1.  **`src/reportData.ts`**:
    * 内容大幅简化，更侧重于引导用户查看交互式演示。
    * `ReportContentItem` 接口增加了 `demoComponent` 字段，用于指定要渲染的演示组件。
    * 创建了新的章节专门用于嵌入演示组件，例如 "2. 演示：智能问答" 和 "3. 演示：客服辅助"。

2.  **`src/App.vue`**:
    * 导入了新的演示组件 `InteractiveQueryDemo.vue` 和 `AgentAssistDemo.vue`。
    * 在模板的 `v-for` 循环中，增加了对 `item.type === 'demo'` 的判断。如果为 `true`，则根据 `item.demoComponent` 的值动态渲染对应的演示组件。
    * 调整了侧边栏和主内容区的样式，使其更美观。

3.  **`src/components/InteractiveQueryDemo.vue` (新增)**:
    * 包含一个文本区域让用户输入“客户问题”。
    * 一个“咨询 Copilot”按钮。
    * 点击按钮后，模拟 慧装易助的分析过程（有加载状态），然后显示：
        * 识别到的关键词（模拟）。
        * 匹配到的知识/案例（从一个简单的模拟知识库中查找）。
        * 建议的回复（基于模拟知识库）。
    * 如果用户未输入或未匹配到，会给出相应提示。

4.  **`src/components/AgentAssistDemo.vue` (新增)**:
    * 包含一个文本区域让用户输入“客服回复草稿”。
    * 当用户输入时，实时（模拟）分析输入内容。
    * 根据预设的一些简单规则（例如：是否包含问候语、是否使用了不当词汇、是否需要询问订单号等），在下方显示 慧装易助的反馈提示（如合规提醒、建议等）。

5.  **样式调整 (`tailwind.config.js`, `src/style.css`, `App.vue` `<style scoped>`)**:
    * 为演示组件的容器添加了一些基本样式。
    * 优化了整体布局和滚动条样式，提升视觉效果。
    * 在 `tailwind.config.js` 中添加了一个简单的 `pulse-fast` 动画，用于加载状态。

**运行步骤：**

请按照您之前成功运行项目的步骤：

1.  确保您的 Vite + Vue 3 + TS 项目已创建。
2.  将上述所有更新后的文件内容（`tailwind.config.js`, `postcss.config.js`, `index.html`, `src/main.ts`, `src/style.css`, `src/vite-env.d.ts`, `src/reportData.ts`, `src/App.vue`）复制到您项目中的对应位置。
3.  在 `src/` 目录下创建一个名为 `components` 的新文件夹。
4.  在 `src/components/` 文件夹中，创建 `InteractiveQueryDemo.vue` 和 `AgentAssistDemo.vue` 文件，并将上面提供的代码分别复制进去。
5.  运行 `npm install` (或 yarn/pnpm) 来确保所有依赖都已安装。
6.  运行 `npm run dev` (或 yarn dev / pnpm dev) 来启动开发服务器。

现在，您应该能看到一个更具交互性的概念演示页面了。用户可以在特定章节与模拟的 慧装易助功能进行