# API 文档

本文档详细描述了智能客服系统项目所使用的全部 API 接口，旨在为后端开发人员提供清晰的对接规范。

## 基础 URL

所有 API 的基础 URL 均托管在 `http://localhost:3000`。该服务由 `json-server` 提供，数据源为项目根目录下的 `db.json` 文件。

## 核心 API

### 1. 报告内容 API

*   **Endpoint**: `GET /reports`
*   **方法**: `GET`
*   **描述**: 获取用于构建主应用界面所有章节（Section）的数据。每个章节包含标题、内容以及可能需要动态加载的组件。
*   **成功响应 (200 OK)**:
    *   **类型**: `application/json`
    *   **内容**: 一个 `ReportSection` 对象数组。
    ```json
    [
      {
        "id": "intro",
        "title": "1. 概念介绍",
        "mainTitle": "1. 慧装易助概念介绍",
        "content": [
          {
            "type": "paragraph",
            "text": "欢迎来到 慧装易助..."
          }
        ]
      },
      {
        "id": "interactive-query",
        "title": "2. 功能：智能问答",
        "mainTitle": "2. 功能：慧装易助智能问答与建议",
        "demoComponent": "InteractiveQueryDemo",
        "content": [
          {
            "type": "paragraph",
            "text": "此场景模拟客户提出一个常见问题..."
          }
        ]
      }
    ]
    ```

### 2. 审核队列 API

*   **Endpoint**: `GET /review-queue`
*   **方法**: `GET`
*   **描述**: 获取所有待审核项的数据列表，用于“审核队列”功能。
*   **成功响应 (200 OK)**:
    *   **类型**: `application/json`
    *   **内容**: 一个 `ReviewQueueItem` 对象数组。
    ```json
    [
      {
        "id": "1",
        "source": "用户提问-系统未答出",
        "originalQuery": "我想了解贵公司的退货政策...",
        "status": "pending"
      }
    ]
    ```

*   **Endpoint**: `PATCH /review-queue/:id`
*   **方法**: `PATCH`
*   **描述**: 更新指定 ID 的审核项。可用于修改状态、内容、元数据等。
*   **URL 参数**:
    *   `id` (string, required): 要更新的审核项 ID。
*   **请求体**:
    *   **类型**: `application/json`
    *   **内容**: 一个包含 `ReviewQueueItem` 部分属性的对象。
    ```json
    {
      "status": "approved",
      "standardQuestion": "退货政策咨询",
      "metadata": { "tags": ["退货", "售后"] }
    }
    ```
*   **成功响应 (200 OK)**:
    *   **内容**: 更新后的 `ReviewQueueItem` 对象。

### 3. 知识库问答 API

*   **Endpoint**: `GET /service-qa`
*   **方法**: `GET`
*   **描述**: 获取用于“智能问答”功能的全部知识库问答(QA)数据。
*   **成功响应 (200 OK)**:
    *   **类型**: `application/json`
    *   **内容**: 一个 `ServiceQA` 对象数组。
    ```json
    [
      {
        "id": "1",
        "question": "我的定制家具尺寸有偏差...",
        "answer": "您好，我了解您的情况..."
      }
    ]
    ```

### 4. 客服实时辅助 API

*   **Endpoint**: `POST /agent-assist`
*   **方法**: `POST`
*   **描述**: 模拟一个接收客服实时输入并返回辅助建议的 AI 服务。
*   **请求体**:
    *   **类型**: `application/json`
    *   **内容**: `AssistRequest` 对象。
    ```json
    {
      "context": {
        "sessionId": "demo-session-123",
        "agentId": "agent-456",
        "dialogueHistory": [
          { "sender": "customer", "content": "我的订单还没发货吗？" }
        ]
      },
      "currentDraft": "您好，关于您的问题，我需要先查询一下",
      "assistType": "auto"
    }
    ```
*   **成功响应 (200 OK)**:
    *   **类型**: `application/json`
    *   **内容**: `AssistResponse` 对象，其中包含建议和分析结果。
    ```json
    {
      "code": 200,
      "message": "Success",
      "data": {
        "suggestions": [
          { "type": "completion", "content": "请您提供一下订单号。" }
        ],
        "complianceAnalysis": { "hasIssues": false, "issues": [] }
      }
    }
    ```

## 数据模型

*(详细的数据模型定义请参考 `src/services/api.types.ts`)* 