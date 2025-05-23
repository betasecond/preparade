<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue';
import { ReviewQueueServiceImpl, type ReviewQueueItem } from '../services/reviewQueue.service';

// 初始化状态
const reviewItems = ref<ReviewQueueItem[]>([]);
const isLoading = ref(false);
const errorMessage = ref('');
const selectedItemId = ref<string | null>(null);
const filterStatus = ref<string>('all');
const filterSource = ref<string>('all');
const sortBy = ref<string>('latest');

// 支持的标签选项
const availableTags = ref<string[]>([]);

// 实例化服务
const reviewQueueService = new ReviewQueueServiceImpl();

// 编辑表单状态
const editForm = reactive({
  standardQuestion: '',
  standardAnswer: '',
  tags: [] as string[],
  keywords: [] as string[],
  expirationDate: '',
  newTag: '',
  newKeyword: '',
  comment: ''
});

// 审核队列统计数据
const queueStats = ref({
  totalItems: 0,
  pendingCount: 0,
  approvedCount: 0,
  rejectedCount: 0,
  needsInfoCount: 0
});

// 初始化加载数据
onMounted(async () => {
  try {
    await loadQueueData();
    await loadTags();
    await loadStats();
  } catch (error) {
    console.error('初始化加载失败:', error);
    errorMessage.value = error instanceof Error ? error.message : '无法加载数据，请稍后再试';
  }
});

// 加载审核队列数据
const loadQueueData = async () => {
  isLoading.value = true;
  errorMessage.value = '';
  
  try {
    const params = {
      page: 1,
      pageSize: 50,
      status: filterStatus.value !== 'all' ? filterStatus.value : undefined,
      source: filterSource.value !== 'all' ? filterSource.value : undefined,
      sortBy: sortBy.value === 'latest' ? 'timestamp' : undefined,
      sortOrder: sortBy.value === 'latest' ? 'desc' : 'asc'
    };

    const response = await reviewQueueService.getReviewQueueItems(params);
    
    if (response.code === 200) {
      reviewItems.value = response.data.items;
    } else {
      errorMessage.value = response.message || '获取审核队列数据失败';
    }
  } catch (error) {
    console.error('加载审核队列数据失败:', error);
    errorMessage.value = error instanceof Error ? error.message : '服务暂时不可用，请稍后再试';
  } finally {
    isLoading.value = false;
  }
};

// 加载审核标签
const loadTags = async () => {
  try {
    const response = await reviewQueueService.getReviewTags();
    if (response.code === 200) {
      availableTags.value = response.data;
    }
  } catch (error) {
    console.error('加载标签失败:', error);
  }
};

// 加载统计数据
const loadStats = async () => {
  try {
    const response = await reviewQueueService.getReviewStats();
    if (response.code === 200) {
      queueStats.value = response.data;
    }
  } catch (error) {
    console.error('加载统计数据失败:', error);
  }
};

// 处理筛选和排序变化
const handleFilterChange = async () => {
  await loadQueueData();
};

// 监听筛选条件变化
watch([filterStatus, filterSource, sortBy], handleFilterChange);

// 获取选中的项目
const selectedItem = computed(() => {
  if (!selectedItemId.value) return null;
  return reviewItems.value.find(item => item.id === selectedItemId.value) || null;
});

// 选择一个项目进行审核
const selectItem = async (id: string) => {
  selectedItemId.value = id;
  
  try {
    // 获取详细信息
    const response = await reviewQueueService.getReviewItemDetail(id);
    
    if (response.code === 200) {
      const item = response.data;
      
      editForm.standardQuestion = item.standardQuestion || item.originalQuery;
      editForm.standardAnswer = item.suggestedAnswer || item.currentAnswer || '';
      editForm.tags = item.metadata?.tags || [];
      editForm.keywords = item.metadata?.keywords || [];
      editForm.expirationDate = item.metadata?.expirationDate || '';
      editForm.comment = '';
    } else {
      errorMessage.value = response.message || '获取审核项详情失败';
    }
  } catch (error) {
    console.error('获取审核项详情失败:', error);
    errorMessage.value = error instanceof Error ? error.message : '服务暂时不可用，请稍后再试';
  }
};

// 添加标签
const addTag = () => {
  if (editForm.newTag && !editForm.tags.includes(editForm.newTag)) {
    editForm.tags.push(editForm.newTag);
    editForm.newTag = '';
  }
};

// 删除标签
const removeTag = (tag: string) => {
  const index = editForm.tags.indexOf(tag);
  if (index > -1) {
    editForm.tags.splice(index, 1);
  }
};

// 添加关键词
const addKeyword = () => {
  if (editForm.newKeyword && !editForm.keywords.includes(editForm.newKeyword)) {
    editForm.keywords.push(editForm.newKeyword);
    editForm.newKeyword = '';
  }
};

