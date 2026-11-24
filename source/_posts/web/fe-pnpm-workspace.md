---
title: 前端工程化-pnpm-workspace
date: 2018-02-06 02:00:00
categories:
  - web
tags:
  - web
---

<div class="essay-banner essay-fe"></div>

# 前端工程化

## pnpm-workspace

## 一、pnpm-workspace.yaml 配置文件

```yaml
packages:
  - 'packages/*'
  - 'apps/*'
```

1. pnpm 在 `packages/` 和 `apps/` 目录下的所有子目录都是独立的包，应该被当作工作空间的一部分进行管理
2. 多个包使用相同依赖时，pnpm 会在根目录的 `node_modules` 中只安装一份
3. 允许工作空间内的包相互引用，支持本地包的符号链接(`import x from '@yuan-shan/tool'` @yuan-shan/tool 是 package.json 文件中的 name 属性)，实现实时开发调试
4. 统一脚本执行

```bash
# -w --workspace-root 指定工作空间根目录
pnpm -w install axios   # 安装 axios 到工作空间根目录的 node_modules 中

# --workspace 限定在工作空间范围内(不会联网去 npm registry 中查询)
pnpm --workspace install @yuan-shan/tool # 安装本地的 @yuan-shan/tool 包到根目录的 node_modules 中

# -F --filter 过滤要操作的包
pnpm -F "@yuan-shan/tool" dev # 在 @yuan-shan/tool 包中执行 dev 脚本

# -r --recursive 递归执行
pnpm -r install # 对工作空间的所有包执行安装命令
```

## 二、workspace: 协议

- 依赖版本写成 `workspace:` 协议时，pnpm 只解析本地工作空间内的包；工作空间里找不到对应包时安装会失败，不会回退到 npm registry
- 支持 `workspace:*`、`workspace:~`、`workspace:^` 以及 `workspace:^1.5.0` 这类范围写法
- 别名写法 `workspace:foo@*` 表示依赖名写 `bar`、实际指向工作空间内的 `foo`；相对路径写法 `workspace:../foo` 引用兄弟包
- 打包或发布工作空间包时，`workspace:` 依赖会被动态替换为工作空间内对应的版本号，或对应的 semver 范围；裸 `workspace:` 等同于 `workspace:*`
- 别名写法在发布前会被转换为普通的别名依赖（如 `npm:foo@1.0.0`），消费者按常规 semver 范围安装即可
- 这个机制让本地包可以边开发边联动引用，发布时也不需要先发一个中间版本给消费者安装

## 三、安装与链接行为

- `linkWorkspacePackages` 默认为 `false`；开启后本地可用的工作空间包会链接进 `node_modules`，而不是从 registry 下载
- `linkWorkspacePackages: true` 只在直接声明处链接工作空间包；传递依赖里写普通版本范围的包仍从 registry 安装；`deep` 设置还会把工作空间包链接到子依赖位置
- `injectWorkspacePackages` 默认为 `false`；开启后本地工作空间依赖以硬链接而非符号链接接入，也可以通过 `dependenciesMeta[].injected` 对单个依赖选择性开启
- 注入的依赖默认会在可能时用符号链接去重；被依赖方与注入包声明的 peer 依赖不一致、需要多份依赖图时，才会物理复制注入副本
- `dedupeInjectedDeps` 控制注入依赖的符号链接去重行为；`syncInjectedDepsAfterScripts` 列出需要在执行后同步注入副本的脚本名，方便配合 watch 模式构建
- `sharedWorkspaceLockfile` 默认为 `true`：工作空间根目录只生成一份 `pnpm-lock.yaml`，所有依赖进入同一个 `node_modules`（虚拟存储），各子包只符号链接到自己声明的依赖
- 共享 lockfile 下每个依赖只保留一份实例，安装更快，代码评审里的锁文件改动也更少；pnpm 的严格性通过符号链接保留
- `preferWorkspacePackages` 默认为 `false`；开启后即使 registry 上有更新版本，也优先使用工作空间内的本地包；该设置只在未使用 `saveWorkspaceProtocol` 时才有实际意义
- 工作空间内每个包仍是独立 Node 包，有自己的 `package.json`；包之间通过 `name` 互相引用，链接后改动源码不需要重新安装

## 四、常用配置项

