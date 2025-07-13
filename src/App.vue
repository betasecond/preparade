<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import type { ReportSection } from './reportData';
import { getReports } from './api';
import InteractiveQueryDemo from './components/InteractiveQueryDemo.vue';
import AgentAssistDemo from './components/AgentAssistDemo.vue';
import ReviewQueueDemo from './components/ReviewQueueDemo.vue';

const reportSections = ref<ReportSection[]>([]);
const selectedSectionId = ref<string>(''); 

onMounted(async () => {
  try {
    const data = await getReports();
    reportSections.value = data;
    if (data.length > 0) {
      selectedSectionId.value = data[0].id;
    }
  } catch (error) {
    console.error('Failed to fetch report sections:', error);
    // Optionally, set an error state to show in the UI
  }
});

const currentSection = computed(() => {
  return reportSections.value.find(sec => sec.id === selectedSectionId.value) || null;
});

const formatText = (text: string): string => {
  if (!text) return '';
  return text.replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-slate-700">$1</strong>');
};
</script>

<template>
  <div class="flex h-screen bg-gray-100">
    <aside class="w-72 bg-slate-800 text-slate-100 p-6 space-y-2 overflow-y-auto shadow-lg">
      <h1 class="text-3xl font-bold mb-8 border-b border-slate-700 pb-3 text-indigo-400">
        Copilot 演示
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
            <ReviewQueueDemo v-if="item.demoComponent === 'ReviewQueueDemo'" />
          </div>
        </div>
      </div>
      <div v-else class="text-center text-gray-500 mt-20">
        <p class="text-2xl">请从左侧选择一个演示模块或章节。</p>
      </div>
    </main>
  </div>
</template>

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
