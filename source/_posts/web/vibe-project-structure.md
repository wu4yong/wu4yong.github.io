---
title: Vibe Coding-项目结构
date: 2018-04-22 16:00:00
categories:
  - web
tags:
  - web
---

<div class="essay-banner essay-vibe"></div>

# Vibe Coding

## 项目结构

```
YuanShanMonorepo/
├── apps/
│   └── keyDoWeb/              # 前端 React 应用
│       ├── src/
│       │   ├── api/           # API 请求层
│       │   ├── components/    # UI 组件（sidebar, role, task, ui/）
│       │   ├── hooks/         # TanStack Query Hooks
│       │   ├── lib/           # axios 实例、工具函数、Toast
│       │   ├── pages/         # 页面（auth, home/quadrant）
│       │   ├── router/        # 路由配置
│       │   ├── store/         # Zustand Store
│       │   └── utils/         # 日期工具函数
│       └── docs/              # 前端文档
├── server/
│   └── keyDoServer/           # 后端 NestJS 应用
│       ├── src/
│       │   ├── auth/          # 认证模块（JWT + bcrypt）
│       │   ├── user/          # 用户模块
│       │   ├── task/          # 任务模块（含重复任务逻辑）
│       │   ├── role/          # 角色模块
│       │   ├── prisma/        # 数据库服务
│       │   └── common/        # 全局守卫/过滤器/拦截器/管道
│       └── prisma/            # 数据库 Schema
├── packages/
│   ├── keyDoContract/         # 共享类型 + Zod Schema
│   └── tools/                 # LexoRank 工具函数
├── deployments/
│   └── keydo/                 # Docker 部署配置
│       ├── docker-compose.yml
│       ├── Dockerfile.backend
│       ├── Dockerfile.frontend
│       ├── nginx.conf
│       └── deploy.sh
└── docs/                      # 项目文档
```

## 单仓多包的目录划分

- 根目录通过 `pnpm-workspace.yaml` 的 `packages` 字段声明工作区内的项目目录，工作区内互相引用的包按 `workspace:` 协议链接
- 默认情况下整个工作区共用根目录的一份 `pnpm-lock.yaml`，各项目只把自己 `package.json` 里声明的依赖符号链接进自身 `node_modules`
- `apps/` 与 `server/` 下放可以独立启动部署的应用，`packages/` 下放到多端复用的类型定义、校验 Schema 和工具函数
- 应用之间不直接引用对方源码，跨端复用的部分收敛到 `packages/` 中的共享包，避免前后端各写一份类型
- 本地工作区包默认不会自动链接进子依赖，需要链接时通过 `workspace:` 范围协议在依赖声明里指定
- `linkWorkspacePackages` 默认关闭，本地包不会默认链接进 `node_modules`；工作区包只有在版本范围满足依赖声明时才会被链接

## 前端目录的职责划分

- `api/` 集中放后端请求封装，`hooks/` 里的 TanStack Query Hooks 负责服务端状态的读取、缓存与失效，页面组件不直接发起请求
- `store/` 放 Zustand 客户端状态；需要持久化的状态通过 persist 中间件写入存储，存储项的 `name` 是必填的唯一键，默认使用 `localStorage`
- `partialize` 可以只挑选需要持久化的字段；持久化数据发生不兼容变更时，通过 `version` 与 `migrate` 处理旧存储里的历史数据
- persist 支持同步存储（如 localStorage）和异步存储（如 AsyncStorage），异步存储会带来额外的水合成本；自定义存储通过 `createJSONStorage` 包装
- `router/` 放路由配置，`pages/` 按页面组织，`components/` 按可复用 UI 拆分，`lib/` 与 `utils/` 放 axios 实例、Toast 和日期等通用函数
- `docs/` 与源码同仓放置，前端相关的接口约定、交互说明随应用一起维护

## 后端目录的职责划分

- 后端按业务域拆成 `auth`、`user`、`task`、`role` 等模块，每个模块内聚自己的控制器和服务，模块之间通过导出的 provider 协作
- `prisma/` 目录对应 Prisma 的默认 schema 位置，CLI 按 `./prisma/schema.prisma` 读取；schema 由 datasource、generator 和数据模型三部分组成
- datasource 的连接串通过 `env()` 从环境变量读取，避免把密钥写进 schema 文件
- Prisma CLI 默认在执行命令的目录及其子目录查找 `schema.prisma`；文件名或位置不同时，用 `--schema` 参数显式指定路径
- `common/` 放全局复用的守卫、过滤器、拦截器和管道；守卫在中间件之后、拦截器和管道之前执行，用来决定请求能否进入路由处理
- 守卫实现 `CanActivate` 接口，通过 `ExecutionContext` 拿到当前路由处理；返回 `false` 时框架抛 `ForbiddenException`
- 全局守卫可以通过 `APP_GUARD` token 在模块 `providers` 中注册，注册后对所有控制器和路由生效；需要公开的路由用 `@Public()` 装饰器标记为白名单
- 通过 `useGlobalGuards()` 在模块之外注册的全局守卫无法注入依赖；注册多个 `APP_GUARD` 时，每个请求按注册顺序依次执行

## 前后端的对接边界

- 接口出入参类型由共享包导出，前端页面提交表单前用 Zod Schema 校验，后端控制器收到请求后复用同一份 Schema 做服务端校验
- 前端通过 `api/` 层调用后端模块暴露的路由，不直接引用后端模块的服务类；后端模块之间的协作走 provider 导出与导入
- 排序、日期格式化这类两端都要用的纯函数放到 `packages/tools`，避免在前端和后端各实现一套
- 共享包改动会同时影响前端应用和后端应用，类型与 Schema 的变更需要两端一起对齐

## 共享包与部署目录

- `packages/keyDoContract` 导出前后端共享的 TypeScript 类型和 Zod Schema，表单校验和接口出入参在两端共用同一份定义
- `packages/tools` 放 LexoRank 这类与业务框架无关的纯函数工具，不依赖前端或后端运行时
- `deployments/keydo/` 下集中放 Dockerfile、`docker-compose.yml`、`nginx.conf` 和部署脚本，应用源码与部署配置分目录管理
- 部署目录内的 Nginx 配置负责反向代理到后端 API，并处理 SPA 前端路由的回退；数据库服务以独立容器方式编排

## 参考

- https://pnpm.io/workspaces
- https://www.prisma.io/docs/concepts/components/prisma-schema
- https://docs.nestjs.com/guards
- https://docs.nestjs.com/security/authentication
- https://zustand.docs.pmnd.rs/integrations/persisting-store-data
