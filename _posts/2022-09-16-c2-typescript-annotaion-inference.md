---
layout: post
title: Type Annotaton, Type Inference
date: 2022-09-16
updated: 
tags: [typescript]
menu: clone-reddit
---
## Type Annotaton, Type Inference
* Type Annotaton : 개발자가 타입을 타입스크립트에게 직접 말해주는 것
```javascript
var a: nubmer = 10;
```

* Type Inference : 타입 스크립트가 알아서 타입을 추론하는 것
```javascript
var a= 10;
```

1. var    : 선언
2. a      : 변수
3. `:`    : Annotate  
4. number : Data Type
5. 10     : 초기화
<img src="\assets\img\posts\anno-infer\init-var.png" style="border: 1px solid gray; width: 40%;" />

#### 타입을 추론하지 못해서 Annotation을 꼭 해줘야 하는 경우
* **any 타입을 리턴하는 경우**    
  아래의 경우 개발자의 입장에서는 json 데이터의 키, 값이 어떤 타입인지 추론 가능하지만,   
  Typescript는 이를 지원하지 않으므로 Annotation을 꼭 해줘야 한다.
```javascript
const json = '{"x" : 4, "y" : 7}'
const coordinates = JSON.parse(json);
console.log(coordinates);
```

* **변수 선언을 먼저하고 나중에 초기화하는 경우**    
선언과 동시에 초기화하면 타입을 추론하지만,   
나중에 초기화하는 경우 추로할 수 없다.
```javascript
let greeting
greeting = 'hello';
```

* **변수에 대입될 값이 일정치 못한 경우**    
변수의 타입이 조건에 따라 변동될 가능성이 있는 경우로   
변수 a가 조건에 따라 boolean, nubmer로 변경될 수 있는 경우 Annotation이 필요하다.
<img src="\assets\img\posts\anno-infer\multi-type.png" style="border: 1px solid gray; width: 40%;" />