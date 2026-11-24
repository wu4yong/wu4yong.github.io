---
title: 前端工程化-postcss
date: 2018-02-11 17:00:00
categories:
  - web
tags:
  - web
---

<div class="essay-banner essay-fe"></div>

# 前端工程化

## postcss 介绍

- postcss 是一个用 javaScript 工具和插件转换 CSS 代码的工具
- postcss 是一个`平台`, 和 webpack 是一个概念，postcss 本身没有什么功能，只是用 JS 来处理 CSS。postcss 的`插件`才是实现功能的主体
- scss 被称为`预处理器`，是因它的工作环节在 CSS 之前，scss 文件最终会被转化为 css 语法
- postcss 被称为`后处理器`，是因为它的`部分`工作环节是在 css 之后，会将 css 语法进行转化(eg： 添加浏览器后缀，编译高级语法到低级语法，px 转成 rem)

## 二、功能

### 2.1 Autoprefixer

- 根据设置的浏览器支持度，和 caniuse 网站的信息，自动给 CSS 规则添加前缀

### 2.2 PostCSS Preset Env

- 将 `现代` CSS 语法转化为浏览器支持程度高的语法

### 2.3 pxtorem

- 将 px 转化为 rem

### 2.4 cssnano

- 压缩 css 代码

### 2.5 stylelint

- 检测 CSS 代码， 格式化 css 代码

## 三、处理流程与 AST 节点

- PostCSS 处理 CSS 时先把字符串分词成 token，再由解析器根据 token 构建出 AST；插件在 AST 上完成修改后，再由 stringifier 把 AST 输出回 CSS 字符串
- 分词（tokenizer）把 CSS 字符串拆成带类型和位置信息的 token；解析器（parser）基于 token 构造节点；处理器（processor）初始化插件并运行转换；stringifier 把修改后的 AST 还原成 CSS 文本
- Token 是一个数组，第一项是类型（如 `word`、`space`、`{`、`;`），后面是匹配文本与起止行列位置；`space` 这类 token 不带位置信息
- 解析器通过 tokenizer 的流式接口逐个取 token 构造节点，不需要一次性保留全部 token；词法分析与语法分析分开，便于分别优化分词速度和 AST 可读性
- AST 节点继承自基础 Node 类，常见类型包括：`Root`（文件根节点）、`AtRule`（`@` 开头的语句）、`Rule`（选择器与其内部声明）、`Declaration`（属性键值对）、`Comment`（独立注释）
- 字符串化从给定节点开始遍历，调用对应方法生成原始 CSS 文本；节点上的 `raws` 保留空格、分号等原始样式细节
- PostCSS 本身不是 Sass、Less 那样的预处理器，不定义自定义语法和语义；合法 CSS 都可以被它处理，它也可以放在预处理器之后或与之配合使用
- 注释在选择器、at-rule 参数和值内部时，会存放在节点的 `raws` 属性里，而不是作为独立 Comment 节点
- 除了默认的 CSS 语法，parser 与 stringifier 都可以替换成自定义实现，接入其他 CSS 方言

## 四、插件的形态与事件

- PostCSS 插件是一个创建函数，接收选项后返回带 `postcssPlugin` 名称属性的对象；函数上需要设置 `plugin.postcss = true`
- 返回对象上可以按节点类型定义事件方法：`Once`（每个文件触发一次）、`Root`、`AtRule`、`Rule`、`Declaration`、`Comment`；带 `Exit` 后缀的方法在子节点全部处理完后触发
- `OnceExit`、`RootExit` 等退出钩子在节点全部子节点处理完后触发，适合做汇总校验与状态回收
- `prepare(result)` 为每次处理动态生成监听器，适合先遍历收集共享状态（如变量表），再在退出阶段统一使用；每次处理重新生成，可携带本次临时状态，避免跨文件污染
- 节点提供类 DOM 的遍历与修改 API：`next`、`parent` 查找相邻与父节点，`some` 遍历子节点，`remove` 删除自身，`append`、`insertBefore` 插入新节点
- 新增节点要复制来源节点的 `source` 信息，否则生成的 source map 位置会不正确，报错位置也对不上原始文件
- 按名字匹配声明或 at-rule 时用对象形式（如 `Declaration: { color: decl => {} }`）；复杂值再配合选择器、值、尺寸、媒体查询、字体、边距等专用解析器，比正则更稳妥
- 简单判断可以先用字符串 `includes` 做快速过滤，再进入重解析
- 插件改到或新增节点后会被重新遍历；只往容器里加子节点容易造成死循环，需要先用标记（包括 `Symbol`）记录已处理过的节点
- 第二个参数里提供节点构造器（如 `new Rule({ selector, source })`），新建节点可以挂到根节点或现有节点之下

