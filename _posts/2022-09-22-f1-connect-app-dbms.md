---
layout: post
title: Reddit 애플리케이션과 Postgresql 연결
date: 2022-09-23
updated: 
tags: [node-js, postgresql]
menu: clone-reddit
---
## 필요한 모듈
#### pg
Postgresql 데이터베이스와 인터페이스하기 위한 Node.js 모듈 모음이다.
일련의 명령어나 함수, 옵션, 프로그램 언어에 의해 제공되는 명령어나 데이터를 표현하기 위한 다른 방법들로 구성되는 프로그래밍 인터페이스.

간단하게 말해서 Postgresql 데이터베이스를 Node.js에서 사용할 수 있게 도와주는 모듈.    
callbacks, promises, connecting pooling, C/C++, bindings 등등

#### typeorm
typescript 및 javascript(ES5, ES6, ES7, ES8)와 함께 사용할 수 있는 Node JS에서 실행되는 ORM 이다.

#### reflect-metadata
typeorm에서 런타임 시 타입들을 파악하고, Decorator를 사용할 수 있게 해주는 용도.

아래 npm 명령을 사용해 필요한 모듈을 모두 받아준다.
```
npm install pg typeorm reflect-metadata --save
```

- - -

## typeorm 설정파일 생성 및 변경
아래 명령을 사용하여 typeorm을 사용하기 위한 설정파일을 생성(초기화) 해준다.
```
npx typeorm init
```

생성된 설정 파일들을 포함한 프로젝트 구조는 다음과 같다.
```
MyProject   
┣━━━━━━ src   
┃        ┣━━━ entity (entities로 변경)
┃        ┃     ┣━━━ User.ts   
┃        ┣━━━ migration   
┃        ┣━━━ data-source.ts  // typeorm 설정을 위한 파일
┃        ┗━━━ index.ts   
┣━━━━━━ .gitignore   
┣━━━━━━ package.json   
┣━━━━━━ README.md   
┗━━━━━━ tsconfig.json
```

그리고 `data-source.ts` 파일을 아래와 같이 Postgresql Docker Container 정보로 변경해준다.   
JDBC의 접속정보를 입력한다고 생각하면 이해가 쉽다.
```typescript
import "reflect-metadata"
import { DataSource } from "typeorm"

export const AppDataSource = new DataSource({
    type: "postgres",
    host: "localhost",
    port: 5432,
    username: "postgres",
    password: "1234",
    database: "postgres",
    synchronize: true,
    logging: false,
    entities: ["src/entities/**/*.ts"],
    migrations: [],
    subscribers: [],
})
```

- - -

## Node.js 서버 기동 시 Database 연결 처리
Node.js 서버의 도입부 였던 `/src/server.ts` 파일을 아래와 같이 수정한다.   
***(수정 부분에 대해 주석 추가)***
```typescript
// 필요 npm 모듈 import
import express from "express";
import morgan from "morgan";

// [추가 내용]
// 앞서 수정한 data-source.ts 파일의 AppDataSource import
import { AppDataSource } from "./data-source";

const app = express();

app.use(express.json());
/**
 * morgan : node.js 백엔드 서버 사용 시 로그 미들웨어
 *  - dev
 *  - short
 *  - tiny
 */
app.use(morgan(""));
// app.get의 url로 접속 시 해당 블록 코드 실행
// Controller
app.get("/", (_, res) => res.send("running"));

let port = 5000;
// app.listen의 포트로 접속하면 해당 블록 코드 실행
app.listen(port, async () => {
    console.log(`Server running at http://localhost:${port}`);

    // [추가 내용]
    // Node.js app 실행 후 AppDataSource를 사용해 Database 연결
    AppDataSource.initialize().then(async () => {
        console.log("database initialize")
    }).catch(error => console.log(error))

})
```

로컬 환경에서 Node.js 서버 빌드와 `http://localhost:5000`으로 접속 시 
에러없이 정상적으로 페이지가 출력되면 Node.js와 Database 연결은 끝이 난다.
***(Database 연결을 위해서는 Postgresql Docker Container가 기동중이어야 한다.)***