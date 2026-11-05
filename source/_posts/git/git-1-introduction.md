---
title: Git-前言
date: 2025-08-01 01:00:00
categories:
  - java
tags:
  - git
---
<div class="essay-banner essay-image1"></div>

# 1. 前言

## 1.1 什么是Git

Git是一个分布式版本控制工具，主要用于管理开发过程中的源代码文件（Java类、xml文件、html页面等），在软件开发过程中被广泛使用。

在IDEA开发工具中可以集成Git（后面会讲解Git安装和集成过程）：

<div class="img-wrap-left"><img class="left-img" src="/assets/img/git/1/image1.png" alt="image1.png"></div>

集成后在IDEA中可以看到Git相关图标：

<div class="img-wrap-left"><img class="left-img" src="/assets/img/git/1/image2.png" alt="image2.png"></div>

可以通过启动两个IDEA窗口模拟两个开发人员来展示Git的使用：

<div class="img-wrap-left"><img class="left-img" src="/assets/img/git/1/image3.png" alt="image3.png"></div>

其他的版本控制工具：

SVN

CVS

VSS

## 1.2 使用Git能做什么

代码回溯：Git在管理文件过程中会记录日志，方便回退到历史版本

版本切换：Git存在分支的概念，一个项目可以有多个分支（版本），可以任意切换

多人协作：Git支持多人协作，即一个团队共同开发一个项目，每个团队成员负责一部分代码，通过Git就可以管理和协调

远程备份：Git通过仓库管理文件，在Git中存在远程仓库，如果本地文件丢失还可以从远程仓库获取
