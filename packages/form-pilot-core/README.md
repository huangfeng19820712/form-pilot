# @form-pilot/core

FormPilot 的表单智能内核，提供框架无关、运行时无关、UI 无关的表单语义与适配器契约。该包仅作为内部基础设施被 `@form-pilot/vue` 与 `@form-pilot/mcp-client` 使用，业务应用不应直接依赖本包。

## 依赖

- 运行时：无强制外部运行时依赖（作为库被其他包使用）
- 开发：`typescript`（工作区安装）

> 设计目标：核心仅定义“表单是什么/能做什么”，不包含 UI 渲染、DOM 访问、AI/MCP 逻辑或具体 UI 库 API。

## 安装

- 工作区（Monorepo）自动管理，内部包通过 `workspace:*` 依赖引用本包。

## 核心概念与类型

- `FormSchema`/`FormFieldSchema`/`ValidationRule`：可序列化的表单结构描述（字段、类型、必填、校验规则、标签等）
- `FormAdapter`：对真实表单实例的统一操作契约（提取 schema、读写值、校验、提交）
- `FormRuntime`：运行时上下文（实例、适配器、规范化 schema、生命周期钩子）
- `FormLifecycleHooks`：在 set/validate/submit 前后插入可审计的钩子

## 快速使用（库内部或适配器层）

```ts
import {
  defineAdapter,
  createFormRuntime,
  setValues,
  getValues,
  validate,
  submit,
} from '@form-pilot/core'

// 1) 定义一个适配器（示意：根据你的 UI 表单实例提供能力）
const MyAdapter = defineAdapter({
  id: 'my-form-adapter',
  capabilities: ['schema', 'values', 'validate', 'submit'],
  create: () => ({
    isMatch: (instance) => typeof instance === 'object',
    extractSchema: (instance) => ({ fields: [{ id: 'name', type: 'string', required: true }] }),
    getValues: (instance) => ({ name: instance.name }),
    setValues: (instance, values) => { Object.assign(instance, values) },
    validate: (instance) => ({ valid: !!instance.name, issues: instance.name ? [] : [{ fieldId: 'name', message: 'required' }] }),
    submit: async (instance) => ({ ok: true, data: instance }),
  }),
})

// 2) 创建运行时（自动探测适配器并规范化 schema）
const runtime = createFormRuntime(formInstance, { adapters: [MyAdapter], hooks: {
  beforeSet: async ({ instance, next }) => {},
  beforeValidate: async ({ instance }) => {},
  beforeSubmit: async ({ instance }) => {},
}})

// 3) 使用桥接方法执行操作
await setValues(runtime, { name: 'Alice' })
const values = getValues(runtime)
const result = await validate(runtime)
const submitRes = await submit(runtime)
```

## 运行

- 工作区脚本

```bash
pnpm -w run typecheck
pnpm -w run build
```

- 仅构建 core

```bash
pnpm --filter @form-pilot/core run typecheck
pnpm --filter @form-pilot/core run build
```

## 扩展开发

- 适配器系统
  - 使用 `defineAdapter` 声明适配器能力，通过 `isMatch()` 按实例能力选择适配器
  - 在 `createFormRuntime()` 中传入多个适配器以便运行时自动探测
- schema 规范化
  - 通过核心的 `normalizeSchema` 保证字段 `id/type/required/rules` 等稳定与可序列化
- 生命周期钩子
  - 在 `hooks` 中定义 `beforeSet/afterSet/beforeValidate/beforeSubmit` 以实现审计/拦截

## 约束

- 不访问 DOM，不引入 Vue/React 等框架
- 不实现或暴露 UI 库 API，不包含 AI/MCP/权限逻辑
- 业务应用不直接依赖本包；通过 `@form-pilot/vue` 与 `@form-pilot/mcp-client` 间接使用