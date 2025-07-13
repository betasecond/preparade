<script setup lang="ts">
import { ref, reactive, computed, onMounted, watch } from 'vue';
import type { ReviewItem } from '../reportData';
import { ReviewQueueServiceImpl } from '../services/reviewQueue.service';
import type { ReviewItemResponse } from '../services/reviewQueue.service';
import type { ReviewQueueFilterParams } from '../services/reviewQueue.service';

// --- 响应式状态定义 ---

// 列表和分页
const queueItems = ref<ReviewItem[]>([]);
const totalItems = ref(0);
const currentPage = ref(1);
const pageSize = ref(10);

// 选中项的完整数据
const selectedItem = ref<ReviewItemResponse | null>(null);

// 加载和错误状态
const loading = ref(true);
const loadingDetail = ref(false);
const errorMessage = ref<string | null>(null);

// 筛选和排序
const activeFilters = ref<ReviewQueueFilterParams>({});
const filterStatus = ref<string>('all'); // 用于UI绑定
const filterSource = ref<string>('all'); // 用于UI绑定
const sortBy = ref<string>('latest'); // 用于UI绑定


// 服务实例
const reviewQueueService = new ReviewQueueServiceImpl();

// 编辑表单状态
const editForm = reactive({
  standardQuestion: '',
  standardAnswer: '',
  tags: [] as string[],
  keywords: [] as string[],
  expirationDate: '',
  comment: ''
});

// --- 数据加载与处理 ---

/**
 * 加载审核队列列表
 */
const loadQueueData = async () => {
  loading.value = true;
  errorMessage.value = null;
  try {
    const response = await reviewQueueService.getReviewItems({
      page: currentPage.value,
      pageSize: pageSize.value,
      ...activeFilters.value,
    });
    
    // 假设您的 http-client 在响应中添加了 code 和 data 字段
    // @ts-ignore
    if (response && response.data) {
      // @ts-ignore
      const responseData = response.data;
      // @ts-ignore
      queueItems.value = responseData.content || [];
      // @ts-ignore
      totalItems.value = responseData.total || responseData.totalElements || 0;

      // 如果列表有数据，但当前没有选中项，或当前选中项不在新列表里，则默认选中第一项
      const isSelectedItemInvalid = !selectedItem.value || !queueItems.value.some(i => i.id === selectedItem.value!.id);
      if (queueItems.value.length > 0 && isSelectedItemInvalid) {
        await selectItem(queueItems.value[0]);
      } else if (queueItems.value.length === 0) {
        selectedItem.value = null; // 如果列表为空，则清空选中项
      }
    } else {
      // @ts-ignore
      throw new Error(response.message || '获取审核队列数据失败');
    }
  } catch (error) {
    console.error('获取审核队列失败:', error);
    errorMessage.value = error instanceof Error ? error.message : '服务暂时不可用';
  } finally {
    loading.value = false;
  }
};

/**
 * 选择一个审核项，并加载其详细信息
 * @param item 要选择的审核项
 */
const selectItem = async (item: ReviewItem | null) => {
  if (!item) {
    selectedItem.value = null;
    return;
  }

  // 避免对同一个已完整加载的项重复发起请求
  if (selectedItem.value?.id === item.id && selectedItem.value?.reviewHistory) {
    return;
  }

  // 先用列表中的基本信息来填充，确保即使API失败，基本信息也存在
  // 并为数组属性提供默认值，防止模板渲染错误
  selectedItem.value = { 
    ...item, 
    reviewHistory: [], 
    relatedKnowledgeItems: [] 
  };
  
  loadingDetail.value = true;
  try {
    if (!item.id) {
      console.warn('Attempted to select an item with no ID.', item);
      return;
    }
    // @ts-ignore
    const response = await reviewQueueService.getReviewItemDetail(item.id);
    
    // @ts-ignore
    if (response && response.data) {
      // @ts-ignore
      const itemDetail = response.data;
      selectedItem.value = {
        ...itemDetail,
        reviewHistory: itemDetail.reviewHistory || [],
        relatedKnowledgeItems: itemDetail.relatedKnowledgeItems || [],
      };
      
      // 当获取到详情后，填充编辑表单
      editForm.standardQuestion = itemDetail.standardQuestion || itemDetail.originalQuery;
      editForm.standardAnswer = itemDetail.suggestedAnswer || itemDetail.currentAnswer || '';
      editForm.tags = itemDetail.metadata?.tags || [];
      editForm.keywords = itemDetail.metadata?.keywords || [];
      editForm.expirationDate = itemDetail.metadata?.expirationDate || '';
      editForm.comment = '';

    } else {
      // @ts-ignore
      throw new Error(response.message || '获取审核项详情失败');
    }
  } catch (error) {
    console.error('获取审核项详情失败:', error);
    // 失败时，selectedItem 依然保留之前设置的基本信息和空数组，UI不会崩溃
    errorMessage.value = error instanceof Error ? error.message : '无法加载详情';
  } finally {
    loadingDetail.value = false;
  }
};

