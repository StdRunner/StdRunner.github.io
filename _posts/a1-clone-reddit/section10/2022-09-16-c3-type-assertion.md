---
layout: post
title: Type Assertion
date: 2022-09-16
updated: 
tags: [typescript]
menu: clone-reddit
---
## Type Assertion
Typescript가 추론한 타입을 얼마든지 변경 가능하다.   
이 때 사용되는 매커니즘이 Type Assertion이다.   
`개발자가 컴파일러에게 내가 너보다 타입을 더 잘 알고있다. 의심하지 마`라고    
말하는 것과 같다.

Type Assertion을 사용하면 값의 타입을 설정하고, 컴파일러에 이를 유추하지 않도록 지시할 수 있다.    

아래의 경우 컴파일러는 foo type이 속성이 없는 {} 라고 추론하므로 컴파일 에러 발생
```javascript
let foo = {};
foo.bar = 123;
foo.bas = 'hello';
```

다음 경우 Type Assertion 사용하여 컴파일 에러를 피할 수 있다.
```javascript
interface Foo {
  bar: number;
  bas: string;
}

var foo = {} as Foo;
foo.bar = 123;
foo.bas = 'hello';
```