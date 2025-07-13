# Preparade: 智能客服系统 (Copilot) 概念验证演示平台

<div align="center">
  <img src="./public/vite.svg" alt="Preparade Logo" width="120">
  <h3>客服系统智能化解决方案展示</h3>
</div>

## 项目背景与意义

传统客户服务模式在当今快节奏环境中面临诸多挑战：
- 客户期待即时响应（24小时响应已无法满足当前需求）
- 客户厌恶在不同客服间辗转重复问题（61%的客户不喜欢重复叙述问题）
- 企业在预算缩减的同时，需要提高服务质量
- 缺乏一致性和数据孤岛问题严重影响客户体验

本演示项目展示了 AI Copilot 智能客服系统如何解决这些难题，将客户服务从传统的"成本中心"转变为有潜力的"利润中心"。AI Copilot 作为人工客服的"倍增器"，能够增强效率、提高一致性并实现规模化服务，同时让人工客服专注于更复杂和高价值的互动。

## 功能演示

本项目提供两个主要演示模块：

1. **智能问答演示** - 展示 AI 如何分析客户问题并提供精准回复建议
2. **客服辅助演示** - 展示 AI 如何为客服提供实时支持和信息

## 快速开始

### 环境要求

- Node.js (推荐 v18+)
- pnpm (推荐) 或 npm

### 安装步骤

1. 克隆项目仓库:
```bash
git clone https://github.com/betasecond/preparade.git
cd preparade
git checkout 0.0.5a
```

2. 安装依赖:
```bash
# 使用 pnpm (推荐)
pnpm install

# 或使用 npm
npm install
```

3. 启动开发服务器:
```bash
pnpm dev
# 或
npm run dev
```

4. 在浏览器中访问:
```
http://localhost:5173/
```

### 启动模拟 API 服务器

为了使应用能够获取数据，请在项目根目录打开一个新的终端窗口，并运行以下命令来启动 `json-server` 模拟后端：

```bash
pnpm server
# 或
npm run server
```

此服务器将运行在 `http://localhost:3000`。

## 构建生产版本

```bash
pnpm build
# 或
npm run build
```

构建完成后，可以使用以下命令预览生产版本:

```bash
pnpm preview
# 或
npm run preview
```

## 技术栈

- Vue 3 - 前端框架
- TypeScript - 类型安全
- Vite - 构建工具和开发服务器
- TailwindCSS - UI 样式
- Axios - HTTP 请求客户端
- json-server - 模拟 REST API 服务器

## API 参考

本项目使用 `json-server` 模拟后端 API，数据源为根目录下的 `db.json` 文件。

### 报告模块 (`/reports`)

- **GET `/reports`**
  - **描述**: 获取所有报告板块的数据。
  - **响应示例**:
    ```json
    [
      {
        "id": "2024-q1-summary",
        "title": "2024年Q1客服中心运营效率报告",
        "reportContent": [
          {
            "id": "interactive-query",
            "title": "智能问答机器人",
            "description": "演示 AI 如何赋能一线客服，提供实时、精准的客户问题解答支持。",
            "demoComponent": "InteractiveQueryDemo"
          }
        ]
      }
    ]
    ```

### 审核队列模块 (`/reviewQueue`)

- **GET `/reviewQueue`**
  - **描述**: 获取所有待审核的客服对话记录。
- **GET `/reviewQueue/:id`**
  - **描述**: 根据 ID 获取单个审核项。
- **PATCH `/reviewQueue/:id`**
  - **描述**: 更新审核项的状态（例如，将 `status` 更新为 `approved` 或 `rejected`）。
  - **请求体示例**:
    ```json
    {
      "status": "approved",
      "reviewedBy": "张三"
    }
    ```

### 智能问答知识库 (`/serviceQA`)

- **GET `/serviceQA`**
  - **描述**: 获取用于“智能问答”演示的知识库问答对。
  - **响应示例**:
    ```json
    [
      {
        "id": 1,
        "question": "如何修改我的账户密码？",
        "answer": "您可以通过【个人中心】-【账户设置】-【修改密码】来重设您的密码。"
      }
    ]
    ```

## 项目结构

```
/
├── public/                # 静态资源
├── src/
│   ├── api/               # API 服务层
│   │   └── index.ts       # Axios 实例和 API 请求函数
│   ├── assets/            # 图片等资产文件
│   ├── components/        # 可复用组件
│   │   ├── InteractiveQueryDemo.vue  # 智能问答演示组件
│   │   ├── ReviewQueueDemo.vue       # 质检队列演示组件
│   │   └── AgentAssistDemo.vue       # 客服辅助演示组件
│   ├── App.vue            # 主应用组件
│   ├── main.ts            # 应用入口
│   └── reportData.ts      # 共享的 TypeScript 类型定义
├── .gitignore
├── db.json                # 模拟 API 数据源
├── index.html             # HTML 模板
├── package.json           # 项目配置
├── tsconfig.json          # TypeScript 配置
└── vite.config.ts         # Vite 配置
```

## 如何进行开发

当前项目的数据流已通过 `json-server` 进行模拟。开发流程如下：

1. **修改数据**: 直接编辑根目录下的 `db.json` 文件来添加或修改用于演示的数据。
2. **扩展 API**: 如果需要新的数据接口，可以在 `db.json` 中添加新的一级键，`json-server` 会自动创建对应的 RESTful API 路由。
3. **更新前端组件**: 修改 `src/components/` 目录下的 Vue 组件以实现新的业务逻辑或 UI 界面。
4. **调用 API**: 在 `src/api/index.ts` 中添加新的函数来调用 API，并在组件中使用这些函数获取或更新数据。

## 未来规划

本项目计划进一步发展，添加更多智能客服功能演示，包括：
- 情感分析与个性化响应
- 预测性服务示例
- 多渠道协同服务演示

## 了解更多

有关智能客服系统更详细的信息，请参考 `智能客服系统调研报告.txt` 文件，它提供了关于这类系统架构、工作流程、优势和未来发展趋势的全面分析。

## 许可证

[MIT](LICENSE)
