---
title: Git-代码托管服务
date: 2025-08-03 01:00:00
categories:
  - java
tags:
  - git
---
<div class="essay-banner essay-image3"></div>

# 3. Git代码托管服务

## 3.1 常用的Git代码托管服务

Git中存在两种类型的仓库，即**本地仓库**和**远程仓库**。那么我们如何搭建Git**远程仓库**呢？

我们可以借助互联网上提供的一些代码托管服务来实现，其中比较常用的有GitHub、码云、GitLab等。

{% autogrid data-grid-link-table nofix %}
 名称        | 网址                        | 说明                                                  
 gitHub      | https://github.com/       | 一个面向开源及私有软件项目的托管平台，因为只支持Git 作为唯一的版本库格式进行托管，故名gitHub 
 码云        | https://gitee.com/        | 国内的一个代码托管平台，由于服务器在国内，所以相比于GitHub，码云速度会更快            
 GitLab      | https://about.gitlab.com/ | 一个用于仓库管理系统的开源项目，使用Git作为代码管理工具，并在此基础上搭建起来的web服务      
BitBucket    | https://bitbucket.org/    | 一家源代码托管网站，采用Mercurial和Git作为分布式版本控制系统，同时提供商业计划和免费账户  
{% endautogrid %}

## 3.2 码云代码托管服务

码云网址：

**\[该类型的内容暂不支持下载\]**

<div class="img-wrap-left"><img class="left-img" src="/assets/img/git/3/image11.png" alt="image11.png"></div>

使用码云的操作流程如下：

注册码云账号

登录码云

创建远程仓库

邀请其他用户成为仓库成员

### 3.2.1 注册码云账号

注册网址：

**\[该类型的内容暂不支持下载\]**

<div class="img-wrap-left"><img class="left-img" src="/assets/img/git/3/image12.png" alt="image12.png"></div>

### 3.2.2 登录码云

注册完成后可以使用刚刚注册的邮箱进行登录，登录地址：

**\[该类型的内容暂不支持下载\]**

<div class="img-wrap-left"><img class="left-img" src="/assets/img/git/3/image13.png" alt="image13.png"></div>

### 3.2.3 创建远程仓库

登录成功后可以创建远程仓库，操作方式如下：

<div class="img-wrap-left"><img class="left-img" src="/assets/img/git/3/image14.png" alt="image14.png"></div>

页面跳转到新建仓库页面：

<div class="img-wrap-left"><img class="left-img" src="/assets/img/git/3/image15.png" alt="image15.png"></div>

解释说明：

仓库名称：必填，每个仓库都需要有一个名称，同一个码云账号下的仓库名称不能重复

路径：访问远程仓库时会使用到，一般无需手动指定，和仓库名称自动保持一致

开源：所有人都可以查看此仓库

私有：只有此仓库的成员可见，其他人不可见

创建完成后可以查看仓库信息：

<div class="img-wrap-left"><img class="left-img" src="/assets/img/git/3/image16.png" alt="image16.png"></div>

**注意**：每个Git远程仓库都会对应一个网络地址，点击【克隆/下载】按钮，在弹出窗口点击【复制】按钮即可复制网络地址，地址如下：

**\[该类型的内容暂不支持下载\]**

### 3.2.4 邀请其他用户成为仓库成员

前面已经在码云上创建了自己的远程仓库，目前仓库成员只有自己一个人（身份为管理员）。在企业实际开发中，一个项目往往是由多个人共同开发完成的，为了使多个参与者都有权限操作远程仓库，就需要邀请其他项目参与者成为当前仓库的成员。

点击管理按钮进入仓库管理页面，左侧菜单中可以看到【仓库成员管理】：

<div class="img-wrap-left"><img class="left-img" src="/assets/img/git/3/image17.png" alt="image17.png"></div>

点击【开发者】菜单，跳转到如下页面：

<div class="img-wrap-left"><img class="left-img" src="/assets/img/git/3/image18.png" alt="image18.png"></div>

点击【添加仓库成员】菜单下的【邀请用户】菜单，跳转到如下页面：

<div class="img-wrap-left"><img class="left-img" src="/assets/img/git/3/image19.png" alt="image19.png"></div>

可以看到邀请用户有多种方式：链接邀请、直接添加、通过仓库邀请成员

**注意**：被邀请用户必须为码云的注册用户，否则无法成为仓库成员
