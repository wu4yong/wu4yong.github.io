---
title: 九、MCP实现+原理+源码+鉴权
date: 2026-09-09 01:00:00
categories:
  - ai
tags:
  - SpringAi
---

<div class="essay-banner essay-image11">
   <!-- MCP Implementation -->
</div>

## MCP

### 问题：

1. 当有服务商需要将tools提供外部使用（比如高德地图提供了位置服务tools， 比如百度提供了联网搜索的tools...）
2.  或者在企业级中， 有多个智能应用，想将通用的tools公共化
  怎么办？  
可以把tools单独抽取出来，  由应用程序读取外部的tools。     那关键是怎么读呢？ 怎么解析呢？  如果每个提供商各用一种规则你能想象有多麻烦！ 所以MCP就诞生了，  他指定了标准规则，  以jsonrpc2.0的方式进行通讯。
那问题又来了， 以什么方式通讯呢？   http?  rpc?  stdio?      mcp提供了sse和stdio这2种方式。

<div class="img-wrap-left"><img class="left-img" src="/assets/img/springai/ch09_1749538652064-fa3cda1e-d919-4e45-999c-db97817ba693_d2dfc9e867.png" alt="ch09_1749538652064-fa3cda1e-d919-4e45-999c-db97817ba693_d2dfc9e867.png"></div>

### 使用

Streamable http目前springai1.0版本不支持， 我们先掌握SSE和STDIO
分别说下STDIO和SSE的方式：
+ **STDIO**更适合客户端桌面应用和辅助工具
+ **SSE**更适合web应用 、业务有关的公共tools

<div class="img-wrap-left"><img class="left-img" src="/assets/img/springai/ch09_1749543212615-6e6d670b-73d7-4c49-aab9-6640ee8b98c8_b84ced1e93.png" alt="ch09_1749543212615-6e6d670b-73d7-4c49-aab9-6640ee8b98c8_b84ced1e93.png"></div>

### STDIO

#### MCP Server

##### 现成共用MCP Server

