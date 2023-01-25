---
layout: post
title: a02. React JS 설치 및 앱 생성
date: 2023-01-25
updated: 
tags: [react-js]
menu: react-js
---
## a02. React JS 설치 및 앱 생성
먼저 리액트 공식 페이지에 진입하고 중앙의 `시작하기` 버튼을 클릭한다.
* [리액트 공식 페이지](https://ko.reactjs.org/)

<img src="\assets\img\posts\reactjs\react-page.png" style="border: 1px solid gray">

우측 네비게이션 메뉴에서 `새로운 React 앱 만들기`를 클릭한다.
<img src="\assets\img\posts\reactjs\start-react.png" style="border: 1px solid gray">

`React JS` Application을 생성하기 위해서는 `Node JS`와 `npm` 설치가 필요하다.   
공식 페이지에서는 현재 `React JS` 공식 페이지에서는 `Node JS 14.0.0 이상`, `npm 5.6`을 설치하도록 명시하고 있다.
<img src="\assets\img\posts\reactjs\create-app.png" style="border: 1px solid gray">

`Node JS`와 `npm`, 편집기 설치는 오픈소스 또는 아래 포스트를 참고하기 바라며 내용은 생략한다.
* [리액트 설치를 위해서 필요한 것들(Node.js & Visual Studio Code)](https://stdrunner.github.io/2022/09/20/d1-for-make-reactpjt.html)

본인이 Application을 생성하고자 하는 경로의 터미널에서 아래 명령어를 입력하면 `React JS` Application을 생성할 수 있다.   
`APP_NAME`은 원하는대로 변경해도 무방하다.
```
npm create-react-app {APP_NAME}
```

Application 생성이 완료되면 터미널 경로에 `APP_NAME`으로 폴더가 생성되며 해당 폴더가 곧 `React JS` Application이 된다.   
Application 폴더로 진입하여 터미널에 아래 명령어를 입력하면 `React JS` Application을 로컬 환경에서 실행 가능하다.

```
npm start
```

`{APP_NAME}/package.json` 파일에 아래 내용으로 `React JS` Applicaiton 명령이 정의되어 있다.
```json
...생략
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test",
    "eject": "react-scripts eject"
  },

...생략
```

`React JS` Application이 정상 실행되면 터미널에 아래와 같은 내용이 출력된다.   
<img src="\assets\img\posts\reactjs\app-start.png" style="border: 1px solid gray; width: 50%">

`http://localhost:3000` 주소를 브라우저로 진입하면 로컬 환경의 `React JS` Application이 **정상 실행**된 것을 확인할 수 있다.
<img src="\assets\img\posts\reactjs\react-app.png" style="border: 1px solid gray; width: 80%">