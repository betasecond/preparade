# AI 智能体客服平台 - AI 编程助手指引

你好，AI 编程助手！欢迎来到 “Preparade” 项目。

这是一个 Vue 3 + TypeScript 构建的智能客服概念验证平台，展示 AI 如何辅助人工客服工作。项目名为 "Preparade"，核心目标是展示将客户服务从"成本中心"转变为"利润中心"的 AI 解决方案。

## 核心架构与数据流

- **前端框架**: Vue 3 (组合式 API) + TypeScript
- **UI**: Tailwind CSS
- **构建工具**: Vite
- **模拟后端**: `json-server`
- **中心数据源**: `db.json` 文件通过 `json-server` 提供 API。
- **API 服务**: 所有 API 请求都通过 `src/api/index.ts` 中的函数进行封装。

### 三大核心功能组件

1.  **InteractiveQueryDemo**: 智能问答功能，使用 `db.json` 数据进行实时问题匹配。
2.  **AgentAssistDemo**: 客服辅助功能，基于规则引擎的实时反馈系统。
3.  **ReviewQueueDemo**: 审核队列功能，复杂的状态管理和筛选系统。

## 开发模式

### 数据流哲学

- **API First**: 所有前端功能都基于预先定义好的 API (`db.json` 的结构) 进行开发。
- **Props down**: 通过 `db.json` -> API -> `App.vue` -> Props 的方式将数据传递给子组件。
- **Events up**: 组件内部状态变化不向上传递，保持功能独立性。
- **局部状态**: 每个功能组件管理自己的交互状态（例如，输入框内容、加载状态、API 响应）。

### 代码风格与规范

- **TypeScript**: 请始终使用强类型，为所有变量、函数参数和返回值添加明确的类型。
- **组合式 API**: 使用 `<script setup>` 语法糖，这是当前 Vue 3 的最佳实践。
- **Tailwind CSS**: 直接在模板中使用原子类。避免编写自定义的 CSS，除非绝对必要。
- **组件拆分**: 保持组件的单一职责原则。如果一个组件变得过于复杂，请考虑将其拆分为更小的、可复用的子组件。
- **API 封装**: 所有与后端（即 `json-server`）的交互都必须在 `src/api/index.ts` 中定义为独立的、可复用的函数。

## 常见任务

### 修改现有功能

1.  **定位组件**: 根据功能描述，在 `src/components` 目录下找到对应的 `.vue` 文件。
2.  **修改逻辑**: 在 `<script setup>` 中调整数据处理或业务逻辑。
3.  **调整 UI**: 在 `<template>` 中修改布局或样式。
4.  **数据变更**: 如果需要修改数据，请直接编辑 `db.json` 文件。

### 添加新功能模块

1.  **创建新组件**: 在 `src/components` 目录下创建一个新的 `.vue` 文件。
2.  **定义数据**: 在 `db.json` 中为新功能添加数据源（如果需要）。
3.  **创建 API**: 在 `src/api/index.ts` 中添加调用新数据源的函数。
4.  **配置路由/渲染**:
    *   在 `db.json` 的 `reports` 数组中添加新功能的内容配置。
    *   在 `App.vue` 中导入新组件，并确保它能被动态渲染。

## 重要提示

### 功能性质的设计决策

- **UI 交互优先**: 这是概念验证平台，重点在于UI交互，而非生产级性能。
- **模拟逻辑**: 许多“AI”功能（如文本匹配）都是在前端用 TypeScript 简化的逻辑模拟的。
- **数据简单性**: `db.json` 的数据结构被设计为易于理解和修改。

在开发时，请保持代码的清晰性、可读性，并严格遵循上述规范。感谢你的协助！
