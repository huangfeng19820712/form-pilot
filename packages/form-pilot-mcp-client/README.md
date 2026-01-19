# @huangfeng19820712/form-pilot-mcp-client

面向企业的前端 MCP 客户端，安全地让 AI 通过受控工具操作真实 Vue 表单。该包是 AI/MCP 与 `@huangfeng19820712/form-pilot-vue` 之间的安全桥梁，强制权限、字段级防护、提交确认，并对每一次 AI 操作进行结构化审计。

## 依赖

- 运行时
  - `vue`（peer）：Vue 2.6+ 或 Vue 3.3+
  - `vue-demi`：统一 Vue2/Vue3 访问层
  - `@huangfeng19820712/form-pilot-vue`：唯一表单接入层（业务仅依赖此包与 MCP 客户端）
- 工作区内部
  - `@huangfeng19820712/form-pilot-core`：表单语义与适配器契约（不直接暴露给业务）

> 不包含后端、AI 决策或 MCP 服务端实现。该包仅在前端执行受控工具调用。

## 安装

- Monorepo（当前工作区）

```bash
pnpm install
```

- 外部项目（发布后）

```bash
pnpm add @huangfeng19820712/form-pilot-mcp-client @huangfeng19820712/form-pilot-vue vue-demi
```

确保你的应用依赖了 `vue`（2 或 3）与对应 UI 表单库；AI 仅通过 MCP 工具操作，不直接访问 DOM。

## 快速使用

1) 在 Vue 应用中创建表单句柄（仅示例，实际表单由你的 UI 库提供）：

```ts
import { useAiForm } from '@huangfeng19820712/form-pilot-vue'

const formHandle = () => useAiForm(formRef, { id: 'userCreate' })
```

2) 创建 MCP 客户端并配置守卫与审计：

```ts
import { MCPClient } from '@huangfeng19820712/form-pilot-mcp-client'

const client = new MCPClient({
  actor: 'ai-bot',
  guards: {
    userCreate: {
      allowedFields: ['name', 'email'],
      canWrite: (fieldId, value) => true,
    },
  },
  clientGuard: {
    submitRequiresConfirm: true,
    confirm: async (formId) => window.confirm(`确认提交 ${formId} ?`),
  },
  onAudit: (entry) => console.log('AUDIT', entry),
})
```

3) 注册可由 AI 操作的表单：

```ts
client.registerForm('userCreate', formHandle)
```

4) 连接 MCP Server（二选一）：

```ts
// WebSocket：前端可直接发送工具执行结果回服务端
client.connectWS('wss://mcp.example.com/tools')

// SSE：服务端下发工具调用，前端通过回调回传结果
client.connectSSE('/mcp/tools', (result) => sendBack(result))
```

5) 可选：本地触发工具（无需网络）

```ts
await client.dispatch({ tool: 'setFormValues', params: { formId: 'userCreate', values: { name: 'Alice' } } })
```

## 工具与返回结构

所有工具返回 `{ success: boolean, data?, error? }`，失败不抛出框架内部错误。

- `getFormSchema(formId)`
  - 读取规范化表单 schema（字段、类型、必填等），仅用于 AI 理解与计划
- `setFormValues(formId, values)`
  - 字段级允许列表与可写校验，屏蔽不允许的字段并返回 `blockedFields`
- `validateForm(formId)`
  - 执行表单校验，返回 `issues` 与整体 `valid`
- `submitForm(formId)`
  - 需要显式确认（若开启），返回提交结果 `ok/data/error`

## 权限与安全

- 字段级守卫
  - `allowedFields`: 允许 AI 写入的字段白名单
  - `canWrite(fieldId, value)`: 每字段的动态可写策略（可用于权限/风控）
- 提交确认
  - `submitRequiresConfirm`: 开启后，AI 提交必须二次确认
  - `confirm(formId)`: 自定义确认逻辑（弹窗/策略服务等）
- 无 DOM 访问
- 表单操作全部通过 `@huangfeng19820712/form-pilot-vue` 的句柄方法委托，实现兼容 Vue2/Vue3

## 审计日志

- 每次工具调用都会记录：`timestamp/actor/formId/action/fields/values`
- 通过 `onAudit(entry)` 钩子转发到外部审计系统（SIEM、日志平台等）

示例：

```ts
const client = new MCPClient({
  onAudit: (entry) => sendToSIEM(entry),
})
```

## 运行与开发

- 工作区脚本

```bash
pnpm -w run typecheck
pnpm -w run build
```

- 仅构建 MCP 客户端

```bash
pnpm --filter @huangfeng19820712/form-pilot-mcp-client run typecheck
pnpm --filter @huangfeng19820712/form-pilot-mcp-client run build
```

- 在应用中调试
  - 用真实表单实例创建 `useAiForm(formRef, options)` 句柄
  - `registerForm(formId, handleOrGetter)` 注册到客户端
  - 通过 `connectWS/connectSSE` 接入你的 MCP 服务端路由

## 扩展开发

- 新增工具
  - 按 `src/tools/*` 的结构添加新工具函数，并在 `MCPClient.dispatch` 中路由与审计
- 自定义守卫
  - 扩展 `guards[formId]` 的策略函数（例如角色/组织权限），或在 `dispatch` 前做外置校验
- 审计集成
  - 使用 `onAudit` 将日志统一接入企业审计/风控平台
- 传输层
  - `ws.ts/sse.ts` 为最小可用实现，可替换为你的通讯库（保持消息格式 `{ tool, params, actor }`）

## 约束与边界

- 不实现或暴露 `@huangfeng19820712/form-pilot-core` 细节，业务仅通过 `@huangfeng19820712/form-pilot-vue` 与本包交互
- 不硬编码任何 UI 库 API；兼容由适配器支持的表单实现
- 不实现 AI 决策或后端服务；本包仅执行受控工具调用

---

如需在你的表单系统中启用 AI 操作：先用 `@huangfeng19820712/form-pilot-vue` 将真实表单接入，再用 `MCPClient` 开启受控工具能力与审计。该方案在 Vue2/Vue3 下保持一致 API，满足企业级的权限与合规要求。