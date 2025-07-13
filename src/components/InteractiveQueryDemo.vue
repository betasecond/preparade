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
      @click="getAISuggestion"
      class="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 text-sm font-medium transition-colors"
    >
      咨询 AI 智能体客服
    </button>

    <div v-if="isLoading" class="mt-6 text-center">
      <div class="inline-block animate-pulse-fast rounded-full bg-indigo-400 h-8 w-8"></div>
      <p class="text-sm text-slate-500 mt-2">AI 智能体客服正在分析...</p>
    </div>

    <div v-if="aiResponse && !isLoading" class="mt-6 p-4 border border-green-300 bg-green-50 rounded-md">
      <h4 class="text-md font-semibold text-green-800 mb-2">AI 智能体客服分析与建议:</h4>
      <div class="space-y-2 text-sm">
        <p><strong class="text-green-700">识别关键词:</strong> <span class="text-slate-600">{{ aiResponse.keywords }}</span></p>
        <p><strong class="text-green-700">匹配知识/案例:</strong> <span class="text-slate-600">{{ aiResponse.matchedCase }}</span></p>
        <div>
          <strong class="text-green-700">建议回复:</strong>
          <div class="mt-1 p-2 border border-slate-200 bg-slate-50 rounded text-slate-700">
            {{ aiResponse.suggestedReply }}
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
import { ref, onMounted } from 'vue';
import { getServiceQA, type ServiceQA } from '../api';

const customerQuery = ref('');
const isLoading = ref(false);
const aiResponse = ref<{ keywords: string; matchedCase: string; suggestedReply: string } | null>(null);
const errorMessage = ref('');
const serviceQADatabase = ref<ServiceQA[]>([]);

// 加载数据
onMounted(async () => {
  try {
    const data = await getServiceQA();
    serviceQADatabase.value = data.map(item => ({
      ...item,
      keywords: item.question.trim().split(/\s+/).filter(word => word.length > 1)
    }));
  } catch (error) {
    console.error('加载知识库失败:', error);
    errorMessage.value = '加载知识库数据失败，请稍后再试。';
  }
});

// 使用简单的相似度算法找到最匹配的问答对
const findBestMatch = (query: string): ServiceQA | null => {
  if (!serviceQADatabase.value.length) return null;
  
  const queryLower = query.toLowerCase();
  let bestMatch: ServiceQA | null = null;
  let highestScore = 0;
  
  serviceQADatabase.value.forEach(qa => {
    // 计算简单的关键词匹配程度
    const questionLower = qa.question.toLowerCase();
    let score = 0;
    
    // 检查完整问题匹配度
    if (queryLower.includes(questionLower) || questionLower.includes(queryLower)) {
      score += 5;
    }
    
    // 检查关键词匹配
    qa.keywords?.forEach(keyword => {
      if (queryLower.includes(keyword.toLowerCase())) {
        score += 1;
      }
    });
    
    if (score > highestScore) {
      highestScore = score;
      bestMatch = qa;
    }
  });
  
  // 设置匹配阈值，低于此分数认为没有找到匹配
  return highestScore > 0 ? bestMatch : null;
};

const getAISuggestion = async () => {
  if (!customerQuery.value.trim()) {
    errorMessage.value = '请输入客户问题。';
    aiResponse.value = null;
    return;
  }
  isLoading.value = true;
  aiResponse.value = null;
  errorMessage.value = '';

  // 模拟API调用和分析延迟
  await new Promise(resolve => setTimeout(resolve, 1500));

  const query = customerQuery.value;
  const bestMatch = findBestMatch(query);

  if (bestMatch) {
    // 提取问题中的关键词，最多展示5个
    const extractedKeywords = bestMatch.keywords?.slice(0, 5).join(', ') || '家具, 质量, 服务';
    
    aiResponse.value = {
      keywords: extractedKeywords,
      matchedCase: `案例#${bestMatch.id}: ${bestMatch.question.slice(0, 30)}${bestMatch.question.length > 30 ? '...' : ''}`,
      suggestedReply: bestMatch.answer,
    };
  } else {
    aiResponse.value = {
      keywords: '未能精确匹配特定关键词',
      matchedCase: '未找到高度相似的历史案例。',
      suggestedReply: '您好，请您详细描述一下您的问题，我会尽力协助您。或者，我可以为您转接人工专家处理。',
    };
  }
  isLoading.value = false;
};
</script>