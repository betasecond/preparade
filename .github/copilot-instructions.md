# AI 智能体客服演示平台 - AI 编程助手指引
## 重点提示
注意 每次大功能 你需要构建TODO list并随时确认.每次小功能完成后 你都需要谨慎的git add（不准使用git add .） 和 commit 并提供清晰的 commit message. 每次提交都需要确保代码质量和功能完整性。
## 项目概览

这是一个 Vue 3 + TypeScript 构建的智能客服概念验证演示平台，展示 AI 如何辅助人工客服工作。项目名为 "Preparade"，核心目标是展示将客户服务从"成本中心"转变为"利润中心"的 AI 解决方案。

## 架构核心

### 数据驱动的内容渲染系统
- **中心数据源**: `src/reportData.ts` 定义所有演示内容和组件映射
- **动态组件加载**: `App.vue` 根据 `ReportContentItem.type` 和 `demoComponent` 字段动态渲染组件
- **类型系统**: 强类型化的 `ReportSection` 和 `ReportContentItem` 接口确保内容结构一致性

### 三大核心演示组件
1. **InteractiveQueryDemo**: 智能问答演示，使用 CSV 数据进行实时问题匹配
2. **AgentAssistDemo**: 客服辅助演示，基于规则引擎的实时反馈系统
3. **ReviewQueueDemo**: 审核队列演示，复杂的状态管理和筛选系统

## 关键开发模式

### CSV 数据集成模式
```typescript
// 在 InteractiveQueryDemo.vue 中
import csvData from './客服客诉对接话术-数据集.csv?raw';
```
- 使用 Vite 的 `?raw` 导入获取原始 CSV 内容
- 运行时解析 CSV，避免构建时处理复杂性
- 实现简单的关键词匹配算法进行问答匹配

### 响应式状态管理模式
```typescript
// 标准模式：ref 用于简单状态，reactive 用于复杂对象
const items = ref<Item[]>([]);
const editForm = reactive({
  field1: '',
  field2: []
});
```

### TailwindCSS 设计系统
- **颜色系统**: 主要使用 `indigo` 系列作为主色调，`slate` 系列作为文本色
- **状态颜色映射**: 
  - 成功/批准: `green-*`
  - 警告/待处理: `yellow-*` 或 `amber-*`
  - 错误/拒绝: `red-*`
  - 信息: `blue-*`
- **响应式断点**: 使用 `md:` 前缀进行桌面端适配

### 组件通信模式
- **Props down**: 通过 `reportData.ts` 集中管理所有演示数据
- **Events up**: 组件内部状态变化不向上传递，保持演示独立性
- **局部状态**: 每个演示组件管理自己的交互状态

## 关键开发约定

### 文件组织
- **组件文件**: 单文件组件 (.vue)，使用 `<script setup>` 语法
- **类型定义**: 集中在 `reportData.ts` 中，导出所有相关接口
- **样式**: 纯 TailwindCSS，避免 scoped styles（除自定义滚动条外）

### 命名约定
- **变量**: camelCase，如 `customerQuery`, `aiResponse`
- **组件**: PascalCase，如 `InteractiveQueryDemo`
- **CSS 类**: TailwindCSS 原生类名
- **函数**: camelCase，动词开头，如 `getAISuggestion`, `analyzeAgentInput`

### TypeScript 使用模式
```typescript
// 明确的接口定义
interface ServiceQA {
  index: number;
  question: string;
  answer: string;
  keywords?: string[];
}

// 泛型 ref 类型声明
const data = ref<ServiceQA[]>([]);
const response = ref<{ keywords: string; suggestedReply: string } | null>(null);
```

## 核心工作流

### 开发服务器
```bash
pnpm dev  # 启动开发服务器在 localhost:5173
```

### 构建和预览
```bash
pnpm build    # TypeScript 编译 + Vite 构建
pnpm preview  # 预览生产构建
```

### 添加新演示组件
1. 在 `src/components/` 创建新组件
2. 在 `reportData.ts` 的 `ReportContentItem` 接口中添加新的 `demoComponent` 值
3. 在 `App.vue` 中添加相应的 `v-if` 条件渲染
4. 在 `reportData` 数组中添加演示内容配置

### CSV 数据处理模式
当处理新的 CSV 数据源时：
1. 将 CSV 文件放在 `src/components/` 目录
2. 使用 `import csvData from './filename.csv?raw'` 导入
3. 实现解析函数处理 CSV 格式差异
4. 创建相应的 TypeScript 接口定义数据结构

## 特殊注意事项

### 中文本地化
- 项目完全中文化，包括变量名使用中文描述性注释
- 日期格式使用 `zh-CN` 本地化
- CSV 文件名可能包含中文字符

### 演示性质的设计决策
- 所有 API 调用都是模拟的，使用 `setTimeout` 模拟延迟
- 数据不需要持久化，刷新页面重置状态
- 专注于 UI 交互演示，不需要真实的后端集成

### 性能考虑
- CSV 解析在组件挂载时进行，适合演示规模的数据量
- 使用计算属性进行实时筛选和排序
- TailwindCSS 的 purge 配置确保生产构建体积优化

这个项目是概念验证演示，重点在于展示智能客服系统的交互模式和用户体验，而非生产级的性能和可扩展性。在开发时请保持演示的流畅性和视觉效果的专业性。
