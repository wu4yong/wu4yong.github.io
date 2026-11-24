---
title: Vibe Coding-vibeCoding工具
date: 2018-04-21 23:00:00
categories:
  - web
tags:
  - web
---

<div class="essay-banner essay-vibe"></div>

# Vibe Coding

## Vibe Coding 工具

KeyDo 项目全程采用 Vibe Coding 方式开发，以下记录了各阶段使用的主要工具及实践方式。

## 一、需求澄清

使用 **Gemini 2.5 Pro** 将模糊的想法转化为可执行的方案：

1. 描述项目场景与基本需求，由 Gemini 理解开发者意图并划分出 MVP 版本、1.0 版本和迭代计划
2. 通过多轮对话逐步细化功能模块、交互流程和页面布局。确认技术选型与设计理念
3. 确认边界情况和异常状态，避免后续开发中遗漏关键逻辑
4. 通过 Gemini 生成 V0 提示词，让 V0 直接生成可预览的 Web 页面原型，所见即所得，快速验证交互设计

![gemini-web](@@CDN@@/assets/img/web/vibe-tools/img-01.webp)

## 二、项目开发

**Cursor + ChatGPT 5.5** 编写详细设计文档并执行编码：

1. 通过 Plan 模式将 Gemini 原型功能拆解为具体的开发任务
2. 将技术栈、项目架构、UI规范落地到 Cursor 的 `.cursorrules` 规则文件中，让 AI 了解项目技术栈和代码规范

![cursor-img](@@CDN@@/assets/img/web/vibe-tools/img-02.webp)

## 三、UI 设计

使用 **V0 + MCP** 完成界面设计到代码的无缝衔接：

1. 用自然语言向 V0 描述想要的组件或页面，指明布局结构、交互状态（hover/loading/empty）和参考风格
2. V0 直接生成可预览的 React 代码，所见即所得，不满意就继续迭代
3. 通过 MCP 协议将 V0 接入 Cursor，在编辑器内就能把设计稿代码直接整合进项目

![v0-home](@@CDN@@/assets/img/web/vibe-tools/img-03.webp)

## 四、开发计划与任务管理

使用 **Notion + Notion MCP** 管理项目进度：

1. 在 Notion 中制定 MVP 任务清单和迭代计划
2. 通过 Notion MCP 打通 Cursor，编辑器内即可查阅任务详情、更新进度
3. 开发文档随代码同步生成，不用来回切换工具

![notion-mvp](@@CDN@@/assets/img/web/vibe-tools/img-04.webp)

![notion-paln](@@CDN@@/assets/img/web/vibe-tools/img-05.webp)

## 五、Cursor 规则文件的形态

- 项目规则存放在 `.cursor/rules/` 目录，随代码库一起纳入版本控制；规则文件支持 `.md` 与 `.mdc` 扩展名，`.mdc` 可通过 frontmatter 的 `description`、`globs`、`alwaysApply` 控制何时生效
- 规则分项目规则、用户规则和团队规则三类：项目规则作用于当前代码库，用户规则全局生效，团队规则由仪表盘统一管理
- 用户规则在 Cursor 设置中定义、跨项目生效；本机用户规则文件存放在 `~/.cursor/rules`（Windows 为 `%USERPROFILE%\.cursor\rules`），留在本机不随账号同步；团队规则存放在服务端并自动同步给成员
- 规则有四种生效方式：每次会话始终应用、由 Agent 按相关性判断、匹配指定文件模式、仅在 `@` 手动提及时应用
- 规则可通过命令面板的 "New Cursor Rule" 命令，或 Cursor Settings → Rules, Commands 创建，文件落在 `.cursor/rules/`
- 根目录下的 `.cursorrules` 是早期遗留格式，目前仍受支持但官方建议迁移到项目规则或 `AGENTS.md`；`AGENTS.md` 是不带 frontmatter 的纯 Markdown 指令文件，Cursor 在根目录和子目录都会读取
- Cursor 同样按读取 `AGENTS.md` 的方式读取项目根目录的 `CLAUDE.md`；`CLAUDE.md` 始终在每次对话中应用，不受规则 frontmatter 的 `alwaysApply` 设置影响
- 规则内容在生效时作为持久上下文附加到模型对话开头；规则只作用于 Agent 对话，不影响 Tab 补全
- 嵌套的 `.cursor/rules` 目录在其目录下的文件被引用时自动附加规则
- 大型项目建议把规则按关注点拆成多个聚焦文件，而不是堆进一个长规则文件；`.cursor/rules` 下的嵌套子目录可以工作，但扁平结构更易维护