/**
 * 提交审核决定
 * @param decision 决定类型
 */
const handleReviewDecision = async (decision: 'approve' | 'reject' | 'needsInfo') => {
  if (!selectedItem.value) {
    errorMessage.value = '没有选中的项目';
    return;
  }
  
  loadingDetail.value = true;
  errorMessage.value = null;
  
  try {
    const request: import('../services/reviewQueue.service').ReviewDecisionRequest = {
      itemId: selectedItem.value.id,
      decision: decision,
      comment: editForm.comment,
    };

    if (decision === 'approve') {
      request.standardQuestion = editForm.standardQuestion;
      request.suggestedAnswer = editForm.standardAnswer;
      request.metadata = {
        tags: editForm.tags,
        keywords: editForm.keywords,
        expirationDate: editForm.expirationDate || undefined,
      };
    }
    
    // @ts-ignore
    const response = await reviewQueueService.submitReviewDecision(request);

    // @ts-ignore
    if (response && response.data?.success) {
      // 操作成功，刷新列表
      await loadQueueData();
      // 可以根据需求决定是否清除选中项
      // selectedItem.value = null; 
    } else {
      // @ts-ignore
      throw new Error(response.message || '操作失败');
    }
  } catch (error) {
    console.error('提交审核决定失败:', error);
    errorMessage.value = error instanceof Error ? error.message : '操作失败，请重试';
  } finally {
    loadingDetail.value = false;
  }
};


// --- 生命周期和侦听器 ---

onMounted(async () => {
  await loadQueueData();
  // 可以在这里加载其他初始数据，如标签、统计等
});

// 侦听UI筛选条件的变化，并更新activeFilters
watch([filterStatus, filterSource, sortBy], () => {
  const newFilters: ReviewQueueFilterParams = {};
  if (filterStatus.value !== 'all') newFilters.status = filterStatus.value as 'pending' | 'approved' | 'rejected' | 'needsInfo';
  if (filterSource.value !== 'all') newFilters.source = filterSource.value;
  // 可以在这里添加排序逻辑
  
  activeFilters.value = newFilters;
  // 筛选条件变化时重新加载数据
  loadQueueData();
});


// --- 辅助函数和计算属性 ---

const getStatusClass = (status: string) => {
  switch (status) {
    case 'approved': return 'bg-green-100 text-green-800';
    case 'rejected': return 'bg-red-100 text-red-800';
    case 'needsInfo': return 'bg-yellow-100 text-yellow-800';
    default: return 'bg-blue-100 text-blue-800';
  }
};

// ... 此处可以添加其他UI辅助函数，如格式化日期等 ...

