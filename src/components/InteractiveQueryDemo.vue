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