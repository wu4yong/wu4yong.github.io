---
title: Redis-实战
date: 2025-09-02 01:00:00
categories:
  - database
tags:
  - redis
---
<div class="essay-banner essay-image3"></div>

# 二、Redis实战

## 1.短信登录

### 1.1 环境准备

### 准备数据库

**[hmdp.sql]**

执行以上hmdp.sql脚本文件，得到数据库如下（MySQL版本5.7以上）：

tb_user：用户表

tb_user_info：用户详情表

tb_shop：商户信息表

tb_shop_type：商户类型表

tb_blog：用户日记表（达人探店日记）

tb_follow：用户关注表

tb_voucher：优惠券表

tb_voucher_order：优惠券的订单表

### 导入后端项目

**[hm-dianping.zip]**

用idea导入上面的hm-dianping项目，并修改配置文件中的mysql、redis等地址信息为自己对应的信息。

启动项目，打开浏览器访问http://localhost:8081/shop-type/list，如果看到数据就表示项目导入成功。

### 导入前端工程

**[nginx-1.18.0.zip]**

将上面的前端工程nginx-1.18.0放在一个不包含中文空格的路径下，双击nginx.exe启动前端项目。

### 运行前端项目

打开浏览器，开启浏览器的手机模式，然后访问http://localhost:8080，就可以看到前端页面了：

<div class="img-wrap-left"><img class="left-img" src="/assets/img/redis/2/image13.png" alt="image13.png"></div>

### 1.2 基于Session实现登录

基于Session实现登录功能分为三个接口：

**发送验证码**：用户提交手机号后，校验手机号是否合法，不合法重新输入，合法就生成并保存验证码，并将验证码响应给用户。

**短信验证码登录、注册**：后端拿到手机号和验证码后，和session中的验证码比较，不一致无法通过，一致就查询用户是否存在，不存在的用户创建并保存一个新用户，然后同一致保存用户到session。

**校验登录状态**：用户请求时，后台从Cookie获取sessionID，然后从session中获取用户信息，只有用户存在才保存用户信息到ThreadLocal并放行，否则不放行。

<div class="img-wrap-left"><img class="left-img" src="/assets/img/redis/2/image14.png" alt="image14.png"></div>

### 1.2.1 发送验证码

完善UserContrllor对应的TODO项：

```java
/**
* 发送手机验证码
*/
@PostMapping("code")
public Result sendCode(@RequestParam("phone") String phone, HttpSession session) {
// 发送短信验证码并保存验证码
return userService.sendCode(phone, session);
}
```

IUserService接口：

```java
Result sendCode(String phone, HttpSession session);
```

UserServiceImpl类：

```java
@Override
public Result sendCode(String phone, HttpSession session) {
// 1.校验手机号
if (RegexUtils.isPhoneInvalid(phone)) {
// 2.如果不符合，返回错误信息
return Result.fail("手机号格式错误！");
}
// 3.符合，生成验证码
String code = RandomUtil.randomNumbers(6);

// 4.保存验证码到 session
session.setAttribute("code", code);
// 5.发送验证码
log.debug("发送短信验证码成功，验证码：{}", code);
// 返回ok
return Result.ok();
}
```

### 1.2.2 登录注册

完善UserContrllor对应的TODO项：

```java
/**
* 登录功能
* @param loginForm 登录参数，包含手机号、验证码；或者手机号、密码
*/
@PostMapping("/login")
public Result login(@RequestBody LoginFormDTO loginForm, HttpSession session){
// 实现登录功能
return userService.login(loginForm, session);
}
```

IUserService接口：

```java
Result login(LoginFormDTO loginForm, HttpSession session);
```

UserServiceImpl类：

```java
@Override
public Result login(LoginFormDTO loginForm, HttpSession session) {
// 1.校验手机号
String phone = loginForm.getPhone();
if (RegexUtils.isPhoneInvalid(phone)) {
// 2.如果不符合，返回错误信息
return Result.fail("手机号格式错误！");
}
// 3.校验验证码
Object cacheCode = session.getAttribute("code");
String code = loginForm.getCode();
if(cacheCode == null || !cacheCode.toString().equals(code)){
//3.不一致，报错
return Result.fail("验证码错误");
}
//一致，根据手机号查询用户
User user = query().eq("phone", phone).one();

//5.判断用户是否存在
if(user == null){
//不存在，则创建
user = createUserWithPhone(phone);
}
//7.保存用户信息到session中
session.setAttribute("user", BeanUtils.copyProperties(user,UserDTO.class));

return Result.ok();
}

private User createUserWithPhone(String phone) {
// 1.创建用户
User user = new User();
user.setPhone(phone);
user.setNickName(USER_NICK_NAME_PREFIX + RandomUtil.randomString(10));
// 2.保存用户
save(user);
return user;
}
```

### 1.2.3 登录拦截功能

在utils包下定义拦截器LoginInterceptor：

```java
public class LoginInterceptor implements HandlerInterceptor {

@Override
public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
//1.获取session
HttpSession session = request.getSession();
//2.获取session中的用户
Object user = session.getAttribute("user");
//3.判断用户是否存在
if(user == null){
//4.不存在，拦截，返回401状态码
response.setStatus(401);
return false;
}
//5.存在，保存用户信息到Threadlocal
UserHolder.saveUser((UserDTO) user);
//6.放行
return true;
}
}
```

在config包下注册拦截器，使其生效：

```java
@Configuration
public class MvcConfig implements WebMvcConfigurer {

@Override
public void addInterceptors(InterceptorRegistry registry) {
// 登录拦截器
registry.addInterceptor(new LoginInterceptor())
.excludePathPatterns(
"/shop/**",
"/voucher/**",
"/shop-type/**",
"/upload/**",
"/blog/hot",
"/user/code",
"/user/login"
);
}
}
```

完善UserContrllor对应的TODO项：

```java
@GetMapping("/me")
public Result me(){
// 获取当前登录的用户并返回
UserDTO user = UserHolder.getUser();
return Result.ok(user);
}
```

### 1.3 Session共享

实际开发中，往往采用集群分布，即使用多台tomcat处理请求，由于http协议是无状态协议，假如第一次登录请求到第一台tomcat，此时第一台tomcat上会存储对应的session，其他tomcat并没有存放这个session，下一次请求到第二台tomcat时，由于服务器没有对应的session，会认为用户没有登录，当然，这时用户已经登录了。

Session共享即当任意一台服务器的session修改时，都会同步给其他的Tomcat服务器的session，此时就能解决集群分布下session失效问题。但是，这样会带来额外的开销，给服务器带来压力。

<div class="img-wrap-left"><img class="left-img" src="/assets/img/redis/2/image15.png" alt="image15.png"></div>

### 1.4 Redis代替Session共享

由于Redis是基于内存的，而且可被多台tomcat服务器共享，所以用Redis代替Session共享能很好的解决集群分布的session问题。

### 1.4.1 业务流程

**发送短信验证码**：和原来的业务逻辑基本一致，只不过是验证码不再是保存到session，而是保存到Redis。

**短信验证码登录、注册**：后端拿到手机号和验证码后，从redis中获取正确的验证码，然后和用户输入的验证码校对，不一致无法通过，一致就根据手机号从MySQL获取用户，用户不存在创建并保存一个新用户，然后同一致保存用户到Redis中。

<div class="img-wrap-left"><img class="left-img" src="/assets/img/redis/2/image16.png" alt="image16.png"></div>

**校验登录状态**：和原来的业务逻辑基本一致，只是获取用户不再是从session获取，而是从Redis获取。

<div class="img-wrap-left"><img class="left-img" src="/assets/img/redis/2/image17.png" alt="image17.png"></div>

### 1.4.2 Key-Value的设计

再进行往Redis中存数据时，需要考虑如下几点：

value的数据结构（数据类型）

key的选择：唯一性、方便携带

合适的存储粒度：内存占用

如验证码使用string类型，键使用login:code:手机号的格式；用户信息使用Hash类型，键使用login:token:UUID的格式

### 1.4.3 代码改造

UserServiceImpl代码改造：

```java
package com.hmdp.service.impl;
...
@Service
@Slf4j
public class UserServiceImpl extends ServiceImpl<UserMapper, User> implements IUserService {

@Resource
private StringRedisTemplate stringRedisTemplate;

@Override
public Result sendCode(String phone, HttpSession session) {
//校验手机号是否合法
if(RegexUtils.isPhoneInvalid(phone)){
//不合法，返回错误信息
return Result.fail("手机号格式不正确");
}

//合法，生成验证码
String code = RandomUtil.randomNumbers(6);

//保存验证码到redis
stringRedisTemplate.opsForValue().set(RedisConstants.LOGIN_CODE_KEY + phone, code, RedisConstants.LOGIN_CODE_TTL, TimeUnit.MINUTES);

//发送验证码
log.debug("验证码：{}", code);

//返回OK
return Result.ok();
}

@Override
public Result login(LoginFormDTO loginForm, HttpSession session) {
//验证手机号是否合法
String phone = loginForm.getPhone();
if(phone == null || RegexUtils.isPhoneInvalid(phone)){
//手机号不合法返回错误信息
return Result.fail("手机号格式不正确");
}

//校验验证码是否一致
String rightCode = stringRedisTemplate.opsForValue().get(RedisConstants.LOGIN_CODE_KEY + phone);
String userCode = loginForm.getCode();
if(rightCode == null || !userCode.equals(rightCode)){
//不一致返回错误
return Result.fail("验证码不正确，请检查后重新输入");
}

//根据手机号获取用户
User user = query().eq("phone", phone).one();

//用户不存在就创建一个用户到数据库
if(user == null){
user = createUserWithPhone(phone);
}

//保存用户到redis
String token = UUID.randomUUID().toString();
UserDTO userDTO = BeanUtil.copyProperties(user, UserDTO.class);
Map<String, Object> userMap = BeanUtil.beanToMap(userDTO, new HashMap<>(),
CopyOptions.create()
.setIgnoreNullValue(true)
.setFieldValueEditor((fieldName, fieldValue) -> fieldValue.toString()));
stringRedisTemplate.opsForHash().putAll(RedisConstants.LOGIN_USER_KEY + token, userMap);
stringRedisTemplate.expire(RedisConstants.LOGIN_USER_KEY + token, RedisConstants.LOGIN_USER_TTL, TimeUnit.MINUTES);

//返回OK
return Result.ok(token);
}

private User createUserWithPhone(String phone) {
...
}
}
```

重写LoginInterceptor拦截器的业务逻辑：

```java
package com.hmdp.utils;

public class LoginInterceptor implements HandlerInterceptor {

private StringRedisTemplate stringRedisTemplate;

public LoginInterceptor(StringRedisTemplate stringRedisTemplate) {
this.stringRedisTemplate = stringRedisTemplate;
}

@Override
public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
//获取请求头中的token
String token = request.getHeader("authorization");

//token不存在，返回401状态码，拦截
if(StrUtil.isBlank(token)){
response.setStatus(401);
return false;
}

//基于token获取redis中的用户
String key = RedisConstants.LOGIN_USER_KEY + token;
Map<Object, Object> userMap = stringRedisTemplate.opsForHash().entries(key);

//判断用户是否存在
if(userMap.isEmpty()){
//用户不存在返回401状态码，拦截
response.setStatus(401);
return false;
}

//将查到的用户转换成userDTO
UserDTO userDTO = BeanUtil.fillBeanWithMap(userMap, new UserDTO(), false);

//保存用户信息到ThreadLocal
UserHolder.saveUser(userDTO);

//刷新token有效期
stringRedisTemplate.expire(key, RedisConstants.LOGIN_USER_TTL, TimeUnit.MINUTES);

//放行
return true;
}
}
```

|                                                                                                       |
| ----------------------------------------------------------------------------------------------------- |
| **注意**：由于LoginInterceptor的对象的手动创建的，而非Spring创建的，所以并不能通过@Resource或@Autowired注解注入StringRedisTemplate的对象。 |

修改拦截器注册类MvcConfig：

```java
package com.hmdp.config;

@Configuration
public class MvcConfig implements WebMvcConfigurer {
@Resource
private StringRedisTemplate stringRedisTemplate;

@Override
public void addInterceptors(InterceptorRegistry registry) {
// 登录拦截器
registry.addInterceptor(new LoginInterceptor(stringRedisTemplate))
... //这部分不变
);
}
}
```

### 1.4.4 解决状态登录刷新问题

在注册拦截器LoginInterceptor时，排除了一些路径，如果用户在指定时间内只使用了这些排除的路径，那超时会被判定未登录，显然用户体验不好。

可以在LoginInterceptor拦截器之前再定义一个拦截器，拦截所有请求，这个拦截器实现基本逻辑（用户存在性判断以外的其他逻辑），并更新token有效期：

<div class="img-wrap-left"><img class="left-img" src="/assets/img/redis/2/image18.png" alt="image18.png"></div>

在utils包下新建一个拦截器RefreshTokenInterceptor：

```java
package com.hmdp.utils;

public class RefreshTokenInterceptor implements HandlerInterceptor {
@Resource
private StringRedisTemplate stringRedisTemplate;

public RefreshTokenInterceptor(StringRedisTemplate stringRedisTemplate) {
this.stringRedisTemplate = stringRedisTemplate;
}

@Override
public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
// 1.获取请求头中的token
String token = request.getHeader("authorization");
if (StrUtil.isBlank(token)) {
return true;
}

// 2.基于token获取redis中的用户
String key = RedisConstants.LOGIN_USER_KEY + token;
Map<Object, Object> userMap = stringRedisTemplate.opsForHash().entries(key);

// 3.判断用户是否存在
if (userMap.isEmpty()) {
return true;
}

// 5.将查询到的hash数据转为UserDTO
UserDTO userDTO = BeanUtil.fillBeanWithMap(userMap, new UserDTO(), false);

// 6.存在，保存用户信息到 ThreadLocal
UserHolder.saveUser(userDTO);

// 7.刷新token有效期
stringRedisTemplate.expire(key, RedisConstants.LOGIN_USER_TTL, TimeUnit.MINUTES);

// 8.放行
return true;
}

@Override
public void afterCompletion(HttpServletRequest request, HttpServletResponse response, Object handler, Exception ex) throws Exception {
UserHolder.removeUser();
}
}
```

修改拦截器注册类MvcConfig：

```java
@Override
public void addInterceptors(InterceptorRegistry registry) {
// 登录拦截器
registry.addInterceptor(new LoginInterceptor(stringRedisTemplate))
.excludePathPatterns(
"/shop/**",
"/voucher/**",
"/shop-type/**",
"/upload/**",
"/blog/hot",
"/user/code",
"/user/login"
).order(1);
//token刷新拦截器
registry.addInterceptor(new RefreshTokenInterceptor(stringRedisTemplate)).addPathPatterns("/**").order(0);
}
```

## 2.商户查询缓存

### 2.1 缓存介绍

一个实际存在的网站，如果访问的用户量很大，这些用户的请求都会达到SQL数据库，此时SQL数据库的压力就很大，通过缓存，可以减轻数据库的压力。

缓存，顾名思义，就是数据交换的**缓冲区**，俗称的缓存就是**缓冲区内的数据**。比如，可以把数据库里的数据缓存到内存中（常用Redis），由于内存的速度显著高于磁盘，当请求到达服务器时，服务器就会尝试从缓存中获取数据，获取成功就返回缓存中的数据，否则再访问数据库。

当然，缓存是双面的，有优点和缺点：

缓存的作用（优点）：降低后端负载；提高读写效率，降低响应时间

缓存的成本（缺点）：数据一致性成本；代码维护成本；运维成本

数据一致性：数据库发生改变，Redis还没及时更新，那么从缓存内取到的数据就会出错，就是数据一致性问题

### 2.2 添加商户缓存

### 2.2.1 缓存模型和思路

```java
@GetMapping("/{id}")
public Result queryShopById(@PathVariable("id") Long id) {
//这里是直接查询数据库
return shopService.queryById(id);
}
```

<div class="img-wrap-left"><img class="left-img" src="/assets/img/redis/2/image19.png" alt="image19.png"></div>

当前端点击103茶餐厅选项后（其他也一样），后端就请求到queryShopById方法从数据库获取店铺信息，可以缓存对应的店铺信息到Redis中，后续请求时只要从Redis中取数据即可，从而降低数据库压力并提高效率，相应的缓存模型和业务逻辑为：

<div class="img-wrap-left"><img class="left-img" src="/assets/img/redis/2/image20.png" alt="image20.png"></div>

### 2.2.2 代码实现

ShopController：

```java
@GetMapping("/{id}")
public Result queryShopById(@PathVariable("id") Long id) {
return shopService.queryById(id);
}
```

IShopService接口新增一个方法：

```java
Result queryById(Long id);
```

ShopServiceImpl新增一个方法：

```java
@Override
public Result queryById(Long id) {
//1.从Redis查询商铺缓存
String key = RedisConstants.CACHE_SHOP_KEY + id;
String shopJson = stringRedisTemplate.opsForValue().get(key);

//2.判断是否存在，存在直接返回
if(StrUtil.isNotBlank(shopJson)){
Shop shop = JSONUtil.toBean(shopJson, Shop.class);
return Result.ok(shop);
}

//3.不存在，根据id查询数据库
Shop shop = getById(id);

//4.数据库中也不存在，返回错误
if(shop == null){
return Result.fail("店铺不存在");
}

//5.存在，缓存到Redis
stringRedisTemplate.opsForValue().set(key, JSONUtil.toJsonStr(shop));

//6.返回
return Result.ok(shop);
}
```

### 2.3 添加商户类型缓存

ShopTypeController：

```java
@GetMapping("list")
public Result queryTypeList() {
return typeService.queryList();
}
```

IShopTypeService添加queryList方法：

```java
Result queryList();
```

RedisConstants添加两个属性：

```java
public static final String CACHE_SHOPTYPE_KEY = "cache:shop_type:shop_type_list";
public static final Long CACHE_SHOPTYPE_TTL = 60L;
```

ShopTypeServiceImpl添加queryList方法：

```java
@Override
public Result queryList() {
//1.从Redis中获取商户类型列表
String key = RedisConstants.CACHE_SHOPTYPE_KEY;
List<String> list = stringRedisTemplate.opsForList().range(key, 0, -1);

//2.商户类型列表存在，直接返回
List<ShopType> typeList = new ArrayList<>();
if(CollectionUtil.isNotEmpty(list)){
for (String s : list) {
ShopType shopType = JSONUtil.toBean(s, ShopType.class);
typeList.add(shopType);
}
return Result.ok(typeList);
}

//3.商户类型列表不存在，从数据库查找商户类型列表
typeList = query().orderByAsc("sort").list();

//4.数据库也不存在商户类型列表，返回错误
if(CollectionUtil.isEmpty(typeList)){
return Result.fail("不存在商户类型");
}

//5.序列化商户类型列表
for (ShopType shopType : typeList) {
String s = JSONUtil.toJsonStr(shopType);
list.add(s);
}

//6.将商户类型列表写入Redis
stringRedisTemplate.opsForList().rightPushAll(key, list);
stringRedisTemplate.expire(key, RedisConstants.CACHE_SHOPTYPE_TTL, TimeUnit.MINUTES);

//7.返回ok
return Result.ok(typeList);
}
```

