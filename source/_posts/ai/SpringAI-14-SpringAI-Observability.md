---
title: 十四、SpringAI实时监控+观测性
date: 2026-09-14 01:00:00
categories:
  - ai
tags:
  - SpringAi
---

<div class="essay-banner essay-image11">
   Spring AI Observability
</div>

## 为什么Spring AI应用急需可观测性？

### AI服务成本失控的痛点

在企业级AI应用中，使用DeepSeek、OpenAI、Google Gemini或Azure OpenAI等服务时，成本控制是一个严峻挑战：

+ • **Token消耗不透明**：无法精确了解每次AI调用的成本
+ • **费用增长失控**：大规模应用中，AI服务费用可能呈指数级增长
+ • **性能瓶颈难定位**：AI调用链路复杂，问题排查困难
+ • **资源使用不合理**：缺乏数据支撑的优化决策

### Spring AI可观测性的价值

Spring AI的可观测性功能为这些痛点提供了完美解决方案：

+ • ✅ **精准Token监控**：实时追踪输入/输出Token消耗，精确到每次调用
+ • ✅ **智能成本控制**：基于使用统计制定成本优化策略
+ • ✅ **深度性能分析**：识别AI调用瓶颈，优化响应时间
+ • ✅ **完整链路追踪**：端到端记录请求在Spring AI应用中的完整流转

## 实战演练：构建可观测的Spring AI翻译应用

### 第一步：Spring AI项目初始化

在start.spring.io<sup>[1]</sup>创建Spring Boot项目，集成Spring AI核心依赖：

**Maven依赖配置（Spring AI BOM管理）：**

```plain
<!--百炼-->
<dependency>
    <groupId>com.alibaba.cloud.ai</groupId>
    <artifactId>spring-ai-alibaba-starter-dashscope</artifactId>
</dependency> 
<!-- Spring Boot Actuator 监控 -->
<dependency>
  <groupId>org.springframework.boot</groupId>
  <artifactId>spring-boot-starter-actuator</artifactId>
</dependency>
<!--web-->
<dependency>
  <groupId>org.springframework.boot</groupId>
  <artifactId>spring-boot-starter-web</artifactId>
</dependency>
```

### 第二步：Spring AI客户端配置

**主应用类配置：**

```plain
@SpringBootApplication
publicclassSpringAiTranslationApplication {
    
    publicstaticvoidmain(String[] args) {
        SpringApplication.run(SpringAiTranslationApplication.class, args);
    }
    
    @Bean
    public ChatClient chatClient(ChatClient.Builder builder) {
        return builder.build();
    }
}
```

**Spring AI配置文件：**

```plain
# Spring AI 可观测性配置
management:
endpoints:
    web:
      exposure:
        include:"*"
endpoint:
    health:
      show-details:always
metrics:
    export:
      prometheus:
        enabled:true

spring:
threads:
    virtual:
      enabled:true
ai:
    deepseek:
      api-key:${DEEPSEEK_API_KEY}
      chat:
        options:
          model:deepseek-chat
          temperature: 0.8
```

**环境变量设置：**

export DEEPSEEK_API_KEY=your-deepseek-api-key

### 第三步：构建Spring AI翻译服务

**智能翻译控制器：**

```java

@RestController
@RequestMapping("/api/v1")
@RequiredArgsConstructor
@Slf4j
public class SpringAiTranslationController {

    private final ChatModel chatModel;

    @PostMapping("/translate")
    public TranslationResponse translate(@RequestBody TranslationRequest request) {

        log.info("Spring AI翻译请求: {} -> {}", request.getSourceLanguage(), request.getTargetLanguage());
        
        String prompt= String.format(
                "作为专业翻译助手，请将以下%s文本翻译成%s，保持原文的语气和风格：\n%s",
                request.getSourceLanguage(),
                request.getTargetLanguage(),
                request.getText()
        );

        String translatedText= chatModel.call(prompt);
        
        return TranslationResponse.builder()
                .originalText(request.getText())
                .translatedText(translatedText)
                .sourceLanguage(request.getSourceLanguage())
                .targetLanguage(request.getTargetLanguage())
                .timestamp(System.currentTimeMillis())
                .build();
    }
}

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
class TranslationRequest {
    private String text;
    private String sourceLanguage;
    private String targetLanguage;
}

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
class TranslationResponse {
    private String originalText;
    private String translatedText;
    private String sourceLanguage;
    private String targetLanguage;
    private Long timestamp;
}
```

### 第四步：Spring AI翻译API测试

```plain
curl -X POST http://localhost:8080/api/v1/translate  
  -H "Content-Type: application/json"  
  -d '{
    "text": "Spring AI makes AI integration incredibly simple and powerful",
    "sourceLanguage": "英语",
    "targetLanguage": "中文"
}'

# 响应示例
{
"originalText": "Spring AI makes AI integration incredibly simple and powerful",
"translatedText": "Spring AI让AI集成变得极其简单而强大",
"sourceLanguage": "英语",
"targetLanguage": "中文",
"timestamp": 1704067200000
}
```

## Spring AI监控指标深度解析

### 核心指标1：Spring AI操作性能监控

**指标端点**：`/actuator/metrics/spring.ai.chat.client`

```plain
{
  "name":"spring.ai.chat.client.operation",
"description":"Spring AI ChatClient操作性能指标",
"baseUnit":"seconds",
"measurements":[
    {
      "statistic":"COUNT",
      "value":15
    },
    {
      "statistic":"TOTAL_TIME",
      "value":8.456780293
    },
    {
      "statistic":"MAX",
      "value":2.123904083
    }
],
"availableTags":[
    {
      "tag":"gen_ai.operation.name",
      "values":["framework"]
    },
    {
      "tag":"spring.ai.kind",
      "values":["chat_client"]
    }
]
}
```

**业务价值**：

+ • 监控Spring AI翻译服务调用频次
+ • 分析Spring AI响应时间分布
+ • 识别Spring AI性能瓶颈

### 核心指标2：Spring AI Token使用量精准追踪

**指标端点**：`/actuator/metrics/gen_ai.client.token.usage`

```plain
{
  "name":"gen_ai.client.token.usage",
"description":"Spring AI Token使用量统计",
"measurements":[
    {
      "statistic":"COUNT",
      "value":1250
    }
],
"availableTags":[
    {
      "tag":"gen_ai.response.model",
      "values":["deepseek-chat"]
    },
    {
      "tag":"gen_ai.request.model",
      "values":["deepseek-chat"]
    },
    {
      "tag":"gen_ai.token.type",
      "values":[
        "output",
        "input",
        "total"
      ]
    }
]
}
```

**成本控制价值**：

+ • 精确计算Spring AI服务成本
+ • 优化Prompt设计降低Token消耗
+ • 制定基于使用量的预算策略