现在有很多MCP 服务 给大家提供一个网站：[MCP Server（MCP 服务器）](https://mcp.so/zh)

<div class="img-wrap-left"><img class="left-img" src="/assets/img/springai/ch09_1743148612881-af22674d-a11a-4914-a3a0-eaf1f83a01aa_41669ac3b7.png" alt="ch09_1743148612881-af22674d-a11a-4914-a3a0-eaf1f83a01aa_41669ac3b7.png"></div>

那MCP有了， 怎么调用呢？  这里介绍2种使用方式：

##### 自定义MCP Server

创建一个springai项目
1. 依赖

```xml

<!--mcp-server  -->
<dependency>
  <groupId>org.springframework.ai</groupId>
  <artifactId>spring-ai-starter-mcp-server</artifactId>
</dependency>

 <dependencyManagement>
        <dependencies>
            <!--springai  -->
            <dependency>
                <groupId>org.springframework.ai</groupId>
                <artifactId>spring-ai-bom</artifactId>
                <version>${spring-ai.version}</version>
                <type>pom</type>
                <scope>import</scope>
            </dependency>
        </dependencies>
  </dependencyManagement>

<!-- 打包 -->
<build>
        <plugins>
            <plugin>
                <groupId>org.springframework.boot</groupId>
                <artifactId>spring-boot-maven-plugin</artifactId>
                <executions>
                    <execution>
                        <goals>
                            <goal>repackage</goal>
                        </goals>
                    </execution>
                </executions>
            </plugin>
        </plugins>
    </build>
```

2. 添加工具

```java
@Service
public class UserToolService {

    Map<String,Double> userScore = Map.of(
        "xushu",99.0,
        "zhangsan",2.0,
        "lisi",3.0);
    @Tool(description = "获取用户分数")
    public String getScore(String username) { 
        if(userScore.containsKey(userName)){
            return userScore.get(userName).toString();
        }  

        return "未检索到当前用户"+userName;
    }
}
```

3. 暴露工具

```java
@Bean
public ToolCallbackProvider weatherTools(UserToolService userToolService) {
    return MethodToolCallbackProvider.builder().toolObjects(userToolService).build();
}
```

4. 配置

```yaml
spring:
  main:
    banner-mode: off
  ai:
    mcp:
      server:
        name: my-weather-server
        version: 0.0.1
```

注意：您必须禁用横幅和控制台日志记录，以允许 STDIO 传输!!工作  banner-mode: off

5. 打包  mvn package
此时target/生成了jar则成功！

#### MCP Client

##### 通过工具

CherryStudio、Cursor 、Claude Desktop、[Cline ](https://marketplace.visualstudio.com/items?itemName=saoudrizwan.claude-dev) 等等很多， 这里不一一演示， 不会的话自己找个文章， 工具使用都很简单!

<div class="img-wrap-left"><img class="left-img" src="/assets/img/springai/ch09_1743151169161-51d3e731-8ad4-48e3-85bc-2519460274ec_f511ecef49.png" alt="ch09_1743151169161-51d3e731-8ad4-48e3-85bc-2519460274ec_f511ecef49.png"></div>

以Cline为例： 他是Vscode的插件
1. 安装VSCode
2. 安装插件：

<div class="img-wrap-left"><img class="left-img" src="/assets/img/springai/ch09_1743506292616-d840d75c-1ee7-4954-b3c1-80c472c23321_11dbd88bb8.png" alt="ch09_1743506292616-d840d75c-1ee7-4954-b3c1-80c472c23321_11dbd88bb8.png"></div>

3. 配置cline的模型：

<div class="img-wrap-left"><img class="left-img" src="/assets/img/springai/ch09_1743506403789-4eedfc69-694e-4409-8b30-9711f3d5d5bb_eda7948c1d.png" alt="ch09_1743506403789-4eedfc69-694e-4409-8b30-9711f3d5d5bb_eda7948c1d.png"></div>

4. 配置cline的mcpserver

<div class="img-wrap-left"><img class="left-img" src="/assets/img/springai/ch09_1743506882142-2aa504e7-2ff4-470a-a859-ba6428ae0673_413ab0762a.png" alt="ch09_1743506882142-2aa504e7-2ff4-470a-a859-ba6428ae0673_413ab0762a.png"></div>

```json
{
    "mcpServers": {
        "baidu-map": {
            "command": "cmd",
            "args": [
                "/c",
                "npx",
                "-y",
                "@baidumap/mcp-server-baidu-map"
            ],
            "env": {
                "BAIDU_MAP_API_KEY": "LEyBQxG9UzR9C1GZ6zDHsFDVKvBem2do"
            }
        },
        "filesystem": {
            "command": "cmd",
            "args": [
                "/c",
                "npx",
                "-y",
                "@modelcontextprotocol/server-filesystem",
                "C:/Users/tuling/Desktop"
            ]
        },
        "mcp-server-weather": {
            "command": "java",
            "args": [
                "-Dspring.ai.mcp.server.stdio=true",
                "-Dlogging.pattern.console=",
                "-jar",
                "D:\\ideaworkspace\\git_pull\\tuling-flight-booking_all\\mcp-stdio-server\\target\\mcp-stdio-server-xs-1.0.jar"
            ]
        }
    }
}

```

5. 开启cline权限

<div class="img-wrap-left"><img class="left-img" src="/assets/img/springai/ch09_1743506993562-39b29cae-c7f0-4912-9d36-7ff5957347eb_df4b008111.png" alt="ch09_1743506993562-39b29cae-c7f0-4912-9d36-7ff5957347eb_df4b008111.png"></div>

<div class="img-wrap-left"><img class="left-img" src="/assets/img/springai/ch09_1743507041841-ad6dca07-fe24-41a4-af70-fa74e5300dda_fc65e678a6.png" alt="ch09_1743507041841-ad6dca07-fe24-41a4-af70-fa74e5300dda_fc65e678a6.png"></div>

6.测试：

<div class="img-wrap-left"><img class="left-img" src="/assets/img/springai/ch09_1743507165047-e40b880f-ddd3-410a-ad0d-0d300bce963a_1cab5d4d10.png" alt="ch09_1743507165047-e40b880f-ddd3-410a-ad0d-0d300bce963a_1cab5d4d10.png"></div>

##### 通过Spring AI

1. 依赖

```xml
<!--既支持sse\也支持Stdio-->
<dependency>
    <groupId>org.springframework.ai</groupId>
    <artifactId>spring-ai-starter-mcp-client-webflux</artifactId>
</dependency>
```

2 配置

```yaml
spring:
  ai:
    mcp:
      client:
        request-timeout: 60000
        stdio:
          servers-configuration: classpath:/mcp-servers-config.json
          connections:
            server1:
              command: /path/to/server
              args:
                - --port=8080
                - --mode=production
              env:
                API_KEY: your-api-key
                DEBUG: "true"
```

3. mcp-servers-config.json：
获取Baidu地图key: [控制台 | 百度地图开放平台](https://lbsyun.baidu.com/apiconsole/key)

```json
{
    "mcpServers": {
        "baidu-map": {
            "command": "cmd",
            "args": [
                "/c",
                "npx",
                "-y",
                "@baidumap/mcp-server-baidu-map"
            ],
            "env": {
                "BAIDU_MAP_API_KEY": "xxxx"
            }
        },
        "filesystem": {
            "command": "cmd",
            "args": [
                "/c",
                "npx",
                "-y",
                "@modelcontextprotocol/server-filesystem",
                "C:/Users/tuling/Desktop"
            ]
        },
        "mcp-server-weather": {
            "command": "java",
            "args": [
                "-Dspring.ai.mcp.server.stdio=true",
                "-Dlogging.pattern.console=",
                "-jar",
                "D:\\xxx\\target\\mcp-stdio-server-xs-1.0.jar"
            ]
        }
    }
}

```

4. 绑定到Chatclient

```java
/**
 * @author wx:程序员SpringAI
 * @version 1.0
 * @description: 智能航空助手:需要一对一解答关注wx: 程序员SpringAI
 */
@RestController
@CrossOrigin
public class OpenAiController {
    
    private final ChatClient chatClient;
    
    public OpenAiController(
            DashScopeChatModel dashScopeChatModel,
                            // 外部 mcp tools
                            ToolCallbackProvider mcpTools) {
        this.chatClient =ChatClient.builder(dashScopeChatModel)
        .defaultToolCallbacks(mcpTools)
        .build();
    }
    

 @CrossOrigin
@GetMapping(value = "/ai/generateStreamAsString", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
public Flux<String> generateStreamAsString(@RequestParam(value = "message", defaultValue = "讲个笑话") String message) {

    Flux<String> content = chatClient.prompt()
            .user(message)
            .stream()
            .content();

    return  content;

    }
    
```

```yaml
# 调试日志
logging:
  level:
    io:
      modelcontextprotocol:
        client: DEBUG
        spec: DEBUG
```

### SSE

#### MCP Server

这种方式需要将部署为Web服务
1. 依赖

```java

        <!--mcp服务器核心依赖— 响应式-->
        <dependency>
            <groupId>org.springframework.ai</groupId>
            <artifactId>spring-ai-starter-mcp-server-webmvc</artifactId>
        </dependency>
```

如果用：`<artifactId>spring-ai-starter-mcp-server-**webflux**</artifactId>`  
会出现：

<div class="img-wrap-left"><img class="left-img" src="/assets/img/springai/ch09_1759203265265-9bd3c786-1835-42dd-b2f4-4cb200293726_efaf578694.png" alt="ch09_1759203265265-9bd3c786-1835-42dd-b2f4-4cb200293726_efaf578694.png"></div>

根据官方：[https://github.com/spring-projects/spring-ai/pull/3511](https://github.com/spring-projects/spring-ai/pull/3511)
建议加入： `spring.main.web-application-type=reactive  `
2. 定义外部工具

```java

@Service
public class UserToolService {

    Map<String,Double> userScore = Map.of(
            "xushu",99.0,
            "zhangsan",2.0,
            "lisi",3.0);
    @Tool(description = "获取用户分数")
    public String getScore(String username) {
        if(userScore.containsKey(username)){
            return userScore.get(username).toString();
        }

        return "未检索到当前用户";
    }
}
```

3. 暴露工具

```java
 @Bean
    public ToolCallbackProvider weatherToolCallbackProvider(WeatherService weatherService,
                                                            UserToolService userToolService) {
        return MethodToolCallbackProvider.builder().toolObjects(userToolService).build();
    }
```

4. 配置

```yaml
server:
  port: 8088

```

5. 启动

#### MCP Client

1. 添加依赖

```xml

<!--既支持sse\也支持Stdio-->
<dependency>
  <groupId>org.springframework.ai</groupId>
  <artifactId>spring-ai-starter-mcp-client-webflux</artifactId>
</dependency>
```

2. 配置

```xml
spring:
  ai:
    mcp:
      client:
        enabled: true
        name: my-mcp-client
        version: 1.0.0
        request-timeout: 30s
        type: ASYNC  # or SYNC
        sse:
          connections:
            server1:
              url: http://localhost:8088
```

3. 代码

```java
/**
 * @author wx:程序员SpringAI
 * @version 1.0
 * @description: 智能航空助手:需要一对一解答关注wx: 程序员SpringAI
 */
@RestController
@CrossOrigin
public class OpenAiController {

    private final ChatClient chatClient;

    public OpenAiController(
        DashScopeChatModel dashScopeChatModel,
        // 外部 mcp tools
        ToolCallbackProvider mcpTools) {
        this.chatClient =ChatClient.builder(dashScopeChatModel)
        .defaultToolCallbacks(mcpTools)
        .build();
    }


    @CrossOrigin
    @GetMapping(value = "/ai/generateStreamAsString", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public Flux<String> generateStreamAsString(@RequestParam(value = "message", defaultValue = "讲个笑话") String message) {

        Flux<String> content = chatClient.prompt()
        .user(message)
        .stream()
        .content();

        return  content;

    }

```

### 原理

1. STDIO 是基于标准输入\输出流的方式， 需要在MCP 客户端安装一个包（可以是jar包、python包、npm包等..）. 它是“客户端”的MCP Server。

<div class="img-wrap-left"><img class="left-img" src="/assets/img/springai/ch09_1752585876004-6075ff95-4059-4c69-a950-3a0c51f7a0d3_9e362dd9fc.png" alt="ch09_1752585876004-6075ff95-4059-4c69-a950-3a0c51f7a0d3_9e362dd9fc.png"></div>

2. SSE  是基于Http的方式进行通讯， 需要将MCP Server部署为一个web服务. 它是服务端的MCP Server

#### STDIO原理

<div class="img-wrap-left"><img class="left-img" src="/assets/img/springai/ch09_1752591174064-97591e76-da2c-4c04-81d4-6aebe59361fd_521455aebc.png" alt="ch09_1752591174064-97591e76-da2c-4c04-81d4-6aebe59361fd_521455aebc.png"></div>

很多人不理解stdio到底什么意思， 为什么一定要把stdio server的banner关掉， 还要清空控制台？

<div class="img-wrap-left"><img class="left-img" src="/assets/img/springai/ch09_1749543942465-684dee68-7d74-4a28-aa11-914d178dd9e2_8987a776fb.png" alt="ch09_1749543942465-684dee68-7d74-4a28-aa11-914d178dd9e2_8987a776fb.png"></div>

1. 首先SpringAi底层会读取到mcp-servers-config.json的信息
2. 然后执行命令（其实聪明的小伙伴早就发现了，mcp-servers-config.json文件中就是一堆shell命令）
    1. 怎么执行？  熟悉java的同学应该知道，java里面有一个对象用于执行命令：

```java
 ProcessBuilder processBuilder = new ProcessBuilder();
        processBuilder.command("java","-version");

        Process process = processBuilder.start();

        process.errorReader().lines().forEach(System.out::println);
```

3. 所以springAi底层相当于读取到信息后， 会通过processBuilder去执行命令

```java
String[] commands={"java",
                "-Dspring.ai.mcp.server.stdio=true",
                "-Dlogging.pattern.console=",
                "-jar",
                "D:\\ideaworkspace\\git_pull\\tuling-flight-booking_all\\mcp-stdio-server\\target\\mcp-stdio-server-xs-1.0.jar"};

        ProcessBuilder processBuilder = new ProcessBuilder();
        processBuilder.command(commands);
        // processBuilder.environment().put("username","xushu");

        Process process = processBuilder.start();
```

其实你也完全可以自己通过mcd去执行命令

<div class="img-wrap-left"><img class="left-img" src="/assets/img/springai/ch09_1749544393733-af10cef8-2d9d-4fb9-a14b-1b61761afcda_d209c132b2.png" alt="ch09_1749544393733-af10cef8-2d9d-4fb9-a14b-1b61761afcda_d209c132b2.png"></div>

1. 运行jar -jar mcp-stdio-server.jar
2. 输入{"jsonrpc":"2.0","method":"tools/list","id":"3b3f3431-1","params":{}}
3. 输出tools列表
这就是标准输入输出流!    看到这里你应该知道， 为什么需要`-Dlogging.pattern.console=`  完全是为了清空控制台，才能读取信息!
所以利用java也是一样的原理：

```java
@Test
    public void test() throws IOException, InterruptedException {
        String[] commands={"java",
                "-Dspring.ai.mcp.server.stdio=true",
                "-Dlogging.pattern.console=",
                "-jar",
                "D:\\ideaworkspace\\git_pull\\tuling-flight-booking_all\\mcp-stdio-server\\target\\mcp-stdio-server-xs-1.0.jar"};

        ProcessBuilder processBuilder = new ProcessBuilder();
        processBuilder.command(commands);
        processBuilder.environment().put("username","xushu");

        Process process = processBuilder.start();

        Thread thread = new Thread(() -> {
            try (BufferedReader processReader = new BufferedReader(new InputStreamReader(process.getInputStream()))) {
                String line;
                while ((line=processReader.readLine())!=null) {
                        System.out.println(line);
                }
            } catch (IOException e) {
                e.printStackTrace();
            }
        });
        thread.start();


        Thread.sleep(1000);

        new Thread(() -> {

            try {
                //String jsonMessage="{\"jsonrpc\":\"2.0\",\"method\":\"initialize\",\"id\":\"3670122a-0\",\"params\":{\"protocolVersion\":\"2024-11-05\",\"capabilities\":{},\"clientInfo\":{\"name\":\"spring-ai-mcp-client\",\"version\":\"1.0.0\"}}}";
                String jsonMessage = "{\"jsonrpc\":\"2.0\",\"method\":\"tools/list\",\"id\":\"3b3f3431-1\",\"params\":{}}";

                jsonMessage = jsonMessage.replace("\r\n", "\\n").replace("\n", "\\n").replace("\r", "\\n");

                var os = process.getOutputStream();
                synchronized (os) {
                    os.write(jsonMessage.getBytes(StandardCharsets.UTF_8));
                    os.write("\n".getBytes(StandardCharsets.UTF_8));
                    os.flush();
                }
                System.out.println("写入完成！");
            }catch (IOException e){
                e.printStackTrace();
            }
        }).start();


        thread.join();
        /*JSONRPCRequest[jsonrpc=2.0, method=initialize, id=5d83d0d1-0, params=InitializeRequest[protocolVersion=2024-11-05, capabilities=ClientCapabilities[experimental=null, roots=null, sampling=null],
        clientInfo=Implementation[name=spring-ai-mcp-client, version=1.0.0]]]*/
    }

```

1. 通过ProcessBuilder执行命令
2. 通过子线程轮询 process.getInputStream 获取输出流
3. 通过process.getOutputStream(); 进行写入流
所以整个过程是这样的：再回顾上面的图
启动程序--->读取mcpjson--->通过ProcessBuilder启动命令---> 写入初始化jsonrpc---->写入获取tools列表jsonrpc---->请求大模型（携带tools）---->写入请求外部tool的jsonrpc---->获取数据--->发送给大模型---->响应。

### STDIO源码

<div class="img-wrap-left"><img class="left-img" src="/assets/img/springai/ch09_1749543994705-06c671de-1be4-4d18-838f-2148c7eac45d_de4f38b3e9.png" alt="ch09_1749543994705-06c671de-1be4-4d18-838f-2148c7eac45d_de4f38b3e9.png"></div>

### MCP鉴权

在做MCP企业级方案落地时， 我们可能不想让没有权限的人访问MCP Server,  或者需要根据不同的用户返回不同的数据， 这里就涉及到MCP Server授权操作。
那MCP Server有2种传输方式，  实现起来不一样：

#### STDIO

这种方式在本地运行,**它 将MCP Server作为子进程启动**。 我们称为标准输入输出， 其实就是利用运行命令的方式写入和读取控制台的信息，以达到传输。  

<div class="img-wrap-left"><img class="left-img" src="/assets/img/springai/ch09_1747376380238-74bfcf1f-4ed0-41f2-ac6a-39cdf3b54fd1_70a3c6a91b.png" alt="ch09_1747376380238-74bfcf1f-4ed0-41f2-ac6a-39cdf3b54fd1_70a3c6a91b.png"></div>

 通常我们会配置一段json，比如这里的百度地图MCP Server ：
+ 其中command和args代表运行的命令和参数。
+ 其实env中的节点BAIDU_MAP_API_KEY就是做授权的。
如果你传入的BAIDU_MAP_API_KEY不对， 就没有使用权限。

```json
"baidu-map": {
  "command": "cmd",
  "args": [
    "/c",
    "npx",
    "-y",
    "@baidumap/mcp-server-baidu-map"
  ],
  "env": {
    "BAIDU_MAP_API_KEY": "LEyBQxG9UzR9C1GZ6zDHsFDVKvBem2do"
  }
},
```

所以STDIO做授权的方式很明确， 就是通过env【环境变量】，实现步骤如下：
1. 服务端发放一个用户的凭证（可以是秘钥、token）  这步不细讲，需要有一个授权中心发放凭证。
2. 通过mcp client通过env传入凭证
3. mcp server通过环境变量鉴权
所以在MCP Server端就可以通过获取环境变量的方式获取env里面的变量：
也可以通过AOP的方式统一处理

```java
    @Tool(description = "获取用户余额")
    public String getScore() {
        String userName = System.getenv("API_KEY"); 
        // todo .. 鉴权处理
        return "未检索到当前用户"+userName;
    }
```

这种方式要注意：  他不支持动态鉴权，  也就是动态更换环境变量，  因为STDIO是本地运行方式，**它 将MCP Server作为子进程启动, **如果是多个用户动态切换凭证， 会对共享的环境变量造成争抢， 最终只能存储一个。  除非一个用户对应一个STDIO MCP  Server.     但是这样肯定很吃性能！   如果要多用户动态切换授权，  可以用SSE的方式；

#### SSE

##### 说明

不过，如果你想把 MCP 服务器开放给外部使用，就需要暴露一些标准的 HTTP 接口。对于私有场景，MCP 服务器可能并不需要严格的身份认证，但在企业级部署下，对这些接口的安全和权限把控就非常重要了。为了解决这个问题，[2025 年 3 月发布的最新 MCP 规范](https://modelcontextprotocol.io/specification/2025-03-26/basic/authorization)引入了安全基础，借助了广泛使用的 [OAuth2 框架](https://modelcontextprotocol.io/specification/2025-03-26/basic/authorization)。

<div class="img-wrap-left"><img class="left-img" src="/assets/img/springai/ch09_1747373008252-ea86cf42-b7c5-49b2-96f4-9abdc4d986cf_67ceb074a7.webp" alt="ch09_1747373008252-ea86cf42-b7c5-49b2-96f4-9abdc4d986cf_67ceb074a7.webp"></div>

本文不会详细介绍 OAuth2 的所有内容，不过简单回顾一下还是很有帮助。
**在规范的草案中，MCP 服务器既是资源服务器，也是授权服务器。**
+ **作为资源服务器**，MCP 负责检查每个请求中的 `Authorization`请求头。这个请求头必须包括一个 OAuth2`access_token`（令牌），它代表客户端的“权限”。这个令牌通常是一个 JWT（JSON Web Token），也可能只是一个不可读的随机字符串。如果令牌缺失或无效（无法解析、已过期、不是发给本服务器的等），请求会被拒绝。正常情况下，调用示例如下：

```plain
curl https://mcp.example.com/sse -H "Authorization: Bearer <有效的 access token>"
```

+ **作为授权服务器**，MCP 还需要有能力为客户端安全地签发 `access_token`。在发放令牌前，服务器会校验客户端的凭据，有时还需要校验访问用户的身份。授权服务器决定令牌的有效期、权限范围、目标受众等特性。
用 Spring Security 和 Spring Authorization Server，可以方便地为现有的 Spring MCP 服务器加上这两大安全能力。

<div class="img-wrap-left"><img class="left-img" src="/assets/img/springai/ch09_1747373008252-989690c4-f96d-4333-87a1-0b027a0f42f0_2c193481d9.webp" alt="ch09_1747373008252-989690c4-f96d-4333-87a1-0b027a0f42f0_2c193481d9.webp"></div>

##### 给 Spring MCP 服务器加上 OAuth2 支持

这里以官方例子仓库的【天气】MCP 工具演示如何集成 OAuth2，主要是让服务器端能签发和校验令牌。
首先，`pom.xml` 里添加必要的依赖：

```xml
<dependency>
  <groupId>org.springframework.boot</groupId>
  <artifactId>spring-boot-starter-oauth2-resource-server</artifactId>
</dependency>
<dependency>
  <groupId>org.springframework.boot</groupId>
  <artifactId>spring-boot-starter-oauth2-authorization-server</artifactId>
</dependency>
```

接着，在 `application.properties`配置里加上简易的 OAuth2 客户端信息，便于请求令牌：

```properties
spring.security.oauth2.authorizationserver.client.oidc-client.registration.client-id=xushu
spring.security.oauth2.authorizationserver.client.oidc-client.registration.client-secret={noop}xushu666
spring.security.oauth2.authorizationserver.client.oidc-client.registration.client-authentication-methods=client_secret_basic
spring.security.oauth2.authorizationserver.client.oidc-client.registration.authorization-grant-types=client_credentials
```

这样定义后，你可以直接通过 POST 请求和授权服务器交互，无需浏览器，用配置好的 `/secret` 作为固定凭据。 比如 最后一步是开启授权服务器和资源服务器功能。通常会新增一个安全配置类，比如 `SecurityConfiguration`，如下：

```java
import static org.springframework.security.oauth2.server.authorization.config.annotation.web.configurers.OAuth2AuthorizationServerConfigurer.authorizationServer;

@Configuration
@EnableWebSecurity
class SecurityConfiguration {

    @Bean
    SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        return http.authorizeHttpRequests(auth -> auth.anyRequest().authenticated())
        .with(authorizationServer(), Customizer.withDefaults())
        .oauth2ResourceServer(resource -> resource.jwt(Customizer.withDefaults()))
        .csrf(CsrfConfigurer::disable)
        .cors(Customizer.withDefaults())
        .build();
    }
}
```

这个过滤链主要做了这些事情：
+ 要求所有请求都要经过身份认证。也就是访问 MCP 的接口，必须带上 access_token。
+ 同时启用了授权服务器和资源服务器两大能力。
+ 关闭了 CSRF（跨站请求伪造防护），因为 MCP 不是给浏览器直接用的，这部分无需开启。
+ 打开了 CORS（跨域资源共享），方便用 MCP inspector 测试。
这样配置之后，只有带 access_token 的访问才会被接受，否则会直接返回 401 未授权错误，例如：

```powershell
curl http://localhost:8080/sse --fail-with-body
# 返回：
# curl: (22) The requested URL returned error: 401
```

要使用 MCP 服务器，先要获取一个 access_token。可通过 `client_credentials` 授权方式（用于机器到机器、服务账号的场景）：

```powershell
curl -XPOST http://localhost:8080/oauth2/token --data grant_type=client_credentials --user xushu:xushu666
# 返回：
# {"access_token":"<YOUR-ACCESS-TOKEN>","token_type":"Bearer","expires_in":299}
```

把返回的 access_token 记下来（它一般以 “ey” 开头），之后就可以用它来正常请求服务器了：

```powershell
curl http://localhost:8080/sse -H"Authorization: Bearer YOUR_ACCESS_TOKEN"
# 服务器响应内容
```

你还可以直接在 MCP inspector 工具里用这个 access_token。从菜单的 Authentication > Bearer 处粘贴令牌并连接即可。

##### 为MCP Client设置请求头

目前，  mcp 的java sdk 没有提供api直接调用，  经过SpringAI老师研究源码后， 你只能通过2种方式实现：

##### 重写源码

扩展mcp 的sse方式java sdk的源码，  整个重写一遍。 工作量较大， 并且我预计过不了多久， spring ai和mcp协议都会更新这块。  看你的紧急程度， 如果考虑整体扩展性维护性，可以整体重写一遍：
提供一个重写思路
**重写McpSseClientProperties**
MCPSse客户端属性配置：新增请求头字段

```java
package org.springframework.ai.autoconfigure.mcp.client.properties;

@ConfigurationProperties("spring.ai.mcp.client.sse")
public class McpSseClientProperties {
    public static final String CONFIG_PREFIX = "spring.ai.mcp.client.sse";
    private final Map<String, SseParameters> connections = new HashMap();
    
    private final Map<String, String> headersMap = new HashMap<>();
    private String defaultHeaderName;
    private String defaultHeaderValue;
    private boolean enableCompression = false;
    private int connectionTimeout = 5000;

    public McpSseClientProperties() {
    }

    public Map<String, SseParameters> getConnections() {
        return this.connections;
    }

    public Map<String, String> getHeadersMap() {
        return this.headersMap;
    }

    public String getDefaultHeaderName() {
        return this.defaultHeaderName;
    }

    public void setDefaultHeaderName(String defaultHeaderName) {
        this.defaultHeaderName = defaultHeaderName;
    }

    public String getDefaultHeaderValue() {
        return this.defaultHeaderValue;
    }

    public void setDefaultHeaderValue(String defaultHeaderValue) {
        this.defaultHeaderValue = defaultHeaderValue;
    }

    public boolean isEnableCompression() {
        return this.enableCompression;
    }

    public void setEnableCompression(boolean enableCompression) {
        this.enableCompression = enableCompression;
    }

    public int getConnectionTimeout() {
        return this.connectionTimeout;
    }

    public void setConnectionTimeout(int connectionTimeout) {
        this.connectionTimeout = connectionTimeout;
    }

    public static record SseParameters(String url) {
        public SseParameters(String url) {
            this.url = url;
        }

        public String url() {
            return this.url;
        }
    }
}
```

**重写SseWebFluxTransportAutoConfiguration**
**自动装配添加请求头配置信息**

```java
package org.springframework.ai.autoconfigure.mcp.client;

@AutoConfiguration
@ConditionalOnClass({WebFluxSseClientTransport.class})
@EnableConfigurationProperties({McpSseClientProperties.class, McpClientCommonProperties.class})
@ConditionalOnProperty(
        prefix = "spring.ai.mcp.client",
        name = {"enabled"},
        havingValue = "true",
        matchIfMissing = true
)
public class SseWebFluxTransportAutoConfiguration {
    public SseWebFluxTransportAutoConfiguration() {
    }

    @Bean
    public List<NamedClientMcpTransport> webFluxClientTransports(McpSseClientProperties sseProperties, WebClient.Builder webClientBuilderTemplate, ObjectMapper objectMapper) {
        List<NamedClientMcpTransport> sseTransports = new ArrayList();
        Iterator var5 = sseProperties.getConnections().entrySet().iterator();
        Map<String, String> headersMap = sseProperties.getHeadersMap();
        while(var5.hasNext()) {
            Map.Entry<String, McpSseClientProperties.SseParameters> serverParameters = (Map.Entry)var5.next();
            WebClient.Builder webClientBuilder = webClientBuilderTemplate.clone()
                    .defaultHeaders(headers -> {
                        if (headersMap != null && !headersMap.isEmpty()) {
                            headersMap.forEach(headers::add);
                        }
                    })
                    .baseUrl(((McpSseClientProperties.SseParameters)serverParameters.getValue()).url());
            WebFluxSseClientTransport transport = new WebFluxSseClientTransport(webClientBuilder, objectMapper);
            sseTransports.add(new NamedClientMcpTransport((String)serverParameters.getKey(), transport));
        }

        return sseTransports;
    }

    @Bean
    @ConditionalOnMissingBean
    public WebClient.Builder webClientBuilder() {
        return WebClient.builder();
    }

    @Bean
    @ConditionalOnMissingBean
    public ObjectMapper objectMapper() {
        return new ObjectMapper();
    }
}
```

 使用：

<div class="img-wrap-left"><img class="left-img" src="/assets/img/springai/ch09_1747380936959-4787c998-23ca-4e5e-b3be-24fb49476be9_5346f8a3e2.png" alt="ch09_1747380936959-4787c998-23ca-4e5e-b3be-24fb49476be9_5346f8a3e2.png"></div>

**设置WebClientCustomizer**
在用Spring-ai-M8版本的时候， 发现提供了WebClientCustomizer进行扩展。 可以尝试：
1. 根据用户凭证进行授权

```java
curl -XPOST http://localhost:8080/oauth2/token --data grant_type=client_credentials --user xushu:xushu666 
```

2. 根据授权后的token进行请求：

```java
@Bean
public WebClientCustomizer webClientCustomizer() {
    // 认证 mcp server  /oauth?username:password   --> access_token
    return (builder) -> {
        builder.defaultHeader("Authorization","Bearer eyJraWQiOiIzYmMzMDRmZC02NzcyLTRkYTItODJiMy1hNTEwNGExMDBjNTYiLCJhbGciOiJSUzI1NiJ9.eyJzdWIiOiJ4dXNodSIsImF1ZCI6Inh1c2h1IiwibmJmIjoxNzQ2NzE4MjE5LCJpc3MiOiJodHRwOi8vbG9jYWxob3N0OjgwODAiLCJleHAiOjE3NDY3MTg1MTksImlhdCI6MTc0NjcxODIxOSwianRpIjoiM2VhMzIyODctNTQ5NC00NWZlLThlZDItZGY1MjViNmIwNzkxIn0.Q-zWBZxa2CeFZo2YinenyaLb8KBMMua40X8YSs4n2fez7ODihtoVuCeJQnd2Q6qV2Pa8Z3cfH4QcMUuxMJ-_sLtZaSXpbCThH5q3KoQZ8C4MLJRTpuRqv4z1n7uLNXiVG2rya5hGwjTxu5qzHuBa2ri9pamRwmsjTz4vLHBJ1ILxDJcTkZUFuV1ExQJViewGt_7KMYcFqzGyRPiS4mm4wVvJTDjqcEGwMelu51L44K1DDYgt29vVLRVQEmnUtbBzePAxRqfw_HWJdhRSeQNiqRYCYhdAlPr3QZUFJa54GpuZn3CNyaXFoL7mENSR7wCYWx6wi--_REw6oaIfeSm-Xg");
    };
}
```

SSE是支持动态切换token的，  因为一个请求就是一个新的http请求，  不会出现多线程争抢。
但是需要动态请求：
curl -XPOST [http://localhost:8080/oauth2/token](http://localhost:8080/oauth2/token) --data grant_type=client_credentials --user xushu:xushu666    进行重新授权
