---
"@fhuang/form-pilot-core": patch
"@fhuang/form-pilot-vue": patch
"@fhuang/form-pilot-mcp-client": patch
"@fhuang/form-pilot-adapter-plain": patch
---

下调 TypeScript 编译目标至 ES2018 以兼容 Vue2 构建链，移除依赖包输出中的 ES2020 语法（如 Nullish Coalescing）。不涉及 API 变更。