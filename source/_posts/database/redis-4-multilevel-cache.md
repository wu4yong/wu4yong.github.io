---
title: Redis-多级缓存
date: 2025-09-04 01:00:00
categories:
  - database
tags:
  - redis
---
<div class="essay-banner essay-image4"></div>

# 四、多级缓存

传统的缓存策略是请求到达Tomcat后，先查Redis缓存，如果Redis缓存未命中则查数据库。如果Redis缓存失效会对数据库产生冲击，而且Tomcat也会成为整个系统的瓶颈。

多级缓存就是充分利用请求处理的每个环节，分别添加缓存，减轻Tomcat压力，提升服务性能：

<div class="img-wrap-left"><img class="left-img" src="https://cdn.jsdelivr.net/gh/wu4yong/starry-images@main/assets/img/redis/4/image116.png" alt="image116.png"></div>

浏览器访问静态资源时，优先读取浏览器本地缓存，访问非静态资源（Ajax查数据）时，访问服务器，当请求到达Nginx后，优先读取**Nginx本地缓存**，如果Nginx本地缓存未命中，则去查Redis缓存（不经过Tomcat），若Redis也没命中，则查Tomcat内的**JVM进程缓存**，如果JVM进程缓存也没命中，最后才查数据库。

在多级缓存架构中，Nginx内部需要编写本地缓存查询、Redis查询、Tomcat查询的业务逻辑，因此这样的nginx不再是一个反向代理服务器，而是一个编写**业务的Web服务器**，所以需要搭建Nginx集群，再由专门的Nginx反向代理。同理，Tomcat也需要搭建集群。最终的多级缓存架构如下：

<div class="img-wrap-left"><img class="left-img" src="https://cdn.jsdelivr.net/gh/wu4yong/starry-images@main/assets/img/redis/4/image117.png" alt="image117.png"></div>

## 1.JVM进程缓存

### 1.1 导入案例

### 1.1.1 安装MySQL

为了方便后期配置MySQL，先准备两个目录，用于挂载容器的数据和配置文件目录：

```bash
# 进入/tmp目录
cd /tmp
# 创建文件夹
mkdir mysql
# 进入mysql目录
cd mysql
```

进入mysql目录后，执行以下Docker命令：

```powershell
docker run 
-p 3306:3306 
--name mysql 
-v $PWD/conf:/etc/mysql/conf.d 
-v $PWD/logs:/logs 
-v $PWD/data:/var/lib/mysql 
-e MYSQL_ROOT_PASSWORD=123 
--privileged 
-d 
mysql:5.7.25
```

在/tmp/mysql/conf目录添加一个my.cnf文件，作为mysql的配置文件：

```bash
# 创建文件
touch /tmp/mysql/conf/my.cnf
```

文件内容：

```properties
[mysqld]
skip-name-resolve
character_set_server=utf8
datadir=/var/lib/mysql
server-id=1000
```

配置修改后，必须重启容器：

```powershell
docker restart mysql
```

### 1.1.2 导入SQL

**[item.sql]**

使用MySQL工具连接上MySQL，运行上面提供的item.sql脚本文件，得到两张表：

tb_item：商品表，包含商品的基本信息

tb_item_stock：商品库存表，包含商品的库存信息

### 1.1.3 导入Demo工程

**[item-service.zip]**

导入上面的item-service项目到IDEA，最终项目结构如下：

<div class="img-wrap-left"><img class="left-img" src="https://cdn.jsdelivr.net/gh/wu4yong/starry-images@main/assets/img/redis/4/image118.png" alt="image118.png"></div>

修改配置文件的MySQL信息为自己的数据库信息：

```yaml
spring:
application:
name: itemservice
datasource:
url: jdbc:mysql://127.0.0.1:3306/heima?useSSL=false
username: root
password: 123456
driver-class-name: com.mysql.jdbc.Driver
```

启动服务，访问http://localhost:8081/item/10001即可查询数据。

### 1.1.4 启动Nginx

**[nginx-1.18.1.zip]**

将上面的nginx-1.18.1文件夹拷贝到一个不含中文和空格的目录下，双击nginx.exe运行。访问 http://localhost/item.html?id=10001就可以看到商品查询页面。

### 1.2 初识Caffeine

缓存可以分为两类：

分布式缓存，例如Redis：

优点：存储容量更大、可靠性更好、可以在集群间共享

缺点：访问缓存有网络开销

场景：缓存数据量较大、可靠性要求较高、需要在集群间共享

进程本地缓存，例如HashMap、GuavaCache：

优点：读取本地内存，没有网络开销，速度更快

缺点：存储容量有限、可靠性较低、无法共享

场景：性能要求较高，缓存数据量较小

**Caffeine**是基于Java8开发的，提供了近乎最佳命中率的高性能的本地缓存库，目前Spring内部的缓存使用的就是Caffeine。

Caffeine的Github网址：

**[该类型的内容暂不支持下载]**

Caffeine基本使用：

```java
@Test
void testBasicOps() {
// 构建cache对象
Cache<String, String> cache = Caffeine.newBuilder().build();
// 存数据
cache.put("gf", "迪丽热巴");
// 取数据
String gf = cache.getIfPresent("gf");
System.out.println("gf = " + gf);
// 取数据，包含两个参数：
// 参数一：缓存的key
// 参数二：Lambda表达式，表达式参数就是缓存的key，方法体是查询数据库的逻辑
// 优先根据key查询JVM缓存，如果未命中，则执行参数二的Lambda表达式
String defaultGF = cache.get("defaultGF", key -> {
// 根据key去数据库查询数据
return "柳岩";
});
System.out.println("defaultGF = " + defaultGF);
}
```