## 五、依赖上报与错误处理

- 插件可以通过 `result.messages` 追加类型为 `dependency` 或 `dir-dependency` 的消息，告知 webpack、Gulp 等 runner：该依赖文件（或目录）变化时需要重新构建 CSS；消息类型由 `type` 字段区分
- 发现不合法的自定义变量或其他语法错误时，插件可以用节点上的 `error()` 方法抛出带位置信息的错误；通过 `result` 调用 `warn()` 则只给出警告而不中断处理
- 词法位置信息随 token 保留到节点上，报错时可以定位到原始文件的行列位置
- 节点之间的遍历和父子关系都在 AST 对象上完成，插件不需要自己拼接 CSS 字符串；输出格式与空格、分号等原始样式由 stringifier 结合节点的 `raws` 保留
- 插件读到的选项在创建函数的参数里获取；创建函数本身只做选项检查和共享状态准备，具体节点处理写在返回对象的事件方法中
- PostCSS 生态里的 Autoprefixer、Stylelint、CSSnano 等工具都构建在 PostCSS 之上；CSS Modules、样式重置类插件也通过 PostCSS 插件机制实现隔离与复用

- 插件适用场景包括兼容性修复、自动化常规操作、检查常见错误、样式隔离与可维护性、CSS 草案 polyfill 等
- 插件分私有与公开两类：私有插件只服务特定项目；公开插件通过 boilerplate 模板发布到 npm 与插件目录
- TypeScript 中创建函数标注为 `PluginCreator<Options>`，即可让 `plugin.postcss = true` 类型合法
- 事件分进入与退出两类：`Once`、`Root`、`AtRule`、`Rule` 在处理子节点前调用；`OnceExit`、`RootExit`、`AtRuleExit`、`RuleExit` 在子节点全部处理完后调用
- 按名字匹配时 `'*'` 键表示匹配全部节点；未匹配到的再用正则或专用解析器处理
- 专用解析器覆盖选择器、值、数字长度百分比、媒体查询、字体、边距/内边距/边框等属性；另有属性解析器、函数解析器与字体、边距辅助工具
- 正则与解析器属于重操作，先用 `String#includes()` 做快速过滤，再进入重解析
- `prepare(result)` 生成的监听器可携带本次处理的临时状态，例如先收集变量表，再在 `OnceExit` 阶段统一使用；也可配合 Browserslist 取声明属性
- 节点构造器通过事件方法第二个参数取得；新建规则可挂到 `root()` 之下，再把原节点移入新规则
- 新增节点必须复制 `source` 信息，否则 source map 与报错位置对不上原始文件
- 被改动或新增的节点会被重新访问；改动子节点时父节点也会被重新访问；只有 `Once` 与 `OnceExit` 不会再次触发
- 只往容器里加子节点容易造成无限循环；可用 `Symbol` 或标记位记录已处理节点，再次访问时跳过
- 第二个参数里的 `result` 对象可用于 `warn` 上报警告；语法错误用节点 `error()` 抛出并带词法位置
- 依赖消息除 `dependency` 外，目录依赖使用 `dir-dependency` 类型；消息带 `plugin`、`file`/`dir`、`parent` 字段
- runner（webpack、Gulp 等）读取这些消息后，在关联文件变化时重新构建 CSS
- 注释在选择器、at-rule 参数和值内部时存于节点 `raws`，不作为独立 Comment 节点
- 除默认 CSS 语法外，parser 与 stringifier 都可替换为自定义实现，接入其他 CSS 方言
- Processor 初始化注册的插件并按顺序运行转换；插件本身不拼接 CSS 字符串，输出格式由 stringifier 结合 `raws` 保留
- 插件创建函数只做选项检查与共享状态准备，具体节点处理写在返回对象的事件方法中
- 生态中的 Autoprefixer、Stylelint、CSSnano、CSS Modules、样式重置类工具都构建在 PostCSS 插件机制之上
- 解析器通过 tokenizer 流式接口逐个取 token 构造节点，不需要一次性保留全部 token；词法分析与语法分析分开
- Token 数组第一项是类型，后面是匹配文本与起止行列位置；`space` 这类 token 不带位置信息
- 节点继承基础 Node 类，父子关系与遍历都在 AST 对象上完成
- 简单插件也建议从测试写起，boilerplate 模板自带测试文件；调试可用编辑器 Node 调试器或 `console.log`
- 官方不建议直接给 CSS 加新语法；新特性应先写 CSS 草案提案，再以 polyfill 插件形式实现

## 参考

- https://postcss.org/docs/postcss-architecture
- https://postcss.org/docs/writing-a-postcss-plugin
