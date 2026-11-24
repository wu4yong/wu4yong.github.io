---
title: Git-在IDEA中使用Git
date: 2018-02-05 16:02:24
categories:
  - git
tags:
  - git
---
<div class="essay-banner essay-git"></div>

# 5. 在IDEA中使用Git

通过Git命令可以完成Git相关操作，为了简化操作过程，我们可以在IEDA中配置Git，配置好后就可以在IDEA中通过图形化的方式来操作Git。

## 5.1 在IDEA中配置Git

在IDEA中使用Git，本质上还是使用的本地安装的Git软件，所以需要提前安装好Git并在IDEA中配置Git。

Git安装目录：

![image49.png](@@CDN@@/assets/img/git/5/image49.webp)

解释说明：

*git.exe：Git安装目录下的可执行文件，前面执行的git命令，其实就是执行的这个文件*

IDEA中的配置：

![image50.png](@@CDN@@/assets/img/git/5/image50.webp)

说明：如果Git安装在默认目录中（C:\\Program Files\\Git），则IDEA中无需再手动配置，直接就可以使用。

## 5.2 获取Git仓库

在IDEA中获取Git仓库有两种方式：

本地初始化仓库，本质就是执行 git init 命令

从远程仓库克隆，本质就是执行 git clone 命令

### 5.2.1 本地初始化仓库

在IDEA中通过如下操作可以在本地初始化一个本地仓库，其实底层就是执行的 git init 命令。操作过程如下：

1）依次选择菜单【VCS】---【Import into Version Control】---【Create Git Repository】

![image51.png](@@CDN@@/assets/img/git/5/image51.webp)

2）在弹出的【Create Git Repository】对话框中选择当前项目根目录，点击【OK】按钮：

![image52.png](@@CDN@@/assets/img/git/5/image52.webp)

操作完成后可以看到当前项目根目录下出现了.git隐藏目录：

![image53.png](@@CDN@@/assets/img/git/5/image53.webp)

操作完成后可以在IDEA的工具栏中看到Git的相关操作图标：

![image54.png](@@CDN@@/assets/img/git/5/image54.webp)

### 5.2.2 从远程仓库克隆

在IDEA中从远程仓库克隆本质就是执行的 git clone 命令，具体操作过程如下：

1）在IDEA开始窗口中点击【Get from Version Control】

![image55.png](@@CDN@@/assets/img/git/5/image55.webp)

2）在弹出的【Get from Version Control】窗口中输入远程仓库的URL地址和对应的本地仓库存放目录，点击【Clone】按钮进行仓库克隆操作

![image56.png](@@CDN@@/assets/img/git/5/image56.webp)

## 5.3 Git忽略文件

在Git工作区中有一个特殊的文件 .gitignore，通过此文件可以指定工作区中的哪些文件不需要Git管理。我们在码云上创建Git远程仓库时可以指定生成此文件，如下：

![image57.png](@@CDN@@/assets/img/git/5/image57.webp)

创建完成后效果如下：

![image58.png](@@CDN@@/assets/img/git/5/image58.webp)

解释说明：

*1）我们在使用Git管理项目代码时，并不是所有文件都需要Git管理，例如Java项目中编译的.class文件、开发工具自带的配置文件等，这些文件没有必要交给Git管理，所以也就不需要提交到Git版本库中*

*2）注意忽略文件的名称是固定的，不能修改*

*3）添加到忽略列表中的文件后续Git工具就会忽略它*

一个参考的.gitignore文件内容如下：

```text
.git
logs
rebel.xml
target/
!.mvn/wrapper/maven-wrapper.jar
log.path_IS_UNDEFINED
.DS_Store
offline_user.md
*.class

### IntelliJ IDEA ###
.idea
*.iws
*.iml
*.ipr
```

## 5.4 本地仓库操作

本地仓库操作：

将文件加入暂存区，本质就是执行 git add 命令

将暂存区的文件提交到版本库，本质就是执行 git commit 命令

查看日志，本质就是执行 git log 命令

### 5.4.1 将文件加入暂存区

当在Git工作区新增文件或者对已有文件修改后，就需要将文件的修改加入暂存区，具体操作如下：

![image59.png](@@CDN@@/assets/img/git/5/image59.webp)

### 5.4.2 将暂存区文件提交到版本库

将暂存区文件提交到版本库，可以选择一个文件进行提交，也可以选择整个项目提交多个文件。在IEDA中对文件的提交进行了简化操作，也就是如果文件修改后，无需再加入暂存区，可以直接提交。

1）提交一个文件：

![image60.png](@@CDN@@/assets/img/git/5/image60.webp)