Caffeine有三种**缓存驱逐策略**，用于清除缓存，避免内存消耗：

基于容量：设置缓存的数量上限

```java
// 创建缓存对象
Cache<String, String> cache = Caffeine.newBuilder()
.maximumSize(1) // 设置缓存大小上限为1
.build();
```

基于时间：设置缓存的有效时间

```java
// 创建缓存对象
Cache<String, String> cache = Caffeine.newBuilder()
// 设置缓存有效期为10秒，最后一次写入经过10秒未被访问就清除
.expireAfterWrite(Duration.ofSeconds(10))
.build();
```

基于引用：设置缓存为软引用或弱引用，利用GC来回收缓存数据。性能较差，不建议使用。

|                                                                                 |
| ------------------------------------------------------------------------------- |
| **注意**：在默认情况下，当一个缓存元素过期的时候，Caffeine不会自动立即将其清理和驱逐，而是在一次读或写操作后，或者在空闲时间完成对失效数据的驱逐。 |

### 1.3 实现JVM进程缓存

需求：

给根据id查询商品的业务添加缓存，缓存未命中时查询数据库

给根据id查询商品库存的业务添加缓存，缓存未命中时查询数据库

缓存初始大小为100

缓存上限为10000

在com.heima.item.config包下定义配置类CaffeineConfig，其中定义两个Caffeine缓存对象，分别保存商品、库存的缓存数据：

```java
@Configuration
public class CaffeineConfig {
@Bean
public Cache<Long, Item> itemCache() {
return Caffeine.newBuilder()
.initialCapacity(100) //初始大小为100
.maximumSize(10_000) //缓存上限为10000
.build();
}

@Bean
public Cache<Long, ItemStock> stockCache() {
return Caffeine.newBuilder()
.initialCapacity(100) //初始大小为100
.maximumSize(10_000) //缓存上限为10000
.build();
}
}
```

修改ItemController类，添加缓存逻辑：

```java
@RestController
@RequestMapping("item")
public class ItemController {
@Autowired
private Cache<Long, Item> itemCache;
@Autowired
private Cache<Long, ItemStock> stockCache;

//...其它略

@GetMapping("/{id}")
public Item findById(@PathVariable("id") Long id) {
return itemCache.get(id, key -> itemService.query()
.ne("status", 3).eq("id", key)
.one()
);
}

@GetMapping("/stock/{id}")
public ItemStock findStockById(@PathVariable("id") Long id) {
return stockCache.get(id, key -> stockService.getById(key));
}
}
```

## 2.Lua语法入门

Lua官网：

**[该类型的内容暂不支持下载]**

### 2.1 HelloWorld

CentOS7默认已经安装了Lua语言环境，所以可以直接运行Lua代码。

在Linux虚拟机的任意目录下新建一个hello.lua文件：touch hello.lua

使用vi/vim编辑hello.lua，添加如下内容：

```lua
print("Hello World!")
```

执行指令运行hello.lua脚本：lua hello.lua

### 2.2 变量和循环

### 2.2.1 Lua的数据类型

<div class="img-wrap-left"><img class="left-img" src="https://cdn.jsdelivr.net/gh/wu4yong/starry-images@main/assets/img/redis/4/image119.png" alt="image119.png"></div>

可以通过type()函数判断数据类型，如print(type('Hello World'))输出结果为string

### 2.2.2 声明变量

Lua声明变量无需指定数据类型，而是用local来声明变量为局部变量：

```lua
-- 声明字符串，可以用单引号或双引号
local str = 'hello'
-- 字符串拼接使用 ..
local str2 = 'hello' .. 'world'
-- 声明数字
local num = 21
-- 声明布尔类型
local flag = true
```

Lua中的table类型既可以作为数组，又可以作为Java中的Map来使用。数组就是特殊的table，只是key是数组角标而已：

```lua
-- 声明数组 ，key为角标的 table
local arr = {'java', 'python', 'lua'}
-- 声明table，类似java的map
local map = {name='Jack', age=21}
```

Lua中的数组角标是从1开始，访问的时候与Java中类似：

```lua
-- 访问数组第一个元素，lua数组的角标从1开始
print(arr[1])
```

Lua中的table可以用key来访问：

```lua
-- 访问table
print(map['name'])
print(map.name)
```

### 2.2.3 循环

对于table，可以利用for循环来遍历，不过数组和普通table遍历略有差异。

遍历数组：

```lua
-- 声明数组 key为索引的 table
local arr = {'java', 'python', 'lua'}
-- 遍历数组
for index,value in ipairs(arr) do
print(index, value)
end
```

遍历普通table

```lua
-- 声明map，也就是table
local map = {name='Jack', age=21}
-- 遍历table
for key,value in pairs(map) do
print(key, value)
end
```

### 2.3 条件控制、函数

### 2.3.1 函数

定义函数语法：

```lua
function 函数名(argument1, argument2..., argumentn)
-- 函数体
return 返回值
end
```

例如，定义printArr函数打印数组：

```lua
function printArr(arr)
for index, value in ipairs(arr) do
print(value)
end
end
```

### 2.3.2 条件控制

条件分支语句语法：

```lua
if(布尔表达式) then
--[ 布尔表达式为 true 时执行该语句块 --]
else
--[ 布尔表达式为 false 时执行该语句块 --]
end
```

与JAVA不同的是，布尔表达式中的逻辑运算是基于英文单词：

<div class="img-wrap-left"><img class="left-img" src="https://cdn.jsdelivr.net/gh/wu4yong/starry-images@main/assets/img/redis/4/image120.png" alt="image120.png"></div>