### 2.4 缓存更新策略

### 2.4.1 缓存淘汰

由于我们只往内存中写数据，却不进行更新删除，久而久之，内存就会不足，从而引起一些问题，所以，内存中的数据需要定时更新，也就是缓存淘汰，缓存淘汰的方案有三种：

|          |                                                           |                             |                         |
| -------- | --------------------------------------------------------- | --------------------------- | ----------------------- |
|          | 内存淘汰                                                      | 超时剔除                        | 主动更新                    |
| **说明**   | 不用自己维护，利用Redis的内存淘汰机制，当内存不足时自动淘汰部分数据（不确定淘汰哪些数据），下次查询时更新缓存 | 给缓存添加超时时间，到期后自动删除，下次查询时更新缓存 | 编写业务逻辑，在修改数据库的同时，手动更新缓存 |
| **一致性**  | 差                                                         | 一般                          | 好                       |
| **维护成本** | 无                                                         | 低                           | 高                       |

**业务场景**：

低一致性需求：使用内存淘汰机制，例如店铺类型的查询缓存

高一致性需求：主动更新，并以超时剔除作为兜底方案，例如店铺详情查询的缓存

### 2.4.2 缓存不一致

由于缓存是数据来源于数据库，如果数据库的数据发生变化时，缓存中的数据没有同步更新，此时用户会使用旧的数据，就会产生类似多线程数据安全问题，导致数据库缓存不一致问题。

现有三种方案解决数据库不一致问题：

<div class="img-wrap-left"><img class="left-img" src="/assets/img/redis/2/image21.png" alt="image21.png"></div>

如果使用Cache Aside Pattern方案，需要考虑三个问题：

删除缓存还是更新缓存？

更新缓存：每次更新数据库都要更新缓存，假如只有最后一次更新有效，那前几次更新缓存都无效，无效写操作较多

删除缓存：更新数据库时让缓存失效，查询时再更新缓存，胜出

如何保证缓存与数据库的操作同时成功或失败？

单体系统，将缓存与数据库操作放在一个事务

分布式系统，利用TCC等分布式事务方案

先操作缓存还是先操作数据库？

先删缓存再操作数据库

先操作数据库再删缓存

那到底是先操作缓存还是先操作数据库呢？

先删除缓存再操作数据库：假如原来缓存中数据为10，线程1删除缓存完成后更新数据库，由于更新数据库的操作在磁盘上进行，速度慢于操作缓存，此时线程2完成了查询缓存，未命中，查询出数据库的数据10并写入缓存，写入完成后线程1更新完数据库数据为20，此时缓存数据和数据库数据发生不一致。

先操作数据库再操作缓存：假如此时缓存失效（比如超时），数据库中数据为10，线程1查询缓存，未命中，查询数据库，将要写入缓存时或写入缓存的过程中，此时线程2更新数据库内容为20，然后删除缓存，之后线程1将数据10写入缓存，此时缓存数据和数据库数据发生不一致。

<div class="img-wrap-left"><img class="left-img" src="/assets/img/redis/2/image22.png" alt="image22.png"></div>

由于写入缓存的速度很快，这段时间基本不可能有其他线程完成业务逻辑，所以先操作数据库再操作缓存的不一致现象很难发生，而先删除缓存再操作数据库的不一致现象就很常见，所以先操作数据库再操作缓存胜出。

### 2.4.3 缓存更新策略最佳解决方案

根据上一节的分析，得出缓存更新策略最佳解决方案：

低一致性需求：使用Redis自带的内存淘汰机制

高一致性需求：主动更新，并以超时剔除作为兜底方案

读操作：

缓存命中则直接返回

缓存未命中则查询数据库，并写入缓存，设定超时时间

写操作：

先写数据库，然后再删除缓存

要确保数据库与缓存操作的原子性

### 2.5 实现商铺缓存和数据库的双写一致

### 2.5.1 需求

修改ShopController中的业务逻辑，满足下面的需求：

根据id查询店铺时，如果缓存未命中，则查询数据库，将数据库结果写入缓存，并设置超时时间

根据id修改店铺时，先修改数据库，再删除缓存

### 2.5.2 代码实现

修改ShopServiceImpl的queryById方法，设置缓存时添加过期时间：

```java
@Override
public Result queryById(Long id) {
... //业务代码不变

//5.存在，缓存到Redis
stringRedisTemplate.opsForValue().set(key, JSONUtil.toJsonStr(shop), RedisConstants.CACHE_SHOP_TTL, TimeUnit.MINUTES);

//6.返回
return Result.ok(shop);
}
```

修改ShopController的updateShop方法：

```java
public Result updateShop(@RequestBody Shop shop) {
// 写入数据库
return shopService.update(shop);
}
```

IShopService接口添加update方法：

```java
Result update(Shop shop);
```

ShopServiceImpl类添加update方法：

```java
@Override
@Transactional
public Result update(Shop shop) {
//店铺id不能为空
Long id = shop.getId();
if(id == null){
return Result.fail("店铺id不能为空");
}

//更新数据库
updateById(shop);

//删除缓存
stringRedisTemplate.delete(RedisConstants.CACHE_SHOP_KEY + id);
return Result.ok();
}
```

### 2.6 缓存穿透

缓存穿透是指客户端请求的数据在缓存中和数据库中都不存在，这样缓存永远不会生效，这些请求都会打到数据库，带来巨大压力。

### 2.6.1 解决方案

缓存穿透常见解决方案有两种：

缓存空对象：当客户端访问不存在的数据时，会穿透Redis直击数据库，但是数据库中也没有数据，此时我们也把这个数据存到Redis，只是值为null，并设置有效期，下次客户端再访问这个资源时，就会直接访问到Redis，而不会到达数据库。

布隆过滤：采用哈希思想，利用一个庞大的二进制数组，走哈希思想判断当前请求的数据是否存在（对应位置是0还是1），如果存在，则放行，如果不存在，则直接返回。布隆过滤虽然节约内存空间，但是由于哈希冲突，存在误判风险。

<div class="img-wrap-left"><img class="left-img" src="/assets/img/redis/2/image23.png" alt="image23.png"></div>

缓存空对象

优点：实现简单，维护方便

缺点：额外的内存消耗；可能造成短期的不一致

布隆过滤

优点：内存占用较少，没有多余key

缺点：实现复杂；存在误判可能

### 2.6.2 解决商品查询的缓存穿透问题

在原来的逻辑中，如果这个数据在mysql中不存在，直接就返回404，这样会存在缓存穿透，我们使用缓存空对象解决，实现思路如下：

<div class="img-wrap-left"><img class="left-img" src="/assets/img/redis/2/image24.png" alt="image24.png"></div>

### 代码实现

修改ShopServiceImpl类的queryById方法：

```java
@Override
public Result queryById(Long id) {
//1.从Redis查询商铺缓存
String key = RedisConstants.CACHE_SHOP_KEY + id;
String shopJson = stringRedisTemplate.opsForValue().get(key);

//2.判断是否存在，存在直接返回
if(StrUtil.isNotBlank(shopJson)){
Shop shop = JSONUtil.toBean(shopJson, Shop.class);
return Result.ok(shop);
}

//3.不存在，判断命中值是否是空值，为空值返回错误
if(shopJson == null){
return Result.fail("店铺不存在");
}

//4.数据库中也不存在，缓存空字符串，返回错误
Shop shop = getById(id);
if(shop == null){
stringRedisTemplate.opsForValue().set(key, "", RedisConstants.CACHE_NULL_TTL, TimeUnit.MINUTES);
return Result.fail("店铺不存在");
}

//5.存在，缓存到Redis
stringRedisTemplate.opsForValue().set(key, JSONUtil.toJsonStr(shop), RedisConstants.CACHE_SHOP_TTL, TimeUnit.MINUTES);

//6.返回
return Result.ok(shop);
}
```

### 2.7 缓存雪崩

缓存雪崩是指在同一时段大量的缓存key同时失效或者Redis服务宕机，导致大量请求到达数据库，带来巨大压力。

解决方案：

给不同的Key的TTL添加随机值

利用Redis集群提高服务的可用性

给缓存业务添加降级限流策略

给业务添加多级缓存

<div class="img-wrap-left"><img class="left-img" src="/assets/img/redis/2/image25.png" alt="image25.png"></div>

### 2.8 缓存击穿

缓存击穿问题也叫**热点Key问题**，就是一个被高并发访问并且缓存重建业务较复杂的key突然失效了，无数的请求访问会在瞬间给数据库带来巨大的冲击。

详细解释：假设线程1在查询缓存之后，查询数据库并重建缓存数据，此时线程1正在执行，线程2、线程3、线程4...同时访问当前这个方法， 且都没有从缓存中查到数据，就会同一时刻访问查询访问数据库，同时执行数据库代码，数据库压力就会过大。

<div class="img-wrap-left"><img class="left-img" src="/assets/img/redis/2/image26.png" alt="image26.png"></div>

常见的解决方案有两种：互斥锁、逻辑过期

### 2.8.1 缓存击穿解决方案

### 互斥锁介绍

利用锁的互斥性，如果第一个线程获取锁成功，就可以执行业务逻辑，这个过程中其他线程只能等待，直到第一个线程释放锁，才能进行业务逻辑，从而解决缓存击穿问题。但是这会使业务从并行变成串行，而且其他线程等待过程不能执行任何逻辑。

如下图：线程1先过来访问，未命中缓存，获取互斥锁并查询数据库重建缓存，此时线程2访问，未命中缓存，尝试获取锁，由于互斥锁线程1未释放，就会获取失败，然后休眠等待不断尝试获取锁，只有线程1业务执行完释放锁后，线程2才能获取锁成功，命中缓存，返回缓存中的数据。

<div class="img-wrap-left"><img class="left-img" src="/assets/img/redis/2/image27.png" alt="image27.png"></div>

### 逻辑过期介绍

在互斥锁方案中提到，互斥锁方案会造成业务串行化，影响用户体验，导致的根本原因是缓存失效（过期），导致未命中缓存从而不断尝试获取锁。解决办法是使用逻辑过期时间代替真实TTL过期时间，并牺牲数据的及时性，用业务逻辑判断是否过期，过期的话缓存重建的过程用另一个线程完成，没重建完成前使用原来的数据，即脏数据。

如下图：当线程1请求过来时，通过逻辑判断发现缓存过期，尝试获取互斥锁，获取成功，开启一个新的线程实现查询数据库并重建缓存，重置过期时间，而线程1先返回脏数据，即使其他线程插队，也会从缓存中获取过期数据，尝试获取互斥锁，获取失败，返回脏数据。

<div class="img-wrap-left"><img class="left-img" src="/assets/img/redis/2/image28.png" alt="image28.png"></div>

| 解决方案 | 优点 | 缺点 |
| --- | --- | --- |
| 互斥锁 | 没有额外的内存消耗<br />保证一致性<br />实现简单 | 线程需要等待，性能受到影响<br />可能有死锁风险 |
| 逻辑过期 | 线程无需等待，性能较好 | 不保证一致性<br />有额外内存消耗<br />实现复杂 |

### 2.8.1 互斥锁解决店铺查询缓存击穿

使用**互斥锁**解决商品查询业务的缓存击穿问题，业务逻辑如下：

<div class="img-wrap-left"><img class="left-img" src="/assets/img/redis/2/image29.png" alt="image29.png"></div>

如何获取全局唯一的互斥锁：利用redis的setnx方法，如果redis中没有这个key，则插入成功返回1，stringRedisTemplate中对应true；如果有这个key，则插入失败返回0，stringRedisTemplate中对应false，通过true或false，来表示是否成功获得互斥锁。

```java
private boolean tryLock(String key) {
Boolean flag = stringRedisTemplate.opsForValue().setIfAbsent(key, "1", 10, TimeUnit.SECONDS);
return BooleanUtil.isTrue(flag);
}


private void unlock(String key) {
stringRedisTemplate.delete(key);
}
```

先封装ShopServiceImpl类中原来的缓存穿透代码，防止丢失：

```java
private Shop queryWithPassThrough(Long id){
//1.从Redis查询商铺缓存
String key = RedisConstants.CACHE_SHOP_KEY + id;
String shopJson = stringRedisTemplate.opsForValue().get(key);

//2.判断是否存在，存在直接返回
if(StrUtil.isNotBlank(shopJson)){
return JSONUtil.toBean(shopJson, Shop.class);
}

//3.不存在，判断命中值是否是空值，为空值返回错误
if(shopJson == null) return null;

//4.数据库中也不存在，缓存空字符串，返回错误
Shop shop = getById(id);
if(shop == null){
stringRedisTemplate.opsForValue().set(key, "", RedisConstants.CACHE_NULL_TTL, TimeUnit.MINUTES);
return null;
}

//5.存在，缓存到Redis
stringRedisTemplate.opsForValue().set(key, JSONUtil.toJsonStr(shop), RedisConstants.CACHE_SHOP_TTL, TimeUnit.MINUTES);

//6.返回
return shop;
}
```

定义queryWithMutex方法实现互斥锁解决缓存击穿：

```java
public Shop queryWithMutex(Long id){
//1.从redis中查询商铺缓存
String key = RedisConstants.CACHE_SHOP_KEY + id;

//2.判断是否存在，存在就直接返回
String shopJson = stringRedisTemplate.opsForValue().get(key);
if(StrUtil.isNotBlank(shopJson)){
return JSONUtil.toBean(shopJson, Shop.class);
}

//3.判断命中值是否为空值，空值返回错误
if(shopJson != null) return null;

//4.实现缓存重构
//4.1 获取互斥锁
String lockKey = RedisConstants.LOCK_SHOP_KEY + id;
Shop shop = null;
try {
boolean islock = tryLock(lockKey);

//4.2 判断是否获取成功，获取失败则休眠重试
if(!islock){
Thread.sleep(40);
return queryWithMutex(id);
}

//4.3 获取成功，根据id查询数据库
shop = getById(id);

//5 数据库也不存在，将空值写入redis，返回错误
if(shop == null){
stringRedisTemplate.opsForValue().set(key, "", RedisConstants.CACHE_NULL_TTL, TimeUnit.MINUTES);
return null;
}

//存在，写入商铺信息到redis
stringRedisTemplate.opsForValue().set(key, JSONUtil.toJsonStr(shop), RedisConstants.CACHE_SHOP_TTL, TimeUnit.MINUTES);
} catch (InterruptedException e) {
throw new RuntimeException(e);
} finally {
//释放锁
unlock(lockKey);
}

return shop;
}
```

修改queryById方法：

```java
@Override
public Result queryById(Long id) {
/*//缓存穿透
Shop shop = queryWithPassThrough(id);*/

//互斥锁解决缓存击穿
Shop shop = queryWithMutex(id);

if(shop==null) return Result.fail("店铺不存在!");

return Result.ok(shop);
}
```

### 测试

使用Postman实现100个请求：

<div class="img-wrap-left"><img class="left-img" src="/assets/img/redis/2/image30.png" alt="image30.png"></div>

如果在控制台发现只有一次SQL语句，表示测试成功。

### 2.8.2 逻辑过期解决店铺查询缓存击穿

使用**逻辑过期**解决商品查询业务的缓存击穿问题，业务逻辑如下：

<div class="img-wrap-left"><img class="left-img" src="/assets/img/redis/2/image31.png" alt="image31.png"></div>

现在有一个问题，逻辑过期时间字段是添加在原有pojo上还是新建一个类RedisData，并继承pojo？都不是，代码开发尽量不要修改源代码，所以使用一个Object字段或泛型字段定义真实数据：

```java
@Data
public class RedisData {
private LocalDateTime expireTime;
private Object data;
}
```

ShopServiceImpl类新增方法saveShop2Redis和queryWithLogicalExpire：

```java
/**
* 缓存重建方法
*/
public void saveShop2Redis(Long id, Long expireSeconds) throws InterruptedException {
//1.查询店铺信息
Shop shop = getById(id);

//2.封装逻辑过期时间
RedisData redisData = new RedisData();
redisData.setData(shop);
redisData.setExpireTime(LocalDateTime.now().plusSeconds(expireSeconds));

//3.写入Redis
stringRedisTemplate.opsForValue().set(RedisConstants.CACHE_SHOP_KEY + id, JSONUtil.toJsonStr(redisData));
}

private static final ExecutorService CACHE_REBUILD_EXECUTOR = Executors.newFixedThreadPool(10);

/**
* 逻辑过期解决缓存击穿
*/
public Shop queryWithLogicalExpire(Long id) {
// 1.从redis查询商铺缓存
String key = RedisConstants.CACHE_SHOP_KEY + id;
String json = stringRedisTemplate.opsForValue().get(key);

// 2.判断是否存在
if (StrUtil.isBlank(json)) {
// 3.不存在，直接返回
return null;
}

// 4.命中，需要先把json反序列化为对象
RedisData redisData = JSONUtil.toBean(json, RedisData.class);
Shop shop = JSONUtil.toBean((JSONObject) redisData.getData(), Shop.class);
LocalDateTime expireTime = redisData.getExpireTime();

// 5.判断是否过期
if (expireTime.isAfter(LocalDateTime.now())) {
// 5.1.未过期，直接返回店铺信息
return shop;
}

// 5.2.已过期，需要缓存重建
// 6.缓存重建
// 6.1.获取互斥锁
String lockKey = RedisConstants.LOCK_SHOP_KEY + id;
boolean isLock = tryLock(lockKey);

// 6.2.判断是否获取锁成功
if (isLock) {
CACHE_REBUILD_EXECUTOR.submit(() -> {
try {
//重建缓存
this.saveShop2Redis(id, 20L);
} catch (Exception e) {
throw new RuntimeException(e);
} finally {
unlock(lockKey);
}
});
}

// 6.4.返回过期的商铺信息
return shop;
}
```

最后修改ShopServiceImpl类的queryById方法内原来的调用互斥锁方案修改成调用逻辑过期方案。

### 测试

删除Redis中对应的店铺缓存，然后编写测试单元缓存对应的脏数据：

```java
@Test
void testSaveShop() throws InterruptedException {
shopService.saveShop2Redis(1L, 10L);
}
```

然后修改数据库中id为1的店铺信息，如店铺名为104茶餐厅，使缓存中的数据成为脏数据。

启动项目后，使用Postman发送200条请求：

<div class="img-wrap-left"><img class="left-img" src="/assets/img/redis/2/image32.png" alt="image32.png"></div>

最后看到前面的几条请求的响应数据是103茶餐厅（脏数据），后面的响应数据就都正确了。

### 2.9 缓存工具封装

由于缓存问题非常常见，如果每个业务都解决缓存穿透、缓存击穿（缓存雪崩一般使用redis集群解决，后面会学习），会给业务开发带来不小的压力，所以，我们需要工具类帮我们提供这些操作，而工具类需要我们手动书写。

方法1：将任意Java对象序列化为json并存储在string类型的key中，并且可以设置TTL过期时间

方法2：将任意Java对象序列化为json并存储在string类型的key中，并且可以设置逻辑过期时间，用于处理缓存击穿问题

