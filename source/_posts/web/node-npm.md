---
title: Node.js-npm
date: 2018-04-11 00:00:00
categories:
  - web
tags:
  - web
---

<div class="essay-banner essay-node"></div>

# Node.js

## NPM 的使用

## 基础的指令

- npm install(install 可以简写成 i) XXX 安装插件
- npm install 按照 package.json 文件中的信息，自动安装所有插件
- npm uninstall XXX 卸载插件
- npm update XXX 更新插件
- npm init 初始化项目，自动生成 package.json 文件，方便记录项目中使用到的各种依赖信息 -y 全部使用默认信息
- npm publish 把本地自己的包上传到 NPM 官网上
- npm cache clean 清除缓存

## 版本 @ ~ ^

- ~3.2.2 的意思就是会自动匹配到 3.2.x 的最新版本，3.3.0 的版本不会自动更新
- ^3.2.2 的意思就是会自动匹配到 3.x.x 的最新版本 4.x.x 的版本不会自动更新(现在的 npm 默认的形式)
- npm 安装的时候。使用 @ 符号可以指定插件的版本

- 3.2.1

3 的位置版本变化代表不能兼容的大版本变化
2 的位置版本变化代表增加新的功能 可以向后兼容
1 的位置版本变化代表修复了 BUG 可以向后兼容

## npm 本地安装和全局安装

### 全局安装

- npm install X -g(这里 -g 是 -global 的简写), 通常全局包安装在 node 目录下的 node_modules 文件夹。(一般只有`工具类`的包才需要使用`全局安装`，是为了更加方便的使用包提供的`命令`)
- 全局模式安装：全局模式并不是将一个模块包安装为一个全局包的意思，它并不意味着可以从任何地方通过 require() 来引用到它。全局模式这个称谓其实并不精确，存在诸多误导。实际上，`-g` 是将一个包安装为 `全局可用的可执行命令`
- 全局安装的包可提供直接执行的命令(在所有类型的终端中都可以直接使用命令)，例如 node -v 等版本号的查看。如果没有全局安装的话，想要执行某个包的命令还得去找到包所在的文件目录才能执行对应的命令。

### 本地安装

- npm install X (后面可以加几种修饰符，主要有两种 --save-dev 和 --save ),包安装在你当前项目文件夹下的 node_modules 文件夹中。
- 本地安装的好处是，当在一个项目中想要使用某些包时。因为包是本地安装，所以直接使用 require('xxx') 命令即可。
- 如果没有本地安装只有全局安装的话引入一个包就得 require('/usr/local/....') 通过全局包的路径引入。十分的麻烦
- 而且一台主机上会有很多个项目，因此本地安装可以更灵活地在不同的项目使用不同版本的包，并避免全局包污染的问题，

## npm --save --save-dev 的区别

- npm install X 不会修改 package.json 以后运行 npm install 时，不会自动安装
- npm install X --save(--save 可以简写 -S) 修改 package.json 文件，把版本号和插件名字写进 dependencies (生成环境)模块中。 以后运行 npm install 会自动安装到 node_modules 目录中 安装到生成环境例如 vue react axios。
- npm install X --save-dev(--save-dev 可以简写 -D) 修改 package.json 文件，把版本号和插件名字写进 devDependencies (开发环境)模块中。使用 npm install 时根据是 npm 包(不会下载)还是项目(会下载)会有不同的作用。例如 gulp babel webpack 等辅助构建工具

- 在发布 npm 包的时候，本身 dependencies (生成环境)下的模块会作为依赖，一起被下载。devDependencies (开发环境)下面的模块就不会自动下载了；但对于项目而言，npm install 会自动下载 devDependencies 和 dependencies 下面的模块。

## npm 指令

- npm info xxx 查看 xxx 的最新版本情况

## npx 指令