例如，自定义printArr函数打印table，当参数为nil时打印错误信息：

```lua
function printArr(arr)
if not arr then
print('数组不能为空！')
return
end
for index, value in ipairs(arr) do
print(value)
end
end
```

## 3.实现多级缓存

### 3.1 安装OpenResty

OpenResty是一个基于Nginx的高性能 Web 平台，用于方便地搭建能够处理超高并发、扩展性极高的动态 Web 应用、Web 服务和动态网关。具备下列特点：

具备Nginx的完整功能

基于Lua语言进行扩展，集成了大量精良的 Lua 库、第三方模块

允许使用Lua**自定义业务逻辑**、**自定义库**

官方网站：

**[该类型的内容暂不支持下载]**

### 3.1.1 安装

安装OpenResty的依赖开发库，执行命令：

```powershell
yum install -y pcre-devel openssl-devel gcc --skip-broken
```

添加 openresty 仓库，便于未来安装或更新软件包（通过 yum check-update 命令）：

```powershell
#如果yum-config-manager运行失败需要先执行这个指令
yum install -y yum-utils

yum-config-manager --add-repo https://openresty.org/package/centos/openresty.repo
```

安装openresty软件包：

```powershell
yum install -y openresty
```

安装OpenResty的管理工具opm，opm可以帮助我们安装一个第三方的Lua模块：

```powershell
yum install -y openresty-opm
```

默认情况下，OpenResty安装的目录是/usr/local/openresty，目录结构如下：

<div class="img-wrap-left"><img class="left-img" src="https://cdn.jsdelivr.net/gh/wu4yong/starry-images@main/assets/img/redis/4/image121.png" alt="image121.png"></div>

通过nginx目录可以看到，OpenResty就是在Nginx基础上集成了一些Lua模块。

配置nginx的环境变量：

```bash
# 打开配置文件
vi /etc/profile

# 在配置文件最下面添加如下内容
# NGINX_HOME就是OpenResty安装目录下的nginx的目录
export NGINX_HOME=/usr/local/openresty/nginx
export PATH=${NGINX_HOME}/sbin:$PATH

# 让配置生效
source /etc/profile
```

### 3.1.2 启动和运行

OpenResty底层是基于Nginx的，查看OpenResty目录的nginx目录，结构与windows中安装的nginx基本一致：

<div class="img-wrap-left"><img class="left-img" src="https://cdn.jsdelivr.net/gh/wu4yong/starry-images@main/assets/img/redis/4/image122.png" alt="image122.png"></div>

所以运行方式与nginx基本一致：

```powershell
# 启动nginx
nginx
# 重新加载配置
nginx -s reload
# 停止
nginx -s stop
```

由于nginx的默认配置文件注释太多，影响后续编辑，这里将nginx.conf中的注释部分删除，保留有效部分。

修改/usr/local/openresty/nginx/conf/nginx.conf文件，内容如下：

```nginx
#user nobody;
worker_processes 1;
error_log logs/error.log;

events {
worker_connections 1024;
}

http {
include mime.types;
default_type application/octet-stream;
sendfile on;
keepalive_timeout 65;

server {
listen 8081;
server_name localhost;
location / {
root html;
index index.html index.htm;
}
error_page 500 502 503 504 /50x.html;
location = /50x.html {
root html;
}
}
}
```

在Linux的控制台输入命令以启动nginx：

```bash
nginx
```

访问页面http://192.168.150.101:8081，注意ip地址替换为自己的虚拟机IP，就可以看到 Welcome to OpenResty! 页面。

### 3.2 OpenResty快速入门

在多级缓存架构中，Windows上的Nginx用来做反向代理服务，将前端的查询商品的Ajax请求代理到OpenResty集群，OpenResty集群用来编写多级缓存业务。

### 3.2.1 反向代理流程

访问商品查询页http://localhost/item.html?id=10001时，会发送一个GET请求http://localhost/api/item/10001，请求被Windows上的Nginx捕获，并反向代理给OpenResty集群，也就是缓存Nginx集群。

<div class="img-wrap-left"><img class="left-img" src="https://cdn.jsdelivr.net/gh/wu4yong/starry-images@main/assets/img/redis/4/image123.png" alt="image123.png"></div>

我们需要在OpenResty中编写业务，查询商品数据（假数据）并返回到浏览器。

### 3.2.2 OpenResty监听请求

OpenResty的很多功能都依赖于其目录下的Lua库，需要在nginx.conf中指定依赖库的目录，并导入依赖：

添加对OpenResty的Lua模块的加载，修改/usr/local/openresty/nginx/conf/nginx.conf文件，在其中的http下面，添加下面代码：

```nginx
#lua 模块
lua_package_path "/usr/local/openresty/lualib/?.lua;;";
#c模块
lua_package_cpath "/usr/local/openresty/lualib/?.so;;";
```

监听/api/item路径，修改/usr/local/openresty/nginx/conf/nginx.conf文件，在nginx.conf的server下面，添加对/api/item这个路径的监听：

```nginx
location /api/item {
# 默认的响应类型，这里相应的是JSON数据
default_type application/json;
# 响应结果由lua/item.lua文件来决定
content_by_lua_file lua/item.lua;
}
```

### 3.2.3 编写item.lua

在/usr/loca/openresty/nginx/lua文件夹下，新建item.lua文件：

```bash
# 进入nginx目录
cd /usr/local/openresty/nginx
# 创建lua文件夹
mkdir lua
# 创建item.lua文件
touch lua/item.lua
```

在item.lua中，利用ngx.say()函数返回数据到Response中：