方法3：根据指定的key查询缓存，并反序列化为指定类型，利用缓存空值的方式解决缓存穿透问题

方法4：根据指定的key查询缓存，并反序列化为指定类型，需要利用逻辑过期解决缓存击穿问题

```java
package com.hmdp.utils;

import cn.hutool.core.util.BooleanUtil;
import cn.hutool.core.util.StrUtil;
import cn.hutool.json.JSONObject;
import cn.hutool.json.JSONUtil;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.TimeUnit;
import java.util.function.Function;

@Slf4j
@Component
public class CacheClientUtil {
private final StringRedisTemplate stringRedisTemplate;

private static final ExecutorService CACHE_REBUILD_EXECUTOR = Executors.newFixedThreadPool(10);

private static final Long CACHE_NULL_TTL = 2L;

private static final String LOCK_SHOP_KEY = "lock:shop:";

public CacheClientUtil(StringRedisTemplate stringRedisTemplate) {
this.stringRedisTemplate = stringRedisTemplate;
}

/**
* 将java对象序列化到redis的string类型中，并指定TTL
* @param key redis中对应的key
* @param value redis中key对应的对象
* @param TTL TTL
* @param unit TTL对应的单位
*/
public void set(String key, Object value, Long TTL, TimeUnit unit) {
stringRedisTemplate.opsForValue().set(key, JSONUtil.toJsonStr(value), TTL, unit);
}

/**
* 将java对象序列化到redis的string类型中，并指定逻辑TTL
* @param key redis中对应的key
* @param value redis中key对应的对象
* @param LogicalTTL 逻辑TTL
* @param unit 逻辑TTL对应的单位
*/
public void setWithLogicalExpire(String key, Object value, Long LogicalTTL, TimeUnit unit) {
// 设置逻辑过期
RedisData redisData = new RedisData();
redisData.setData(value);
redisData.setExpireTime(LocalDateTime.now().plusSeconds(unit.toSeconds(LogicalTTL)));
// 写入Redis
stringRedisTemplate.opsForValue().set(key, JSONUtil.toJsonStr(redisData));
}

/**
* 根据key查询缓存，并反序列化为指定类型，利用空值解决缓存穿透
* @param keyPrefix 缓存key前缀
* @param id 查询的使用的id
* @param type 返回值类型
* @param dbFallback 查询业务逻辑函数
* @param time key的TTL
* @param unit TTL对应的单位
* @param <R> 返回值泛型
* @param <ID> id泛型
* @return 返回最终查询的数据
*/
public <R, ID> R queryByIdWithPassThrough(String keyPrefix, ID id, Class<R> type, Function<ID, R> dbFallback, Long time, TimeUnit unit) {
String key = keyPrefix + id;
// 1.从redis查询商铺缓存
String json = stringRedisTemplate.opsForValue().get(key);
// 2.判断是否存在
if (StrUtil.isNotBlank(json)) {
// 3.存在，直接返回
return JSONUtil.toBean(json, type);
}
// 判断命中的是否是空值
if (json != null) {
// 返回null
return null;
}

// 4.不存在，根据id查询数据库
R r = dbFallback.apply(id);
// 5.不存在，返回null
if (r == null) {
// 将空值写入redis
stringRedisTemplate.opsForValue().set(key, "", CACHE_NULL_TTL, TimeUnit.MINUTES);
// 返回null
return null;
}
// 6.存在，写入redis
this.set(key, r, time, unit);
return r;
}

/**
* 根据key查询缓存，并反序列化为指定类型，利用逻辑过期解决缓存击穿
* @param keyPrefix 缓存key前缀
* @param id 查询的使用的id
* @param type 返回值类型
* @param dbFallback 查询业务逻辑函数
* @param time key的TTL
* @param unit TTL对应的单位
* @param <R> 返回值泛型
* @param <ID> id泛型
* @return 返回最终查询的数据
*/
public <R, ID> R queryWithLogicalExpire(String keyPrefix, ID id, Class<R> type, Function<ID, R> dbFallback, Long time, TimeUnit unit) {
String key = keyPrefix + id;
// 1.从redis查询商铺缓存
String json = stringRedisTemplate.opsForValue().get(key);
// 2.判断是否存在
if (StrUtil.isBlank(json)) {
// 3.存在，直接返回
return null;
}
// 4.命中，需要先把json反序列化为对象
RedisData redisData = JSONUtil.toBean(json, RedisData.class);
R r = JSONUtil.toBean((JSONObject) redisData.getData(), type);
LocalDateTime expireTime = redisData.getExpireTime();
// 5.判断是否过期
if (expireTime.isAfter(LocalDateTime.now())) {
// 5.1.未过期，直接返回店铺信息
return r;
}
// 5.2.已过期，需要缓存重建
// 6.缓存重建
// 6.1.获取互斥锁
String lockKey = LOCK_SHOP_KEY + id;
boolean isLock = tryLock(lockKey);
// 6.2.判断是否获取锁成功
if (isLock) {
// 6.3.成功，开启独立线程，实现缓存重建
CACHE_REBUILD_EXECUTOR.submit(() -> {
try {
// 查询数据库
R newR = dbFallback.apply(id);
// 重建缓存
this.setWithLogicalExpire(key, newR, time, unit);
} catch (Exception e) {
throw new RuntimeException(e);
} finally {
// 释放锁
unlock(lockKey);
}
});
}
// 6.4.返回过期的商铺信息
return r;
}

/**
* 根据key查询缓存，并反序列化为指定类型，利用互斥锁解决缓存击穿，同时利用缓存空值解决了缓存穿透
* @param keyPrefix 缓存key前缀
* @param id 查询的使用的id
* @param type 返回值类型
* @param dbFallback 查询业务逻辑函数
* @param time key的TTL
* @param unit TTL对应的单位
* @param <R> 返回值泛型
* @param <ID> id泛型
* @return 返回最终查询的数据
*/
public <R, ID> R queryWithMutex(String keyPrefix, ID id, Class<R> type, Function<ID, R> dbFallback, Long time, TimeUnit unit) {
String key = keyPrefix + id;
// 1.从redis查询商铺缓存
String shopJson = stringRedisTemplate.opsForValue().get(key);
// 2.判断是否存在
if (StrUtil.isNotBlank(shopJson)) {
// 3.存在，直接返回
return JSONUtil.toBean(shopJson, type);
}
// 判断命中的是否是空值
if (shopJson != null) {
// 返回一个错误信息
return null;
}


// 4.实现缓存重建
// 4.1.获取互斥锁
String lockKey = LOCK_SHOP_KEY + id;
R r = null;
try {
boolean isLock = tryLock(lockKey);
// 4.2.判断是否获取成功
if (!isLock) {
// 4.3.获取锁失败，休眠并重试
Thread.sleep(50);
return queryWithMutex(keyPrefix, id, type, dbFallback, time, unit);
}
// 4.4.获取锁成功，根据id查询数据库
r = dbFallback.apply(id);
// 5.不存在，返回错误
if (r == null) {
// 将空值写入redis
stringRedisTemplate.opsForValue().set(key, "", CACHE_NULL_TTL, TimeUnit.MINUTES);
// 返回错误信息
return null;
}
// 6.存在，写入redis
this.set(key, r, time, unit);
} catch (InterruptedException e) {
throw new RuntimeException(e);
} finally {
// 7.释放锁
unlock(lockKey);
}
// 8.返回
return r;
}

private boolean tryLock(String key) {
Boolean flag = stringRedisTemplate.opsForValue().setIfAbsent(key, "1", 10, TimeUnit.SECONDS);
return BooleanUtil.isTrue(flag);
}

private void unlock(String key) {
stringRedisTemplate.delete(key);
}
}
```

### 测试

在ShopServiceImpl类中改造queryById方法：

```java
@Resource
private CacheClient cacheClient;

@Override
public Result queryById(Long id) {
// 解决缓存穿透
Shop shop = cacheClientUtil
.queryWithPassThrough(RedisConstants.CACHE_SHOP_KEY, id, Shop.class, this::getById, RedisConstants.CACHE_SHOP_TTL, TimeUnit.MINUTES);

/*//互斥锁解决缓存击穿
Shop shop = cacheClientUtil
.queryWithMutex(RedisConstants.CACHE_SHOP_KEY, id, Shop.class, this::getById, RedisConstants.CACHE_SHOP_TTL, TimeUnit.MINUTES);

//逻辑过期解决缓存击穿
Shop shop = cacheClientUtil
.queryWithLogicalExpire(RedisConstants.CACHE_SHOP_KEY, id, Shop.class, this::getById, 20L, TimeUnit.SECONDS);*/

if (shop == null) {
return Result.fail("店铺不存在！");
}
// 7.返回
return Result.ok(shop);
}
```

最后像之前的测试即可。

## 3.优惠卷秒杀

### 3.1 全局唯一ID

在电商系统中，订单表往往会有大量的数据存储，如果数据量庞大，将来会拆分订单表，如果都采用id自增，由于各个表独立，会造成有多个订单的id一致的情况，这个设计初衷id唯一相悖，而且，id自增很容易让别人猜测出一些信息，此时就要使用一种全局唯一的id

以优惠券秒杀来说，购买优惠券后就会生成一个订单到tb_voucher_order表，这个表就需要全局唯一id。

**全局ID生成器**：一种在分布式系统下生成全局唯一ID的工具，一般要具备五点特性，唯一性、高可用、递增性、高性能、安全性。

常见全局ID生成策略：

UUID

Redis自增

snowflake算法

数据库自增：维护一张表专门用于id自增，从而保证id唯一

### 3.2 Redis自增

对于long型id，占用8个字节64位，对这64位进行分解：

<div class="img-wrap-left"><img class="left-img" src="/assets/img/redis/2/image33.png" alt="image33.png"></div>

最高位：符号位：1bit，永远为0

时间戳：31bit，以秒为单位，可以使用69年

序列号：32bit，秒内的计数器，支持每秒产生2^32个不同ID

```java
@Component
public class RedisIdWorker {
/**
* 开始时间戳
*/
private static final long BEGIN_TIMESTAMP = 1760895122L;
/**
* 序列号的位数
*/
private static final int COUNT_BITS = 32;

private StringRedisTemplate stringRedisTemplate;

public RedisIdWorker(StringRedisTemplate stringRedisTemplate) {
this.stringRedisTemplate = stringRedisTemplate;
}

public long nextId(String keyPrefix) {
// 1.生成时间戳
LocalDateTime now = LocalDateTime.now();
long nowSecond = now.toEpochSecond(ZoneOffset.UTC);
long timestamp = nowSecond - BEGIN_TIMESTAMP;

// 2.生成序列号
// 2.1.获取当前日期，精确到天
String date = now.format(DateTimeFormatter.ofPattern("yyyy:MM:dd"));
// 2.2.自增长
long count = stringRedisTemplate.opsForValue().increment("icr:" + keyPrefix + ":" + date);

// 3.拼接并返回
return timestamp << COUNT_BITS | count;
}
}
```

### 测试性能

在测试之前，先了解一下CountDownLatch：countdownlatch名为信号枪，用于同步协调在多线程的等待与唤醒问题。

由于程序是异步的，有可能其他线程还没有运行完时，主线程却运行完了，而我们希望的是主线程在其他线程运行结束后才能运行，此时就需要CountDownLatch，其中有两个重要方法：countDown和await

await 方法是阻塞方法，可以实现阻塞main线程，使其在其他线程全部运行完毕后再运行，即当CountDownLatch内部维护的变量变为0时不再阻塞，放行，而只要调用一次countDown方法，就能使CountDownLatch维护的变量减1，通过使分线程绑定并合理设置这个变量，使得所有分线程全部运行完时变量刚好为0，就能实现main线程最后执行。

了解完countdownlatch后，就编写测试单元模拟多线程生成大量全局唯一ID：

```java
@Resource
private RedisIdWorker redisIdWorker;
private final ExecutorService es = Executors.newFixedThreadPool(500); //线程池

@Test
void testIdWorker() throws InterruptedException {
CountDownLatch latch = new CountDownLatch(300);

Runnable task = () -> {
for (int i = 0; i < 100; i++) {
long id = redisIdWorker.nextId("order");
System.out.println("id = " + id);
}
latch.countDown();
};
long begin = System.currentTimeMillis();
for (int i = 0; i < 300; i++) {
es.submit(task);
}
latch.await();
long end = System.currentTimeMillis();
System.out.println("time = " + (end - begin));
}
```

测试完成后发现，生成30000个id用时近3s，平均一个id生成用时0.1ms，性能还是很高的。

### 3.3 添加优惠券

每个店铺都可以发布优惠券，分为平价券和特价券，平价券优惠力度低，所以没有太多限制，而特价券优惠力度高，所以有数量、抢购时间、结束时间等限制，牵扯到两张表：

tb_voucher：优惠券的基本信息，优惠金额、使用规则等

tb_seckill_voucher：优惠券的库存、开始抢购时间，结束抢购时间。特价优惠券才需要填写这些信息

**新增普通券业务代码**和**新增秒杀券业务代码**项目已经实现，我们打开Postman，发送一个请求POST http://localhost:8081/voucher/seckill，并添加请求数据：

```json
{
"shopId":1,
"title":"100元代金券",
"subTitle":"周一至周五均可使用",
"rules":"全场通用n无需预约n可无限叠加n不兑现、不找零n仅限堂食",
"payValue":8000,
"actualValue":10000,
"type":1,
"stock":100,
"beginTime":"2025-10-19T10:09:17",
"endTime":"2025-11-20T22:10:17"
}
```

如果在tb_voucher表中能看到插入的优惠券就表示请求成功（如果前端看不到优惠券请合理修改开始结束时间）。

### 3.4 实现秒杀下单

如果前端点击优惠券的抢购按钮，就会请求到/voucher-order/seckill/{id}实现秒杀下单操作，并保存订单信息到tb_seckill_voucher表。

秒杀下单需要保证在秒杀时间范围内且库存充足，具体思路如下：

<div class="img-wrap-left"><img class="left-img" src="/assets/img/redis/2/image34.png" alt="image34.png"></div>

修改VoucherOrderController类：

```java
@RestController
@RequestMapping("/voucher-order")
public class VoucherOrderController {
@Resource
private IVoucherOrderService voucherOrderService;

@PostMapping("seckill/{id}")
public Result seckillVoucher(@PathVariable("id") Long voucherId) {
return voucherOrderService.seckillVoucher(voucherId);
}
}
```

IVoucherOrderService接口新增seckillVoucher方法：

```java
Result seckillVoucher(Long voucherId);
```

VoucherOrderServiceImpl新增seckillVoucher方法：

```java
@Resource
private ISeckillVoucherService seckillVoucherService;
@Resource
private RedisIdWorker redisIdWorker;

@Override
public Result seckillVoucher(Long voucherId) {
// 1.查询优惠券
SeckillVoucher voucher = seckillVoucherService.getById(voucherId);
// 2.判断秒杀是否开始
if (voucher.getBeginTime().isAfter(LocalDateTime.now())) {
// 尚未开始
return Result.fail("秒杀尚未开始！");
}
// 3.判断秒杀是否已经结束
if (voucher.getEndTime().isBefore(LocalDateTime.now())) {
// 尚未开始
return Result.fail("秒杀已经结束！");
}
// 4.判断库存是否充足
if (voucher.getStock() < 1) {
// 库存不足
return Result.fail("库存不足！");
}
//5，扣减库存
boolean success = seckillVoucherService.update()
.setSql("stock = stock -1")
.eq("voucher_id", voucherId).update();
if (!success) {
//扣减库存
return Result.fail("库存不足！");
}
//6.创建订单
VoucherOrder voucherOrder = new VoucherOrder();
// 6.1.订单id
long orderId = redisIdWorker.nextId("order");
voucherOrder.setId(orderId);
// 6.2.用户id
Long userId = UserHolder.getUser().getId();
voucherOrder.setUserId(userId);
// 6.3.代金券id
voucherOrder.setVoucherId(voucherId);
save(voucherOrder);

return Result.ok(orderId);
}
```

打开浏览器访问103茶餐厅，点击抢购后tb_seckill_coucher表的库存字段减1，tb_voucher_order表新增了一条数据。

### 3.5 库存超卖问题

### 3.5.1 问题分析

先用JMeter发送200个请求实现抢购，会发现，数据库中会产生超过100个订单，库存最后是个负数，但是券仅限购100份，出现库存超卖。

原因分析：如下图，线程1查询出库存假设为1，操作数据库扣减库存，由于操作数据库较慢，此时线程2、线程3也查询库存，而此时线程1并没有更新库存完毕，所以也认为还有库存还有，就会更新数据库，最终导致库存超卖。

<div class="img-wrap-left"><img class="left-img" src="/assets/img/redis/2/image35.png" alt="image35.png"></div>

### 3.5.2 乐观锁和悲观锁分析

解决库存超卖的方案就是加锁，但是锁分为悲观锁和乐观锁，两种锁都能解决库存超卖：

<div class="img-wrap-left"><img class="left-img" src="/assets/img/redis/2/image36.png" alt="image36.png"></div>

**悲观锁**：实现对于数据的串行化执行，确保某一逻辑同一时间只能有一个线程执行，如Synchronized、Lock锁等都属于悲观锁。

**乐观锁**：乐观锁有两种方法实现：

版本号法：通过版本号，每次更新数据库都使版本号加1，如果更新数据库时版本号还是原来的版本号，说明这段时间没有线程更新数据库，可以更新数据库，如果更新数据库时版本号已经改变，就说明这段时间已经有线程更新数据库，就不更新或重新处理请求逻辑。

<div class="img-wrap-left"><img class="left-img" src="/assets/img/redis/2/image37.png" alt="image37.png"></div>

**CAS法**：CAS法就是利用数据本身有没有变化来判断拒绝更新还是重试，如果更新数据库时数据和原来的数据不一样，说明这段时间有线程操作了数据库，就不更新或重新处理请求逻辑，否则，说明这段时间没有线程插队，线程安全，可以更新。

<div class="img-wrap-left"><img class="left-img" src="/assets/img/redis/2/image38.png" alt="image38.png"></div>

### 3.5.3 乐观锁解决库存超卖

由于版本号法还要修改数据库表结构，甚至修改pojo，不方便，所以这里使用CAS法利用stock字段是否发生变化来解决库存超卖问题。

修改原来的扣减库存操作为以下内容：

```java
boolean success = seckillVoucherService.update()
.setSql("stock = stock -1")
.eq("voucher_id", voucherId)
.eq("stock",voucher.getStock()) //where id = ? and stock = ?
.update();
```

测试后发现，虽然不会导致库存超卖，但是售出的却不足100份，原因在于：假如100个线程都拿到了库存，然后一起修改库存，但是，这100个更新同一时间只能有1个成功，其他线程都会修改失败，导致大量优惠券没有卖出。

解决方案是只要库存大于0，就让线程去修改库存，从而避免上述问题：

```java
boolean success = seckillVoucherService.update()
.setSql("stock = stock -1")
.eq("voucher_id", voucherId)
.gt("stock",0) //where id = ? and stock > 0
.update();
```

