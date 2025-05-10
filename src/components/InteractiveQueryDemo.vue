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
      <p class="text-sm text-slate-500 mt-2">Copilot 正在分析...</p>
    </div>

    <div v-if="copilotResponse && !isLoading" class="mt-6 p-4 border border-green-300 bg-green-50 rounded-md">
      <h4 class="text-md font-semibold text-green-800 mb-2">Copilot 分析与建议:</h4>
      <div class="space-y-2 text-sm">
        <p><strong class="text-green-700">识别关键词:</strong> 
           <span class="text-slate-600">
             {{ copilotResponse.keywordAnalysis?.map(k => k.keyword).join(', ') || '无关键词' }}
           </span>
        </p>
        <p><strong class="text-green-700">匹配知识/案例:</strong> 
           <span class="text-slate-600">
             {{ copilotResponse.knowledgeMatches?.length ? 
                '案例#' + copilotResponse.knowledgeMatches[0].id + '：' + copilotResponse.knowledgeMatches[0].standardQuestion : 
                '未找到高度相似的历史案例。' }}
           </span>
        </p>
        <div>
          <strong class="text-green-700">建议回复:</strong>
          <div class="mt-1 p-2 border border-slate-200 bg-slate-50 rounded text-slate-700">
            {{ copilotResponse.suggestedAnswer }}
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
import { InteractiveQueryServiceImpl } from '../services/interactiveQuery.service';
import type { UserQueryRequest, QueryResponse } from '../services/interactiveQuery.service';

const customerQuery = ref('');
const isLoading = ref(false);
const copilotResponse = ref<QueryResponse | null>(null);
const errorMessage = ref('');

// 实例化服务
const queryService = new InteractiveQueryServiceImpl();

// 实际调用API
const getCopilotSuggestion = async () => {
  if (!customerQuery.value.trim()) {
    errorMessage.value = '请输入客户问题。';
    copilotResponse.value = null;
    return;
  }
  isLoading.value = true;
  copilotResponse.value = null;
  errorMessage.value = '';

  try {
    // 准备请求参数
    const request: UserQueryRequest = {
      query: customerQuery.value,
      sessionId: 'demo-session-' + Date.now(),
      source: 'web-demo'
    };

    // 调用API
    const response = await queryService.submitQuery(request);
    
    // 处理响应
    if (response.code === 200) {
      copilotResponse.value = response.data;
    } else {
      errorMessage.value = response.message || '请求失败';
    }
  } catch (error) {
    console.error('获取智能回答失败:', error);
    errorMessage.value = error instanceof Error ? error.message : '服务暂时不可用，请稍后再试。';
  } finally {
    isLoading.value = false;
  }
};
</script>