```lua
ngx.say('{"id":10001,"name":"SALSA AIR","title":"RIMOWA 16寸托运箱拉杆箱 SALSA AIR系列果绿色 820.70.36.4","price":18900,"image":"https://m.360buyimg.com/mobilecms/s720x720_jfs/t6934/364/1195375010/84676/e9f2c55f/597ece38N0ddcbc77.jpg!q70.jpg.webp","category":"拉杆箱","brand":"RIMOWA","spec":"","status":1,"createTime":"2019-04-30T16:00:00.000+00:00","updateTime":"2019-04-30T16:00:00.000+00:00","stock":2999,"sold":31290}')
```

重新加载配置：

```powershell
nginx -s reload
```

刷新商品页面http://localhost/item.html?id=1001即可看到效果。

### 3.3 请求参数处理

### 3.3.1 获取参数的API

OpenResty中提供了一些API用来获取不同类型的前端请求参数：

<div class="img-wrap-left"><img class="left-img" src="https://cdn.jsdelivr.net/gh/wu4yong/starry-images@main/assets/img/redis/4/image124.png" alt="image124.png"></div>

### 3.3.2 获取参数并返回

由于请求路径http://localhost/api/item/10001使用的路径参数获取商品数据，所以这里使用正则表达式获取ID。

修改/usr/loca/openresty/nginx/nginx.conf文件中监听/api/item的代码，利用正则表达式获取ID：

```nginx
# ~表示这是一个正则路径，()表示分组，d表示任意数字，+表示至少一位数字
location ~ /api/item/(d+) {
# 默认的响应类型
default_type application/json;
# 响应结果由lua/item.lua文件来决定
content_by_lua_file lua/item.lua;
}
```

修改/usr/loca/openresty/nginx/lua/item.lua文件，获取id并拼接到结果中返回：

```lua
-- 获取商品id
local id = ngx.var[1]
-- 拼接并返回
ngx.say('{"id":' .. id .. ',"name":"SALSA AIR","title":"RIMOWA 21寸托运箱拉杆箱 SALSA AIR系列果绿色 820.70.36.4","price":17900,"image":"https://m.360buyimg.com/mobilecms/s720x720_jfs/t6934/364/1195375010/84676/e9f2c55f/597ece38N0ddcbc77.jpg!q70.jpg.webp","category":"拉杆箱","brand":"RIMOWA","spec":"","status":1,"createTime":"2019-04-30T16:00:00.000+00:00","updateTime":"2019-04-30T16:00:00.000+00:00","stock":2999,"sold":31290}')
```

运行命令以重新加载OpenResty配置：

```powershell
nginx -s reload
```

刷新页面通过调试工具可以看到结果中的ID随着路径的变化而变化。

### 3.4 查询Tomcat

此时lua脚本中的数据还是静态的，我们需要实现商品数据从Tomcat获取，再响应给前端：

<div class="img-wrap-left"><img class="left-img" src="https://cdn.jsdelivr.net/gh/wu4yong/starry-images@main/assets/img/redis/4/image125.png" alt="image125.png"></div>

需要注意的是，Tomcat在Windows，而OpenResty在Linux，只需要将Linux上的IP最后一位变成1，前三位不变，就能得到Windows的IP，例如192.168.150.**101**对应到本地Windows就是192.168.150.**1**

### 3.4.1 发送http请求的API

nginx提供了内部API用以发送http请求：

```lua
local resp = ngx.location.capture("/path",{
method = ngx.HTTP_GET, -- 请求方式
args = {a=1,b=2}, -- get方式传参数
body = "c=3&d=4" -- post方式传参数，get请求参数和post请求参数只能使用一个
})
```

返回的响应内容包括：

resp.status：响应状态码

resp.header：响应头，是一个table

resp.body：响应体，就是响应数据

**注意**：这里的path是路径，并不包含IP和端口。这个请求会被nginx内部的server监听并处理，需要编写一个server用于反向代理这个路径到Tomcat：

```nginx
location /path {
# 这里是windows电脑的ip和Java服务端口，需要确保windows防火墙处于关闭状态
proxy_pass http://192.168.150.1:8081;
}
```

<div class="img-wrap-left"><img class="left-img" src="https://cdn.jsdelivr.net/gh/wu4yong/starry-images@main/assets/img/redis/4/image126.png" alt="image126.png"></div>

### 3.4.2 封装http工具

由于请求Tomcat经常使用，这里封装一个工具基于ngx.location.capture来实现查询tomcat。

因为item-service中的接口都是/item开头，所以需要监听/item路径代理到windows上的tomcat服务。修改/usr/local/openresty/nginx/conf/nginx.conf文件，添加一个location：

```nginx
location /item {
proxy_pass http://192.168.150.1:8081; # 使用自己的Linux对应Windows上Tomcat的IP和端口
}
```

在/usr/local/openresty/lualib目录下，新建一个common.lua文件：

```powershell
vi /usr/local/openresty/lualib/common.lua
```

在common.lua脚本中添加以下内容：

```lua
-- 封装函数，发送http请求，并解析响应
local function read_http(path, params)
local resp = ngx.location.capture(path,{
method = ngx.HTTP_GET,
args = params,
})
if not resp then
-- 记录错误信息到/usr/local/openresty/nginx/logs/error.log，返回404
ngx.log(ngx.ERR, "http请求查询失败, path: ", path , ", args: ", args)
ngx.exit(404)
end
return resp.body
end
-- 将方法导出
local _M = {
read_http = read_http
}
return _M
```

*工具将read_http函数封装到_M这个table类型的read_http变量中，并且返回（类似于导出）。使用时可以利用require('common')导入该函数库，这里的common是函数库的文件名。*

