# @huangfeng19820712/form-pilot-vue

FormPilot 的 Vue 接入层（Vue2/Vue3 统一）。该包是业务应用唯一需要依赖的前端入口，用于将真实 Vue 表单安全接入到 FormPilot 内核与 MCP 工具层。

## 依赖

- 运行时
  - `vue`（peer）：Vue 2.6+ 或 Vue 3.3+
  - `vue-demi`：统一访问 Vue2/Vue3 的 API
- 工作区内部
  - 间接使用 `@huangfeng19820712/form-pilot-core`（不直接暴露给业务）

> 本包仅提供 Vue 绑定与统一 API，不实现表单语义、不访问 DOM、不硬编码 UI 库。

## 安装

- Monorepo（当前工作区）

```bash
pnpm install
```

- 外部项目（发布后）

```bash
pnpm add @huangfeng19820712/form-pilot-vue vue-demi
```

## 公共 API

- `useAiForm(formRef, options)`：从真实表单引用创建 AI 可操作的安全句柄
- `FormPilotPlugin`：Vue 插件，用于全局注册适配器与钩子

句柄方法：

- `getSchema()` 返回规范化 schema
- `setValues(values)` 安全写入表单值
- `getValues()` 读取当前表单值
- `validate()` 执行校验
- `submit()` 执行提交

## 快速使用

```ts
import { useAiForm, FormPilotPlugin } from '@huangfeng19820712/form-pilot-vue'
import Vue from 'vue'

// 1) 可选：在应用初始化时注册适配器与钩子
Vue.use(FormPilotPlugin, {
  adapters: [/* 你的适配器描述列表（不硬编码 UI 库） */],
  hooks: {
    beforeSet: async ({ instance, next }) => {},
    beforeValidate: async ({ instance }) => {},
    beforeSubmit: async ({ instance }) => {},
  },
})

// 2) 在组件中基于真实表单 ref 创建句柄
const handle = useAiForm(formRef, { id: 'userCreate' })

// 3) 使用句柄方法（所有操作委托到核心桥接层）
await handle.setValues({ name: 'Alice' })
const values = handle.getValues()
const result = await handle.validate()
const submitRes = await handle.submit()
```

> `formRef` 可以是 Vue3 的 `ref` 或 Vue2 的组件实例引用；本包使用 `vue-demi` 自动处理版本差异。

## 与 AI/MCP 集成

- 当你需要让 AI 操作表单时，结合 `@huangfeng19820712/form-pilot-mcp-client` 使用：

```ts
import { MCPClient } from '@huangfeng19820712/form-pilot-mcp-client'

const client = new MCPClient({ /* 守卫与审计配置 */ })
client.registerForm('userCreate', () => useAiForm(formRef, { id: 'userCreate' }))
```

> 业务应用不需要直接引用 `@huangfeng19820712/form-pilot-core`；所有核心能力通过本包句柄与 MCP 客户端间接使用。

## 运行与开发

- 工作区脚本

```bash
pnpm -w run typecheck
pnpm -w run build
```

- 仅构建 Vue 接入层

```bash
pnpm --filter @huangfeng19820712/form-pilot-vue run typecheck
pnpm --filter @huangfeng19820712/form-pilot-vue run build
```

## 扩展开发

- 适配器注册
  - 使用 `FormPilotPlugin` 将你的适配器描述与生命周期钩子注入全局
- 细化钩子
  - `beforeSet/afterSet/beforeValidate/beforeSubmit` 可用于审计、权限提示或预处理
- 与 UI 库集成
  - 通过适配器将 UI 库的表单实例桥接到核心；本包不硬编码 UI 行为

## 约束

- 不访问 DOM，不实现或修改核心语义
- 不硬编码 Element/AntD 等 UI 库 API；适配器作为可插拔策略
- 业务仅依赖本包与 MCP 客户端（如需 AI 操作），不直接依赖核心