可以看到，如果选中一个文件提交，则菜单名称为【Commit File...】

2）提交多个文件：

![image61.png](@@CDN@@/assets/img/git/5/image61.webp)

可以看到，如果提交多个文件，则菜单名称为【Commit Directory...】

由于提交操作属于高频操作，所以为了进一步方便操作，在IDEA的工具栏中提供了提交操作的快捷按钮：

![image62.png](@@CDN@@/assets/img/git/5/image62.webp)

### 5.4.3 查看日志

查看日志，既可以查看整个仓库的提交日志，也可以查看某个文件的提交日志。

1）查看整个项目的提交日志：

![image63.png](@@CDN@@/assets/img/git/5/image63.webp)

![image64.png](@@CDN@@/assets/img/git/5/image64.webp)

2）查看某个文件的提交日志

![image65.png](@@CDN@@/assets/img/git/5/image65.webp)

![image66.png](@@CDN@@/assets/img/git/5/image66.webp)

## 5.5 远程仓库操作

远程仓库操作：

查看远程仓库，本质就是执行 git remote 命令

添加远程仓库，本质就是执行 git remote add 命令

推送至远程仓库，本质就是执行 git push 命令

从远程仓库拉取，本质就是执行 git pull 命令

### 5.5.1 查看远程仓库

操作过程如下：

![image67.png](@@CDN@@/assets/img/git/5/image67.webp)

在弹出的【Git Remotes】窗口中可以看到配置的远程仓库：

![image68.png](@@CDN@@/assets/img/git/5/image68.webp)

### 5.5.2 添加远程仓库

一个本地仓库可以配置多个远程仓库，在【Git Remotes】窗口中点击【+】来添加一个新的远程仓库：

![image69.png](@@CDN@@/assets/img/git/5/image69.webp)

### 5.5.3 推送至远程仓库

可以通过如下操作将本地仓库文件推送至远程仓库：

![image70.png](@@CDN@@/assets/img/git/5/image70.webp)

在弹出的【Push Commits】窗口中可以看到本次推送的文件，点击【Push】按钮即可推送至远程仓库：

![image71.png](@@CDN@@/assets/img/git/5/image71.webp)

由于推送至远程仓库操作属于高频操作，所以可以通过IDEA工具栏中的提交快捷按钮同时完成提交和推送：

![image72.png](@@CDN@@/assets/img/git/5/image72.webp)

点击【Commit and Push...】按钮同时完成提交和推送操作

### 5.5.4 从远程仓库拉取

可以通过如下操作从远程仓库拉取：

![image73.png](@@CDN@@/assets/img/git/5/image73.webp)

由于从远程仓库拉取文件属于高频操作，所以在IDEA的工具栏中提供了对应的快捷按钮：

![image74.png](@@CDN@@/assets/img/git/5/image74.webp)

在弹出的【Update Project】窗口中点击【OK】：

![image75.png](@@CDN@@/assets/img/git/5/image75.webp)

## 5.6 分支操作

分支操作：

查看分支，本质就是执行 git branch 命令

创建分支，本质就是执行 git branch 分支名 命令

切换分支，本质就是执行 git checkout 命令

将分支推送到远程仓库，本质就是执行 git push 命令

合并分支，本质就是执行 git merge 命令

### 5.6.1 查看分支

可以通过如下操作查看分支：

![image76.png](@@CDN@@/assets/img/git/5/image76.webp)

在弹出的窗口中可以看到本地分支和远程分支：

![image77.png](@@CDN@@/assets/img/git/5/image77.webp)

由于分支操作属于高频操作，所以在IDEA的状态栏中提供了分支操作的快捷按钮：

![image78.png](@@CDN@@/assets/img/git/5/image78.webp)

点击【master】快捷按钮即可弹出【Git Branches】分支窗口：

![image79.png](@@CDN@@/assets/img/git/5/image79.webp)

### 5.6.2 创建分支

在【Git Branches】分支窗口中点击【New Branch】，弹出如下窗口：

![image80.png](@@CDN@@/assets/img/git/5/image80.webp)

在弹出的【Create New Branch】窗口中输入新分支的名称，点击【Create】按钮完成分支创建

### 5.6.3 切换分支

通过如下操作可以切换分支：

![image81.png](@@CDN@@/assets/img/git/5/image81.webp)

### 5.6.4 将分支推送到远程仓库

通过如下操作可以将分支推送到远程仓库：

![image82.png](@@CDN@@/assets/img/git/5/image82.webp)

### 5.6.5 合并分支

通过下面操作可以进行分支的合并：

![image83.png](@@CDN@@/assets/img/git/5/image83.webp)