修改/usr/loca/openresty/nginx/lua/item.lua文件，利用刚刚封装的函数库实现对tomcat的查询：

```lua
-- 引入自定义common工具模块，返回值是common中返回的 _M
local common = require("common")
-- 从 common中获取read_http这个函数
local read_http = common.read_http
-- 获取路径参数
local id = ngx.var[1]
-- 根据id查询商品
local itemJSON = read_http("/item/" .. id, nil)
-- 根据id查询商品库存
local itemStockJSON = read_http("/item/stock/".. id, nil)
```

这里查询到商品JSON串和商品库存JSON串，需要将其转换成Lua的table并合并，然后将合并的table转为JSON返回。JSON的序列化和反序列化需要用到cjson工具。

### 3.4.3 CJSON工具类

cjson模块是OpenResty提供的用来处理JSON的序列化和反序列化的工具。官网地址：

**[该类型的内容暂不支持下载]**

### 基本使用

引入cjson模块：

```lua
local cjson = require "cjson"
```

序列化：

```lua
local obj = {
name = 'jack',
age = 21
}
-- 把 table 序列化为 json
local json = cjson.encode(obj)
```

反序列化：

```lua
local json = '{"name": "jack", "age": 21}'
-- 反序列化 json为 table
local obj = cjson.decode(json);
print(obj.name)
```

### 3.4.4 实现Tomcat查询

修改之前的item.lua中的业务，添加json处理功能：

```lua
-- 导入common函数库
local common = require('common')
local read_http = common.read_http
-- 导入cjson库
local cjson = require('cjson')

-- 获取路径参数
local id = ngx.var[1]
-- 根据id查询商品
local itemJSON = read_http("/item/".. id, nil)
-- 根据id查询商品库存
local itemStockJSON = read_http("/item/stock/".. id, nil)

-- JSON转化为lua的table
local item = cjson.decode(itemJSON)
local stock = cjson.decode(itemStockJSON)

-- 组合数据
item.stock = stock.stock
item.sold = stock.sold

-- 把item序列化为json 返回结果
ngx.say(cjson.encode(item))
```

运行命令以重新加载OpenResty配置：

```powershell
nginx -s reload
```

### 3.4.5 基于ID负载均衡

在实际开发中，Tomcat使用的是集群模式，由于每一台JVM的进程缓存是独立的，使用默认的负载均衡规则也就是轮询模式时，第二次请求的Tomcat和第一次请求的Tomcat不相同，此时第一台JVM的进程缓存JVM2是没有的，就会查询数据库，进程缓存就会失效。

nginx提供了基于请求路径做负载均衡的算法，根据请求路径做hash运算，把得到的数值对tomcat服务的数量取余，余数是几，就访问第几个服务，实现负载均衡，这样每个路径多次访问就会到达同一台Tomcat。

### 实现基于ID负载均衡

定义tomcat集群，并设置基于路径做负载均衡（http下添加）：

```nginx
upstream tomcat-cluster {
hash $request_uri;
server 192.168.150.1:8081;
server 192.168.150.1:8082;
}
```

修改对tomcat服务的反向代理，目标指向tomcat集群：

```nginx
location /item {
proxy_pass http://tomcat-cluster;
}
```

重新加载OpenResty

```powershell
nginx -s reload
```

### 测试

复制Tomcat服务，并指定端口号为8082（参考实战篇一人一单）：

<div class="img-wrap-left"><img class="left-img" src="https://cdn.jsdelivr.net/gh/wu4yong/starry-images@main/assets/img/redis/4/image127.png" alt="image127.png"></div>

同时启动两个tomcat并多次访问http://localhost/api/item/10001，可以看到只有8082第一次访问有查询数据库的SQL，后几次没有日志记录，说明请求到达8082并且缓存生效。

### 3.5 Redis缓存预热

Redis缓存会面临冷启动问题：

**冷启动**：服务刚刚启动时，Redis中并没有缓存，如果所有数据都在第一次查询时添加缓存，可能会给数据库带来较大压力。

**缓存预热**：在实际开发中，利用大数据统计用户访问的热点数据，在项目启动时将这些热点数据提前查询并保存到Redis中。

由于这里商品数据不大，所以我们缓存所有商品数据到Redis。

利用Docker安装Redis：

```powershell
docker run --name redis -p 6379:6379 -d redis redis-server --appendonly yes
```

在item-service服务中引入Redis依赖：

```xml
<dependency>
<groupId>org.springframework.boot</groupId>
<artifactId>spring-boot-starter-data-redis</artifactId>
</dependency>
```

配置Redis地址（设置为自己的虚拟机地址）：

```yaml
spring:
redis:
host: 192.168.150.101
```

缓存预热需要在项目启动时完成，并且必须是拿到RedisTemplate之后。这里利用InitializingBean接口来实现，因为InitializingBean可以在对象被Spring创建并且成员变量全部注入后执行：

```java
package com.heima.item.config;

@Component
public class RedisHandler implements InitializingBean {
@Autowired
private StringRedisTemplate redisTemplate;
@Autowired
private IItemService itemService;
@Autowired
private IItemStockService stockService;

private static final ObjectMapper MAPPER = new ObjectMapper();

@Override
public void afterPropertiesSet() throws Exception {
// 初始化缓存
// 1.查询商品信息
List<Item> itemList = itemService.list();
// 2.放入缓存
for (Item item : itemList) {
// 2.1.item序列化为JSON
String json = MAPPER.writeValueAsString(item);
// 2.2.存入redis
redisTemplate.opsForValue().set("item:id:" + item.getId(), json);
}

// 3.查询商品库存信息
List<ItemStock> stockList = stockService.list();
// 4.放入缓存
for (ItemStock stock : stockList) {
// 2.1.item序列化为JSON
String json = MAPPER.writeValueAsString(stock);
// 2.2.存入redis
redisTemplate.opsForValue().set("item:stock:id:" + stock.getId(), json);
}
}
}
```

