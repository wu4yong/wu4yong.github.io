---
title: TypeScript-TS面向对象支持
date: 2018-04-20 15:00:00
categories:
  - web
tags:
  - web
---

<div class="essay-banner essay-ts"></div>

# TypeScript

## TS 类

- 三大特性: 继承，封装，多态

## 一、类属性

### 1.1 属性的声明与类型标注

```ts
class Point {
  x: number;
  y: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }
}

const pt = new Point(1, 2);
```

### 1.2 只读属性

```ts
class Point {
  readonly x: number; // 声明只读属性
  y: number;

  constructor(x: number, y: number) {
    this.x = x; // 构造函数中可以修改只读属性
    this.y = y;
  }

  add() {
    // 非构造函数中，无法未只读属性赋值
    this.x = 1; // 无法为“x”赋值，因为它是只读属性。ts(2540)
    this.y = 2;
  }
}
```

## 二、成员可见性修饰符

1. public: 默认修饰符, 在任何地方可见
2. private: 私有属性, 只能在类的内部访问(只能做到编译期的保护，运行时保护需要使用闭包、#私有)
3. protected: 受保护的属性, 在类的内部和子类中可以被访问
4. readonly: 只读属性, 可以在构造器里面赋值，但是赋值之后就不可以再修改了
5. abstract: 关键字来定义抽象类和抽象方法
6. static: 是静态属性，可以理解为是类上的一些常量，实例不能访问

## 三、extends

- 通过 extends 来继承类
- 类可能来自基类，派生类具有基类的所有属性和方法，还可以定义额外的成员
- 派生类也可以覆盖基类字段或者属性，TS 强制派生类始终是其基类的子类型

## 四、implements

- 通过 implements 来实现接口
- implements 子句只是检查类可以被视为接口类型，它根本不会改变类的类型或者方法

## 五、this

- TS 不会改变 this 的行为

```ts
class MyClass {
  name = "MyClass";
  getName() {
    return this.name;
  }
}
const c = new MyClass();
const obj = {
  name: "obj",
  getName: c.getName,
};

// Prints "obj", not "MyClass"
console.log(obj.getName());
```

## 六、参数属性

```ts
class Prams {
  // TS  专有语法
  // 将构造函数参数转换为具有相同名称和值的类属性
  constructor(
    public readonly x: number,
    protected y: number,
    private z: number
  ) {}
}
const p = new Prams(1, 2, 3);
console.log(p);
```

## 七、类之间的关系

```ts
class Point1 {
  x = 0;
  y = 0;
}
 
class Point2 {
  x = 0;
  y = 0;
}
 
// OK 因为它俩的结构是相同的
const p: Point1 = new Point2();
```

```ts
class Person {
  name: string;
  age: number;
}
 
class Employee {
  name: string;
  age: number;
  salary: number;
}
 
// OK 即使没有显式继承、类之间的子类型关系也存在
const p: Person = new Employee();
```