### 3.6 一人一单

### 3.6.1 问题分析

优惠券是为了引流，但是现在，一个用户可以重复下单，最终优惠券被同一个用户抢光，而我们希望，一个人往往只能下单一次。

实现思路：如果秒杀开始，则进一步判断库存是否足够，然后再根据优惠卷id和用户id查询用户是否已经下过这个订单，如果下过这个订单，则不再下单，否则进行下单

<div class="img-wrap-left"><img class="left-img" src="/assets/img/redis/2/image39.png" alt="image39.png"></div>

### 3.6.2 代码实现

### 初步代码：增加一人一单逻辑

```java
@Override
@Transactional
public Result seckillVoucher(Long voucherId) {
// 1.查询优惠券
SeckillVoucher voucher = seckillVoucherService.getById(voucherId);
// 2.判断秒杀是否开始
if (voucher.getBeginTime().isAfter(LocalDateTime.now())) {
// 尚未开始
return Result.fail("秒杀尚未开始！");
}
// 3.判断秒杀是否已经结束
if (voucher.getEndTime().isBefore(LocalDateTime.now())) {
// 尚未开始
return Result.fail("秒杀已经结束！");
}
// 4.判断库存是否充足
if (voucher.getStock() < 1) {
// 库存不足
return Result.fail("库存不足！");
}
// 5.一人一单逻辑
// 5.1.用户id
Long userId = UserHolder.getUser().getId();
int count = query().eq("user_id", userId).eq("voucher_id", voucherId).count();
// 5.2.判断是否存在
if (count > 0) {
// 用户已经购买过了
return Result.fail("用户已经购买过一次！");
}

//6，扣减库存
boolean success = seckillVoucherService.update()
.setSql("stock= stock -1")
.eq("voucher_id", voucherId).update();
if (!success) {
//扣减库存
return Result.fail("库存不足！");
}
//7.创建订单
VoucherOrder voucherOrder = new VoucherOrder();
// 7.1.订单id
long orderId = redisIdWorker.nextId("order");
voucherOrder.setId(orderId);

voucherOrder.setUserId(userId);
// 7.3.代金券id
voucherOrder.setVoucherId(voucherId);
save(voucherOrder);

return Result.ok(orderId);

}
```

再次进行并发测试，会发现，还是会存在一人多单问题，原因是：当同个用户多个请求线程并发运行时，都查询数据库发现未下单，然后都进行扣减库存生成订单。解决方法是加锁，乐观锁适合于更新操作，而现在是插入，需要使用悲观锁。

封装createVoucherOrder方法，并为方法加上synchronized锁以保证线程安全，同时删除seckillVoucher的事务管理：

```java
@Transactional
public synchronized Result createVoucherOrder(Long voucherId) {
Long userId = UserHolder.getUser().getId();
// 5.1.查询订单
int count = query().eq("user_id", userId).eq("voucher_id", voucherId).count();
// 5.2.判断是否存在
if (count > 0) {
// 用户已经购买过了
return Result.fail("用户已经购买过一次！");
}

// 6.扣减库存
boolean success = seckillVoucherService.update()
.setSql("stock = stock - 1") // set stock = stock - 1
.eq("voucher_id", voucherId).gt("stock", 0) // where id = ? and stock > 0
.update();
if (!success) {
// 扣减失败
return Result.fail("库存不足！");
}

// 7.创建订单
VoucherOrder voucherOrder = new VoucherOrder();
// 7.1.订单id
long orderId = redisIdWorker.nextId("order");
voucherOrder.setId(orderId);
// 7.2.用户id
voucherOrder.setUserId(userId);
// 7.3.代金券id
voucherOrder.setVoucherId(voucherId);
save(voucherOrder);

// 7.返回订单id
return Result.ok(orderId);
}
```

但现在锁是加载方法上的，锁的对象是this，如果是不同用户请求过来，那就只能一个一个串行执行，效率低，可以设置锁的对象是用户id，保证不同用户线程能并行执行，同一用户线程串行执行：

```java
@Transactional
public Result createVoucherOrder(Long voucherId) {
Long userId = UserHolder.getUser().getId();
synchronized(userId.toString().intern()){
// 5.1.查询订单
int count = query().eq("user_id", userId).eq("voucher_id", voucherId).count();
// 5.2.判断是否存在
if (count > 0) {
// 用户已经购买过了
return Result.fail("用户已经购买过一次！");
}

// 6.扣减库存
boolean success = seckillVoucherService.update()
.setSql("stock = stock - 1") // set stock = stock - 1
.eq("voucher_id", voucherId).gt("stock", 0) // where id = ? and stock > 0
.update();
if (!success) {
// 扣减失败
return Result.fail("库存不足！");
}

// 7.创建订单
VoucherOrder voucherOrder = new VoucherOrder();
// 7.1.订单id
long orderId = redisIdWorker.nextId("order");
voucherOrder.setId(orderId);
// 7.2.用户id
voucherOrder.setUserId(userId);
// 7.3.代金券id
voucherOrder.setVoucherId(voucherId);
save(voucherOrder);

// 7.返回订单id
return Result.ok(orderId);
}
}
```

toString方法底层使用new的方法，会导致用户id字符串对象不一致，intern方法保证用户id字符串是唯一的

但是这样会导致一个问题，锁的释放在事务提交前执行，如果事务还没来得及提交，这个用户又来一个线程先一步完成了抢购业务，这时就有两个事务提交，还是不会一人一单。所以这个事务要放在锁的范围内，从而保证事务先提交再释放锁。

删除createVoucherOrder中的锁的逻辑，保留事务，修改seckillVoucher的调用逻辑：

```java
//原来逻辑
// return createVoucherOrder(voucherId);

//修改后
Long userId = UserHolder.getUser().getId();
synchronized (userId.toString().intern()){
return this.createVoucherOrder(voucherId);
}
```

这里调用createVoucherOrder是使用this调用的，而不是通过代理对象调用的，所以会事务失效（事务失效情况自行搜索学习），所以，这里要用原始的事务对象操作事务才能使事务生效：

导入依赖：

```xml
<dependency>
<groupId>org.aspectj</groupId>
<artifactId>aspectjweaver</artifactId>
</dependency>
```

启动类上加 @EnableAspectJAutoProxy(exposeProxy = true) 暴露出代理对象

修改调用逻辑：

```java
Long userId = UserHolder.getUser().getId();
synchronized (userId.toString().intern()){
//获取代理对象
IVoucherOrderService proxy = (IVoucherOrderService) AopContext.currentProxy();
return proxy.createVoucherOrder(voucherId);
}
```

### 3.6.3 集群模式下的并发问题

首先复制一个服务器HmDianPingApplication2，并指定端口号为8082：

<div class="img-wrap-left"><img class="left-img" src="/assets/img/redis/2/image40.png" alt="image40.png"></div>

然后修改nginx服务器的配置：

<div class="img-wrap-left"><img class="left-img" src="/assets/img/redis/2/image41.png" alt="image41.png"></div>

进入nginx的目录的命令行，执行nginx.exe -s reload命令重启nginx。

使用jmeter分别向两台服务器发送请求，通过debug调试，会发现两个线程同时获取锁是可以的，这会导致一人多单。

**锁失效原因分析**：如下图，两个服务器就有两个虚拟机，当JVM1中的线程1获取锁并查询订单不存在，与此同时JVM2也会尝试获取锁，虽然用户id一致，但是两台虚拟机是相互独立的，JVM2的线程3会在自己的范围内生成一个对象，JVM1和JVM2的对象是不同的，所以都能获取锁成功，线程3查询订单不存在，线程1和线程3同时插入订单，导致一人多单。

<div class="img-wrap-left"><img class="left-img" src="/assets/img/redis/2/image42.png" alt="image42.png"></div>

## 4.分布式锁

### 4.1 基本原理和实现方式

分布式锁，满足分布式系统或集群模式下多进程可见并且互斥的锁。核心思想是让所有线程都使用同一把锁，这样就能保证所有线程串行化，而不会出现锁失效的情况。

<div class="img-wrap-left"><img class="left-img" src="/assets/img/redis/2/image43.png" alt="image43.png"></div>

分布式锁应满足以下几点：

可见性：多个线程都能看到相同的结果

互斥：分布式锁的最基本的条件，使得程序串行执行

高可用：程序不易崩溃，时时刻刻都保证较高的可用性

高性能：较高的加锁性能和释放锁性能

安全性：安全是程序中必不可少的一环

常见的分布式锁有三种：

|         |                 |                |                  |
| ------- | --------------- | -------------- | ---------------- |
|         | MySQL           | Redis          | Zookeeper        |
| **互斥**  | 利用mysql本身的互斥锁机制 | 利用setnx这样的互斥命令 | 利用节点的唯一性和有序性实现互斥 |
| **高可用** | 好               | 好              | 好                |
| **高性能** | 一般              | 好              | 一般               |
| **安全性** | 断开连接，自动释放锁      | 利用锁超时机制，到期释放   | 临时节点，断开连接自动释放    |

### 4.2 Redis分布式锁

### 4.2.1 核心思路

利用setnx命令，当有多个线程时，只能有一个线程执行成功，获得锁，其他线程执行失败，休眠重试或返回错误。当然，为了确保设置超时时间和setnx命令同时成功或失败，需要setnx和设置超时时间通过一个命令完成，如set lock thread1 ex 10 nx。

### 4.2.2 基本实现

定义ILock接口：

```java
package com.hmdp.utils;

public interface ILock {
/**
* 尝试获取锁
* @Param timeoutSec 锁的持有时间
* @return true:获取成功 false:获取失败
*/
boolean tryLock(long timeoutSec);

/**
* 释放锁
*/
void unlock();
}
```

定义SimpleRedisLock类实现ILock接口：

```java
public class SimpleRedisLock implements ILock {
private String name;
private StringRedisTemplate stringRedisTemplate;
private static final String KEY_PREFIX = "lock:";

public SimpleRedisLock(String name, StringRedisTemplate stringRedisTemplate) {
this.name = name;
this.stringRedisTemplate = stringRedisTemplate;
}


@Override
public boolean tryLock(long timeoutSec) {
//获取线程标识
long threadId = Thread.currentThread().getId();
//获取锁
Boolean success = stringRedisTemplate.opsForValue().setIfAbsent(KEY_PREFIX + name, threadId + "", timeoutSec, TimeUnit.SECONDS);

return Boolean.TRUE.equals(success); //null值也返回false
}

@Override
public void unlock() {
stringRedisTemplate.delete(KEY_PREFIX + name);
}
}
```

修改业务代码：

```java
@Resource
private StringRedisTemplate stringRedisTemplate;

@Override
public Result seckillVoucher(Long voucherId) {
// 1.查询优惠券
SeckillVoucher voucher = seckillVoucherService.getById(voucherId);
// 2.判断秒杀是否开始
if (voucher.getBeginTime().isAfter(LocalDateTime.now())) {
// 尚未开始
return Result.fail("秒杀尚未开始！");
}
// 3.判断秒杀是否已经结束
if (voucher.getEndTime().isBefore(LocalDateTime.now())) {
// 尚未开始
return Result.fail("秒杀已经结束！");
}
// 4.判断库存是否充足
if (voucher.getStock() < 1) {
// 库存不足
return Result.fail("库存不足！");
}
Long userId = UserHolder.getUser().getId();

//创建锁对象(新增代码)
SimpleRedisLock lock = new SimpleRedisLock("order:" + userId, stringRedisTemplate);
//获取锁对象
boolean isLock = lock.tryLock(5);
//加锁失败
if (!isLock) {
return Result.fail("不允许重复下单");
}
try {
//获取代理对象(事务)
IVoucherOrderService proxy = (IVoucherOrderService) AopContext.currentProxy();
return proxy.createVoucherOrder(voucherId);
} finally {
//释放锁
lock.unlock();
}
}
```

### 4.2.3 Redis分布式锁误删

如下图，线程1获取锁后业务发生阻塞，触发锁的超时释放，然后线程2获取锁，由于锁已经释放，线程2获取成功，执行业务过程中线程1好了，完成业务并释放了不属于自己的锁，释放完的同时线程3又可以获取锁执行业务，这时就有线程2和线程3并发执行业务。

<div class="img-wrap-left"><img class="left-img" src="/assets/img/redis/2/image44.png" alt="image44.png"></div>

解决办法是线程释放锁时判断锁是否还是自己的，如果还是自己的锁，就说明这个过程没有其他线程执行，可以删除，否则就不删除：

<div class="img-wrap-left"><img class="left-img" src="/assets/img/redis/2/image45.png" alt="image45.png"></div>

### 代码实现

实现思路：在存入锁时，放入自己线程的标识 ，在删除锁时，判断当前这把锁的标识是不是自己存入的，如果是，则进行删除，如果不是，则不进行删除。

<div class="img-wrap-left"><img class="left-img" src="/assets/img/redis/2/image46.png" alt="image46.png"></div>

对于多台虚拟机，每台虚拟机相互独立，可能出现两个线程标识（如线程id）一致的情况，可以利用UUID类和static关键字实现为每台虚拟机生成唯一标识，再拼接线程标识就保证了分布式下线程的唯一标识。

只要修改SimpleRedisLock类的tryLock和unlock的代码即可：

```java
private static final String ID_PREFIX = UUID.randomUUID().toString(true) + "-"; //hutool包下

@Override
public boolean tryLock(long timeoutSec) {
// 获取线程标示
String threadId = ID_PREFIX + Thread.currentThread().getId();
// 获取锁
Boolean success = stringRedisTemplate.opsForValue()
.setIfAbsent(KEY_PREFIX + name, threadId, timeoutSec, TimeUnit.SECONDS);
return Boolean.TRUE.equals(success);
}

public void unlock() {
// 获取线程标示
String threadId = ID_PREFIX + Thread.currentThread().getId();
// 获取锁中的标示
String id = stringRedisTemplate.opsForValue().get(KEY_PREFIX + name);
// 判断标示是否一致
if(threadId.equals(id)) {
// 释放锁
stringRedisTemplate.delete(KEY_PREFIX + name);
}
}
```

### 4.2.4 分布式锁的原子性

如下图，当线程1获取锁执行完业务后，判断锁是自己的，这时业务阻塞，导致锁超时释放，线程2就能成功获取锁，而线程1这时又结束阻塞直接删除线程2的锁，然后线程3就又能获取锁，这就是分布式锁的原子性问题。解决方案就是保证判断锁逻辑和释放锁逻辑保持原子性，同时成功。

<div class="img-wrap-left"><img class="left-img" src="/assets/img/redis/2/image47.png" alt="image47.png"></div>

### 4.2.5 Lua脚本

Redis脚本提供了Lua脚本功能，一个脚本内编写多条Redis命令，执行时确保所有命令同时成功，类似MySQL的事务。

Lua编程语言基本语法参考网站：

**[该类型的内容暂不支持下载]**

### Lua脚本编写Redis命令

Redis提供了调用函数执行redis命令：

```lua
redis.call('命令名称', 'key', '其它参数', ...)

-- 例如执行 set name jack
redis.call('set', 'name', 'jack')
```

例如先执行set name Rose，再执行get name的脚本为：

```lua
-- 先执行 set name jack
redis.call('set', 'name', 'Rose')
-- 再执行 get name
local name = redis.call('get', 'name')
-- 返回
return name
```

调用脚本的Redis命令：

```powershell
EVAL script numkeys key [key ...] arg [arg ...]
```

script：Lua脚本

numkeys：键的数量，2表示后面的2个参数作为键

arg：去除键后剩下的参数就是值，和键一一对应

例如执行 redis.call('set', 'name', 'jack') 这个脚本：

```powershell
EVAL "redis.call('set', 'name', 'jack')" 0
```

key、value也可以作为参数传递，key类型参数会放入KEYS数组，其它参数会放入ARGV数组：

```powershell
EVAL "return redis.call('set', KEYS[1], ARGV[1])" 1 name Rose
```

### Lua脚本解决分布式锁的原子性

RedisTemplate提供了execute方法执行Lua脚本：

<div class="img-wrap-left"><img class="left-img" src="/assets/img/redis/2/image48.png" alt="image48.png"></div>

在resources目录下编写Lua脚本unlock.lua：

```lua
-- 获取锁中的标示，判断是否与当前线程标示一致
if (redis.call('GET', KEYS[1]) == ARGV[1]) then
-- 一致，则删除锁
return redis.call('DEL', KEYS[1])
end
-- 不一致，则直接返回
return 0
```

Java代码：

```java
private static final DefaultRedisScript<Long> UNLOCK_SCRIPT;
static {
UNLOCK_SCRIPT = new DefaultRedisScript<>();
UNLOCK_SCRIPT.setLocation(new ClassPathResource("unlock.lua"));
UNLOCK_SCRIPT.setResultType(Long.class);
}

public void unlock() {
// 调用lua脚本
stringRedisTemplate.execute(
UNLOCK_SCRIPT,
Collections.singletonList(KEY_PREFIX + name),
ID_PREFIX + Thread.currentThread().getId()
);
}
```

### 4.3 Redisson分布式锁

到这一步，我们的锁基本已经可以商业使用了，但是仍存在隐患：

**不可重入**：同一个线程无法多次获取同一把锁

**不可重试**：获取锁只尝试一次就返回false，没有重试机制

**超时释放**：锁超时释放虽然可以避免死锁，但如果是业务执行耗时较长，也会导致锁释放，存在安全隐患

**主从一致性**：如果Redis提供了主从集群，主从同步存在延迟，当主宕机时，如果从并未同步主中的锁数据，则会出现锁实现

Redisson是一个在Redis的基础上实现的Java驻内存数据网格。不仅提供了一系列的分布式的Java常用对象，还提供了许多分布式服务，其中就包含了各种分布式锁的实现。

### 4.3.1 Redisson快速入门

引入依赖：

```xml
<dependency>
<groupId>org.redisson</groupId>
<artifactId>redisson</artifactId>
<version>3.13.6</version>
</dependency>
```

配置Redisson客户端：

```java
@Configuration
public class RedissonConfig {
@Bean
public RedissonClient redissonClient(){
//配置
Config config = new Config();
config.useSingleServer().setAddress("redis://192.168.88.130:6379")
.setPassword("123456")
.setDatabase(1);
//创建RedissonClient对象
return Redisson.create(config);
}
}
```

测试Redission的分布式锁（可重入）：

```java
@Resource
private RedissionClient redissonClient;

@Test
void testRedisson() throws Exception{
//获取锁(可重入)，指定锁的名称
RLock lock = redissonClient.getLock("anyLock");
//尝试获取锁，参数分别是：获取锁的最大等待时间(期间会重试)，锁自动释放时间，时间单位
boolean isLock = lock.tryLock(1,10,TimeUnit.SECONDS);
//判断获取锁成功
if(isLock){
try{
System.out.println("执行业务");
}finally{
//释放锁
lock.unlock();
}

}
}
```

修改优惠券秒杀业务，把自己的锁换成Redisson的锁：