- `saveWorkspaceProtocol` 控制通过 `pnpm add` 把工作空间包写入 `package.json` 时使用的协议前缀；三档取值：`false` 写普通版本范围，`true` 写 `workspace:` 前缀，`rolling`（默认）写成 `workspace:*` 形式
- `includeWorkspaceRoot` 默认为 `false`；递归在工作空间执行命令时，默认不会把根工作空间项目本身纳入执行范围
- `ignoreWorkspaceRootCheck` 开启后，不需要 `-w` / `--ignore-workspace-root-check` 也能往工作空间根目录添加依赖
- `workspaceConcurrency` 控制工作空间任务的并发数，默认取 4 与可用 CPU 核心数之间的较小值
- `failIfNoMatch` 默认为 `false`；设为 `true` 时，过滤后没有匹配到任何包，命令会以非零退出码结束
- `ignoreWorkspaceCycles` 默认为 `false`；设为 `true` 后不再输出工作空间依赖循环的警告，循环内任务的相互顺序仍不保证
- `disallowWorkspaceCycles` 默认为 `false`；设为 `true` 时，存在循环依赖会直接让安装失败
- 检测到循环依赖时，pnpm 会输出警告，并在能定位的情况下指出是哪些包在 `dependencies`、`optionalDependencies`、`devDependencies` 中形成了循环
- 递归执行脚本时，命令按工作空间配置列出的顺序逐个运行；存在循环时该顺序不构成拓扑保证
- 从 npm、Yarn 或 Bun 迁移过来的仓库，若根 `package.json` 有 `workspaces` 字段而没有 `pnpm-workspace.yaml`，`pnpm install` 会按相同模式生成一份 `packages` 配置；已存在的 `pnpm-workspace.yaml` 不会被改动
- 版本变更与发布流程可以用 `pnpm change` 与 `pnpm version -r` 在工作空间范围内批量处理

- 工作空间必须在根目录放置 `pnpm-workspace.yaml`，`packages` 字段列出各项目目录
- 从 npm、Yarn、Bun 迁移时，v12.7.0+ 的 `pnpm install` 会在没有 `pnpm-workspace.yaml` 时按根 `package.json` 的 `workspaces` 字段生成一份；已存在的配置文件不会被改动
- 传 `--ignore-workspace` 时不会创建工作空间配置；之后 `workspaces` 字段与 `packages` 模式不一致时，pnpm 会输出警告，因为只读 `pnpm-workspace.yaml`
- `linkWorkspacePackages` 开启后，只有版本满足依赖范围的本地包才会被链接；范围不满足时仍从 registry 安装
- 注入的相对 `workspace:`、`file:` 依赖以及注入包自动安装的 peer 依赖，从该包 `package.json` 所在目录解析
- `syncInjectedDepsAfterScripts` 列出的脚本执行成功后，pnpm 还会刷新声明了 `bin` 的注入包命令链接
- 共享 lockfile 下每个依赖是单例，安装更快，代码评审只看一份锁文件；根虚拟存储 `node_modules/.pnpm` 中各项目只链接自己声明的依赖
- `saveWorkspaceProtocol` 与 `savePrefix` 共同决定写入 `package.json` 的规格：`false` 写普通版本范围，`true` 写 `workspace:` 前缀，`rolling` 默认写 `workspace:*`
- 版本管理除 `pnpm change`、`pnpm version -r` 外，changesets、Rush 等外部工具也支持 pnpm 工作空间
- 检测到循环依赖时，pnpm 检查 `dependencies`、`optionalDependencies`、`devDependencies` 三处声明并在能定位时列出具体包
- `ignoreWorkspaceCycles` 开启后不仅关闭循环警告，还会把递归运行中的 `ERR_PNPM_TASK_CYCLE` 降级为警告；循环内任务相互顺序仍不保证
- `disallowWorkspaceCycles` 开启后，存在循环依赖会直接让安装失败，而不是仅警告
- `failIfNoMatch` 示例：`pnpm --filter=bad-pkg-name test` 在工作空间找不到该包时以非零码退出
- 别名发布前转换为 `npm:foo@1.0.0` 形式的常规别名依赖；相对路径规格发布前转换为所有包管理器都支持的常规版本规格
- `workspace:~` 替换为波浪号范围，`workspace:^` 替换为插入号范围，`workspace:^1.5.0` 替换为对应 semver 范围
- 裸 `workspace:` 不带版本范围时按 `workspace:*` 处理
- 工作空间包打包进归档（`pnpm pack` 或 `pnpm publish` 系列命令）时才发生协议替换，开发期保持本地链接
- `preferWorkspacePackages` 只在工作空间未使用 `saveWorkspaceProtocol` 时才有实际意义
- `injectWorkspacePackages` 即使开启，pnpm 仍优先用符号链接去重注入依赖；peer 依赖不一致需要多份依赖图时才物理复制
- 工作空间内各包独立解析自己的依赖树，运行时不共享内存状态，共享的只是文件层面的链接与提升结果
- 命令按工作空间配置列出的顺序逐个运行；需要确定顺序时应调整包之间的依赖声明，而不是依赖命令行执行顺序
- 新增子包先在 `packages` 路径模式中登记，安装命令才会识别为工作空间项目
- 本地包改动后无需重新发布安装即可被引用方看到；发布产物里替换为已发布版本号，不再保留本地链接
- 协议声明找不到本地包时安装失败，不会静默回退 registry，避免误用线上版本
- `includeWorkspaceRoot` 开启后，递归命令也会在根工作空间项目上执行

## 参考

- https://pnpm.io/workspaces
