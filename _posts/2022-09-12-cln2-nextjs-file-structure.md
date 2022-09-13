---
layout: post
title: Next JS 기본 파일 구조
date: 2022-09-12
updated: 
tags: next-js
menu: clone-reddit
---
## Next JS 기본 파일 구조
`npx create-next-app@latest --typescript` 명령을 사용하여 Next JS app을 생성하면    
아래와 같은 폴더 구조를 갖게된다. Next JS App의 기본 폴더 구조에 대해 알아보자.

<img src="\assets\img\posts\nextjs-file-structure\nextjs_app.png" style="border: 1px solid gray;" />

#### pages 폴더
pages 폴더 내에 Application 페이지들을 생성.   
index.tsx가 처름 ***"/"(루트)*** 페이지가 된다.

***_app.tsx***는 공통되는 레이아웃을 작성. (header, footer와 같은)   
URL을 통해 특정 페이지에 진입하기 전 통과하는 인터셉터 페이지.
모든 페이지에 공통으로 포함되는 컴포넌트를 넣어주려면 여기에 넣어주면 된다.

만약 ***/about*** 이라는 페이지를 만드려면 pages 폴더 안에 about.tsx 파일을 생성하면 된다.

#### public 폴더
다른 App 구조와 유사하게 이미지 같은 정적(static) 에셋들을 보관한다.

#### styles 폴더
말 그대로 ***스타일링***을 처리해주는 폴더   

모듈 css는 컴포넌트 종속적으로 스타일링하기 위한 것이며, 확장자 앞에 module을 붙여줘야 한다.
```
Home.module.css
```

#### next.config.js 파일
Next JS는 웹팩을 기본 번들러로 사용한다.   
그래서 웹팩에 관한 설정들을 이 파일에서 해줄 수 있다.

#### tsconfig.json 파일
Next JS App에서 현재 Typescript를 사용중이므로   
Typescript에 대한 설정파일이다.