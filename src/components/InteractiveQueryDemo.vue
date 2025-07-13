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
      <div class="response-content">
        <p class="text-slate-700 whitespace-pre-line">{{ aiResponse.content }}</p>
        <div class="mt-3 pt-3 border-t border-green-200 text-sm">
          <p><strong class="text-green-700">识别关键词:</strong> <span class="text-slate-600">{{ aiResponse.keywords }}</span></p>
          <p><strong class="text-green-700">匹配知识/案例:</strong> <span class="text-slate-600">{{ aiResponse.source }}</span></p>
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
import { getServiceQA } from '../api';
import type { ServiceQA } from '../reportData';

const customerQuery = ref('');
const isLoading = ref(false);
const aiResponse = ref<{ title: string; content: string; keywords: string; source: string; } | null>(null);
const errorMessage = ref('');
const serviceQADatabase = ref<ServiceQA[]>([]);
const FALLBACK_KEYWORDS = '家具, 质量, 服务';

// 加载数据
onMounted(async () => {
  try {
    const data = await getServiceQA();
    const preprocessKeywords = (question: string) => {
      // 简单中文分词：提取所有汉字字符作为一个数组
      const chineseChars = question.match(/\p{Script=Han}/gu);
      if (chineseChars) {
        return chineseChars;
      }
      // 对于非中文或无汉字的文本，使用原有的空格分割逻辑
      return question.trim().split(/\s+/).filter(word => word.length > 1);
    }

    const processedData = data.map(item => ({
      ...item,
      keywords: preprocessKeywords(item.question),
    }));
    
    serviceQADatabase.value = processedData;
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

const getAISuggestion = () => {
  if (!customerQuery.value.trim()) {
    errorMessage.value = "请输入您的问题后再咨询。";
    aiResponse.value = null; // 清除旧的回答
    return;
  }
  errorMessage.value = '';
  isLoading.value = true;
  aiResponse.value = null;

  // 模拟AI思考过程
  setTimeout(() => {
    const bestMatch = findBestMatch(customerQuery.value);
    
    if (bestMatch) {
      // 提取问题中的关键词，最多展示5个
      const extractedKeywords = bestMatch.keywords?.slice(0, 5).join(', ') || FALLBACK_KEYWORDS;
      
      aiResponse.value = {
        title: 'AI 知识库建议',
        content: bestMatch.answer,
        keywords: extractedKeywords,
        source: '内部知识库'
      };
    } else {
      aiResponse.value = {
        title: 'AI 无明确答案',
        content: '抱歉，对于您的问题，知识库中暂无直接匹配的答案。请尝试换个问法或联系人工客服。',
        keywords: '无匹配',
        source: '无'
      };
    }
    isLoading.value = false;
  }, 1000);
};
</script>

<style scoped>
/* 保持原有样式不变 */
.animate-pulse-fast {
  animation: pulse-fast 1.2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

@keyframes pulse-fast {
  0%, 100% {
    opacity: 1;
    transform: scale(1);
  }
  50% {
    opacity: 0.5;
    transform: scale(0.95);
  }
}
</style>