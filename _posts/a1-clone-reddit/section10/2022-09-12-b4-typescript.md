---
layout: post
title: Typescript 란?
date: 2022-09-12
updated: 
tags: [typescript]
menu: clone-reddit
---
## Typescript가 나오게 된 배경
Javascript는 본래 클라이언트 측 언어로 도입되었다. 그런데 Node.js의 개발로 인해 Javascript를 클라이언트 측 뿐 아니라   
서버 기술로도 활용가능해졌다.

그러나 코드가 커지고 복잡해져 코드를 유지관리/재사용하기 어려워지고,
***Type 검사 및 컴파일 시 오류 검사의 기능***을 수용하지 못하기 때문에 Javascript는 본격적인 서버 기술로
Enterprise, 기업 수준에서 성공하지 못하게 되었다.   

이 간극을 매우기 위해 Typescript가 제시되었다.

* * *

## Typescript란 ?
타입스크립트는 자바스크립트에 타입을 부여한 언어. 자바스크립트의 확장된 언어라고 볼 수 있다.   
타입스크립트는 자바스크립트와 달리 작성된 파일의 ***컴파일*** 과정을 수행해야 브라우저상에서 실행이 가능하다.
<img src="\assets\img\posts\typescript\typescript.png" style="border: 1px solid gray; width: 80%;" />

자바스크립트는 라인 단위로 읽어 수행하는 인터프리터 언어.

> Typescript
> > * Type System(형)   
* Javascript
<br>

#### Type System
* 개발환경에서 에러를 잡는걸 도와준다.
* type annotations를 사용해서 코드를 분석할 수 있다.
* 오직 개발 환경에서만 활성화 된다.
* 타입 스크립트와 성능 향상과는 관계가 없다.

#### TypeScript 사용하는 이유
- TypeScript는 JavaScript 코드를 단순화하여 더 쉽게 읽고 디버그할 수 있다.
- TypeScript는 오픈 소스.
- TypeScript는 정적 검사와 같은 JavaScript IDE 및 사례를 위한 매우 생산적인 개발 도구를 제공.
- TypeScript를 사용하면 코드를 더 쉽게 읽고 이해할 수 있다.
- TypeScript를 사용하면 일반 JavaScript보다 크게 개선할 수 있다.
- TypeScript는 ES6(ECMAScript 6)의 모든 이점과 더 많은 생산성을 제공.
- TypeScript는 코드 유형 검사를 통해 JavaScript를 작성할 때 개발자가 일반적으로 겪는 고통스러운 버그를 피하는 데 도움이 될 수 있다.