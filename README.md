# FormPilot Monorepo

面向企业的 AI 驱动表单基础设施。FormPilot 将真实 Vue 表单安全地接入到 AI/MCP 控制层，确保不触碰 DOM、不绕过权限，所有操作均可审计与追溯。

## 项目结果概览

- 支持 Vue2 与 Vue3 的统一接入层（`@fhuang/form-pilot-vue`）
- 框架无关的核心表单语义与适配器契约（`@fhuang/form-pilot-core`）
- 前端 MCP 客户端，提供受控工具、权限守卫与审计（`@fhuang/form-pilot-mcp-client`）
- pnpm 工作区，TypeScript 优先，清晰包边界与可扩展架构

## 架构示意

```
---------------------------------------------------------------+
|                          Business Apps                         |
|                 Vue2 / Vue3 (Element / AntD ...)               |
---------------------------+-----------------------------------+
                            | useAiForm(formRef, options)
                            v
---------------------------------------------------------------+
|                 @fhuang/form-pilot-vue (Adapter)               |
| - Vue2/Vue3 统一绑定层（vue-demi）                               |
| - 暴露安全句柄：getSchema / setValues / getValues / validate / submit |
| - 仅桥接，不实现表单语义                                        |
---------------------------+-----------------------------------+
                            | delegate
                            v
---------------------------------------------------------------+
|                 @fhuang/form-pilot-core (Kernel)               |
| - 表单语义：Schema/Normalize/Validate/Submit                   |
| - 适配器契约：对真实表单实例的抽象                              |
| - 生命周期钩子：beforeSet/afterSet/beforeValidate/beforeSubmit |
| - 无框架/无 DOM/无 UI 库耦合                                    |
---------------------------+-----------------------------------+
                            ^
                            |
---------------------------------------------------------------+
|           @fhuang/form-pilot-mcp-client (MCP Layer)            |
| - 受控工具：getFormSchema/setFormValues/validateForm/submitForm |
| - 守卫：字段白名单、可写校验、提交确认                          |
| - 审计：结构化日志，外部钩子转发                                 |
| - 连接：WS/SSE 接收工具调用并安全分发                           |
---------------------------------------------------------------+

约束：AI 仅能通过 MCP 工具操作，不直接访问 DOM；业务不直接依赖 core；所有写入与提交均受守卫与确认保护。
```

## 目录结构

```
form-pilot/
├── package.json
├── pnpm-workspace.yaml
├── tsconfig.base.json
├── packages/
│   ├── form-pilot-core/
│   ├── form-pilot-vue/
│   └── form-pilot-mcp-client/
├── apps/
│   ├── admin-vue2/    (预留)
│   └── admin-vue3/    (预留)
└── docs/              (预留)
```

## 包职责说明

- `@fhuang/form-pilot-core`
  - 内核：表单 schema 抽取/规范化、行为抽象、适配器契约、生命周期钩子
  - 不依赖任何前端框架；仅作为 `@fhuang/form-pilot-vue` 与 `@fhuang/form-pilot-mcp-client` 的内部依赖
- `@fhuang/form-pilot-vue`
  - Vue 接入层：统一 Vue2/Vue3，通过 `useAiForm(formRef, options)` 暴露安全句柄
  - 不实现语义；所有操作委托到核心桥接层
- `@fhuang/form-pilot-mcp-client`
  - MCP 客户端：受控工具暴露、权限守卫、提交确认、审计日志、WS/SSE 连接
  - 仅在需要 AI 操作表单的应用中使用；不让业务直接接触 core

## 快速开始

- 安装依赖

```bash
pnpm install
```

- 类型检查与构建

```bash
pnpm -w run typecheck
pnpm -w run build
```

- Vue 应用集成示例

```ts
import { useAiForm, FormPilotPlugin } from '@fhuang/form-pilot-vue'
import { MCPClient } from '@fhuang/form-pilot-mcp-client'

// 注册适配器与钩子（可选）
app.use(FormPilotPlugin, {
  adapters: [/* 你的适配器描述 */],
  hooks: {
    beforeSet: async ({ instance, next }) => {},
    beforeValidate: async ({ instance }) => {},
    beforeSubmit: async ({ instance }) => {},
  },
})

// 创建表单句柄
const handle = () => useAiForm(formRef, { id: 'userCreate' })

// MCP 客户端配置守卫与审计
const client = new MCPClient({
  actor: 'ai-bot',
  guards: { userCreate: { allowedFields: ['name', 'email'] } },
  clientGuard: { submitRequiresConfirm: true, confirm: async id => window.confirm(`确认提交 ${id}?`) },
  onAudit: entry => sendToSIEM(entry),
})

client.registerForm('userCreate', handle)
client.connectWS('wss://mcp.example.com/tools')
```