```java
@Resource
private RedissonClient redissonClient;

@Override
public Result seckillVoucher(Long voucherId) {
// 1.查询优惠券
SeckillVoucher voucher = seckillVoucherService.getById(voucherId);
// 2.判断秒杀是否开始
if (voucher.getBeginTime().isAfter(LocalDateTime.now())) {
// 尚未开始
return Result.fail("秒杀尚未开始！");
}
// 3.判断秒杀是否已经结束
if (voucher.getEndTime().isBefore(LocalDateTime.now())) {
// 尚未开始
return Result.fail("秒杀已经结束！");
}
// 4.判断库存是否充足
if (voucher.getStock() < 1) {
// 库存不足
return Result.fail("库存不足！");
}
Long userId = UserHolder.getUser().getId();
//创建锁对象 这个代码不用了，因为我们现在要使用分布式锁
//SimpleRedisLock lock = new SimpleRedisLock("order:" + userId, stringRedisTemplate);
RLock lock = redissonClient.getLock("lock:order:" + userId);
//获取锁对象
boolean isLock = lock.tryLock();

//加锁失败
if (!isLock) {
return Result.fail("不允许重复下单");
}
try {
//获取代理对象(事务)
IVoucherOrderService proxy = (IVoucherOrderService) AopContext.currentProxy();
return proxy.createVoucherOrder(voucherId);
} finally {
//释放锁
lock.unlock();
}
}
```

### 4.3.2 Redisson可重入锁原理

利用Redis的Hash结构，field存放线程的唯一标识（UUID+线程id），value存放线程重入次数。

调试下面的测试方法可以看到每一次获取锁都是将锁的重入次数加1，释放锁将锁的重入次数减1，最后重入次数为0释放锁，从而实现可重入锁。

```java
@Test
void method1(){
//创建锁对象
RLock lock = redissonClient.getLock("lock");

boolean isLock = lock.tryLock();
if(!isLock){
log.error("获取锁失败, 1");
return;
}
try {
log.info("获取锁成功, 1");
method2(lock);
} finally {
log.info("释放锁, 1");
lock.unlock();
}
}
void method2(RLock lock){
boolean isLock = lock.tryLock();
if(!isLock){
log.error("获取锁失败, 2");
return;
}
try {
log.info("获取锁成功, 2");
} finally {
log.info("释放锁, 2");
lock.unlock();
}
}
```

可重入的具体实现流程如下：

<div class="img-wrap-left"><img class="left-img" src="/assets/img/redis/2/image49.png" alt="image49.png"></div>

其中，获取锁的Lua脚本如下：

```lua
local key = KEYS[1]; -- 锁的key
local threadId = ARGV[1] -- 线程唯一标识
local releaseTime = ARGV[2] -- 锁的自动释放时间
-- 判断是否存在
if(redis.call('exists', key) == 0) then
-- 不存在，获取锁
redis.call('hset', key, threadId, '1');
-- 设置有效期
redis.call('expire', key, releaseTime);
return 1; -- 返回结果
end;
-- 锁已经存在，判断threadId是否是自己的
if(redis.call('hexists', key, threadId) == 1) then
-- 是自己的，获取锁，重入次数+1
redis.call('hincrby', key, threadId, '1');
-- 设置有效期
redis.call('expire', key, releaseTime);
return 1; -- 返回结果
end;
return 0; --代码走到这里，说明获取锁的不是自己，获取锁失败
```

释放锁的Lua脚本如下：

```lua
local key = KEYS[1]; -- 锁的key
local threadId = ARGV[1] -- 线程唯一标识
local releaseTime = ARGV[2] -- 锁的自动释放时间
-- 判断当前锁是否还是被自己持有
if(redis.call('HEXISTS', key， threadId) == 0) then
return nil; -- 如果已经不是自己，则直接返回
end;
-- 是自己的锁，则重入次数-1
local count = redis.call('HINCRBY'， key, threadId, -1);
-- 判断是否重入次数已经为0
if(count > 0) then
-- 大于0说明不能释放锁，重置有效期然后返回
redis.call('EXPIRE', key, releaseTime);
return nil;
else -- 等于0说明可以释放锁，直接删除
redis.call('DEL', key);
return nil;
end;
```

### 4.3.3 redission锁重试和WatchDog机制

tryLock()方法支持传递参数，如下图，其中包含尝试锁重试时间waitTime和锁有效期leaseTime，第三个参数为时间单位，这里以两个参数讲解redission锁重试和WatchDog机制

<div class="img-wrap-left"><img class="left-img" src="/assets/img/redis/2/image50.png" alt="image50.png"></div>

### 锁重试

<div class="img-wrap-left"><img class="left-img" src="/assets/img/redis/2/image51.png" alt="image51.png"></div>

调用tryLock()方法并指定锁重试时间后，进入tryAcquire()方法获取锁的剩余有效期：

```java
private Long tryAcquire(long waitTime, long leaseTime, TimeUnit unit, long threadId) {
return (Long)this.get(this.tryAcquireAsync(waitTime, leaseTime, unit, threadId));
}
```

get()方法阻塞等待tryAcquireAsync()的剩余有效期（null或者有效期），tryAcquireAsync()方法有两种返回值：

null：没有锁存在，获取锁成功

剩余有效期：获取锁失败，尝试再次获取

进入到tryAcquireAsync，如果leaseTime不等于-1，表示指定了锁持有时间（有效期），使用指定的锁持有时间获取锁，否则，表示没有指定锁的持有时间，会指定默认的锁监视超时时间lockWatchdogTimeout作为leaseTime，默认值为30000毫秒即30秒，然后调用tryLockInnerAsync()方法，得到返回的 RFuture 对象 ttlRemainingFuture。

```java
private <T> RFuture<Long> tryAcquireAsync(long waitTime, long leaseTime, TimeUnit unit, long threadId) {
if (leaseTime != -1L) {
return this.tryLockInnerAsync(waitTime, leaseTime, unit, threadId, RedisCommands.EVAL_LONG);
} else {
RFuture<Long> ttlRemainingFuture = this.tryLockInnerAsync(waitTime, this.commandExecutor.getConnectionManager().getCfg().getLockWatchdogTimeout(), TimeUnit.MILLISECONDS, threadId, RedisCommands.EVAL_LONG);
ttlRemainingFuture.onComplete((ttlRemaining, e) -> {
if (e == null) {
if (ttlRemaining == null) {
this.scheduleExpirationRenewal(threadId);
}
}
});
return ttlRemainingFuture;
}
}
```

进入tryLockInnerAsync()方法获取锁的信息，这里可以看到之前的获取锁Lua脚本，脚本nil即对应null，表示获取锁成 功，redis.call('pttl', KEYS[1])得到锁的剩余有效期，表示获取锁失败

<div class="img-wrap-left"><img class="left-img" src="/assets/img/redis/2/image52.png" alt="image52.png"></div>

回到tryLock()源码，获取到锁的剩余有效期ttl后，如果ttl不为null，计算当前剩余等待时间time，如果time小于等于0，证明获取锁逻辑耗费完了等待获取锁时间，调用acquireFailed()方法处理。

**订阅**：time大于0时，获取系统当前时间current，然后创建一个用于订阅锁释放通知的 subscribeFuture，调用 subscribe() 方法进行订阅。接下来调用subscribeFuture.await(time, TimeUnit.MILLISECONDS)等待 time 毫秒时间，等待订阅结果。如果在等待期间未收到订阅结果，表示等待超时。等待超时后代码会尝试取消订阅任务。如果取消失败，会在subscribeFuture.onComplete()方法中进行处理，判断是否需要取消订阅，并调用unsubscribe()方法进行处理。如果取消成功，则代码调用acquireFailed()方法进行处理，表示当前线程获取锁失败，最终返回false

<div class="img-wrap-left"><img class="left-img" src="/assets/img/redis/2/image53.png" alt="image53.png"></div>

订阅的通知就是释放锁Lua脚本当中发布的通知：

<div class="img-wrap-left"><img class="left-img" src="/assets/img/redis/2/image54.png" alt="image54.png"></div>

如果在time时间之内获得释放锁的通知，则会走以下代码逻辑，这也是**锁重试**的原理：

首先，获取当前时间 current 并计算剩余等待时间 time

如果 time 小于等于 0，表示等待锁的时间已经超过了剩余过期时间，或者锁的剩余过期时间非法。调用 acquireFailed() 方法进行处理，并返回 false

如果 time 大于 0，表示还有剩余的时间需要进行等待，也即就是还能去获取锁。代码会进入一个 do-while 循环，并不断尝试获取锁

在循环中，代码会再次获取当前时间 currentTime，然后调用 tryAcquire() 方法尝试获得锁，得到锁的剩余过期时间 ttl

如果锁的剩余过期时间 ttl 为空，表示成功获取到锁，会返回 true

否则，计算并判断剩余等待时间 time ，如果 time <= 0 ，说明尝试获取锁已经消耗完了剩余等待时间，获取锁失败，调用acquireFailed()方法处理

如果剩余过期时间 ttl 大于等于 0 且小于等于剩余等待时间 time，表示还有足够的时间可以等待，代码会使用 tryAcquire() 方法返回的 ttl 来等待锁的释放

如果剩余过期时间 ttl 大于剩余等待时间 time，表示还需要等待更长的时间，代码会使用 time 来等待锁的释放

在循环中，每次等待之后，会重新计算剩余等待时间 time

当剩余等待时间 time 小于或等于 0，表示等待超时，会调用 acquireFailed() 方法进行处理，并返回 false

最后，无论等待成功还是失败，都会调用 unsubscribe() 方法取消订阅并释放资源

```java
try {
time -= System.currentTimeMillis() - current;
if (time <= 0L) {
this.acquireFailed(waitTime, unit, threadId);
boolean var20 = false;
return var20;
} else {
boolean var16;
do {
long currentTime = System.currentTimeMillis();
ttl = this.tryAcquire(waitTime, leaseTime, unit, threadId);
if (ttl == null) {
var16 = true;
return var16;
}
time -= System.currentTimeMillis() - currentTime;
if (time <= 0L) {
this.acquireFailed(waitTime, unit, threadId);
var16 = false;
return var16;
}
currentTime = System.currentTimeMillis();
if (ttl >= 0L && ttl < time) {
((RedissonLockEntry)subscribeFuture.getNow()).getLatch().tryAcquire(ttl, TimeUnit.MILLISECONDS);
} else {
((RedissonLockEntry)subscribeFuture.getNow()).getLatch().tryAcquire(time, TimeUnit.MILLISECONDS);
}
time -= System.currentTimeMillis() - currentTime;
} while(time > 0L);
this.acquireFailed(waitTime, unit, threadId);
var16 = false;
return var16;
}

} finally {
this.unsubscribe(subscribeFuture, threadId);
}
```

当然，如果没有传递最大等待时间waitTime，那就不会进行锁重试，获取锁失败就直接返回false表示获取锁失败。

### WatchDog看门狗机制

WatchDog机制就是用于解决业务阻塞导致锁**超时释放**的安全问题，原理是定期更新锁的有效期，同时监控当前线程是否仍然持有锁。

回顾之前的tryAcquireAsync()方法，还有一部分onComplete()没有分析，这一段就是用来定时更新锁有效期的：

异步获取锁后，代码会在 ttlRemainingFuture.onComplete() 方法中定义一个回调函数，在获取结果后进行处理

如果回调函数中异常参数 e 为 null，表示获取结果成功。此时，代码判断返回的 ttlRemaining 是否为 null，如果为 null，表示锁的状态为有效，调用 scheduleExpirationRenewal() 方法进行锁的过期续约

<div class="img-wrap-left"><img class="left-img" src="/assets/img/redis/2/image55.png" alt="image55.png"></div>

进入到scheduleExpirationRenewal()方法，EXPIRATION_RENEWAL_MAP.putIfAbsent(this.getEntryName(), entry)方法将这个新的Entry对象放入一个名为EXPIRATION_RENEWAL_MAP的map集合中，使用this.getEntryName()方法返回一个唯一的名称（可以理解为锁的名称）作为键。

<div class="img-wrap-left"><img class="left-img" src="/assets/img/redis/2/image56.png" alt="image56.png"></div>

如果不是第一次获取锁，putIfAbsent()会返回旧的Entry，执行addThreadId()方法为当前线程的重入次数自增1，如果是第一次获取锁，除了执行addThreadId()方法新增Redis可重入锁，还会执行renewExpiration()方法，开启一个Timeout定时任务，每隔internalLockLeaseTime / 3 时间即10秒更新锁的有效期即续约。

简单来说，WatchDog机制每10秒检查一次，续期时间为30秒。当程序没有显式释放锁的操作时，watchdog会不断地执行续期操作，确保分布式锁的key不会过期。这样可以避免其他节点认为锁已经过期而尝试获取锁。

> **注意**：
> 要想看门狗机制启动，不能传leaseTime参数
> 锁重试和waitTime参数挂钩，看门狗机制和leaseTime参数挂钩

### 释放锁流程

<div class="img-wrap-left"><img class="left-img" src="/assets/img/redis/2/image57.png" alt="image57.png"></div>

unlock()释放锁会进入cancelExpirationRenewal()方法取消自动更新，如removeThreadId()删除锁，timeout.cancel()取消Timeout定时任务，最终remove()确保删除EXPIRATION_RENEWAL_MAP中的目标ExpirationEntry对象，即使释放锁出现异常，WatchDog也会通过判断后不再给锁续期。

<div class="img-wrap-left"><img class="left-img" src="/assets/img/redis/2/image58.png" alt="image58.png"></div>

**总结下来**，获取锁和释放锁的业务流程如下：

<div class="img-wrap-left"><img class="left-img" src="/assets/img/redis/2/image59.png" alt="image59.png"></div>

**可重入**：利用hash结构记录线程id和重入次数

**可重试**：利用信号量和PubSub功能实现等待、唤醒，获取锁失败的重试机制

**超时续约**：利用watchDog，每隔一段时间（releaseTime / 3），重置超时时间

### 4.3.4 redission锁的MutiLock原理

### Redis集群分布

为了提高redis的可用性，常会搭建集群结构或者主从结构。

假设现在有一台主机和一台从机组成主从结构，假设主机还没来得及把数据写入到从机时，主机宕机，哨兵会发现主机宕机，并选举一个slave变成master，而此时新的master中并没有锁信息，导致锁信息丢失：

<div class="img-wrap-left"><img class="left-img" src="/assets/img/redis/2/image60.png" alt="image60.png"></div>

为了解决这个问题，redission提出了MutiLock锁。建立多个主从结构，每个主节点的地位一致，MutiLock锁进行加锁时，仅当所有主节点都写入锁时才算加锁成功，只要有一个主节点没有写入锁，就算加锁失败，即使一个节点宕机了，其他主节点也有同样的锁，从而保证锁的可靠性：

<div class="img-wrap-left"><img class="left-img" src="/assets/img/redis/2/image61.png" alt="image61.png"></div>

### 基本使用

RedissonConfig新增两个客户端：

```java
@Bean
public RedissonClient redissonClient2() {
//配置
Config config = new Config();
config.useSingleServer().setAddress("redis://192.168.88.131:6379")
.setPassword("123456")
.setDatabase(1);
//创建RedissonClient对象
return Redisson.create(config);
}

@Bean
public RedissonClient redissonClient3() {
//配置
Config config = new Config();
config.useSingleServer().setAddress("redis://192.168.88.132:6379")
.setPassword("123456")
.setDatabase(1);
//创建RedissonClient对象
return Redisson.create(config);
}
```

原来注入1个RedissonClient修改为注入3个RedissonClient，并创建MultiLock对象：

```java
@Resource
private RedissonClient redissonClient;
@Resource
private RedissonClient redissonClient2;
@Resource
private RedissonClient redissonClient3;
private RLock lock;

@BeforeEach
void setUp() {
RLock lock1 = redissonClient.getLock("order");
RLock lock2 = redissonClient2.getLock("order");
RLock lock3 = redissonClient3.getLock("order");
//创建multiLock
lock = redissonClient.getMultiLock(lock1, lock2, lock3);
}
```

保留原有的测试单元不变：

```java
@Test
void method1() {
boolean isLock = lock.tryLock();
if (!isLock) {
log.error("获取锁失败, 1");
return;
}
try {
log.info("获取锁成功, 1");
method2(lock);
} finally {
log.info("释放锁, 1");
lock.unlock();
}
}

void method2(RLock lock) {
boolean isLock = lock.tryLock();
if (!isLock) {
log.error("获取锁失败, 2");
return;
}
try {
log.info("获取锁成功, 2");
} finally {
log.info("释放锁, 2");
lock.unlock();
}
}
```

经过调试可以发现，三个redis客户端都能写入锁和释放锁，且锁完全一致。

### 原理分析

当设置了多个锁时，redission会将多个锁添加到一个集合中，然后用while循环去不停地尝试拿锁，但是会有一个总共的加锁时间，这个时间是用 需要加锁的个数 * 1500ms ，假设有3个锁，那么时间就是4500ms，假设在这4500ms内，所有的锁都加锁成功， 那么此时才算是加锁成功，如果在4500ms有线程加锁失败，则会再次去进行重试：

<div class="img-wrap-left"><img class="left-img" src="/assets/img/redis/2/image62.png" alt="image62.png"></div>

## 5.秒杀优化

原有的下单流程分为如下几步：

查询优惠卷

判断秒杀库存是否足够

查询订单

校验是否是一人一单

扣减库存

创建订单

其中，查询优惠券、查询订单、扣减库存、创建订单都会操作数据库，导致业务效率低下，那该怎么优化呢？

我们可以把查询优惠券、判断库存、查询订单、校验一人一单交给Redis去做，而扣减库存和创建订单这些必须操作数据库的放到阻塞队列中开启一个线程慢慢执行。

<div class="img-wrap-left"><img class="left-img" src="/assets/img/redis/2/image63.png" alt="image63.png"></div>

**Redis端**：当用户下单之后，判断库存是否充足只需要到redis中去根据key找对应的value是否大于0，如果不充足，则直接结束，如果充足，继续在redis中判断用户是否可以下单，如果set集合中没有这条数据，说明他可以下单，如果set集合中没有这条记录，则将userId和优惠卷存入到redis中，并且返回0，整个过程需要保证是原子性，所以使用lua来操作。

**服务端**：当Redis逻辑走完后，判断当前redis中返回的结果是否是0 ，如果是0，则表示可以下单，则将之前说的信息存入到到queue中去，然后返回，然后再来个线程异步的下单，前端可以通过返回的订单id来判断是否下单成。

### 5.1 Redis完成秒杀资格判断

修改VoucherServiceImpl的新增秒杀券业务方法：

```java
@Override
@Transactional
public void addSeckillVoucher(Voucher voucher) {
// 保存优惠券
save(voucher);
// 保存秒杀信息
SeckillVoucher seckillVoucher = new SeckillVoucher();
seckillVoucher.setVoucherId(voucher.getId());
seckillVoucher.setStock(voucher.getStock());
seckillVoucher.setBeginTime(voucher.getBeginTime());
seckillVoucher.setEndTime(voucher.getEndTime());
seckillVoucherService.save(seckillVoucher);
// 保存秒杀库存到Redis中
stringRedisTemplate.opsForValue().set(RedisConstans.SECKILL_STOCK_KEY + voucher.getId(), voucher.getStock().toString());
}
```

