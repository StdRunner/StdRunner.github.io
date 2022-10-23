---
layout: post
title: 커뮤니티 생성 페이지 기능 만들기, User/Auth 미들웨어 생성하기
date: 2022-10-19
updated: 
tags: [typescript, next-js, tailwindcss]
menu: clone-reddit
---
## State 생성
`reddit-clone-app\client\src\pages\subs\create.tsx` 파일에서 이전에 UI를 위한 템플릿을 작성했다.   
UI의 기능 구현을 위해 State를 선언하고 필요 모듈을 import한다.

```typescript
// 필요 모듈 선언 useRouter, useState, axios
import axios from 'axios';
import { useRouter } from 'next/router';
import React, { FormEvent, useState } from 'react'
import InputGroup from '../../components/InputGroup'

const SubCreate = () => {
    // 사용 state 선언
    const [name, setName] = useState("");
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [errors, setErrors] = useState<any>("");
...생략
```

- - - 

## handleSubmit 함수 생성
이후 커뮤니티 생성 UI Form을 Submit했을 때 onSubmit이벤트에서 실행하게 될   
`handleSubmit` 함수를 생성해준다.

```typescript
import axios from 'axios';
import { useRouter } from 'next/router';
import React, { FormEvent, useState } from 'react'
import InputGroup from '../../components/InputGroup'

const SubCreate = () => {
    const [name, setName] = useState("");
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [errors, setErrors] = useState<any>("");
    let router = useRouter();

    // onSubmit 이벤트 시 실행
    const  handleSubmit = async (event: FormEvent) => {
        event.preventDefault();

        try {
            const res = await axios.post("/subs", { name, title, description })

            router.push(`/r/${res.data.name}`);
        } catch (error: any) {
            console.log(error);
            setErrors(error.reponse.data)
        }
    }

        
    return (
        <div className='flex flex-col justify-center pt-16'>
            <div className='w-10/12 mx-auto md:w-96'>
                <h1 className=',b-2 text-lg font-medium'>
                    커뮤니티 만들기
                </h1>
                <hr />
                // handleSubmit함수 실행 부분
                <form onSubmit={handleSubmit}>
                ...생략
```

- - - 

## API 생성
onSubmit 이벤트에서 실행되는 `/subs` 요청을 구현할 API 부분을 Node.js 서버에서 생성해줘야 한다.
`reddit-clone-app\server\src\routes\subs.ts` 파일을 생성해주고 아래 내용을 입력한다.   
주석처리된 부분이 기 구현된, 앞으로 구현할 로직이다.

```typescript
import { Request, Response, Router } from "express";
import jwt from "jsonwebtoken";
import { User } from "../entities/User";


const createSub = async (req: Request, res: Response, next) => {
    const {name, title, description} = req.body;

    // 먼저 Subs를 생성할 수 있는 유저인지 체크를 위해 유저 정보 가져오기 (요청에서 보내주는 토큰을 이용)
    const token = req.cookies.token;

    // 유저 정보가 없다면 throw error!
    if(!token) return next();

    // 유저 정보가 있다면 sub 이름과 제목이 이미 있는 것인지 체크
    const { username }:any = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findOneBy({ username });

    if(!user) throw new Error("Unauthenticated");

    // Sub Instance 생성 후 데이터베이스에 저장

    // 저장한 정보 프론트엔드로 전달해주기
};

const router = Router();

router.post('/', createSub);

export default router;
```

서버가 `/subs` 요청을 받을 수 있도록 Node.js 서버의 Entry 파일인   
`reddit-clone-app\server\src\server.ts` 파일에 아래 내용을 입력한다.

```typescript
...생략
// subs.ts파일을 import
import subRoutes from "./routes/subs";
import cors from "cors";
import dotenv from "dotenv";

const app = express();
const origin = "http://localhost:3000";

...생략
app.get("/", (_, res) => res.send("running"));
app.use("/api/auth", authRoutes)
// "/subs" 요청을 받을 수 있도록 처리한 내용
app.use("/api/subs", subRoutes)
...생략
```

- - -

## User, Auth 미들웨어 생성하기
생각해보면 많은 핸들러(서버 로직)에서 유저 정보를 필요로 하고 유저 정보나 유저의 등급에 따라서 인증을 따로 해줘야한다. 

`핸들러에서 유저 정보를 필요` ==> User Middleware의 필요성   
`유저 정보나 등급에 따라서 인증을 따로 수행` ====> Auth Middleware의 필요성   

이렇게 여러 곳에서 많이 쓰이는 것은 항상 재사용성을 위해서 분리해준다 (미들웨어로 분리)   

우리는 앞서 `유저 정보 가져오기`, `사용자 인증` 처리를 `reddit-clone-app\server\src\routes\subs.ts` 핸들러에서   
수행하도록 처리했지만 미들웨어를 생성하여 그 내용을 미들웨어로 처리할 것이다.

#### 1. User Middleware
`reddit-clone-app\server\src\middlewares\auth.ts` 파일을 생성해주고 아래 내용을 입력한다.   
입력하는 내용은 `subs.ts`에서 처리한 내용이다.

```typescript
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { User } from "../entities/User";

export default async (req: Request, res: Response, next: NextFunction) => {
    try {
        // 먼저 Subs를 생성할 수 있는 유저인지 체크를 위해 유저 정보 가져오기 (요청에서 보내주는 토큰을 이용)
        const token = req.cookies.token;

        // 유저 정보가 없다면 throw error!
        if(!token) return next();

        // 유저 정보가 있다면 sub 이름과 제목이 이미 있는 것인지 체크
        const { username }:any = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findOneBy({ username });
        // 유저 정보를 갖고 오는지 확인
        console.log("User MW", user);

        if(!user) throw new Error("Unauthenticated");

        // 유저 정보를 res.locals.user에 넣어주기
        res.locals.user = user;
        return next();
    } catch (error) {
        console.log(error);
        return res.status(400).json({ error: "Somthing went wrong" });
    }
}
```