</script>
<template>
  <div class="flex h-full bg-gray-50 font-sans">
    <!-- Main content -->
    <main class="flex-1 flex flex-col overflow-hidden">
      <!-- Page header -->
      <div class="border-b border-gray-200 px-4 py-4 sm:flex sm:items-center sm:justify-between sm:px-6 lg:px-8">
        <!-- ... header content ... -->
      </div>

      <div class="flex-1 flex overflow-hidden">
        <!-- Queue List -->
        <div class="w-1/3 flex flex-col border-r border-gray-200 bg-white">
          <div class="p-4 border-b">
            <h2 class="text-lg font-medium text-gray-900">审核队列</h2>
          </div>
          <div v-if="loading" class="p-4 text-center text-gray-500">加载中...</div>
          <div v-else-if="errorMessage && queueItems.length === 0" class="p-4 text-center text-red-500">
            {{ errorMessage }}
          </div>
          <ul v-else-if="queueItems.length > 0" class="overflow-y-auto">
            <li v-for="item in queueItems" :key="item.id" @click="selectItem(item)"
                :class="['p-4 cursor-pointer hover:bg-indigo-50 border-b', { 'bg-indigo-100 border-l-4 border-indigo-500': selectedItem?.id === item.id }]">
              <div class="font-semibold text-gray-800 truncate">{{ item.originalQuery }}</div>
              <div class="text-sm text-gray-500">{{ item.source }}</div>
              <div class="flex items-center justify-between mt-2">
                <span class="text-xs text-gray-400">{{ new Date(item.timestamp).toLocaleString() }}</span>
                <span :class="['px-2 py-0.5 text-xs font-medium rounded-full', getStatusClass(item.status)]">{{ item.status }}</span>
              </div>
            </li>
          </ul>
          <div v-else class="p-4 text-center text-gray-500">队列为空</div>
        </div>

        <!-- Detail Panel -->
        <div class="flex-1 overflow-y-auto p-6">
          <div v-if="loadingDetail" class="text-center text-gray-500">
            <p>正在加载详情...</p>
          </div>
          <div v-else-if="selectedItem" :key="selectedItem.id">
            <h2 class="text-2xl font-bold text-gray-900">{{ selectedItem.originalQuery }}</h2>
            <p v-if="selectedItem.currentAnswer" class="mt-2 text-gray-600 bg-gray-100 p-3 rounded-md">
              <strong>系统回答:</strong> {{ selectedItem.currentAnswer }}
            </p>

            <!-- 编辑表单 -->
            <div class="mt-6 space-y-4">
              <div>
                <label for="standardQuestion" class="block text-sm font-medium text-gray-700">标准问题</label>
                <input type="text" id="standardQuestion" v-model="editForm.standardQuestion" class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-2">
              </div>
              <div>
                <label for="standardAnswer" class="block text-sm font-medium text-gray-700">标准答案</label>
                <textarea id="standardAnswer" v-model="editForm.standardAnswer" rows="4" class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-2"></textarea>
              </div>
               <div>
                <label for="comment" class="block text-sm font-medium text-gray-700">审核备注</label>
                <textarea id="comment" v-model="editForm.comment" rows="2" class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-2" placeholder="可选"></textarea>
              </div>
            </div>
            
            <!-- 操作按钮 -->
            <div class="mt-6 flex items-center justify-end space-x-3 border-t pt-4">
                <div v-if="errorMessage" class="text-red-600 text-sm">{{ errorMessage }}</div>
                <button @click="handleReviewDecision('reject')" type="button" class="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                  拒绝
                </button>
                <button @click="handleReviewDecision('approve')" type="button" class="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                  批准并更新
                </button>
            </div>

            <!-- Review History Section -->
            <div class="mt-8">
              <h3 class="text-xl font-semibold text-gray-800 mb-4">审核历史</h3>
              <div v-if="selectedItem.reviewHistory && selectedItem.reviewHistory.length > 0" class="space-y-4">
                <div v-for="history in selectedItem.reviewHistory" :key="history.timestamp" class="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                  <div class="flex justify-between items-center">
                    <span class="font-semibold text-gray-700">{{ history.action }} by {{ history.reviewerName }}</span>
                    <span class="text-sm text-gray-500">{{ new Date(history.timestamp).toLocaleString() }}</span>
                  </div>
                  <p v-if="history.comment" class="mt-2 text-gray-600">{{ history.comment }}</p>
                </div>
              </div>
              <div v-else class="text-gray-500 bg-gray-100 p-4 rounded-md">暂无审核历史</div>
            </div>
             <!-- ... other detail sections ... -->
          </div>
          <div v-else class="text-center text-gray-500 pt-16">
            <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path vector-effect="non-scaling-stroke" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
            </svg>
            <h3 class="mt-2 text-sm font-medium text-gray-900">无选中项</h3>
            <p class="mt-1 text-sm text-gray-500">请从左侧列表选择一个项目进行查看</p>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>
<style scoped>
/* 可以在此添加或保留之前的样式 */
.border-l-4 {
  border-left-width: 4px;
}
</style>