## 六、MCP 协议的连接方式

- MCP（Model Context Protocol）是连接 AI 应用与外部系统的开放标准，把数据源、工具和工作流以统一协议暴露给 AI 客户端
- 架构上分为 MCP client 与 MCP server：客户端在 AI 编辑器或助手里发起请求，服务端对接本地文件、数据库、第三方工具和内部 API；同一服务可被多个客户端接入
- 协议是双向数据流：AI 应用一侧与数据源、工具一侧通过标准化协议互通；服务端可以暴露自己的数据资源、工具和专用提示词
- MCP 的三类原语各有分工：资源用来暴露数据，工具用来执行动作，提示词是可复用的专用模板；客户端按服务端声明的能力发现并调用
- MCP 部署分本地服务器和远程服务器两类；除工具和资源外，协议还支持在 AI 客户端内部运行的交互式 MCP Apps
- 官方文档列出的兼容客户端包括 Claude、ChatGPT、Visual Studio Code 和 Cursor 等，服务端只需实现一次即可被各客户端复用；调试服务端可使用 MCP Inspector
- Notion 官方提供托管的 MCP 服务，远程地址为 `https://mcp.notion.com/mcp`，客户端通过 Streamable HTTP 连接，OAuth 授权后即可访问工作区的页面、数据库和评论
- 托管服务的客户端需要支持 OAuth 2.0 授权码流程（带 PKCE）、Streamable HTTP、令牌刷新和安全凭据存储
- Notion 开源服务 `notion-mcp-server` 使用集成 token 鉴权，连接与部署都需要自行维护，但该开源服务已不再积极维护；托管 Notion MCP 支持 OAuth 授权和 MCP 令牌，无需自行搭建基础设施，官方推荐使用托管服务
- 企业版工作空间的管理员可以批准或阻止接入的 MCP 客户端，未被批准的工具无法连接对应工作空间

## 七、AI 原型与任务工具的分工

- V0 用自然语言描述组件或页面，直接生成可预览的 React 代码，用于在正式编码前快速验证页面布局和交互状态，不满意就在对话中继续迭代
- MCP 把 V0、Notion 这类外部工具接进编辑器，Agent 在对话中即可调用对应工具的能力，不必在多个应用之间复制粘贴
- Notion MCP 可用于生成 PRD、技术规格和架构文档，跨工作区搜索答案，以及根据任务描述更新项目状态和进度；典型用途还包括生成报告和制定活动方案
- 任务清单、迭代计划和开发文档放在 Notion 侧维护，通过 MCP 同步到 Cursor 内查阅；代码与文档随同一轮开发更新
- 连接后 AI 工具按用户自身的访问权限读写 Notion 页面，能看到的内容范围与用户在工作空间里的权限一致
- 开发文档随代码同步生成，Agent 在编辑器内查阅任务详情和进度，不需要在 Notion 与编辑器之间来回切换；文档、任务和代码三处信息通过 MCP 保持同源，减少上下文在多个工具间复制带来的偏差

## 参考

- https://cursor.com/docs/context/rules
- https://modelcontextprotocol.io/introduction
- https://developers.notion.com/docs/get-started-with-mcp
- https://developers.notion.com/guides/mcp/mcp