// 删除关键词
const removeKeyword = (keyword: string) => {
  const index = editForm.keywords.indexOf(keyword);
  if (index > -1) {
    editForm.keywords.splice(index, 1);
  }
};

// 审核操作
const approveItem = async (saveChanges: boolean = false) => {
  if (!selectedItemId.value) return;
  isLoading.value = true;
  errorMessage.value = '';
  
  try {
    const request = {
      itemId: selectedItemId.value,
      decision: 'approve',
      standardQuestion: saveChanges ? editForm.standardQuestion : undefined,
      suggestedAnswer: saveChanges ? editForm.standardAnswer : undefined,
      metadata: saveChanges ? {
        tags: editForm.tags,
        keywords: editForm.keywords,
        expirationDate: editForm.expirationDate
      } : undefined,
      comment: editForm.comment
    };
    
    const response = await reviewQueueService.submitReviewDecision(request);
    
    if (response.code === 200) {
      // 更新本地状态
      await loadQueueData();
      await loadStats();
      selectedItemId.value = null;
    } else {
      errorMessage.value = response.message || '操作失败';
    }
  } catch (error) {
    console.error('审批操作失败:', error);
    errorMessage.value = error instanceof Error ? error.message : '服务暂时不可用，请稍后再试';
  } finally {
    isLoading.value = false;
  }
};

const rejectItem = async () => {
  if (!selectedItemId.value) return;
  isLoading.value = true;
  errorMessage.value = '';
  
  try {
    const request = {
      itemId: selectedItemId.value,
      decision: 'reject',
      comment: editForm.comment
    };
    
    const response = await reviewQueueService.submitReviewDecision(request);
    
    if (response.code === 200) {
      await loadQueueData();
      await loadStats();
      selectedItemId.value = null;
    } else {
      errorMessage.value = response.message || '操作失败';
    }
  } catch (error) {
    console.error('拒绝操作失败:', error);
    errorMessage.value = error instanceof Error ? error.message : '服务暂时不可用，请稍后再试';
  } finally {
    isLoading.value = false;
  }
};

const needMoreInfo = async () => {
  if (!selectedItemId.value) return;
  isLoading.value = true;
  errorMessage.value = '';
  
  try {
    const request = {
      itemId: selectedItemId.value,
      decision: 'needsInfo',
      comment: editForm.comment
    };
    
    const response = await reviewQueueService.submitReviewDecision(request);
    
    if (response.code === 200) {
      await loadQueueData();
      await loadStats();
      selectedItemId.value = null;
    } else {
      errorMessage.value = response.message || '操作失败';
    }
  } catch (error) {
    console.error('标记需要更多信息失败:', error);
    errorMessage.value = error instanceof Error ? error.message : '服务暂时不可用，请稍后再试';
  } finally {
    isLoading.value = false;
  }
};