在resources包下创建Lua脚本seckill.lua：

```lua
-- 1.参数列表
-- 1.1.优惠券id
local voucherId = ARGV[1]
-- 1.2.用户id
local userId = ARGV[2]

-- 2.数据key
-- 2.1.库存key
local stockKey = 'seckill:stock:' .. voucherId
-- 2.2.订单key
local orderKey = 'seckill:order:' .. voucherId

-- 3.脚本业务
-- 3.1.判断库存是否充足 get stockKey
if(tonumber(redis.call('get', stockKey)) <= 0) then
-- 3.2.库存不足，返回1
return 1
end
-- 3.2.判断用户是否下单 SISMEMBER orderKey userId
if(redis.call('sismember', orderKey, userId) == 1) then
-- 3.3.存在，说明是重复下单，返回2
return 2
end
-- 3.4.扣库存 incrby stockKey -1
redis.call('incrby', stockKey, -1)
-- 3.5.下单（保存用户）sadd orderKey userId
redis.call('sadd', orderKey, userId)
return 0
```

初步修改VoucherOrderServiceImpl中下单逻辑：

```java
private static final DefaultRedisScript<Long> SECKILL_SCRIPT;
static {
SECKILL_SCRIPT = new DefaultRedisScript<>();
SECKILL_SCRIPT.setLocation(new ClassPathResource("seckill.lua"));
SECKILL_SCRIPT.setResultType(Long.class);
}

@Override
public Result seckillVoucher(Long voucherId) {
//获取用户
Long userId = UserHolder.getUser().getId();
// 1.执行lua脚本
Long result = stringRedisTemplate.execute(
SECKILL_SCRIPT,
Collections.emptyList(),
voucherId.toString(), userId.toString()
);
int r = result.intValue();
// 2.判断结果是否为0
if (r != 0) {
// 2.1.不为0 ，代表没有购买资格
return Result.fail(r == 1 ? "库存不足" : "不能重复下单");
}
// 2.2.为0，有购买资格，把下单信息保存到阻塞队列
long orderId = redisIdWorker.nextId("order");
//TODO 保存阻塞队列
// 3.返回订单id
return Result.ok(orderId);
}
```

### 5.2 基于阻塞队列实现秒杀优化

IVoucherOrderService接口新增createVoucherOrder方法：

```java
void createVoucherOrder(VoucherOrder voucherOrder);
```

完善VoucherOrderServiceImpl的下单逻辑，最后完整代码如下：

```java
@Service
public class VoucherOrderServiceImpl extends ServiceImpl<VoucherOrderMapper, VoucherOrder> implements IVoucherOrderService {
@Resource
private ISeckillVoucherService seckillVoucherService;
@Resource
private RedisIdWorker redisIdWorker;
@Resource
private StringRedisTemplate stringRedisTemplate;
@Resource
private RedissonClient redissonClient;
private static final DefaultRedisScript<Long> SECKILL_SCRIPT;
//异步处理线程池
private static final ExecutorService SECKILL_ORDER_EXECUTOR = Executors.newSingleThreadExecutor();
private BlockingQueue<VoucherOrder> orderTasks = new ArrayBlockingQueue<>(1024 * 1024);
private IVoucherOrderService proxy;

static {
SECKILL_SCRIPT = new DefaultRedisScript<>();
SECKILL_SCRIPT.setLocation(new ClassPathResource("seckill.lua"));
SECKILL_SCRIPT.setResultType(Long.class);
}

//在类初始化之后执行，因为当这个类初始化好了之后，随时都是有可能要执行的
@PostConstruct
private void init() {
SECKILL_ORDER_EXECUTOR.submit(new VoucherOrderHandler());
}

private class VoucherOrderHandler implements Runnable {
@Override
public void run() {
while (true) {
try {
//1.获取订单中的队列消息
VoucherOrder voucherOrder = orderTasks.take();
//2.创建订单
handleVoucherOrder(voucherOrder);
} catch (Exception e) {
log.error("处理订单异常:", e);
}
}
}
}

private void handleVoucherOrder(VoucherOrder voucherOrder) {
// 1.获取用户
Long userId = voucherOrder.getUserId();
// 2.创建锁对象
RLock redisLock = redissonClient.getLock("lock:order:" + userId);
// 3.尝试获取锁
boolean isLock = redisLock.tryLock();
// 4.判断是否获得锁成功
if (!isLock) {
// 获取锁失败，直接返回失败或者重试
log.error("不允许重复下单！");
return;
}
try {
//注意：由于是spring的事务是放在threadLocal中，此时的是多线程，事务会失效
proxy.createVoucherOrder(voucherOrder);
} finally {
// 释放锁
redisLock.unlock();
}
}

@Override
@Transactional
public void createVoucherOrder(VoucherOrder voucherOrder) {
Long userId = voucherOrder.getUserId();
// 5.1.查询订单
int count = query().eq("user_id", userId).eq("voucher_id", voucherOrder.getVoucherId()).count();
// 5.2.判断是否存在
if (count > 0) {
// 用户已经购买过了
log.error("用户已经购买过一次！");
}
// 6.扣减库存
boolean success = seckillVoucherService.update()
.setSql("stock = stock - 1") // set stock = stock - 1
.eq("voucher_id", voucherOrder.getVoucherId()).gt("stock", 0) // where id = ? and stock > 0
.update();
if (!success) {
// 扣减失败
log.error("库存不足！");
}
// 7.创建订单
save(voucherOrder);
}


@Override
public Result seckillVoucher(Long voucherId) {
//获取用户
Long userId = UserHolder.getUser().getId();
// 1.执行lua脚本
Long result = stringRedisTemplate.execute(
SECKILL_SCRIPT,
Collections.emptyList(),
voucherId.toString(), userId.toString()
);
int r = result.intValue();
// 2.判断结果是否为0
if (r != 0) {
// 2.1.不为0 ，代表没有购买资格
return Result.fail(r == 1 ? "库存不足" : "不能重复下单");
}
// 2.2.为0，有购买资格，把下单信息保存到阻塞队列
VoucherOrder voucherOrder = new VoucherOrder();
// 2.3.订单id
long orderId = redisIdWorker.nextId("order");
voucherOrder.setId(orderId);
// 2.4.用户id
voucherOrder.setUserId(userId);
// 2.5.代金券id
voucherOrder.setVoucherId(voucherId);
// 2.6.放入阻塞队列
orderTasks.add(voucherOrder);
//3.获取代理对象
proxy = (IVoucherOrderService) AopContext.currentProxy();
// 3.返回订单id
return Result.ok(orderId);
}
}
```

### 5.3 Redis消息队列

阻塞队列实现的秒杀存在两个问题：

JVM的内存限制问题

数据安全问题：JVM的内存数据没有持久化，当服务器重启或宕机或从阻塞队列取的时候遇到异常，数据都会丢失

可以使用**消息队列**解决这两个问题。

### 5.3.1 消息队列介绍

消息队列，即存放消息的队列，最简单的消息队列包含3个角色：

消息队列：存储和管理消息，也被称为消息代理（Message Broker）

生产者：发送消息到消息队列

消费者：从消息队列获取消息并处理消息

消息队列最大的好处是**解耦**，例如：下单后，Redis校验下单条件，再通过队列把消息发送出去，然后再启动一个线程消费这个消息，完成解耦，同时也加快了响应速度。

虽然可以使用现成的mp如kafka，但这里使用Redis自带的mp方案实现消息队列。

### 5.3.2 基于List实现消息队列

由于Redis的List数据结构是一个双向链表，设置当入口和出口在不同边时，就能模拟一个队列，为了实现阻塞效果，出口使用BRPOP或BLPOP，这样，就用List模拟出一个消息队列：

<div class="img-wrap-left"><img class="left-img" src="/assets/img/redis/2/image64.png" alt="image64.png"></div>

优点：

利用Redis存储，不受限于JVM内存上限

基于Redis的持久化机制，数据安全性有保证

可以满足消息有序性

缺点：

无法避免消息丢失

只支持单消费者

### 5.3.3 基于PubSub的消息队列

PubSub是Redis2.0版本引入的消息传递模型。顾名思义，消费者可以订阅一个或多个channel，生产者向对应channel发送消息后，所有订阅者都能收到相关消息。

<div class="img-wrap-left"><img class="left-img" src="/assets/img/redis/2/image65.png" alt="image65.png"></div>

SUBSCRIBE channel [channel] ：订阅一个或多个频道

PUBLISH channel msg ：向一个频道发送消息

PSUBSCRIBE pattern [pattern] ：订阅与pattern格式匹配的所有频道

?，匹配任意一个字符，如h?llo能匹配hallo，不能匹配haallo

*，匹配任意0个或多个字符，如h*llo能匹配hallo和haallo

[ae]，仅能匹配a或e，如h[ae]llo能匹配hallo和hello，不能匹配hcllo和heallo，其他类似

优点：

采用发布订阅模型，支持多生产、多消费

缺点：

不支持数据持久化

无法避免消息丢失，服务器宕机即使重启也无法接受宕机期间的任何消息

消息堆积有上限，超出时数据丢失

### 5.3.4 基于Stream的消息队列-单消费

Stream 是Redis 5.0引入的一种新数据类型，可以实现一个功能非常完善的消息队列，并支持数据持久化。

发送消息的命令：

<div class="img-wrap-left"><img class="left-img" src="/assets/img/redis/2/image66.png" alt="image66.png"></div>

其中，key为消息队列名称，NOMKSTREAM参数一般不指定，常用写法为：

<div class="img-wrap-left"><img class="left-img" src="/assets/img/redis/2/image67.png" alt="image67.png"></div>

读取消息的方式之一XREAD：

<div class="img-wrap-left"><img class="left-img" src="/assets/img/redis/2/image68.png" alt="image68.png"></div>

例如从第一条消息开始读取users队列中的一条消息：

<div class="img-wrap-left"><img class="left-img" src="/assets/img/redis/2/image69.png" alt="image69.png"></div>

读取users队列中的最新一条消息，并等待1秒：

<div class="img-wrap-left"><img class="left-img" src="/assets/img/redis/2/image70.png" alt="image70.png"></div>

业务中通过XREAD阻塞结合循环就能实现持续监听队列的效果：

```java
while(true){
// 尝试读取队列中的消息，最多阻塞2秒
Object msg = redis.execute("XREAD COUNT 1 BLOCK 2000 STREAMS users $");
if(msg == null){
continue;
}

// 处理消息
handleMessage(msg);
}
```

当我们指定起始ID为$时，代表读取最新的消息，如果我们处理一条消息的过程中，又有超过1条以上的消息到达队列，则下次获取时也只能获取到最新的一条，会出现**漏读消息**的问题。

### 5.4.5 基于Stream的消息队列-消费者组

消费者组，将多个消费者划分到一个组中，监听同一个队列。具备下列特点：

**消息分流**：队列中的消息会分流给组内的不同消费者，而不是重复消费，从而加快消息处理的速度

**消息标示**：消费者组会维护一个标示，记录最后一个被处理的消息，哪怕消费者宕机重启，还会从标示之后读取消息。确保每一个消息都会被消费

**消息确认**：消费者获取消息后，消息处于pending状态，并存入一个pending-list。当处理完成后需要通过XACK来确认消息，标记消息为已处理，才会从pending-list移除

创建消费者组：

```powershell
XGROUP CREATE key groupName ID [MKSTREAM]
```

key：队列名称

groupName：消费者组名称

ID：起始消费位置ID标示，$代表队列中最后一个消息，0则代表队列中第一个消息

MKSTREAM：队列不存在时自动创建队列

删除指定的消费者组：

```powershell
XGROUP DESTROY key groupName
```

给指定的消费者组添加消费者：

```powershell
XGROUP CREATECONSUMER key groupname consumername
```

删除消费者组中的指定消费者：

```powershell
XGROUP DELCONSUMER key groupname consumername
```

从消费者组读取消息：

```powershell
XREADGROUP GROUP group consumer [COUNT count] [BLOCK milliseconds] [NOACK] STREAMS key [key ...] ID [ID ...]
```

group：消费组名称

consumer：消费者名称，如果消费者不存在，会自动创建一个消费者

count：本次查询的最大数量

BLOCK milliseconds：当没有消息时最长等待时间

NOACK：无需手动ACK，获取到消息后自动确认

默认收到消息后需要手动执行ACK命令进行消息确认，指定NOACK会自动确认

STREAMS key：指定队列名称

ID：获取消息的起始ID：

>：从下一个**未消费**的消息开始

其它：根据指定id从pending-list中获取已消费但未确认的消息，0指从pending-list中的第一个消息开始

确认消费者组中的消息：

```powershell
XACK key group ID [ID ...]
```

查询消费组里已被拉取但未确认的消息（即待处理超时或未完成的消息）：

```powershell
XPENDING key group [[IDLE min-idle-time] start end count [consumer]]
```

key：队列名称

group：消费组名称

IDLE min-idle-time：删选出闲置时间超过min-idle-time的未确认消息

start end：指定消息ID的范围，常用- +查看所有未确认的消息

count：查询未确认消息的数量

consumer：只查询某个消费者的未确认消息

消费者监听消息的基本思路：

```java
while(true){
// 尝试监听队列，使用阻塞模式，最长等待2000毫秒
Object msg = redis.call("XREADGROUP GROUP g1 c1 COUNT 1 BLOCK 2000 STREAMS s1 >");
if(msg == null){ // null说明没有消息，继续下一次
continue;
}
try {
//处理消息，完成后一定要ACK
handleMessage(msg);
} catch(Exception e){
while(true){
Object msg = redis.call("XREADGROUP GROUP g1 c1 COUNT 1 STREAMS s1 0");
if(msg == null){ // null说明没有异常消息，所有消息都已确认，结束循环
break;
}
try {
//说明没有异常消息，再次处理
handleMessage(msg);
} catch(Exception e){
//再次出现异常，记录日志，继续循环
continue;
}
}
}
}
```

STREAM类型消息队列的XREADGROUP命令特点：

消息可回溯

可以多消费者争抢消息，加快消费速度

可以阻塞读取

没有消息漏读的风险

有消息确认机制，保证消息至少被消费一次

总结下来，List、PubSub、Stream三者的区别如下：

|            |                      |           |                             |
| ---------- | -------------------- | --------- | --------------------------- |
|            | List                 | PubSub    | Stream                      |
| **消息持久化**  | 支持                   | 不支持       | 支持                          |
| **阻塞读取**   | 支持                   | 支持        | 支持                          |
| **消息堆积处理** | 受限于内存空间，可以利用多消费者加快处理 | 受限于消费者缓冲区 | 受限于队列长度，可以利用消费者组提高消费速度，减少堆积 |
| **消息确认机制** | 不支持                  | 不支持       | 支持                          |
| **消息回溯**   | 不支持                  | 不支持       | 支持                          |

### 5.4.6 基于消息队列实现异步秒杀下单

创建一个Stream类型的消息队列stream.orders：

```powershell
XGROUP CREATE stream.orders g1 0 MKSTREAM
```

修改Lua脚本，最终脚本内容如下：

```lua
-- 1.参数列表
-- 1.1.优惠券id
local voucherId = ARGV[1]
-- 1.2.用户id
local userId = ARGV[2]
-- 1.3.订单id
local orderId = ARGV[3]

-- 2.数据key
-- 2.1.库存key
local stockKey = 'seckill:stock:' .. voucherId
-- 2.2.订单key
local orderKey = 'seckill:order:' .. voucherId

-- 3.脚本业务
-- 3.1.判断库存是否充足 get stockKey
if(tonumber(redis.call('get', stockKey)) <= 0) then
-- 3.2.库存不足，返回1
return 1
end
-- 3.2.判断用户是否下单 SISMEMBER orderKey userId
if(redis.call('sismember', orderKey, userId) == 1) then
-- 3.3.存在，说明是重复下单，返回2
return 2
end
-- 3.4.扣库存 incrby stockKey -1
redis.call('incrby', stockKey, -1)
-- 3.5.下单（保存用户）sadd orderKey userId
redis.call('sadd', orderKey, userId)
-- 3.6.发送消息到队列中，XADD stream.orders * k1 v1 k2 v2
redis.call('xadd', 'stream.orders', '*', 'userId', userId, 'voucherId', voucherId, 'id', orderId)
return 0
```

修改VoucherOrderServiceImpl的下单逻辑，最后完整代码如下：

