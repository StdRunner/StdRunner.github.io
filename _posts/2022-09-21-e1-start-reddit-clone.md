---
layout: post
title: Reddit Clone 프로젝트 시작
date: 2022-09-21
updated: 
tags: [next-js, node.js, vscode]
menu: clone-reddit
---
## Next.js App 생성
Reddit 프로젝트 폴더 구조를 다음과 같이 생성한다.   
* reddit-clone-app
  + client
  + server

Visual Studio Code (편집기)를 사용해 client 폴더 경로를 열고, 터미널을 실행한다.   
아래 명령어를 사용해 Next.js App을 client 폴더에 생성한다.
```
npx create-next-app@latest --typescript ./
```
<img src="\assets\img\posts\start-reddit-clone\create-next-app.png" style="border: 1px solid gray;" />

- - -
## Node.js 백엔드 서버 생성
Visual Studio Code (편집기)를 사용해 server 폴더 경로를 열고, 터미널을 실행한다.    
아래 명령어를 사용해 package.json 파일을 생성한다.   

```
npm init
```
명령어 입력 후 Node.js가 입력 사항을 요청하는데,   
Typescript를 사용할 것이므로 처음 실행할 서버의 시작부분을 다음과 같이 수정해서 입력.   
그 외에는 모두 enter치며 넘어가도 상관없다.
```
entry point: (index.js) server.ts
```

`package.json` 파일은 프로젝트 정보, 의존성(dependencies)를 관리하는 문서이다.   
패키지 설치시 여기 그 정보(이름, 버전)가 기록되며, 새 환경에서도 동일한 의존성을 사용할 수 있도록 돕는다.

`server` 폴더 하위에 Node.js 백엔드 서버의 시작 파일인 `server.ts` 파일을 생성해준다.

#### Node.js 백엔드 서버 구현을 위한 npm 모듈 설치
아래 설치 명령어를 사용해 각 npm 모듈을 설치한다.
```
npm isntall morgan nodemon express --save
npm install typescript ts-node @types/node @types/express @types/morgan --save-dev
```

* nodemon : 서버 변경정 발생 시 로컬 서버를 재시작하여 즉시 반영
* ts-noe : Node.js 상에서 Typescript Compiler를 통하지 않고도, 직접 Typescript를 실행시키는 역할
* morgan : Node.js 에서 사용되는 로그 관리를 위한 미들웨어
* @types/express @types/node : Express 및 Node.js에 대한 Type 정의에 도움이 된다.

#### Typescript에 대한 설정
아래 명령어를 사용해 `tsconfig.json` 파일을 생성한다.   
직접 생성해 내용을 채워도 무방하다.
```
npx tsc --init
```

`tsconfig.json` 파일은 typescript로 짜여진 코드를 javascript로 컴파일하는 옵션을 설정하는 파일이다.   
typescript 컴파일은 tsc 명령어를 사용한다.  

#### express 코드 작성
`server/src/` 경로를 생성하고, Node.js 도입부인 `server.ts` 파일을 이동한다.
`server.ts` 파일에 다음 내용을 작성하여 Node.js 실행 시 도입 부분을 정의한다.

```typescript
// 필요 npm 모듈 import
import express from "express";
import morgan from "morgan";

const app = express();

app.use(express.json());
/**
 * morgan : node.js 백엔드 서버 사용 시 로그 미들웨어
 *  - dev
 *  - short
 *  - common
 *  - combined
 */
app.use(morgan(""));
// app.get의 url로 접속 시 해당 블록 코드 실행
// Controller
app.get("/", (_, res) => res.send("running"));

let port = 5000;
// app.listen의 포트로 접속하면 해당 블록 코드 실행
app.listen(port, async () => {
    console.log(`Server running at http://localhost:${port}`);
})
```

#### Node.js 서버 실행을 위해 package.json 파일을 수정
package.json 파일을 아래와 같이 수정해   
서버 실행 스크립트의 Alias를 설정한다.

아까 설치한 nodemon과 ts-node를 이용해 서버를 시작하는 스크립트이다.
```json
"scripts": {
    "start": "ts-node src/server.ts",
    "dev": "nodemon --exec ts-node ./src/server.ts",
    "test": "echo \"Error: no test specified\" && exit 1"
},
```

Node.js 서버의 개발환경 실행 스크립트는 다음과 같다.
```
npm run dev
```

개발 환경 서버 정상 실행 시
<img src="\assets\img\posts\start-reddit-clone\run-node-svr.png" style="border: 1px solid gray; width: 60%" />

서버 정상 실행 후 `http://localhost:5000`으로 접속 시 `server.ts`에서 구현한 바와 같이   
아래 화면을 출력한다.
<img src="\assets\img\posts\start-reddit-clone\nodejs-page.png" style="border: 1px solid gray; width: 80%" />