// 格式化日期
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  if (isNaN(date.getTime())) {
    return dateString;
  }
  
  const today = new Date().toDateString();
  if (date.toDateString() === today) {
    return date.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' });
  }
  
  return date.toLocaleString('zh-CN', { month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' });
};

// 获取状态样式
const getStatusClass = (status: string) => {
  switch (status) {
    case 'approved':
      return 'bg-green-100 text-green-800';
    case 'rejected':
      return 'bg-red-100 text-red-800';
    case 'needsInfo':
      return 'bg-yellow-100 text-yellow-800';
    default:
      return 'bg-blue-100 text-blue-800';
  }
};

// 获取状态文本
const getStatusText = (status: string) => {
  switch (status) {
    case 'approved':
      return '已批准';
    case 'rejected':
      return '已拒绝';
    case 'needsInfo':
      return '需补充';
    default:
      return '待审核';
  }
};
</script>

<template>
  <div class="review-queue-container">
    <!-- 统计信息条 -->
    <div class="stats-bar bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg shadow mb-4 p-3 grid grid-cols-5 gap-3 text-center">
      <div class="stat-item bg-white/10 rounded p-2">
        <div class="text-xs font-medium text-white/80">总项目</div>
        <div class="text-xl font-bold text-white">{{ queueStats.totalItems }}</div>
      </div>
      <div class="stat-item bg-white/10 rounded p-2">
        <div class="text-xs font-medium text-white/80">待处理</div>
        <div class="text-xl font-bold text-white">{{ queueStats.pendingCount }}</div>
      </div>
      <div class="stat-item bg-white/10 rounded p-2">
        <div class="text-xs font-medium text-white/80">已批准</div>
        <div class="text-xl font-bold text-white">{{ queueStats.approvedCount }}</div>
      </div>
      <div class="stat-item bg-white/10 rounded p-2">
        <div class="text-xs font-medium text-white/80">已拒绝</div>
        <div class="text-xl font-bold text-white">{{ queueStats.rejectedCount }}</div>
      </div>
      <div class="stat-item bg-white/10 rounded p-2">
        <div class="text-xs font-medium text-white/80">需补充</div>
        <div class="text-xl font-bold text-white">{{ queueStats.needsInfoCount }}</div>
      </div>
    </div>
    
    <!-- 过滤和排序控制 -->
    <div class="filter-controls bg-white p-4 rounded-lg shadow mb-4 flex flex-wrap gap-4">
      <div class="flex items-center">
        <label for="filter-status" class="mr-2 text-sm font-medium text-gray-700">状态:</label>
        <select
          id="filter-status"
          v-model="filterStatus"
          class="border border-gray-300 rounded-md text-sm px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value="all">全部</option>
          <option value="pending">待审核</option>
          <option value="approved">已批准</option>
          <option value="rejected">已拒绝</option>
          <option value="needsInfo">需补充</option>
        </select>
      </div>
      
      <div class="flex items-center">
        <label for="filter-source" class="mr-2 text-sm font-medium text-gray-700">来源:</label>
        <select
          id="filter-source"
          v-model="filterSource"
          class="border border-gray-300 rounded-md text-sm px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value="all">全部</option>
          <option value="用户提问-系统未答出">用户提问</option>
          <option value="用户反馈-答案差评">用户反馈</option>
          <option value="低置信度回答">低置信度</option>
        </select>
      </div>
      
      <div class="flex items-center">
        <label for="sort-by" class="mr-2 text-sm font-medium text-gray-700">排序:</label>
        <select
          id="sort-by"
          v-model="sortBy"
          class="border border-gray-300 rounded-md text-sm px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value="latest">最新优先</option>
          <option value="oldest">最早优先</option>
        </select>
      </div>
    </div>
    
    <!-- 加载中状态 -->
    <div v-if="isLoading && !selectedItemId" class="bg-white p-8 rounded-lg shadow mb-4 text-center">
      <div class="inline-block animate-pulse-fast rounded-full bg-indigo-400 h-8 w-8"></div>
      <p class="text-sm text-slate-500 mt-2">数据加载中...</p>
    </div>
    
    <!-- 错误信息显示 -->
    <div v-if="errorMessage" class="bg-red-50 border border-red-300 rounded-lg p-4 mb-4 text-red-800">
      {{ errorMessage }}
    </div>
    
    <div class="review-queue-content flex gap-6" v-if="!isLoading || selectedItemId">
      <!-- 列表侧边栏 -->
      <div class="review-list w-2/5 bg-white rounded-lg shadow overflow-hidden">
        <div class="p-3 bg-indigo-50 border-b border-indigo-100">
          <h3 class="font-medium text-indigo-800">待审核列表</h3>
        </div>
        <div class="overflow-y-auto max-h-[600px]">
          <div 
            v-for="item in reviewItems" 
            :key="item.id" 
            @click="selectItem(item.id)"
            class="review-item p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors"
            :class="{'bg-indigo-50': selectedItemId === item.id}"
          >
            <div class="flex justify-between items-start">
              <div class="text-sm font-medium text-gray-800 line-clamp-1">{{ item.originalQuery }}</div>
              <div class="text-xs text-gray-500">{{ formatDate(item.timestamp) }}</div>
            </div>
            
            <div class="flex items-center mt-2 space-x-2">
              <span class="text-xs px-2 py-0.5 rounded" :class="getStatusClass(item.status)">
                {{ getStatusText(item.status) }}
              </span>
              <span class="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">{{ item.source }}</span>
            </div>
          </div>
          
          <div v-if="reviewItems.length === 0" class="p-6 text-center text-gray-500">
            暂无匹配的审核项
          </div>
        </div>
      </div>
      
      <!-- 审核表单 -->
      <div class="review-form flex-1 bg-white rounded-lg shadow overflow-hidden">
        <div v-if="selectedItem" class="p-6">
          <div class="mb-6">
            <h3 class="text-lg font-medium text-gray-900 mb-1">原始用户问题</h3>
            <div class="border border-gray-100 rounded-lg p-3 bg-gray-50 text-gray-700">
              {{ selectedItem.originalQuery }}
            </div>
          </div>
          
          <div v-if="selectedItem.currentAnswer" class="mb-6">
            <h3 class="text-lg font-medium text-gray-900 mb-1">系统当前回答</h3>
            <div class="border border-gray-100 rounded-lg p-3 bg-gray-50 text-gray-700 whitespace-pre-line">
              {{ selectedItem.currentAnswer }}
            </div>
          </div>
          
          <div class="mb-6">
            <h3 class="text-lg font-medium text-gray-900 mb-1">标准问题</h3>
            <input
              type="text"
              v-model="editForm.standardQuestion"
              class="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="输入规范化的标准问题"
            />
          </div>
          
          <div class="mb-6">
            <h3 class="text-lg font-medium text-gray-900 mb-1">标准答案</h3>
            <textarea
              v-model="editForm.standardAnswer"
              rows="6"
              class="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="输入标准答案内容"
            ></textarea>
          </div>
          
          <div class="metadata-section mb-6">
            <h3 class="text-lg font-medium text-gray-900 mb-4">元数据</h3>
            
            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 mb-1">标签</label>
              <div class="flex flex-wrap gap-2 mb-2">
                <div
                  v-for="tag in editForm.tags"
                  :key="tag"
                  class="bg-indigo-50 text-indigo-700 text-sm px-2 py-1 rounded-md flex items-center"
                >
                  <span>{{ tag }}</span>
                  <button @click="removeTag(tag)" class="ml-1 text-indigo-500 hover:text-indigo-700">
                    <span class="text-xs">×</span>
                  </button>
                </div>
              </div>
              <div class="flex">
                <input
                  type="text"
                  v-model="editForm.newTag"
                  class="flex-1 border border-gray-300 rounded-l-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="添加标签"
                  @keyup.enter="addTag"
                />
                <button
                  @click="addTag"
                  class="px-3 py-2 bg-indigo-600 text-white rounded-r-lg hover:bg-indigo-700 text-sm"
                >
                  添加
                </button>
              </div>
              <div class="mt-2 flex flex-wrap gap-1">
                <button
                  v-for="tag in availableTags"
                  :key="tag"
                  @click="editForm.newTag = tag; addTag()"
                  class="text-xs px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded"
                  v-show="!editForm.tags.includes(tag)"
                >
                  {{ tag }}
                </button>
              </div>
            </div>
            
            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 mb-1">关键词</label>
              <div class="flex flex-wrap gap-2 mb-2">
                <div
                  v-for="keyword in editForm.keywords"
                  :key="keyword"
                  class="bg-green-50 text-green-700 text-sm px-2 py-1 rounded-md flex items-center"
                >
                  <span>{{ keyword }}</span>
                  <button @click="removeKeyword(keyword)" class="ml-1 text-green-500 hover:text-green-700">
                    <span class="text-xs">×</span>
                  </button>
                </div>
              </div>
              <div class="flex">
                <input
                  type="text"
                  v-model="editForm.newKeyword"
                  class="flex-1 border border-gray-300 rounded-l-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="添加关键词"
                  @keyup.enter="addKeyword"
                />
                <button
                  @click="addKeyword"
                  class="px-3 py-2 bg-green-600 text-white rounded-r-lg hover:bg-green-700 text-sm"
                >
                  添加
                </button>
              </div>
            </div>
            
            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 mb-1">有效期限</label>
              <input
                type="date"
                v-model="editForm.expirationDate"
                class="border border-gray-300 rounded-lg p-2 w-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            
            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 mb-1">审核备注</label>
              <textarea
                v-model="editForm.comment"
                rows="2"
                class="w-full border border-gray-300 rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="添加审核备注（可选）"
              ></textarea>
            </div>
          </div>
          
          <div class="action-buttons flex space-x-3">
            <button
              @click="approveItem(false)"
              class="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex-1"
              title="确认当前编辑的'标准问题'和'标准答案'无误，可以加入知识库"
              :disabled="isLoading"
            >
              批准
            </button>
            <button
              @click="approveItem(true)"
              class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex-1"
              title="保存当前修改并批准加入知识库"
              :disabled="isLoading"
            >
              保存并批准
            </button>
            <button
              @click="rejectItem"
              class="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 flex-1"
              title="认为此条目不适合加入知识库，或暂时不处理"
              :disabled="isLoading"
            >
              拒绝/忽略
            </button>
            <button
              @click="needMoreInfo"
              class="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 flex-1"
              title="如果审核员无法独立判断，可以标记需要更多信息"
              :disabled="isLoading"
            >
              需要更多信息
            </button>
          </div>
        </div>
        
        <div v-else class="h-full flex items-center justify-center">
          <div class="text-center text-gray-400">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <p class="text-lg">从左侧列表中选择一个项目进行审核</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.review-queue-container {
  font-family: system-ui, -apple-system, sans-serif;
}

/* 使文本内容实现换行显示 */
.whitespace-pre-line {
  white-space: pre-line;
}

/* 限制文本行数 */
.line-clamp-1 {
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;  
  overflow: hidden;
}

/* 禁用按钮样式 */
button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

/* 加载动画 */
.animate-pulse-fast {
  animation: pulse 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: .5;
  }
}
</style>