### 3.6 查询Redis缓存

Redis缓存已经有了，接下来是在OpenResty中实现查询Redis的逻辑，如果Redis缓存命中，就响应Redis中的数据，否则查询Tomcat。

### 3.6.1 封装Redis工具

OpenResty已经提供了操作Redis的模块，就是/usr/local/openresty/lualib/resty/redis.lua，只需要导入使用即可。

为了方便，我们将Redis操作封装到之前的common.lua文件中：

```lua
-- 导入redis模块
local redis = require('resty.redis')
-- 初始化redis对象
local red = redis:new()
-- 第一个参数是连接超时时间，第二个参数是发送命令超时时间，第三个参数是接受响应结果超时时间，这里都是1秒
red:set_timeouts(1000, 1000, 1000)

-- 关闭redis连接的工具方法，其实是放入连接池
local function close_redis(red)
local pool_max_idle_time = 10000 -- 连接的空闲时间，单位是毫秒
local pool_size = 100 --连接池大小
local ok, err = red:set_keepalive(pool_max_idle_time, pool_size)
if not ok then
ngx.log(ngx.ERR, "放入redis连接池失败: ", err)
end
end

-- 查询redis的方法 ip和port是redis地址，key是查询的key
local function read_redis(ip, port, key)
-- 获取一个连接
local ok, err = red:connect(ip, port)
if not ok then
ngx.log(ngx.ERR, "连接redis失败 : ", err)
return nil
end
-- 查询redis
local resp, err = red:get(key)
-- 查询失败处理
if not resp then
ngx.log(ngx.ERR, "查询Redis失败: ", err, ", key = " , key)
end
--得到的数据为空处理
if resp == ngx.null then
resp = nil
ngx.log(ngx.ERR, "查询Redis数据为空, key = ", key)
end
close_redis(red)
return resp

end

-- 封装函数，发送http请求，并解析响应
local function read_http(path, params)
local resp = ngx.location.capture(path,{
method = ngx.HTTP_GET,
args = params,
})
if not resp then
-- 记录错误信息，返回404
ngx.log(ngx.ERR, "http查询失败, path: ", path , ", args: ", args)
ngx.exit(404)
end
return resp.body
end
-- 将方法导出
local _M = {
read_http = read_http,
read_redis = read_redis
}
return _M
```

### 3.6.2 实现Redis查询

修改/usr/loca/openresty/nginx/lua/item.lua文件，添加查询Redis逻辑，如果Redis查询失败，再查询Tomcat：

```lua
-- 导入common函数库
local common = require('common')
local read_http = common.read_http
local read_redis = common.read_redis
-- 导入cjson库
local cjson = require('cjson')

-- 封装查询函数
function read_data(key, path, params)
-- 查询本地缓存
local val = read_redis("127.0.0.1", 6379, key)
-- 判断查询结果
if not val then
ngx.log(ngx.ERR, "redis查询失败，尝试查询http， key: ", key)
-- redis查询失败，去查询http
val = read_http(path, params)
end
-- 返回数据
return val
end

-- 获取路径参数
local id = ngx.var[1]

-- 查询商品信息
local itemJSON = read_data("item:id:" .. id, "/item/" .. id, nil)
-- 查询库存信息
local stockJSON = read_data("item:stock:id:" .. id, "/item/stock/" .. id, nil)

-- JSON转化为lua的table
local item = cjson.decode(itemJSON)
local stock = cjson.decode(stockJSON)
-- 组合数据
item.stock = stock.stock
item.sold = stock.sold

-- 把item序列化为json 返回结果
ngx.say(cjson.encode(item))
```

重新加载OpenResty：

```powershell
nginx -s reload
```

### 3.7 Nginx本地缓存

现在已经实现了Redis缓存、JVM缓存，还差Nginx本地缓存。当接收到请求时，优先查询Nginx本地缓存，未命中再查询Redis缓存，最后才是JVM缓存。

### 3.7.1 本地缓存API

OpenResty为Nginx提供了**shard dict**的功能，可以在nginx的多个worker之间共享数据，实现缓存功能。

开启共享字典，在nginx.conf的http下添加配置：

```nginx
# 共享字典，也就是本地缓存，名称叫做：item_cache，大小150MB
# 当然，缓存名称和大小可以自行设置，如local_cache 200m
lua_shared_dict item_cache 150m;
```

操作共享字典：

```lua
-- 获取本地缓存对象
local item_cache = ngx.shared.item_cache
-- 存储, 指定key、value、过期时间(单位s)，默认为0代表永不过期
item_cache:set('key', 'value', 1000)
-- 读取
local val = item_cache:get('key')
```

### 3.7.2 实现本地缓存查询

修改/usr/loca/openresty/nginx/lua/item.lua文件，添加本地缓存逻辑：