## 第三方项目接入指南

- 安装依赖（npm/yarn/pnpm 均可）

```bash
# 必需：Vue 接入层（Vue2/3 统一）
pnpm add @fhuang/form-pilot-vue vue-demi

# 可选：AI/MCP 客户端（需要让 AI 操作表单时）
pnpm add @fhuang/form-pilot-mcp-client

# 可选：示例适配器（纯对象表单，无 UI 库时演示用）
pnpm add @fhuang/form-pilot-adapter-plain
```

- 重要说明
  - 业务仅需依赖 `@fhuang/form-pilot-vue`，如需 AI 操作再增加 `@fhuang/form-pilot-mcp-client`
  - 不直接依赖 `@fhuang/form-pilot-core`
  - 需要 `vue` 与 `vue-demi`（统一 Vue2/3 API）

### Vue3 使用示例

- 在 `main.ts` 注册插件与适配器

```ts
import { createApp } from 'vue'
import App from './App.vue'
import { FormPilotPlugin } from '@fhuang/form-pilot-vue'
import PlainAdapter from '@fhuang/form-pilot-adapter-plain'

const app = createApp(App)
app.use(FormPilotPlugin, { adapters: [PlainAdapter] })
app.mount('#app')
```

- 在组件中创建句柄并操作表单

```ts
import { ref } from 'vue'
import { useAiForm } from '@fhuang/form-pilot-vue'

const formRef = ref()
const handle = useAiForm(formRef, { id: 'userCreate' })

await handle.setValues({ name: 'Alice', email: 'alice@example.com' })
const ok = await handle.validate()
if (ok) await handle.submit()
```

### Vue2 使用示例

- 在 `main.js` 注册插件与适配器

```js
import Vue from 'vue'
import { FormPilotPlugin } from '@fhuang/form-pilot-vue'
import PlainAdapter from '@fhuang/form-pilot-adapter-plain'

Vue.use(FormPilotPlugin, { adapters: [PlainAdapter] })
new Vue({ render: h => h(App) }).$mount('#app')
```

- 在组件中创建句柄并操作表单

```js
import { useAiForm } from '@fhuang/form-pilot-vue'

export default {
  mounted() {
    this.handle = useAiForm(this.$refs.formRef, { id: 'userCreate' })
    this.handle.setValues({ name: 'Alice' })
  }
}
```

### 与 AI/MCP 集成（可选）

- 安装 `@fhuang/form-pilot-mcp-client` 后，在应用中注册表单并连接工具服务端

```ts
import { MCPClient } from '@fhuang/form-pilot-mcp-client'
import { useAiForm } from '@fhuang/form-pilot-vue'

const client = new MCPClient({
  actor: 'ai-bot',
  guards: { userCreate: { allowedFields: ['name', 'email'] } },
  clientGuard: { submitRequiresConfirm: true, confirm: async id => window.confirm(`确认提交 ${id}?`) },
  onAudit: entry => sendToSIEM(entry),
})

client.registerForm('userCreate', () => useAiForm(formRef, { id: 'userCreate' }))
client.connectWS('wss://mcp.example.com/tools')
// 或：client.connectSSE('https://mcp.example.com/tools')
```

### API 提示

- `@fhuang/form-pilot-vue`
  - `useAiForm(formRef, options)` 返回句柄，包含 `getSchema/getValues/setValues/validate/submit`
  - `FormPilotPlugin` 用于全局注册适配器与生命周期钩子
- `@fhuang/form-pilot-mcp-client`
  - `MCPClient(options)` 提供工具路由、字段守卫、提交确认与审计
  - `registerForm(formId, getter)` 绑定表单；`connectWS`/`connectSSE` 连接工具服务端

### 适配器说明

- 对接 Element/AntD 等 UI 表单库时，需要实现并注册对应的适配器描述
- 无 UI 库或演示可使用 `@fhuang/form-pilot-adapter-plain`（基于纯对象推断 schema）


## 扩展开发

- 适配器扩展：在 core 中定义新的适配器描述，接入不同 UI 表单库（Element/AntD 等），通过 `FormPilotPlugin` 注册到 Vue 层
- 工具扩展：在 MCP 客户端新增工具并在 `dispatch` 路由与审计（保持受控与守卫）
- 审计接入：利用 `onAudit` 将日志转发至企业合规/风控系统

## 设计原则

- TypeScript 优先，明确边界与可扩展类型
- 组合优先：通过适配器与桥接组合能力，而非继承耦合
- 安全优先：工具化操作、权限可控、行为可审计，不直接操作 DOM
- 可演化：核心语义稳定，接入层与工具层可独立发展

## 许可

MIT