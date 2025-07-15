# Preparade: 智能客服系统 (Copilot) 概念验证平台

这是一个基于 Vue 3, TypeScript, 和 Tailwind CSS 构建的 AI 智能体客服概念验证（PoC）项目。它通过模拟真实客服场景，展示了如何利用大语言模型（LLM）与本地知识库结合，为一线客服人员提供实时、精准、合规的辅助。

## 项目核心价值

在当今竞争激烈的市场中，卓越的客户服务是企业脱颖而出的关键。然而，传统客服中心面临着培训成本高、服务质量不一、高峰期响应慢等诸多挑战。

本项目展示了 AI 慧装易助智能客服系统如何解决这些难题，将客户服务从传统的"成本中心"转变为有潜力的"利润中心"。AI 慧装易助作为人工客服的"倍增器"，能够增强效率、提高一致性并实现规模化服务，同时让人工客服专注于更复杂和高价值的互动。

## 功能模块

本项目提供三个主要功能模块：

1.  **智能问答** - 展示 AI 如何分析客户问题并提供精准回复建议
2.  **客服辅助** - 展示 AI 如何为客服提供实时支持和信息
3.  **审核队列** - 模拟知识库的质量控制和内容迭代流程

## 技术栈

*   **前端**: Vue 3 (组合式 API), TypeScript, Vite, Tailwind CSS
*   **模拟后端**: `json-server`
*   **数据**: `db.json` 作为数据源

## API 概览

所有接口均通过 `axios` 与模拟后端 `http://localhost:3000` 进行通信。

### `GET /reports`

*   **描述**: 获取所有报告章节和内容的定义，用于动态渲染左侧导航和主内容区。
*   **响应体**: `ReportSection[]`
    *   `id`: 章节的唯一标识符
    *   `title`: 导航栏中显示的标题
    *   `mainTitle`: 主内容区显示的大标题
    *   `demoComponent` (可选): 需要渲染的Vue组件名
    *   `content`: 包含段落、列表、标题等内容的数组。

### `GET /review-queue`

*   **描述**: 获取“审核队列”模块的待办事项列表。
*   **响应体**: `ReviewQueueItem[]`

### `PATCH /review-queue/:id`

*   **描述**: 更新指定ID的审核项状态或内容。
*   **请求体**: `Partial<ReviewQueueItem>`

### `GET /service-qa`

*   **描述**: 获取用于“智能问答”功能的知识库问答对。
*   **响应体**: `ServiceQA[]`

### `POST /agent-assist`

*   **描述**: 接收客服的实时输入，并返回辅助建议。
*   **请求体**: `AssistRequest`
    *   `context`: 包含会话历史的上下文对象
    *   `currentDraft`: 客服当前输入的文本
*   **响应体**: `AssistResponse`
    *   `suggestions`: 包含补全、情感、合规等类型的建议
    *   `complianceAnalysis`: 合规性分析结果

## 项目结构

```
project-root/
├── public/
├── src/
│   ├── api/
│   │   └── index.ts              # API 请求封装
│   ├── assets/                   # 静态资源
│   ├── components/
│   │   ├── InteractiveQueryDemo.vue  # 智能问答功能组件
│   │   ├── ReviewQueueDemo.vue       # 质检队列功能组件
│   │   └── AgentAssistDemo.vue       # 客服辅助功能组件
│   ├── services/                 # 业务逻辑服务
│   ├── App.vue                   # 主应用组件
│   └── main.ts                   # 应用入口
├── db.json                       # 模拟后端数据
├── package.json
└── vite.config.ts
```

## 本地运行

1.  **安装依赖**:
    ```bash
    pnpm install
    ```

2.  **启动模拟后端**:
    ```bash
    pnpm server
    ```
    此命令会启动一个在 `http://localhost:3000` 监听的 `json-server`。

3.  **启动前端开发服务器**:
    ```bash
    pnpm dev
    ```
    应用将在 `http://localhost:5173` (或另一个可用端口) 上可用。

## 如何贡献

1.  **修改数据**: 直接编辑根目录下的 `db.json` 文件来添加或修改用于展示的数据。
2.  **新增组件**: 在 `src/components` 目录下创建新的 `.vue` 文件。
3.  **集成新组件**:
    *   在 `App.vue` 中导入新组件。
    *   修改 `db.json` 中的 `reports` 数据，添加新的章节，并在 `demoComponent` 字段中指定新组件的名称。

## 未来规划

本项目计划进一步发展，添加更多智能客服功能，包括：

*   用户画像分析
*   服务质检自动化
*   多渠道协同服务
*   更复杂的对话流管理

---

*该项目由 AI 编程助手辅助开发。*
