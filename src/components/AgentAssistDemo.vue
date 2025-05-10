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
      <h4 class="text-md font-semibold text-amber-800 mb-2">AI 智能体客服实时反馈:</h4>
      <ul class="list-disc list-inside space-y-1 text-sm">
        <li v-for="(feedback, index) in copilotFeedback" :key="index" :class="getFeedbackClass(feedback.type)">
          <strong class="font-medium">{{ feedback.type.toUpperCase() }}:</strong> {{ feedback.message }}
        </li>
      </ul>
    </div>
     <div v-else-if="agentDraft.length > 5" class="mt-4 p-3 border border-green-300 bg-green-50 rounded-md text-sm text-green-700">
      <p><strong class="font-medium">AI 智能体客服:</strong> 内容初步看起来不错！</p>
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
    feedback: { type: 'compliance', message: '提示：回复开头建议使用标准问候语，如"您好"。' } as Feedback,
  },
  {
    condition: (text: string) => text.toLowerCase().includes('不知道') || text.toLowerCase().includes('不清楚'),
    feedback: { type: 'warning', message: '注意：避免使用"不知道"、"不清楚"等消极词汇，尝试提供可行的帮助或查询。' } as Feedback,
  },
  {
    condition: (text: string) => text.length > 10 && !text.includes('订单号') && (text.includes('订单') || text.includes('物流')),
    feedback: { type: 'suggestion', message: '建议：如果涉及订单问题，可以主动询问客户的订单号以便快速查询。' } as Feedback,
  },
  {
    condition: (text: string) => text.length > 15 && !text.includes('感谢') && !text.includes('谢谢'),
    feedback: { type: 'suggestion', message: '建议：在回复结尾可以说声"感谢您的理解与支持"等礼貌用语。' } as Feedback,
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