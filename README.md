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

## 项目结构

```
/
├── public/                # 静态资源
├── src/
│   ├── assets/            # 图片等资产文件
│   ├── components/        # 可复用组件
│   │   ├── InteractiveQueryDemo.vue  # 智能问答演示组件
│   │   └── AgentAssistDemo.vue       # 客服辅助演示组件
│   ├── App.vue            # 主应用组件
│   ├── main.ts            # 应用入口
│   └── reportData.ts      # 演示数据
├── index.html             # HTML 模板
├── package.json           # 项目配置
├── tsconfig.json          # TypeScript 配置
└── vite.config.ts         # Vite 配置
```

## 如何进行开发

1. 在 `reportData.ts` 中添加或修改演示数据
2. 修改 `components` 目录下的组件以更新演示功能
3. 修改 `App.vue` 以更改整体布局或导航结构

## 未来规划

本项目计划进一步发展，添加更多智能客服功能演示，包括：
- 情感分析与个性化响应
- 预测性服务示例
- 多渠道协同服务演示

## 了解更多

有关智能客服系统更详细的信息，请参考 `智能客服系统调研报告.txt` 文件，它提供了关于这类系统架构、工作流程、优势和未来发展趋势的全面分析。

## 许可证

[MIT](LICENSE)