```java
@Service
public class VoucherOrderServiceImpl extends ServiceImpl<VoucherOrderMapper, VoucherOrder> implements IVoucherOrderService {
@Resource
private ISeckillVoucherService seckillVoucherService;
@Resource
private RedisIdWorker redisIdWorker;
@Resource
private StringRedisTemplate stringRedisTemplate;
@Resource
private RedissonClient redissonClient;
private static final DefaultRedisScript<Long> SECKILL_SCRIPT;
//异步处理线程池
private static final ExecutorService SECKILL_ORDER_EXECUTOR = Executors.newSingleThreadExecutor();
private IVoucherOrderService proxy;
private static final String queueName = "stream.orders";

static {
SECKILL_SCRIPT = new DefaultRedisScript<>();
SECKILL_SCRIPT.setLocation(new ClassPathResource("seckill.lua"));
SECKILL_SCRIPT.setResultType(Long.class);
}

//在类初始化之后执行，因为当这个类初始化好了之后，随时都是有可能要执行的
@PostConstruct
private void init() {
SECKILL_ORDER_EXECUTOR.submit(new VoucherOrderHandler());
}

private class VoucherOrderHandler implements Runnable {
@Override
public void run() {
// 初始化消费者组
try {
// 创建消费者组，如果组已存在则忽略错误
stringRedisTemplate.opsForStream().createGroup(queueName, "g1");
} catch (Exception e) {
log.warn("消费者组 g1 已存在，跳过创建");
}
while (true) {
try {
// 1.获取消息队列中的订单信息 XREADGROUP GROUP g1 c1 COUNT 1 BLOCK 2000 STREAMS stream.orders >
List<MapRecord<String, Object, Object>> list = stringRedisTemplate.opsForStream().read(
Consumer.from("g1", "c1"),
StreamReadOptions.empty().count(1).block(Duration.ofSeconds(5)),
StreamOffset.create(queueName, ReadOffset.lastConsumed())
);
// 2.判断订单信息是否为空
if (list == null || list.isEmpty()) {
// 如果为null，说明没有消息，继续下一次循环
continue;
}
// 3.解析消息中的订单信息
MapRecord<String, Object, Object> record = list.get(0);
Map<Object, Object> values = record.getValue();
VoucherOrder voucherOrder = BeanUtil.fillBeanWithMap(values, new VoucherOrder(), true);
// 4.如果获取成功，可以下单
//createVoucherOrder(voucherOrder);
handleVoucherOrder(voucherOrder);
// 5.确认消息 XACK stream.orders g1 id
stringRedisTemplate.opsForStream().acknowledge(queueName, "g1", record.getId());
} catch (Exception e) {
log.error("处理订单异常:", e);
//处理异常消息
handlePendingList();
}
}
}

private void handlePendingList() {
while (true) {
try {
// 1.获取pending-list中的订单信息 XREADGROUP GROUP g1 c1 COUNT 1 STREAMS stream.orders 0
List<MapRecord<String, Object, Object>> list = stringRedisTemplate.opsForStream().read(
Consumer.from("g1", "c1"),
StreamReadOptions.empty().count(1),
StreamOffset.create(queueName, ReadOffset.from("0"))
);
// 2.判断消息是否获取成功
if (list == null || list.isEmpty()) {
// 如果获取失败，，说明pending-list没有异常消息，结束循环
break;
}
// 3.解析消息中的订单信息
MapRecord<String, Object, Object> record = list.get(0);
Map<Object, Object> values = record.getValue();
VoucherOrder voucherOrder = BeanUtil.fillBeanWithMap(values, new VoucherOrder(), true);
// 4.如果获取成功，可以下单
handleVoucherOrder(voucherOrder);
// 4.确认消息 XACK stream.orders g1 id
stringRedisTemplate.opsForStream().acknowledge(queueName, "g1", record.getId());
} catch (Exception e) {
log.error("处理pendding订单异常", e);
try {
Thread.sleep(20);
} catch (InterruptedException ex) {
ex.printStackTrace();
}
}
}
}
}


private void handleVoucherOrder(VoucherOrder voucherOrder) {
// 1.获取用户
Long userId = voucherOrder.getUserId();
// 2.创建锁对象
RLock redisLock = redissonClient.getLock("lock:order:" + userId);
// 3.尝试获取锁
boolean isLock = redisLock.tryLock();
// 4.判断是否获得锁成功
if (!isLock) {
// 获取锁失败，直接返回失败或者重试
log.error("不允许重复下单！");
return;
}
try {
//注意：由于是spring的事务是放在threadLocal中，此时的是多线程，事务会失效
proxy.createVoucherOrder(voucherOrder);
} finally {
// 释放锁
redisLock.unlock();
}
}

@Override
@Transactional
public void createVoucherOrder(VoucherOrder voucherOrder) {
Long userId = voucherOrder.getUserId();
// 5.1.查询订单
int count = query().eq("user_id", userId).eq("voucher_id", voucherOrder.getVoucherId()).count();
// 5.2.判断是否存在
if (count > 0) {
// 用户已经购买过了
log.error("用户已经购买过一次！");
}
// 6.扣减库存
boolean success = seckillVoucherService.update()
.setSql("stock = stock - 1") // set stock = stock - 1
.eq("voucher_id", voucherOrder.getVoucherId()).gt("stock", 0) // where id = ? and stock > 0
.update();
if (!success) {
// 扣减失败
log.error("库存不足！");
}
// 7.创建订单
save(voucherOrder);
}

@Override
public Result seckillVoucher(Long voucherId) {
//获取用户
Long userId = UserHolder.getUser().getId();
//获取订单id
long orderId = redisIdWorker.nextId("order");
// 1.执行lua脚本
Long result = stringRedisTemplate.execute(
SECKILL_SCRIPT,
Collections.emptyList(),
voucherId.toString(), userId.toString(), String.valueOf(orderId)
);
int r = result.intValue();
// 2.判断结果是否为0
if (r != 0) {
// 2.1.不为0 ，代表没有购买资格
return Result.fail(r == 1 ? "库存不足" : "不能重复下单");
}
//3.获取代理对象
proxy = (IVoucherOrderService) AopContext.currentProxy();
// 3.返回订单id
return Result.ok(orderId);
}
}
```

## 6.达人探店

### 6.1 发布探店笔记

当点击主页下方的加号时就能实现发布探店笔记：

<div class="img-wrap-left"><img class="left-img" src="/assets/img/redis/2/image71.png" alt="image71.png"></div>

tb_blog：探店笔记表，包含笔记中的标题、文字、图片等

tb_blog_comments：其他用户对探店笔记的评价

这个功能已经实现了，只需修改SystemConstants.IMAGE_UPLOAD_DIR为自己的nginx服务器图片路径即可：

```java
public static final String IMAGE_UPLOAD_DIR = "E:softwareJavaprojectitheima-redisnginx-1.18.0htmlhmdpimgs";
```

### 6.2 查看探店笔记

点击某一篇笔记后，会发起请求查看探店笔记的详细信息，接口设计：

请求方式：GET

请求路径：/blog/{id}

请求参数：id，blog的id

返回值：Blog，笔记信息，包含用户信息

BlogController新增queryBlogById方法：

```java
@GetMapping("/{id}")
public Result queryBlogById(@PathVariable Long id){
return blogService.queryBlogById(id);
}
```

BlogServiceImpl：

```java
@Service
public class BlogServiceImpl extends ServiceImpl<BlogMapper, Blog> implements IBlogService {

@Resource
private IUserService userService;

@Override
public Result queryBlogById(Long id) {
// 1.查询blog
Blog blog = getById(id);
if (blog == null) {
return Result.fail("笔记不存在！");
}
// 2.查询blog有关的用户
queryBlogUser(blog);
return Result.ok(blog);
}

private void queryBlogUser(Blog blog) {
Long userId = blog.getUserId();
User user = userService.getById(userId);
blog.setName(user.getNickName());
blog.setIcon(user.getIcon());
}
}
```

### 6.3 点赞功能

现已有的点赞逻辑likeBlog()方法一人可以多次点按，需要实现一人只能点赞一次，再次点击取消点赞。实现思路是基于Redis的Set集合，通过判断Set集合是否含有用户判断是否点赞，并修改tb_blog表的liked字段。

Blog类新增isLike属性（已经实现）：

```java
/**
* 是否点赞过了
*/
@TableField(exist = false)
private Boolean isLike;
```

修改BlogController类原有的likeBlog方法：

```java
@PutMapping("/like/{id}")
public Result likeBlog(@PathVariable("id") Long id) {
return blogService.likeBlog(id);
}
```

BlogServiceImpl类新增likeBlog方法：

```java
@Resource
private StringRedisTemplate stringRedisTemplate;

@Override
public Result likeBlog(Long id) {
// 1.获取登录用户
Long userId = UserHolder.getUser().getId();
// 2.判断当前登录用户是否已经点赞
String key = RedisConstants.BLOG_LIKED_KEY + id;
Boolean isMember = stringRedisTemplate.opsForSet().isMember(key, userId.toString());
if (BooleanUtil.isFalse(isMember)) {
//3.如果未点赞，可以点赞
//3.1 数据库点赞数+1
boolean isSuccess = update().setSql("liked = liked + 1").eq("id", id).update();
//3.2 保存用户到Redis的set集合
if (isSuccess) {
stringRedisTemplate.opsForSet().add(key, userId.toString());
}
} else {
//4.如果已点赞，取消点赞
//4.1 数据库点赞数-1
boolean isSuccess = update().setSql("liked = liked - 1").eq("id", id).update();
//4.2 把用户从Redis的set集合移除
if (isSuccess) {
stringRedisTemplate.opsForSet().remove(key, userId.toString());
}
}
return Result.ok();
}
```

此时点赞功能已经实现，但是点赞后并不会点亮点赞按钮，还需要修改探店笔记查询接口。

修改queryHotBlog中queryHotBlog方法：

```java
@GetMapping("/hot")
public Result queryHotBlog(@RequestParam(value = "current", defaultValue = "1") Integer current) {
return blogService.queryHotBlog(current);
}
```

修改BlogServiceImpl类添加如下内容：

```java
@Override
public Result queryHotBlog(Integer current) {
// 根据用户查询
Page<Blog> page = query()
.orderByDesc("liked")
.page(new Page<>(current, SystemConstants.MAX_PAGE_SIZE));
// 获取当前页数据
List<Blog> records = page.getRecords();
// 查询用户
records.forEach(blog ->{
this.queryBlogUser(blog);
this.isBlogLiked(blog);
});
return Result.ok(records);
}

private void isBlogLiked(Blog blog) {
//1.获取登录用户
Long userId = UserHolder.getUser().getId();
//2.判断当前登录用户是否已经点赞
String key = RedisConstants.BLOG_LIKED_KEY + blog.getId();
Boolean isMember = stringRedisTemplate.opsForSet().isMember(key, userId.toString());
blog.setIsLike(BooleanUtil.isTrue(isMember));
}
```

### 6.4 点赞排行榜

在探店笔记详情页面，需要按照点赞时间的前后顺序显示Top5点赞排行榜：

<div class="img-wrap-left"><img class="left-img" src="/assets/img/redis/2/image72.png" alt="image72.png"></div>

由于需要按点赞时间排序，原来的Set集合就不能使用了，需要使用SortedSet集合进行存放点赞用户，score字段放置时间戳。

修改BlogServiceImpl原有的点赞逻辑：

```java
@Override
public Result likeBlog(Long id) {
// 1.获取登录用户
Long userId = UserHolder.getUser().getId();
// 2.判断当前登录用户是否已经点赞
String key = RedisConstants.BLOG_LIKED_KEY + id;
Double score = stringRedisTemplate.opsForZSet().score(key, userId.toString());
if (score == null) {
//3.如果未点赞，可以点赞
//3.1 数据库点赞数+1
boolean isSuccess = update().setSql("liked = liked + 1").eq("id", id).update();
//3.2 保存用户到Redis的set集合
if (isSuccess) {
stringRedisTemplate.opsForZSet().add(key, userId.toString(), System.currentTimeMillis());
}
} else {
//4.如果已点赞，取消点赞
//4.1 数据库点赞数-1
boolean isSuccess = update().setSql("liked = liked - 1").eq("id", id).update();
//4.2 把用户从Redis的set集合移除
if (isSuccess) {
stringRedisTemplate.opsForZSet().remove(key, userId.toString());
}
}
return Result.ok();
}

private void isBlogLiked(Blog blog) {
//1.获取登录用户
UserDTO user = UserHolder.getUser();
if(user == null){
// 用户未登录，无需查询是否点赞
return;
}
Long userId = user.getId();
//2.判断当前登录用户是否已经点赞
String key = RedisConstants.BLOG_LIKED_KEY + blog.getId();
Double score = stringRedisTemplate.opsForZSet().score(key, userId.toString());
blog.setIsLike(score != null);
}
```

BlogController新增queryBlogLikes方法：

```java
@GetMapping("/likes/{id}")
public Result queryBlogLikes(@PathVariable("id") Long id) {
return blogService.queryBlogLikes(id);
}
```

BlogServiceImpl类新增queryBlogLikes方法：

```java
@Override
public Result queryBlogLikes(Long id) {
String key = RedisConstants.BLOG_LIKED_KEY + id;
// 1.查询top5的点赞用户 zrange key 0 4
Set<String> top5 = stringRedisTemplate.opsForZSet().range(key, 0, 4);
if (top5 == null || top5.isEmpty()) {
return Result.ok(Collections.emptyList());
}
// 2.解析出其中的用户id
List<Long> ids = top5.stream().map(Long::valueOf).collect(Collectors.toList());
String idStr = StrUtil.join(",", ids);
// 3.根据用户id查询用户 WHERE id IN ( 5 , 1 ) ORDER BY FIELD(id, 5, 1)
List<UserDTO> userDTOS = userService.query()
.in("id", ids).last("ORDER BY FIELD(id," + idStr + ")").list()
.stream()
.map(user -> BeanUtil.copyProperties(user, UserDTO.class))
.collect(Collectors.toList());
// 4.返回
return Result.ok(userDTOS);
}
```

## 7.好友关注

### 7.1 关注和取消关注

用户和用户的关注关系为多对多，这里使用tb_follow表用于记录关注关系，关注即查询信息是否存在，取消关注即删除数据。

FollowController新增follow方法和isFollow方法：

```java
@Resource
private IFollowService followService;

//关注
@PutMapping("/{id}/{isFollow}")
public Result follow(@PathVariable("id") Long followUserId, @PathVariable("isFollow") Boolean isFollow) {
return followService.follow(followUserId, isFollow);
}
//取消关注
@GetMapping("/or/not/{id}")
public Result isFollow(@PathVariable("id") Long followUserId) {
return followService.isFollow(followUserId);
}
```

FollowServiceImpl：

```java
@Service
public class FollowServiceImpl extends ServiceImpl<FollowMapper, Follow> implements IFollowService {

@Override
public Result follow(Long followUserId, Boolean isFollow) {
// 1.获取登录用户
Long userId = UserHolder.getUser().getId();
String key = "follows:" + userId;
// 1.判断到底是关注还是取关
if (isFollow) {
// 2.关注，新增数据
Follow follow = new Follow();
follow.setUserId(userId);
follow.setFollowUserId(followUserId);
boolean isSuccess = save(follow);
} else {
// 3.取关，删除 delete from tb_follow where user_id = ? and follow_user_id = ?
remove(new QueryWrapper<Follow>()
.eq("user_id", userId).eq("follow_user_id", followUserId));
}
return Result.ok();
}


@Override
public Result isFollow(Long followUserId) {
// 1.获取登录用户
Long userId = UserHolder.getUser().getId();
// 2.查询是否关注 select count(*) from tb_follow where user_id = ? and follow_user_id = ?
Integer count = query().eq("user_id", userId).eq("follow_user_id", followUserId).count();
// 3.判断
return Result.ok(count > 0);
}
}
```

### 7.2 共同关注

查询两个人的共同关注就是求两个人关注列表的交集，考虑到Redis的Set集合有求交集功能，这里用Set集合实现。

<div class="img-wrap-left"><img class="left-img" src="/assets/img/redis/2/image73.png" alt="image73.png"></div>

UserController导入查询用户详情的代码：

```java
@GetMapping("/{id}")
public Result queryUserById(@PathVariable("id") Long userId){
// 查询详情
User user = userService.getById(userId);
if (user == null) {
return Result.ok();
}
UserDTO userDTO = BeanUtil.copyProperties(user, UserDTO.class);
// 返回
return Result.ok(userDTO);
}
```

BlogController导入查询用户笔记代码：

```java
@GetMapping("/of/user")
public Result queryBlogByUserId(
@RequestParam(value = "current", defaultValue = "1") Integer current,
@RequestParam("id") Long id) {
// 根据用户查询
Page<Blog> page = blogService.query()
.eq("user_id", id).page(new Page<>(current, SystemConstants.MAX_PAGE_SIZE));
// 获取当前页数据
List<Blog> records = page.getRecords();
return Result.ok(records);
}
```

改造FollowServiceImpl的关注功能代码：

```java
@Override
public Result follow(Long followUserId, Boolean isFollow) {
// 1.获取登录用户
Long userId = UserHolder.getUser().getId();
String key = "follows:" + userId;
// 1.判断到底是关注还是取关
if (isFollow) {
// 2.关注，新增数据
Follow follow = new Follow();
follow.setUserId(userId);
follow.setFollowUserId(followUserId);
boolean isSuccess = save(follow);
if (isSuccess) {
// 把关注用户的id，放入redis的set集合 sadd userId followerUserId
stringRedisTemplate.opsForSet().add(key, followUserId.toString());
}
} else {
// 3.取关，删除 delete from tb_follow where user_id = ? and follow_user_id = ?
boolean isSuccess = remove(new QueryWrapper<Follow>()
.eq("user_id", userId).eq("follow_user_id", followUserId));
if (isSuccess) {
// 把关注用户的id从Redis集合中移除
stringRedisTemplate.opsForSet().remove(key, followUserId.toString());
}
}
return Result.ok();
}
```

FollowController新增followCommons方法：

```java
@GetMapping("/common/{id}")
public Result followCommons(@PathVariable Long id){
return followService.followCommons(id);
}
```

FollowServiceImpl新增followCommons方法：

```java
@Resource
private IUserService userService;

@Override
public Result followCommons(Long id) {
// 1.获取当前用户
Long userId = UserHolder.getUser().getId();
String key = "follows:" + userId;
// 2.求交集
String key2 = "follows:" + id;
Set<String> intersect = stringRedisTemplate.opsForSet().intersect(key, key2);
if (intersect == null || intersect.isEmpty()) {
// 无交集
return Result.ok(Collections.emptyList());
}
// 3.解析id集合
List<Long> ids = intersect.stream().map(Long::valueOf).collect(Collectors.toList());
// 4.查询用户
List<UserDTO> users = userService.listByIds(ids)
.stream()
.map(user -> BeanUtil.copyProperties(user, UserDTO.class))
.collect(Collectors.toList());
return Result.ok(users);
}
```

### 7.3 关注推送

### 7.3.1 Feed流

推送就是把消息推送给用户，使用户可以及时看到消息，而关注推送就是用户如果发布了一篇笔记，就把这篇笔记推送给所有的粉丝，为用户提供沉侵式体验，通过无限下拉刷新获取新的消息，也叫**Feed流**。

Feed流的实现有两种模式：

**Timeline**：不做内容筛选，简单的按照内容发布时间排序，常用于好友或关注。例如朋友圈

优点：信息全面，不会有缺失。并且实现也相对简单

缺点：信息噪音较多，用户不一定感兴趣，内容获取效率低

**智能排序**：利用智能算法屏蔽掉违规的、用户不感兴趣的内容。推送用户感兴趣信息来吸引用户

优点：投喂用户感兴趣信息，用户粘度很高，容易沉迷

缺点：如果算法不精准，可能起到反作用

本例基于关注的好友来做Feed流，所以采用Timeline模式。Timeline模式的实现模式有三种：

### 拉模式

拉模式也叫读扩散，比如：张三、李四、王五各自有自己的发件箱，发送消息发送到自己的发件箱，如果赵六要读取，需要拉取三个人的发件箱信息到自己的收件箱，然后按照时间排序，读取完清除。

<div class="img-wrap-left"><img class="left-img" src="/assets/img/redis/2/image74.png" alt="image74.png"></div>

优点：节约空间，没有重复读取，读完清除

缺点：比较延迟，每次读取都要拉取，如果关注的人多，会造成压力

### 推模式

推模式也叫写扩散，比如：每个粉丝都有自己的收件箱，张三或李四发布内容要推送到所有粉丝的收件箱里。

<div class="img-wrap-left"><img class="left-img" src="/assets/img/redis/2/image75.png" alt="image75.png"></div>

优点：时效快，不用临时拉取

缺点：内存压力大，如果粉丝很多就会推送麻烦

### 推拉结合模式

推拉结合模式也叫读写混合，兼具推和拉两种模式的优点，比如：普通用户粉丝少，就可以直接把消息推动给所有粉丝，而大V粉丝多，有一个自己的发件箱，发送消息写入发件箱的同时推送给活跃的粉丝，不活跃的粉丝查看时自己从发件箱读。

<div class="img-wrap-left"><img class="left-img" src="/assets/img/redis/2/image76.png" alt="image76.png"></div>

Timeline模式三种实现模式对比：

|            |      |           |             |
| ---------- | ---- | --------- | ----------- |
|            | 拉模式  | 推模式       | 推拉模式        |
| **写比例**    | 低    | 高         | 中           |
| **读比例**    | 高    | 低         | 中           |
| **用户读取延迟** | 高    | 低         | 低           |
| **实现难度**   | 复杂   | 简单        | 很复杂         |
| **使用场景**   | 很少使用 | 用户量少，没有大V | 过千万的用户量，有大V |