```lua
-- 导入common函数库
local common = require('common')
local read_http = common.read_http
local read_redis = common.read_redis
-- 导入cjson库
local cjson = require('cjson')
-- 导入共享词典，本地缓存
local item_cache = ngx.shared.item_cache

-- 封装查询函数
function read_data(key, expire, path, params)
-- 查询本地缓存
local val = item_cache:get(key)
if not val then
ngx.log(ngx.ERR, "本地缓存查询失败，尝试查询Redis， key: ", key)
-- 查询redis
val = read_redis("127.0.0.1", 6379, key)
-- 判断查询结果
if not val then
ngx.log(ngx.ERR, "redis查询失败，尝试查询http， key: ", key)
-- redis查询失败，去查询http
val = read_http(path, params)
end
end
-- 查询成功，把数据写入本地缓存，并指定超时时间
item_cache:set(key, val, expire)
-- 返回数据
return val
end

-- 获取路径参数
local id = ngx.var[1]

-- 查询商品信息，设置缓存超时时间为30分钟
local itemJSON = read_data("item:id:" .. id, 1800, "/item/" .. id, nil)
-- 查询库存信息，设置缓存超时时间为1分钟
local stockJSON = read_data("item:stock:id:" .. id, 60, "/item/stock/" .. id, nil)

-- JSON转化为lua的table
local item = cjson.decode(itemJSON)
local stock = cjson.decode(stockJSON)
-- 组合数据
item.stock = stock.stock
item.sold = stock.sold

-- 把item序列化为json 返回结果
ngx.say(cjson.encode(item))
```

重新加载OpenResty：

```powershell
nginx -s reload
```

### 3.8 缓存同步

### 3.8.1 数据同步策略

缓存同步就是要保证缓存中的数据和数据库的数据保持一致，缓存数据同步常见的方式有三种：

**设置有效期**：给缓存设置有效期，到期后自动删除，再次查询时更新

优势：简单、方便

缺点：时效性差，缓存过期之前可能不一致

场景：更新频率较低，时效性要求低的业务

**同步双写**：在修改数据库的同时，直接修改缓存

优势：时效性强，缓存与数据库强一致

缺点：有代码侵入，耦合度高

场景：对一致性、时效性要求较高的缓存数据

**异步通知**：修改数据库时发送事件通知，相关服务监听到通知后修改缓存数据

优势：低耦合，可以同时通知多个缓存服务

缺点：时效性一般，可能存在中间不一致状态

场景：时效性要求一般，有多个服务需要同步

异步实现又可以基于消息队列（MQ）或者Canal来实现：

**基于MQ的异步通知**：业务完成对数据的修改后，发送一条消息到MQ中，缓存服务监听MQ消息，然后更新缓存，但是这种方式仍然有少量代码入侵

<div class="img-wrap-left"><img class="left-img" src="https://cdn.jsdelivr.net/gh/wu4yong/starry-images@main/assets/img/redis/4/image128.png" alt="image128.png"></div>

**基于Canal的通知**：业务完成对数据的修改后直接结束，Canal监听MySQL变化，当发现MySQL变化后，立即通知缓存服务，缓存服务进行缓存更新，这种方式实现了代码零入侵

<div class="img-wrap-left"><img class="left-img" src="https://cdn.jsdelivr.net/gh/wu4yong/starry-images@main/assets/img/redis/4/image129.png" alt="image129.png"></div>

### 3.8.2 Canal工作原理

Canal是阿里巴巴旗下的一款开源项目，基于Java开发。基于数据库增量日志解析，提供增量数据订阅和消费。

Canal的Github网址：

**[该类型的内容暂不支持下载]**

Canal是基于MySQL的主从同步来实现的，MySQL主从同步的原理如下：

<div class="img-wrap-left"><img class="left-img" src="https://cdn.jsdelivr.net/gh/wu4yong/starry-images@main/assets/img/redis/4/image130.png" alt="image130.png"></div>

MySQL master 将数据变更写入二进制日志（binary log），其中记录的数据叫做binary log events，MySQL slave 将 master 的 binary log events拷贝到它的中继日志（relay log），然后重放 relay log 中事件，将数据变更反映它自己的数据。

Canal就是把自己伪装成MySQL的一个slave节点，从而监听master的binary log变化，再把得到的变化信息通知给Canal的客户端，进而完成对其它数据库的同步。

### 3.8.3 安装Canal

### 开启MySQL主从

打开自己的MySQL容器挂载的日志文件（以/tmp/mysql/conf为例）：

```powershell
cd /tmp/mysql/conf
```

修改文件：

```powershell
vi /tmp/mysql/conf/my.cnf
```

在文件最后添加内容：

```properties
log-bin=/var/lib/mysql/mysql-bin
binlog-do-db=heima
```

log-bin=/var/lib/mysql/mysql-bin：设置binary log文件的存放地址和文件名，叫做mysql-bin

binlog-do-db=heima：指定对哪个database记录binary log events，这里记录heima这个库

在MySQL图形化工具（如DataGrip）运行以下命令，添加一个仅用于数据同步的账户，仅提供对heima这个库的操作权限：

```sql
CREATE USER canal@'%' IDENTIFIED by 'canal';
GRANT SELECT, REPLICATION SLAVE, REPLICATION CLIENT,SUPER ON *.* TO 'canal'@'%' identified by 'canal';
FLUSH PRIVILEGES;
```

重启MySQL容器：

```powershell
docker restart mysql
```

在MySQL图形化工具运行如下命令，测试设置是否成功（是否查到结果）：

```sql
show master status;
```

### 安装Canal

创建一个网络，将MySQL、Canal、MQ放到同一个Docker网络中：

```powershell
docker network create heima
```

让MySQL加入这个网络：

```powershell
docker network connect heima mysql
```

复制资料中的canal.tar到虚拟机，然后通过如下命令导入：

```powershell
docker load -i canal.tar
```

运行命令创建Canal容器：

```powershell
docker run -p 11111:11111 --name canal 
-e canal.destinations=heima 
-e canal.instance.master.address=mysql:3306 
-e canal.instance.dbUsername=canal 
-e canal.instance.dbPassword=canal 
-e canal.instance.connectionCharset=UTF-8 
-e canal.instance.tsdb.enable=true 
-e canal.instance.gtidon=false 
-e canal.instance.filter.regex=heima..* 
--network heima 
-d canal/canal-server:v1.1.5
```