- npx 让调用项目内部模块的命令简单起来。npx 的原理很简单，就是运行的时候，会到 node_modules/.bin 路径和环境变量 $PATH 里面，检查命令是否存在(webpack5.2.0 以上版本支持)
- 避免全局安装模块，`npx create-react-app my-react-app` npx 将 create-react-app 下载到一个临时目录，使用以后再删除。所以，以后再次执行上面的命令，会重新下载 create-react-app

## package-lock.json 的作用

- `package-lock.json` 在 npm 修改 `node_modules` 树或 `package.json` 时自动生成，描述本次安装生成的确切依赖树，让后续安装无论中间依赖是否更新，都能生成相同的树
- 这个文件应提交到源码仓库：团队成员、部署环境和持续集成都能据此安装完全一致的依赖，也可以不提交 `node_modules` 就回溯到之前的依赖状态
- lockfile 让依赖树的变化可以通过源码控制 diff 查看，也允许 npm 跳过对已安装包的重复元数据解析，优化安装过程
- 锁文件记录了每个包的实际版本、来源位置和完整性校验信息，版本范围写在 `package.json` 里，实际安装到的版本由锁文件确定
- 锁文件是 `package.json` 的落地清单：`package.json` 声明期望的版本范围，锁文件固化解析出来的确切依赖树，两者配合保证可重复安装

## 锁定记录里的 resolved 与 integrity

- `packages` 对象把包位置映射到对应信息：`version` 是包在 `package.json` 里找到的版本，`resolved` 是包实际解析到的来源（registry 上是 tarball 的 URL，git 依赖是带 commit sha 的 git URL，链接依赖是链接目标位置）
- `integrity` 是该产物解压时所用的 sha512 或 sha1 子资源完整性字符串，用于校验安装下来的包内容是否和发布时一致
- `link` 标记表示这是符号链接；`dev`、`optional`、`devOptional` 等标记标明包属于哪一类依赖树
- `lockfileVersion` 标识锁文件格式版本：npm v5、v6 使用 1，npm v7、v8 使用 2，npm v9 及以上使用 3，新版本向后兼容旧版本

## 依赖分组与 scripts

- `dependencies` 映射包名到版本范围，是运行包时需要的依赖；测试框架、转译器、文档工具这类只在开发阶段使用的工具放在 `devDependencies`，不应进入运行时依赖
- `optionalDependencies` 里的依赖找不到或安装失败时不会让安装整体失败，程序自身需要处理该依赖缺失的情况；`peerDependencies` 用于表达包对宿主工具或库的版本兼容要求
- `scripts` 字段是一个字典，键是生命周期事件或自定义命令名，值是要执行的命令；通过 `npm run <脚本名>` 运行，例如构建、启动、测试等常用命令都可以收拢在这里
- 版本范围支持 `~`、`^`、`x` 通配、区间和 `||` 组合等写法；`~` 锁定到次版本号，`^` 锁定到大版本号，具体兼容边界以 semver 规则为准
- 锁文件随 `node_modules` 树或 `package.json` 的修改自动更新，团队协作时应把 `package-lock.json` 一起提交，避免不同人安装到不同版本的依赖
- 发布自己的包时，`dependencies` 下的模块会作为依赖一起被下载，`devDependencies` 下的构建、测试工具不会随包自动安装给使用者
- `package.json` 的 `name` 和 `version` 是包的基本标识；`main` 字段是程序入口，未设置时默认取包根目录的 `index.js`
- `bin` 字段把命令名映射到包内可执行文件，包全局安装时该文件会被链接到全局命令目录，从而可以在终端直接按命令名执行
- 版本范围里写死版本号只匹配该版本，`x` 通配可以匹配次版本号或补丁位，区间和 `||` 组合用于表达多个可接受范围
- `optionalDependencies` 标记的包安装失败不会让整个安装中断，程序需要自行处理该依赖不存在的情况

## 参考

- https://docs.npmjs.com/cli/v10/configuring-npm/package-lock-json
- https://docs.npmjs.com/cli/v10/configuring-npm/package-json