### 7.3.2 推送到粉丝收件箱

需求：

修改新增探店笔记的业务，在保存blog到数据库的同时，推送到粉丝的收件箱

收件箱满足可以根据时间戳排序，必须用Redis的数据结构实现

查询收件箱数据时，可以实现分页查询

### 思路分析

以传统的分页查询为例，如下图，t1时刻查询第一页数据到6，t2时刻Feed流推送了新的消息11，t3时再查询第二页数据理论上应该从5开始，但是实际是从6开始，所以原始的分页查询不适用，此时就要用到**滚动分页查询**。

<div class="img-wrap-left"><img class="left-img" src="/assets/img/redis/2/image77.png" alt="image77.png"></div>

如下图，采用滚动分页时，t1时刻查询到6，此时记录下这一次查询的最后值6，t2时刻Feed流推动了新的消息11，但是此时我们从上一次查询的最后值6往后分页查询，就查询到了正确的数据。

<div class="img-wrap-left"><img class="left-img" src="/assets/img/redis/2/image78.png" alt="image78.png"></div>

考虑到Set集合只能通过索引分页，所以这里使用SortedSet集合实现，以时间戳为score，每次记录最后的时间戳score，下次从这里开始，用到的命令如下：

```powershell
ZREVRANGEBYSCORE key max min [WITHSCORES] [LIMIT offset count]
```

key：集合名称

max：分数的上限，包含该值

min：分数的下限，包含该值

WITHSCORES：返回成员是否要包含其分数，加上表示包含

LIMIT：用于分页，offset表示起始位置（从0开始），count表示返回几条数据

经过分析，本次案例参数的设置如下：

max：第一页使用当前时间戳，其他页使用上一次查询的最小时间戳

min：0

offset：第一次使用0，后面使用上一次结果中与最小值一样的元素的个数

count：3

### 代码实现

修改BlogController的saveBlog方法：

```java
@PostMapping
public Result saveBlog(@RequestBody Blog blog) {
return blogService.saveBlog(blog);
}
```

BlogServiceImpl类添加saveBlog方法：

```java
@Resource
private IFollowService followService;

@Override
public Result saveBlog(Blog blog) {
// 1.获取登录用户
UserDTO user = UserHolder.getUser();
blog.setUserId(user.getId());
// 2.保存探店笔记
boolean isSuccess = save(blog);
if (!isSuccess) {
return Result.fail("新增笔记失败!");
}
// 3.查询笔记作者的所有粉丝 select * from tb_follow where follow_user_id = ?
List<Follow> follows = followService.query().eq("follow_user_id", user.getId()).list();
// 4.推送笔记id给所有粉丝
for (Follow follow : follows) {
// 4.1.获取粉丝id
Long userId = follow.getUserId();
// 4.2.推送
String key = RedisConstants.FEED_KEY + userId;
stringRedisTemplate.opsForZSet().add(key, blog.getId().toString(), System.currentTimeMillis());
}
// 5.返回id
return Result.ok(blog.getId());
}
```

### 7.3.3 实现分页查询收邮箱

<div class="img-wrap-left"><img class="left-img" src="/assets/img/redis/2/image79.png" alt="image79.png"></div>

在dto包下创建实体类ScrollResult（已经实现）：

```java
@Data
public class ScrollResult {
private List<?> list;
private Long minTime;
private Integer offset;
}
```

BlogController新增queryBlogOfFollow方法：

```java
@GetMapping("/of/follow")
public Result queryBlogOfFollow(@RequestParam("lastId") Long max,@RequestParam(value = "offset",defaultValue = "0") Integer offset){
return blogService.queryBloyOfFollow(max,offset);
}
```

BlogServiceImpl类新增queryBlogOfFollow方法：

```java
@Override
public Result queryBloyOfFollow(Long max, Integer offset) {
// 1.获取当前用户
Long userId = UserHolder.getUser().getId();
// 2.查询收件箱 ZREVRANGEBYSCORE key Max Min LIMIT offset count
String key = RedisConstants.FEED_KEY + userId;
Set<ZSetOperations.TypedTuple<String>> typedTuples = stringRedisTemplate.opsForZSet()
.reverseRangeByScoreWithScores(key, 0, max, offset, 2);
// 3.非空判断
if (typedTuples == null || typedTuples.isEmpty()) {
return Result.ok();
}
// 4.解析数据：blogId、minTime（时间戳）、offset
List<Long> ids = new ArrayList<>(typedTuples.size());
long minTime = 0;
int os = 1;
for (ZSetOperations.TypedTuple<String> tuple : typedTuples) {
// 4.1.获取id
ids.add(Long.valueOf(tuple.getValue()));
// 4.2.获取分数(时间戳）
long time = tuple.getScore().longValue();
if (time == minTime) {
os++;
} else {
minTime = time;
os = 1;
}
}
// 5.根据id查询blog
String idStr = StrUtil.join(",", ids);
List<Blog> blogs = query().in("id", ids).last("ORDER BY FIELD(id," + idStr + ")").list();
for (Blog blog : blogs) {
// 5.1.查询blog有关的用户
queryBlogUser(blog);
// 5.2.查询blog是否被点赞
isBlogLiked(blog);
}
// 6.封装并返回
ScrollResult r = new ScrollResult();
r.setList(blogs);
r.setOffset(os);
r.setMinTime(minTime);
return Result.ok(r);
}
```

## 8.附近商户

### 8.1 GEO数据结构

Redis引入了对GEO的支持，用于存储地理坐标信息，帮助我们通过经纬度检索数据。GEO常用命令如下：

GEOADD：添加一个地理空间信息，包含：经度（longitude）、纬度（latitude）、值（member）

GEODIST：计算指定的两个点之间的距离并返回

GEOHASH：将指定member的坐标转为hash字符串形式并返回

GEOPOS：返回指定member的坐标

~~GEORADIUS~~：指定圆心、半径，找到该圆内包含的所有member，并按照与圆心之间的距离排序后返回。6.以后已废弃

GEOSEARCH：在指定范围内搜索member，并按照与指定点之间的距离排序后返回。范围可以是圆形或矩形。6.2.新功能

GEOSEARCHSTORE：与GEOSEARCH功能一致，不过可以把结果存储到一个指定的key。 6.2.新功能

### 8.2 导入店铺数据到GEO

首页点击某个频道，即可按照距离显示各个频道的店铺信息：

<div class="img-wrap-left"><img class="left-img" src="/assets/img/redis/2/image80.png" alt="image80.png"></div>

现在的问题是怎么合理设置Redis的结构，我们可以以商铺类型id作为键key，key中存放每个店铺的坐标，店铺的值就使用店铺id，这样查询时只需要根据类型到指定key中查找店铺与当前位置的距离即可。

编写测试单元，导入店铺的坐标数据（对应tb_shop表的x、y字段）到Redis：

```java
@Test
void loadShopData() {
// 1.查询店铺信息
List<Shop> list = shopService.list();
// 2.把店铺分组，按照typeId分组，typeId一致的放到一个集合
Map<Long, List<Shop>> map = list.stream().collect(Collectors.groupingBy(Shop::getTypeId));
// 3.分批完成写入Redis
for (Map.Entry<Long, List<Shop>> entry : map.entrySet()) {
// 3.1.获取类型id
Long typeId = entry.getKey();
String key = RedisConstants.SHOP_GEO_KEY + typeId;
// 3.2.获取同类型的店铺的集合
List<Shop> value = entry.getValue();
List<RedisGeoCommands.GeoLocation<String>> locations = new ArrayList<>(value.size());
// 3.3.写入redis GEOADD key 经度 纬度 member
for (Shop shop : value) {
// stringRedisTemplate.opsForGeo().add(key, new Point(shop.getX(), shop.getY()), shop.getId().toString());
locations.add(new RedisGeoCommands.GeoLocation<>(
shop.getId().toString(),
new Point(shop.getX(), shop.getY())
));
}
stringRedisTemplate.opsForGeo().add(key, locations);
}
}
```

### 8.3 实现附近商户功能

由于SpringDataRedis2.3.9版本并不支持Redis 6.2提供的GEOSEARCH命令，因此需要修改POM：

```xml
<dependency>
<groupId>org.springframework.boot</groupId>
<artifactId>spring-boot-starter-data-redis</artifactId>
<exclusions>
<exclusion>
<artifactId>spring-data-redis</artifactId>
<groupId>org.springframework.data</groupId>
</exclusion>
<exclusion>
<artifactId>lettuce-core</artifactId>
<groupId>io.lettuce</groupId>
</exclusion>
</exclusions>
</dependency>
<dependency>
<groupId>org.springframework.data</groupId>
<artifactId>spring-data-redis</artifactId>
<version>2.6.2</version>
</dependency>
<dependency>
<groupId>io.lettuce</groupId>
<artifactId>lettuce-core</artifactId>
<version>6.1.6.RELEASE</version>
</dependency>
```

修改ShopController的queryShopByType方法：

```java
@GetMapping("/of/type")
public Result queryShopByType(
@RequestParam("typeId") Integer typeId,
@RequestParam(value = "current", defaultValue = "1") Integer current,
@RequestParam(value = "x", required = false) Double x,
@RequestParam(value = "y", required = false) Double y
) {
return shopService.queryShopByType(typeId, current, x, y);
}
```

ShopServiceImpl新增queryShopByType方法：

```java
@Override
public Result queryShopByType(Integer typeId, Integer current, Double x, Double y) {
// 1.判断是否需要根据坐标查询
if (x == null || y == null) {
// 不需要坐标查询，按数据库查询
Page<Shop> page = query()
.eq("type_id", typeId)
.page(new Page<>(current, SystemConstants.DEFAULT_PAGE_SIZE));
// 返回数据
return Result.ok(page.getRecords());
}

// 2.计算分页参数
int from = (current - 1) * SystemConstants.DEFAULT_PAGE_SIZE;
int end = current * SystemConstants.DEFAULT_PAGE_SIZE;

// 3.查询redis、按照距离排序、分页。结果：shopId、distance
String key = RedisConstants.SHOP_GEO_KEY + typeId;
GeoResults<RedisGeoCommands.GeoLocation<String>> results = stringRedisTemplate.opsForGeo() // GEOSEARCH key BYLONLAT x y BYRADIUS 10 WITHDISTANCE
.search(
key,
GeoReference.fromCoordinate(x, y),
new Distance(5000),
RedisGeoCommands.GeoSearchCommandArgs.newGeoSearchArgs().includeDistance().limit(end)
);
// 4.解析出id
if (results == null) {
return Result.ok(Collections.emptyList());
}
List<GeoResult<RedisGeoCommands.GeoLocation<String>>> list = results.getContent();
if (list.size() <= from) {
// 没有下一页了，结束
return Result.ok(Collections.emptyList());
}
// 4.1.截取 from ~ end的部分
List<Long> ids = new ArrayList<>(list.size());
Map<String, Distance> distanceMap = new HashMap<>(list.size());
list.stream().skip(from).forEach(result -> {
// 4.2.获取店铺id
String shopIdStr = result.getContent().getName();
ids.add(Long.valueOf(shopIdStr));
// 4.3.获取距离
Distance distance = result.getDistance();
distanceMap.put(shopIdStr, distance);
});
// 5.根据id查询Shop
String idStr = StrUtil.join(",", ids);
List<Shop> shops = query().in("id", ids).last("ORDER BY FIELD(id," + idStr + ")").list();
for (Shop shop : shops) {
shop.setDistance(distanceMap.get(shop.getId().toString()).getValue());
}
// 6.返回
return Result.ok(shops);
}
```

## 9.用户签到

虽然可以使用tb_sign表存储用户的签到信息，但是每一次签到都要记录一条记录，对于巨大的用户和频繁的签到，那记录的数据量是难以想象的，所以，可以用一串由0、1构成的字符串存储用户这个月的签到情况，一个位置代表一天，0表示未签到，1表示已签到，这种思想也被成为**位图**。

<div class="img-wrap-left"><img class="left-img" src="/assets/img/redis/2/image81.png" alt="image81.png"></div>

### 9.1 BitMap

Redis提供了利用String类型数据结构实现位图的BitMap，最大上限是512M，转换为bit则是 2^32个bit位。

BitMap的操作命令：

SETBIT：向指定位置（offset）存入一个0或1

GETBIT ：获取指定位置（offset）的bit值

BITCOUNT ：统计BitMap中值为1的bit位的数量

BITFIELD ：操作（查询、修改、自增）BitMap中bit数组中的指定位置（offset）的值

BITFIELD_RO ：获取BitMap中bit数组，并以十进制形式返回

BITOP ：将多个BitMap的结果做位运算（与 、或、异或）

BITPOS ：查找bit数组中指定范围内第一个0或1出现的位置

BITFIELD完整命令格式如下：

```powershell
BITFIELD key [GET type offset] [SET type offset value] [INCRBY type offset increment] [OVERFLOW WRAP|SAT|FAIL]
```

key：要操作的字符串键

子命令（可同时包含多个，按顺序执行）：

GET type offset：读取指定偏移量（从0开始）处、指定类型的位值，返回读取的位值

SET type offset value：将指定偏移量处、指定类型的位值设置为value

INCRBY type offset increment：对指定偏移量处、指定类型的位值进行自增（increment可正可负）

OVERFLOW WRAP|SAT|FAIL：可选参数，指定INCRBY操作的溢出策略（默认WRAP）：

WRAP：溢出时循环（如无符号整数溢出后从 0 重新开始）

SAT：饱和模式（溢出时保持最大值 / 最小值，不循环）

FAIL：溢出时返回错误，不执行操作

type用于指定位操作的位宽和符号属性，格式为 [u|i]<bits>：

u<bits>：无符号整数，bits可为 1~64（如 u8 表示 8 位无符号整数）

i<bits>：有符号整数，bits可为 1~63（如 i16 表示 16 位有符号整数）

例如BITFIELD field1 GET u3 1表示field1中从第2位开始，读取3位，返回二进制结果对应的无符号整数。

### 9.2 实现签到功能

请求方式：POST

请求路径：/user/sign

请求参数和返回值均无

UserController新增sign方法：

```java
@PostMapping("/sign")
public Result sign() {
return userService.sign();
}
```

UserServiceImpl类新增sign方法：

```java
@Override
public Result sign() {
// 1.获取当前登录用户
Long userId = UserHolder.getUser().getId();
// 2.获取日期
LocalDateTime now = LocalDateTime.now();
// 3.拼接key
String keySuffix = now.format(DateTimeFormatter.ofPattern(":yyyyMM"));
String key = RedisConstants.USER_SIGN_KEY + userId + keySuffix;
// 4.获取今天是本月的第几天
int dayOfMonth = now.getDayOfMonth();
// 5.写入Redis SETBIT key offset 1
stringRedisTemplate.opsForValue().setBit(key, dayOfMonth - 1, true);
return Result.ok();
}
```

### 9.3 签到统计

签到统计就是统计从今天开始往前倒数用户本月连续签到的天数，请求信息如下：

请求方式：GET

请求路径：/user/sign/count

请求参数：无

返回值：连续签到的天数

怎么查到到现在为止用户本月的所有签到次数呢，方法是使用BITFIELD key GET u[dayOfMonth] 0命令，其中dayOfMonth表示今天是本月的第几天，通俗讲就是几号；由于GET得到的是一个十进制整数，怎么得到最后一比特位，方法是和1进行与运算，得到的结果就是最后一比特位。

UserController新增signCount方法：

```java
@GetMapping("/sign/count")
public Result signCount() {
return userService.signCount();
}
```

UserServiceImpl新增signCount方法：

```java
@Override
public Result signCount() {
// 1.获取当前登录用户
Long userId = UserHolder.getUser().getId();
// 2.获取日期
LocalDateTime now = LocalDateTime.now();
// 3.拼接key
String keySuffix = now.format(DateTimeFormatter.ofPattern(":yyyyMM"));
String key = RedisConstants.USER_SIGN_KEY + userId + keySuffix;
// 4.获取今天是本月的第几天
int dayOfMonth = now.getDayOfMonth();
// 5.获取本月截止今天为止的所有的签到记录，返回的是一个十进制的数字 BITFIELD sign:5:202203 GET u14 0
List<Long> result = stringRedisTemplate.opsForValue().bitField(
key,
BitFieldSubCommands.create()
.get(BitFieldSubCommands.BitFieldType.unsigned(dayOfMonth)).valueAt(0)
);
if (result == null || result.isEmpty()) {
// 没有任何签到结果
return Result.ok(0);
}
Long num = result.get(0);
if (num == null || num == 0) {
return Result.ok(0);
}
// 6.循环遍历
int count = 0;
while (true) {
// 6.1.让这个数字与1做与运算，得到数字的最后一个bit位 // 判断这个bit位是否为0
if ((num & 1) == 0) {
// 如果为0，说明未签到，结束
break;
} else {
// 如果不为0，说明已签到，计数器+1
count++;
}
// 把数字右移一位，抛弃最后一个bit位，继续下一个bit位
num >>>= 1;
}
return Result.ok(count);
}
```

## 10.UV统计

UV：也叫独立访客量，指通过互联网访问、浏览这个网页的自然人。1天内同一个用户多次访问该网站，只记录1次

PV：也叫页面访问量或点击量，用户每访问网站的一个页面，记录1次PV，用户多次打开页面，则记录多次PV。往往用来衡量网站的流量

一般来说PV比UV要大得多，如果每次访问都保存到Redis，那么对内存是极大的消耗，为了解决这个问题，可以使用Redis提供的Hyperloglog统计。

### 10.1 HyperLogLog

HyperLogLog（HLL）是从Loglog算法派生的概率算法，用于确定非常大的集合的基数，而不需要存储其所有值。

Redis中的HLL是基于String实现的，单个HLL内存**永远小于16kb，内存占用极低**，但是测量结果不一定准确，有小于0.81％的误差。

原理可以参考网站：

**[该类型的内容暂不支持下载]**

HyperLogLog常用命令：

PFADD key element [element ...] ：向HyperLogLog中添加元素，重复的元素只添加一个

PFCOUNT key [key ...] ：统计HyperLogLog中存放的元素的个数，只是粗略统计，结果不一定准确

PFMERGE destkey sourcekey [sourcekey ...] ：合并多个HyperLogLog，相当于Set集合求并集

### 10.2 测试百万数据的统计

编写测试单元测试100万个数据的统计量：

```java
@Test
void testHyperLogLog() {
//准备数组，装存储到HLL中的数据
String[] values = new String[1000];
//数组角标
int j = 0;
for (int i = 0; i < 1000000; i++) {
//计算角标
j = i % 1000;
//得到HLL中的数据
values[j] = "user_" + i;
//每1000条发送一次
if (j == 999) {
stringRedisTemplate.opsForHyperLogLog().add("hll2", values);
}
}
//统计数量
Long size = stringRedisTemplate.opsForHyperLogLog().size("hll2");
System.out.println("size = " + size);
}
```

从结果可以看到插入了100万条数据到HLL，但是却统计出997593，说明HLL有一定误差，但是误差还是可以接受。