-p 11111:11111：这是canal的默认监听端口

-e canal.instance.master.address=mysql:3306：数据库地址和端口，如果不知道mysql容器地址，可以通过docker inspect 容器id来查看

-e canal.instance.dbUsername=canal：数据库用户名

-e canal.instance.dbPassword=canal ：数据库密码

-e canal.instance.filter.regex=：要监听的表名称

监听表名称的语法：

```powershell
mysql 数据解析关注的表，Perl正则表达式.
多个正则之间以逗号(,)分隔，转义符需要双斜杠()
常见例子：
1. 所有表：.* or .*..*
2. canal schema下所有表： canal..*
3. canal下的以canal打头的表：canal.canal.*
4. canal schema下的一张表：canal.test1
5. 多个规则组合使用然后以逗号隔开：canal..*,mysql.test1,mysql.test2
```

### 3.8.4 监听Canal

Canal提供了各种语言的客户端，当Canal监听到binlog变化时，会通知Canal的客户端，这里使用Java客户端：

<div class="img-wrap-left"><img class="left-img" src="https://cdn.jsdelivr.net/gh/wu4yong/starry-images@main/assets/img/redis/4/image131.png" alt="image131.png"></div>

我们使用Github上的第三方客户端canal-starter，它与SpringBoot完美整合，自动装配，比官方客户端简单好用。

canal-starter的Github地址：

**[该类型的内容暂不支持下载]**

引入依赖：

```xml
<dependency>
<groupId>top.javatool</groupId>
<artifactId>canal-spring-boot-starter</artifactId>
<version>1.2.1-RELEASE</version>
</dependency>
```

编写配置：

```yaml
canal:
destination: heima # canal的集群名字，要与安装canal时设置的名称一致
server: 192.168.150.101:11111 # canal服务地址，使用自己的虚拟机地址
```

修改Item实体类，通过@Id、@Column、@Transient注解完成Item与数据库表字段的映射：

```java
package com.heima.item.pojo;

import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.Transient;

@Data
@TableName("tb_item")
public class Item {
@TableId(type = IdType.AUTO)
@Id
private Long id;//商品id
@Column(name = "name")
private String name;//商品名称
private String title;//商品标题
private Long price;//价格（分）
private String image;//商品图片
private String category;//分类名称
private String brand;//品牌名称
private String spec;//规格
private Integer status;//商品状态 1-正常，2-下架
private Date createTime;//创建时间
private Date updateTime;//更新时间
@TableField(exist = false)
@Transient
private Integer stock;
@TableField(exist = false)
@Transient
private Integer sold;
}
```

@Id：标记表中的id字段

@Column(name = "name")：标记表中与属性名不一致的字段，当然，这里可以不添加

@Transient：标记不属于表中的字段

通过实现EntryHandler<T>接口编写监听器，监听Canal消息：

```java
package com.heima.item.canal;

import com.github.benmanes.caffeine.cache.Cache;

@CanalTable("tb_item")
@Component
public class ItemHandler implements EntryHandler<Item> {
@Autowired
private RedisHandler redisHandler;
@Autowired
private Cache<Long, Item> itemCache;

@Override
public void insert(Item item) {
// 写数据到JVM进程缓存
itemCache.put(item.getId(), item);
// 写数据到redis
redisHandler.saveItem(item);
}

@Override
public void update(Item before, Item after) {
// 写数据到JVM进程缓存
itemCache.put(after.getId(), after);
// 写数据到redis
redisHandler.saveItem(after);
}

@Override
public void delete(Item item) {
// 删除数据到JVM进程缓存
itemCache.invalidate(item.getId());
// 删除数据到redis
redisHandler.deleteItemById(item.getId());
}
}
```

@CanalTable("tb_item")用于指定要监听的表

EntryHandler<Item>的泛型指定表关联的实体类

insert、update、delete方法分别监听数据库表的增、删、改的消息

这里对Redis的操作都封装到了RedisHandler这个类中：

```java
package com.heima.item.config;

@Component
public class RedisHandler implements InitializingBean {
@Autowired
private StringRedisTemplate redisTemplate;
@Autowired
private IItemService itemService;
@Autowired
private IItemStockService stockService;

private static final ObjectMapper MAPPER = new ObjectMapper();

@Override
public void afterPropertiesSet() throws Exception {
// 初始化缓存
// 1.查询商品信息
List<Item> itemList = itemService.list();
// 2.放入缓存
for (Item item : itemList) {
// 2.1.item序列化为JSON
String json = MAPPER.writeValueAsString(item);
// 2.2.存入redis
redisTemplate.opsForValue().set("item:id:" + item.getId(), json);
}

// 3.查询商品库存信息
List<ItemStock> stockList = stockService.list();
// 4.放入缓存
for (ItemStock stock : stockList) {
// 2.1.item序列化为JSON
String json = MAPPER.writeValueAsString(stock);
// 2.2.存入redis
redisTemplate.opsForValue().set("item:stock:id:" + stock.getId(), json);
}
}

public void saveItem(Item item) {
try {
String json = MAPPER.writeValueAsString(item);
redisTemplate.opsForValue().set("item:id:" + item.getId(), json);
} catch (JsonProcessingException e) {
throw new RuntimeException(e);
}
}


public void deleteItemById(Long id) {
redisTemplate.delete("item:id:" + id);
}
}
```

### 测试

启动8081服务，访问http://localhost:8081/，修改某个商品的信息并查看Redis，会发现Redis及时更新数据。
