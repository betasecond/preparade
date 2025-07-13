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
        <li v-for="(suggestion, index) in assistResponse.suggestions" :key="index" :class="getSuggestionClass(suggestion.type)">
          <strong class="font-medium">{{ getSuggestionTypeLabel(suggestion.type) }}:</strong> {{ suggestion.content }}
        </li>
      </ul>
      
      <div v-if="assistResponse.complianceAnalysis && assistResponse.complianceAnalysis.hasIssues" class="mt-2 border-t border-amber-200 pt-2">
        <h5 class="text-sm font-semibold text-red-700">合规性问题:</h5>
        <ul class="list-disc list-inside text-sm">
          <li v-for="(issue, index) in assistResponse.complianceAnalysis.issues" :key="index" class="text-red-600">
            {{ issue.description }} <span v-if="issue.suggestion" class="text-slate-600">(建议: {{ issue.suggestion }})</span>
          </li>
        </ul>
      </div>
    </div>
     <div v-else-if="agentDraft.length > 5" class="mt-4 p-3 border border-green-300 bg-green-50 rounded-md text-sm text-green-700">
      <p><strong class="font-medium">AI 智能体客服:</strong> 内容初步看起来不错！</p>

    </div>

    <div v-if="errorMessage" class="mt-4 p-3 border border-red-300 bg-red-50 rounded-md text-sm text-red-700">
      {{ errorMessage }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { AgentAssistServiceImpl, AssistRequest, type AssistResponse } from '../services/agentAssist.service';

// 状态变量
const agentDraft = ref('');
const isLoading = ref(false);
const assistResponse = ref<AssistResponse | null>(null);
const errorMessage = ref('');
const debounceTimeout = ref<number | null>(null);

// 实例化服务
const assistService = new AgentAssistServiceImpl();

// 模拟的会话上下文
const sessionContext = {
  sessionId: 'demo-session-' + Date.now(),
  agentId: 'agent-123',
  history: [
    {
      id: 'msg-1',
      sender: 'customer',
      content: '你们的产品什么时候能发货？我等了三天了还没收到',
      timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
      type: 'text'
    },
    {
      id: 'msg-2',
      sender: 'agent',
      content: '您好，请问您的订单号是多少呢？我帮您查询',
      timestamp: new Date(Date.now() - 1000 * 60 * 3).toISOString(),
      type: 'text'
    },
    {
      id: 'msg-3',
      sender: 'customer',
      content: '订单号是1234567890',
      timestamp: new Date(Date.now() - 1000 * 60 * 2).toISOString(),
      type: 'text'
    }
  ]
};

// 带防抖的分析函数
const analyzeAgentInput = () => {
  // 清除之前的计时器
  if (debounceTimeout.value !== null) {
    clearTimeout(debounceTimeout.value);
  }

  // 文本为空时重置
  if (!agentDraft.value.trim()) {
    assistResponse.value = null;
    errorMessage.value = '';
    return;
  }

  // 设置防抖延迟
  debounceTimeout.value = setTimeout(async () => {
    isLoading.value = true;
    errorMessage.value = '';

    try {
      // 准备请求参数
      const request: AssistRequest = {
        context: {
          sessionId: sessionContext.sessionId,
          agentId: sessionContext.agentId,
          history: sessionContext.history
        },
        currentDraft: agentDraft.value,
        assistType: 'auto'
      };

      // 调用API
      const response = await assistService.getRealtimeAssistance(request);
      
      // 处理响应
      if (response.code === 200) {
        assistResponse.value = response.data;
      } else {
        errorMessage.value = response.message || '请求失败';
        assistResponse.value = null;
      }
    } catch (error) {
      console.error('获取实时辅助建议失败:', error);
      errorMessage.value = error instanceof Error ? error.message : '服务暂时不可用，请稍后再试。';
      assistResponse.value = null;
    } finally {
      isLoading.value = false;
    }
  }, 800); // 800ms防抖延迟
};

// 监听输入变化
watch(agentDraft, analyzeAgentInput);

// 格式化建议类型
const getSuggestionTypeLabel = (type: string): string => {
  const labels: Record<string, string> = {
    'completion': '补全',
    'sentiment': '情感',
    'compliance': '合规',
    'information': '信息',
    'greeting': '问候',
    'closing': '结束语'
  };
  
  return labels[type] || type.toUpperCase();
};

// 获取CSS类
const getSuggestionClass = (type: string): string => {
  switch (type) {
    case 'information': return 'text-blue-700';
    case 'compliance': return 'text-red-700';
    case 'sentiment': return 'text-purple-700';
    case 'completion': return 'text-green-700';
    case 'greeting':
    case 'closing':
      return 'text-yellow-700';
    default: return 'text-slate-700';
  }
};
</script>