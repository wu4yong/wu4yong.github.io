---
title: Vibe Coding-技术栈
date: 2018-04-22 14:00:00
categories:
  - web
tags:
  - web
---

<div class="essay-banner essay-vibe"></div>

# Vibe Coding

## 技术栈

## 一、前端 — keyDoWeb

{% autogrid data-grid-link-table nofix %}
类别|技术|说明
框架|React 18 + TypeScript|函数组件 + Hooks
构建工具|Vite 5|极速 HMR
UI 组件库|shadcn/ui (Radix Primitives)|20+ 组件，按需复制源码，高度可定制
样式方案|Tailwind CSS 3.4|深色模式、语义化颜色变量、四象限主题色
路由|React Router v7|`createBrowserRouter` 数据路由
服务端状态|TanStack Query (React Query v5)|缓存、乐观更新、请求去重
客户端状态|Zustand|轻量级，支持 persist 持久化
表单|react-hook-form + Zod|类型安全的表单验证
拖拽|@dnd-kit v6|高性能拖拽排序，支持 8px 点击/拖拽区分
日期处理|date-fns v4 + 自定义工具函数|统一东八区 (Asia/Shanghai)
排序算法|LexoRank|字符串字典序，O(1) 插入无需重排
图标|lucide-react|轻量图标库
共享包|@yuan-shan/keydo-contract + @yuan-shan/tools|前后端类型与工具统一
{% endautogrid %}

## 二、后端 — keyDoServer

{% autogrid data-grid-link-table nofix %}
类别|技术|说明
框架|NestJS 10|企业级 Node.js 框架，模块化架构
语言|TypeScript|严格类型约束
数据库|PostgreSQL 16|关系型数据库
ORM|Prisma 5|类型安全的数据库访问层
认证|Passport + JWT|JWT Token，全局守卫 + @Public 白名单
密码加密|bcryptjs|10 轮盐值哈希
验证|Zod|与前端共享 Schema，类型安全
排序|LexoRank|任务拖拽排序核心算法
{% endautogrid %}

## 三、共享包

{% autogrid data-grid-link-table nofix %}
包名|路径|说明
@yuan-shan/keydo-contract|packages/keyDoContract|前后端共享的 TypeScript 类型 + Zod 验证 Schema
@yuan-shan/tools|packages/tools|LexoRank 排序工具函数 (`getRankBetween`, `getInitialRank`)
{% endautogrid %}

## 四、部署与基础设施

{% autogrid data-grid-link-table nofix %}
类别|技术
容器化|Docker + Docker Compose
Web 服务器|Nginx (Alpine)
反向代理|Nginx → 后端 API，SPA 路由回退
数据库服务|PostgreSQL 16 Alpine
部署方式|一键部署脚本 `deploy.sh`
{% endautogrid %}

---

## 五、服务端状态与客户端状态

- TanStack Query 负责服务端状态，缓存读取到的数据；乐观更新在 `onMutate` 里先快照旧值、用 `setQueryData` 提前写入新值，mutation 失败时按快照回滚，settled 后再失效对应查询
- 乐观更新有两条路径：直接在 UI 上追加临时项，或直接操作缓存；多处界面都要反映同一变更时，操作缓存会自动同步到各使用方
- Zustand 管客户端状态，persist 中间件把状态写入 `localStorage` 等存储；`name` 是必填的存储键，`partialize` 可以只挑选需要持久化的字段
- 持久化数据发生不兼容变更时，可以通过 `version` 与 `migrate` 处理旧存储里的历史数据

## 六、表单与类型校验

- react-hook-form 通过 `resolver` 选项接入 schema 校验，resolver 对完整表单数据跑一遍校验，返回类型化的值或错误
- Zod schema 经 `zodResolver` 接入表单，需要安装 `@hookform/resolvers` 与 `zod`；同一份 Zod Schema 也被后端复用，两端出入参定义保持一致
- 表单错误集中在 `formState.errors` 中，`handleSubmit` 在调用提交处理函数前先完成校验

## 七、认证与密码哈希

- NestJS 的全局守卫默认要求每个路由都已登录，未认证请求返回 401；公开路由用 `@Public()` 标记，绕过登录校验
- JWT provider 从 `Authorization` 头读取 bearer token 完成校验；认证模块按顺序尝试各 provider，第一个返回用户的 provider 生效
- bcryptjs 生成盐值时 rounds 参数缺省为 10，哈希同样默认 10 轮；校验密码用 `compare` / `compareSync` 对照已存哈希
- bcrypt 单条哈希固定 60 字符，输入最长 72 字节；盐值随哈希一起保存，用于抵御彩虹表攻击

## 八、数据库访问层

- Prisma schema 在 datasource 中声明 PostgreSQL 连接，generator 指向 `prisma-client-js`，数据模型以 `model` 块定义
- CLI 执行 `prisma generate` 依据 schema 生成类型安全的 Prisma Client，`prisma migrate dev` 依据数据模型创建迁移
- 类型定义与 Zod Schema 放在共享包中，前端表单、后端接口与 Prisma 模型围绕同一套字段约定对接

## 参考

- https://tanstack.com/query/latest/docs/framework/react/guides/optimistic-updates
- https://zustand.docs.pmnd.rs/integrations/persisting-store-data
- https://react-hook-form.com/get-started#SchemaValidation
- https://docs.nestjs.com/security/authentication
- https://github.com/dcodeIO/bcrypt.js
- https://www.prisma.io/docs/concepts/components/prisma-schema
