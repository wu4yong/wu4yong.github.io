---
title: 技术文档总结-webAssembly介绍
date: 2018-01-29 03:00:00
categories:
  - web
tags:
  - web
---

<div class="essay-banner essay-tech"></div>

# 技术文档总结

## WebAssembly简介

- WebAssembly 由高级语言（如 C/C++、Rust 等）编译生成，具有接近原生性能的优势。
- WebAssembly 是 `二进制`、`字节码` 格式，只要浏览器支持 WebAssembly 协议，就可以在浏览器中直接运行。

## 一、斐波那契实现

```bash
# 安装 Emscripten
git clone https://github.com/emscripten-core/emsdk.git
cd emsdk
./emsdk install latest
./emsdk activate latest
source ./emsdk_env.sh  # Linux/Mac
# 或 emsdk_env.bat （Windows）
```

```c
// fib.c
#include <emscripten.h>

// 斐波那契（快速倍增法，O(log n)）
static void fib_pair(int n, int *fn, int *fn1) {
    if (n == 0) {
        *fn = 0;
        *fn1 = 1;
        return;
    }
    int a, b; // F(k), F(k+1)
    fib_pair(n >> 1, &a, &b);
    long long c = (long long)a * (2LL * b - a);      // F(2k)
    long long d = (long long)a * a + (long long)b * b; // F(2k+1)
    if (n & 1) {
        *fn = (int)d;
        *fn1 = (int)(c + d);
    } else {
        *fn = (int)c;
        *fn1 = (int)d;
    }
}

EMSCRIPTEN_KEEPALIVE
int fib(int n) {
    if (n < 0) return 0; // 简单防御
    int fn, fn1;
    fib_pair(n, &fn, &fn1);
    return fn;
}
```

```bash
# 编译 c 代码
emcc \                       # Emscripten 的编译器驱动程序，用于将 C/C++ 编译为 Wasm
  fib.c \                    # 源文件
  -O3 \                      # GCC 风格的优化参数，开启最高级别优化（减少代码体积、提升执行速度）
  -s MODULARIZE=1 \          # 生成模块化的JavaScript包装器
  -s EXPORT_ES6=1 \          # 使用ES6模块语法导出接口
  -s SINGLE_FILE=1 \         # 生成单个JavaScript文件（包含Wasm和胶水代码）
  -s EXPORTED_FUNCTIONS='[_fib]' \  # 显式导出C函数到JavaScript
  -o fib.js                  # 指定输出文件名
```

```html
// index.html
<script type="module">
  import createModule from './fib.js';
  const Module = await createModule();
  Module._fib(45);
</script>
```

## 模块、实例与内存

- Module 是浏览器编译后的 WebAssembly 二进制模块，本身无状态，可以经 `postMessage()` 在窗口与 worker 之间共享
- Instance 是模块与其运行时状态的配对，包含 Memory、Table 和导入值；JavaScript 可以同步调用实例导出的函数
- Memory 是可增长的线性字节数组，供 Wasm 的内存访问指令读写；Table 用于存放函数等无法以原始字节存储的引用
- JS 侧通过 WebAssembly JavaScript API 创建模块、内存、表和实例，导入的 JS 函数也可以被 Wasm 同步调用

## 文本格式 WAT 与编译链路

- 二进制格式有一一对应的可读文本格式（WAT），可以手写或由工具生成，再经文本转二进制工具编译为 wasm 文件
- 一般场景使用 C/C++、Rust 等高级语言经编译器输出 Wasm；Emscripten 还会生成加载模块所需的胶水代码与 HTML 页面
- Wasm 不能直接访问 DOM，只能调用 JavaScript，再由 JavaScript 调用对应的 Web API

## 适用场景与边界

- Wasm 面向计算密集型、对性能要求高的场景，例如 3D 渲染、图像处理、音视频处理与算法计算
- Wasm 与 JavaScript 互为补充，不是替代关系；应用的界面与业务逻辑仍可由 JS 编写
- 模块下载、编译和实例化是异步过程，JS 侧需要在实例就绪后再调用导出函数

## 参考

- https://developer.mozilla.org/en-US/docs/WebAssembly/Guides/Concepts
- https://webassembly.org/
