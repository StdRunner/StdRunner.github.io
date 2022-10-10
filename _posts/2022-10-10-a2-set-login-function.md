---
layout: post
title: 로그인 페이지 기능 생성
date: 2022-10-10
updated: 
tags: [typescript, next-js, tailwindcss]
menu: clone-reddit
---
## 로그인 페이지 기능 생성
`reddit-clone-app\client\src\pages\login.tsx` 파일에 아래의 내용을 추가한다.
```typescript
import Axios from 'axios';
...생략
import React, { FormEvent, useState } from 'react'

...생략
const login = () => {
    // State 생성
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [errors, setErrors] = useState<any>({});

    // handleSubmit 함수 생성
    // 로그인 Form에서 Submit 이벤트 시 동작 정의
    const handleSubmit = async (event: FormEvent) => {
        event.preventDefault();

        try {
            const res = await Axios.post(
                "/auth/login",
                {
                    password,
                    username
                },
                {
                    withCredentials: true
                }
            ); 
        } catch (error: any) {
            console.log(error);
            setErrors(error.response.data || {})
        }
    };
...생략
```

- - -

## 다른 서버의 백엔드-프론트엔드 간 쿠키 전송 설정 (로컬 환경)
```typescript
const handleSubmit = async (event: FormEvent) => {
...생략
        withCredentials : true 
...생략
}
```
로그인 시 아이디와 비밀번호가 서버로 넘어오면 유저의 정보가 맞는지 확인한 후   
cookie에 token을 발급한다.
이후 다른 페이지에서의 인증도 이 token을 통해 인증이 이뤄지게 됩니다.

하지만 백엔드와 프론트엔드의 주소가 다른 경우 로그인이 성공하더라도 에러도 없이 인증이 이루어지지 않았다.
이 이유는 도메인 주소가 다르면 쿠키가 전송이 되지 않기 때문이다.

이 방법을 해결하기 위해서 프론트에서는 axios 요청 보낼 때 withCrendentials 설정해주며   
백엔드에서는 cors 부분에 `credentials true`로 해줘
Response Header에 `Access-Control-Allow-Credentials`을 설정해줍니다.

- - -

## 로그인 API 생성
Node.js 서버 entry 파일인 `reddit-clone-app\server\src\server.ts` 파일에 아래 내용을 추가한다.
```typescript
...생략
app.use(cors({
    origin,
    // 다른 Origin 서버의 요청에도 쿠기를 전송하겠다는 설정
    credentials: true
}));
...생략
```

`reddit-clone-app\server\src\routes\auth.ts` 파일에 아래 내용을 추가한다.
```typescript
...생략
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import cookie from "cookie";

...생략
const login = async (req : Request, res: Response) => {
    const { username, password } = req.body;

    try {
        let errors: any = {};

        // 파라미터가 비워져 있다면 에러를 프론트로 보내주기
        if(isEmpty(username)) errors.username = "사용자 이름은 비워둘 수 없습니다.";
        if(isEmpty(password)) errors.password = "비밀번호는 비워둘 수 없습니다.";
        if(Object.keys(errors).length > 0) {
            return res.status(400).json(errors);
        }

        // DB에서 유저 찾기
        const user = await User.findOneBy({ username });

        // 유저가 없다면 에러 보내기
        if(!user) return res.status(404).json({ username: "사용자 이름이 등록되지 않았습니다." });

        // 유저가 있다면 비밀번호 비교하기
        const passwordMatches = await bcrypt.compare(password, user.password);

        if(!passwordMatches) {
            return res.status(401).json({ password: "비밀번호가 잘못되었습니다." });
        }

        // 비밀번호가 맞가면 토큰 생성
        const token = jwt.sign({ username }, process.env.JWT_SECRET!);

        // 쿠키 저장
        // var setCookie = cookie.selialize('foo', 'bar');
        res.set("Set-Cookie", cookie.selialize("token", token));

        return res.json({ user, token });
    } catch (error) {
        console.log(error);
        return res.status(500).json(error);
    }
}
...생략

const router = Router();
router.post("/register", register);
router.post("/login", login);

...생략
```

#### 쿠키, jwt 토큰 모듈 설치
`reddit-clone-app\server` 경로 터미널에 아래 명령어 입력
```
npm install jsonwebtoken dotenv cookie --save
```

쿠키의 이름과 값은 항상 인코딩해야 한다. 쿠키 하나가 차지하는 용량은 최대 4KB까지이고,   
사이트 하나당 약 20여 개를 허용합니다(브라우저에 따라 다름).

#### .env 파일 생성
`reddit-clone-app\server\.env` 파일을 생성 후 아래 내용을 추가한다.

```properties
PORT=5000
NODE_ENV=development
APP_URL=http://localhost:5000
ORIGIN=http://localhost:3000

JWT_SECRET=super_secret
```

.env 파일을 Node.js 서버에서 사용하기 위해   
Node.js 서버 entry 파일인 `reddit-clone-app\server\src\server.ts` 파일에 아래 내용을 추가한다.

```typescript
...생략
import dotenv from "dotenv";

...생략
dotenv.config();
...생략
```

- - -

## 로그인 시도 및 정상 로그인 처리 확인
1. 회원 가입 이후 로그인 페이지로 페이지 redirect 처리 되는 것을 확인한다.   
2. 사전 회원 가입한 Username, Password를 사용하여 로그인 시도
3. 개발자 도구를 열어 login 요청에 대한 응답과 응답 쿠키를 확인한다.

**[응답]**
```json
{
    token : "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImRveXVuIiwiaWF0IjoxNjY1MzkzODI4fQ._PN70DU2dddAbZMS1MmCx7rT20TmKTdumYhSvKQAdOE",
    user : {
        createdAt : "2022-10-10T00:16:33.319Z"
        email : "kdy95@inzent.com"
        id : 7
        password : "$2a$06$4E9EgjZTq2uijDig1TTyl.queBrIVkmf2mmX6pORqQEgq0QdVtc1m"
        updatedAt : "2022-10-10T00:16:33.319Z"
        username : "doyun"
    }
}
```

**[응답 쿠키]**
<img src="\assets\img\posts\set-login-function\res-cookie.png" style="border: 1px solid gray; width:80%" />