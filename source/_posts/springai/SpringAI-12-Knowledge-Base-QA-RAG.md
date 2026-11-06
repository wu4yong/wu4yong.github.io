---
title: 十二、《基于RAG技术的个人知识库AI问答系统》实战
date: 2026-09-12 01:00:00
categories:
  - springai
tags:
  - SpringAi
---

<div class="essay-banner essay-image11">
   <!-- Knowledge Base QA (RAG) -->
</div>

### V1.0

1. 基本功能+核心功能
2. 前端和后端分开2个文件夹

### V2.0

1. 前端和后端在一个文件夹， 方便vibe coding
2. 加入supersql实现text-tosql
3. 实现跨向量聚合问题
4. 实现来源追溯
5. 实现文档更新
6. 继续更新...

<div class="img-wrap-left"><img class="left-img" src="/assets/img/springai/ch12_1766926120899-f9d183f2-7261-46c0-b862-534db6b5e763_eefcd501a4.png" alt="ch12_1766926120899-f9d183f2-7261-46c0-b862-534db6b5e763_eefcd501a4.png"></div>

链接:  
可参考： https://gitee.com/hongpo/rag-ai  

## 核心功能

上传资料

<div class="img-wrap-left"><img class="left-img" src="/assets/img/springai/ch12_1762497927395-9dfed957-f9fa-4de4-b1b3-61f758b4b70e_7ad7ab6454.png" alt="ch12_1762497927395-9dfed957-f9fa-4de4-b1b3-61f758b4b70e_7ad7ab6454.png"></div>

AI对话

<div class="img-wrap-left"><img class="left-img" src="/assets/img/springai/ch12_1762498003194-37811731-71c0-4248-a667-88d0f0c4f6f3_39b585f765.png" alt="ch12_1762498003194-37811731-71c0-4248-a667-88d0f0c4f6f3_39b585f765.png"></div>

## 其他功能

对话记录

<div class="img-wrap-left"><img class="left-img" src="/assets/img/springai/ch12_1762498080549-e4b17165-56ec-458e-8c45-a8506ee3ead1_b642193944.png" alt="ch12_1762498080549-e4b17165-56ec-458e-8c45-a8506ee3ead1_b642193944.png"></div>

敏感词管理

<div class="img-wrap-left"><img class="left-img" src="/assets/img/springai/ch12_1762498110597-7b962d3f-592a-4ae9-811f-17a919aa2406_f511650802.png" alt="ch12_1762498110597-7b962d3f-592a-4ae9-811f-17a919aa2406_f511650802.png"></div>

热词统计

<div class="img-wrap-left"><img class="left-img" src="/assets/img/springai/ch12_1762498124990-1eea857c-397b-4e84-a163-576ac963f839_72ce2d3261.png" alt="ch12_1762498124990-1eea857c-397b-4e84-a163-576ac963f839_72ce2d3261.png"></div>

前端（提供）：  Vue 3 + TypeScript + Vite

后端：

+ Spring Boot: 3.4.2
+ JDK: 17
+ spring-ai: 1.0.0 GA
+ spring-ai-alibaba: 1.0.0.2
+ maven: 3.9.6
+ Mysql 5.7
+ Milvus(向量存储)
+ LLM使用的通义千问
+ 对象存储使用阿里云OSS (上传RAG资料）