#### 2. Auth Middleware
`reddit-clone-app\server\src\middlewares\auth.ts` 파일을 생성하고 아래 내용을 입력한다.

```typescript
import { Request, Response, NextFunction } from "express";
import { User } from "../entities/User";

export default async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user: User | undefined = res.locals.user;

        if(!user) throw new Error("Unauthenticated");

        return next();
    } catch (error) {
        console.log(error);
        return res.status(401).json({ error: "Unauthenticated" });
    }
}
```

#### 미들웨어 적용하기
구현한 미들웨어를 적용하기 위해 `reddit-clone-app\server\src\routes\subs.ts` 파일에 아래 내용을 추가한다.
```typescript
...생략
import userMiddleware from "../middlewares/user";
import authMiddleware from "../middlewares/auth";
...생략

const router = Router();

// 미들웨어 추가 부분
// 요청이 들어올 시 핸들러 수행 전 미들웨어 수행.
router.post('/', userMiddleware, authMiddleware, createSub);

export default router;
```

- - -

## Cookie 처리
유저 정보를 정상적으로 가져오는지 확인하기 위해 ***현재까지 작성된 코드를 바탕으로*** App에서 아래 절차를 수행한다.
1. 로그인 (쿠키를 정상적으로 브라우저에 저장하는지 확인)
2. `/subs/create` 경로로 이동하여 커뮤니티 만들기 시도 
3. Node.js 서버 로그를 확인

로그인 후 브라우저에 jwt token까지 확인했으나 User 미인증 에러를 확인할 수 있다.
```
POST /api/subs 401 11.503 ms - 37
Error: Auth MW : Unauthenticated
    at E:\study\reddit-clone-app\server\src\middlewares\auth.ts:8:25
    at Generator.next (<anonymous>)
    at E:\study\reddit-clone-app\server\src\middlewares\auth.ts:8:71
    at new Promise (<anonymous>)
    at __awaiter (E:\study\reddit-clone-app\server\src\middlewares\auth.ts:4:12)
    at exports.default (E:\study\reddit-clone-app\server\src\middlewares\auth.ts:4:74)
    at Layer.handle [as handle_request] (E:\study\reddit-clone-app\server\node_modules\express\lib\router\layer.js:95:5)
    at next (E:\study\reddit-clone-app\server\node_modules\express\lib\router\route.js:144:13)
    at E:\study\reddit-clone-app\server\src\middlewares\user.ts:11:27
    at Generator.next (<anonymous>)
```
#### Client
이는 Client 요청(Axios) 시 `withCredentials: true` 옵션을 넣어주지 않아   
Request Header에 cookies 가 포함되지 않으므로 jwt token 값을 통한 User 인증이 처리되지 않은 것이다.
```typescript
// reddit-clone-app\client\src\pages\subs\create.tsx 파일 내용 발췌
            const res = await axios.post(
                                            "/subs", 
                                            { name, title, description },
                                            // Request Header에 cookies를 포함하기 위한 옵션
                                            // { withCredentials: true }
                                        )
```

client에서 매번 Axios요청마다 옵션을 처리해주지 않고 전역 설정을 하기 위해서는   
`reddit-clone-app\client\src\pages\_app.tsx` 파일에 아래 내용을 추가해 준다.
```typescript
...생략
function MyApp({ Component, pageProps }: AppProps) {

  Axios.defaults.baseURL = process.env.NEXT_PUBLIC_SERVER_BASE_URL + "/api";
  // 서버 Request 시 Cookie 포함 전역 설정
  Axios.defaults.withCredentials = true;
...생략
```

#### Server
Server 사이드에서도 Client 쿠키를 통해 받은 token을 사용하기 위해 아래 모듈 설치가 필요하다.
아래 명령어를 사용해 `cookie-parser` 모듈을 설치해 준다.
```
npm install cookie-parser --save
npm i --save-dev @types/cookie-parser
```

`reddit-clone-app\server\src\server.ts` 파일에 아래 내용을 추가한다.
```typescript
...생략
app.use(morgan("dev"));
// 서버 쿠키 파서 추가
app.use(cookieParser());
...생략
```

- - -

## createSub 기능 완성
User, Auth 미들웨어의 기능을 제거하고 기능 완성을 위해   
`reddit-clone-app\server\src\routes\subs.ts` 파일의 내용을 아래와 같이 수정한다.

```typescript
...생략
const createSub = async (req: Request, res: Response, next) => {
    const {name, title, description} = req.body;

    try {
        let errors: any = {};
        if(isEmpty(name)) errors.name = "이름은 비워둘 수 없습니다."
        if(isEmpty(title)) errors.title = "제목은 비워둘 수 없습니다."

        // DB에서 동일한 커뮤니티 존재여부 확인
        const sub = await AppDataSource
                        .getRepository(Sub)
                        .createQueryBuilder("sub")
                        .where("lower(sub.name) = :name", { name: name.toLowerCase() })
                        .getOne();

        if(sub) errors.name = "서브가 이미 존재합니다.";

        if(Object.keys(errors).length > 0) {
            throw errors;
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: "문제가 발생했습니다." });
    }

    // 중복 커뮤니티가 아니라면 Sub Instance 생성 후 데이터베이스에 저장
    try {
        const user: User = res.locals.user;

        const sub = new Sub();
        sub.name = name;
        sub.description = description;
        sub.title = title;
        sub.user = user;

        await sub.save();
        return res.json(sub);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: "문제가 발생했습니다." });
    }
    

    // 저장한 정보 프론트엔드로 전달해주기
    
};
...생략
```