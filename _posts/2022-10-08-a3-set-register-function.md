---
layout: post
title: 회원 가입 페이지 기능 생성
date: 2022-10-08
updated: 
tags: [typescript, next-js, tailwindcss]
menu: clone-reddit
---
## register.tsx 코드 작성
```typescript
import Link from 'next/link'
import React, {useState} from 'react'
import InputGroup from '../components/InputGroup'

const Register = () => {
    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [errors, setErrors] = useState<any>({});
    return (
        <div className="bg-white">
            <div className='flex flex-col items-center justify-center h-screen p-6'>
                <div className='w-10/12 mx-auto md:w-96'>
                    <h1 className='mb-2 text-lg font-medium'>회원가입</h1>
                    <form>
                        <InputGroup 
                            placeholder='Email'
                            value={email}
                            setValue={setEmail}
                            error={errors.email}

                        />
                        <InputGroup 
                            placeholder='Username'
                            value={username}
                            setValue={setUsername}
                            error={errors.username}

                        />
                        <InputGroup 
                            placeholder='Password'
                            value={password}
                            setValue={setPassword}
                            error={errors.password}

                        />

                        <button className={'w-full py-2 mb-1 text-xs font-bold text-white uppercase bg-gray-400 border border-gray-400 rounded'}>
                            회원 가입
                        </button>
                    </form>
                    <small>
                        이미 가입하셨나요?
                        <Link href="/login">
                            <a className='ml-1 text-blue-500 uppercase'>로그인</a>
                        </Link>
                    </small>
                </div>
            </div>
        </div>
    )
}

export default Register
```

#### INPUT 기능을 위한 State 생성
``` typescript
...생략
import React, {useState} from 'react'
...생략

const Register = () => {
    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [errors, setErrors] = useState<any>({});

...생략
```

#### 사전 정의한 InputGroup 컴포넌트를 사용해 INPUT 생성
```typescript
...생략
    <form>
        <InputGroup 
            placeholder='Email'
            value={email}
            setValue={setEmail}
            error={errors.email}

        />
        <InputGroup 
            placeholder='Username'
            value={username}
            setValue={setUsername}
            error={errors.username}

        />
        <InputGroup 
            placeholder='Password'
            value={password}
            setValue={setPassword}
            error={errors.password}

        />
...생략
```

- - -

## Client -> Server Http 요청을 위한 모듈 설치 : Axios
`reddit-clone-app/client` 경로 터미널에서 아래 명령어를 입력한다.
```
npm install axios --save
```

- - -

## 백엔드 회원가입을 위한 요청, 회원가입 후 로그인 페이지로 자동 이동
```typescript
...생략
import { useRouter } from 'next/router';

...생략
    let router = useRouter();

    const handleSubmit = async (event: FormEvent) => {
        event.preventDefault();
        
        try {
            const res = await axios.post('/auth/register', {
                email,
                password,
                username
            })
            // 요청 후 서버 응답 확인
            console.log('res', res);

            // 요청 후 로그인 페이지 이동
            router.push("/login");
        } catch (error: any) {
            console.log('error', error);
            setErrors(error.reponse.data || {});
        }
    }
...생략
```

- - -

## axios를 이용해 요청을 보내는 모든 BASE 경로 지정
axios를 통해 Client to Server 통신 시 매번 BASEURL을 작성해주지 않고    
BASE URL을 환경변수로 참조하여 사용하기 위함

`reddit-clone-app/.env` 파일에 다음 내용 작성
```env
NEXT_PUBLIC_SERVER_BASE_URL=http://localhost:5000
```

Client App의 ***최상단 컴포넌트인***    
`reddit-clone-app\client\src\pages\_app.tsx` 파일 내 
아래 내용을 추가한다.
```typescript
...생략
import Axios from 'axios'

...생략
  Axios.defaults.baseURL = process.env.NEXT_PUBLIC_SERVER_BASE_URL + "/api";
...생략
```

- - - 
## 서버에 /register 요청에 대한 Controller 작성
`reddit-clone-app\server\src\routes\auth.ts` 파일에 다음 내용을 작성한다.

```typescript
import { Router, Request, Response } from "express";

const register = async (req : Request, res: Response) => {
    const { email, username, password } = req.body;
    // Client 요청 시 email을 로그에 출력
    console.log('email', email);
}

const router = Router();
router.post("/register", register);

// export default router;
export default router;
```

#### auth route를 서버 entry 파일에서 import
Node.js 서버 entry 파일인 `reddit-clone-app\server\src\server.ts` 파일에 아래 내용을 작성

```typescript
...생략
import authRoutes from "./routes/auth"

...생략
app.use("/api/auth", authRoutes)
...생략
```

- - -

## CORS 에러 처리
CORS 에러란 `Cross-Origin Resource Sharing`이다.   
현재 Reddit-clone-app의 구조는 Client - Server 구조로 Client 요청 시   
localhost:3000 -> localhost:5000으로 요청을 보내게 된다.

서로 다른 서버 간 요청을 통해 Resource를 공유하는 것을 보안상의 이유로 브라우저 자체에서    
차단하는 경우를 말한다.

이를 해결해주는 방법은 Resource를 제공하는 Server측에서 Resource 공유에 문제없음을    
사전에 알려주면 해결된다.

#### 필요 모듈 설치
`reddit-clone-app/server` 경로 터미널에서 아래 명령어 입력    
```
npm install cors --save
```

#### 특정 서버 요청에 대한 허용
Node.js 서버 entry 파일인 `reddit-clone-app\server\src\server.ts` 파일에 아래 내용을 작성
```typescript
...생략
import cors from "cors";

...생략
const origin = "http://localhost:3000";

app.use(cors({
    origin
}));
...생략
```

- - -

## 서버의 regiser 함수
`reddit-clone-app\server\src\routes\auth.ts` 파일에 아래 내용을 작성   
register 요청이 들어왔을때 서버의 처리를 구현한다.
```typescript
...생략
const register = async (req : Request, res: Response) => {
    const { email, username, password } = req.body;
    
    try {
        let errors: any = {};

        // 이메일과 유저네임이 이미 저장, 사용되고 있는 것인지 확인.
        const emailUser = await User.findOneBy({email});
        const usernameUser = await User.findOneBy({username});

        // 이미 있다면 errors 객체에 넣어줌.
        if(emailUser) errors.email = "이미 해당 이메일 주소가 사용되었습니다."
        if(usernameUser) errors.username = "이미 이 사용자 이름이 사용되었습니다."

        // 에러가 있다면 return으로 에러를 response 보내줌.
        if(Object.keys(errors).length > 0) {
            return res.status(400).json(errors)
        }

        const user = new User();
        user.email = email;
        user.username = username;
        user.password= password;

        // 엔티티에 정해놓은 조건으로 user 데이터의 유효성 검사를 해준다.
        errors = await validate(user);
        // 엔티티 클래스에 정의한 메시지대로 에러 출력
        console.log('errors', errors);

        // if(errors.length>0) return res.status(400).json(mapError(errors));

        // 유저 정보를 user 테이블에
        await user.save()
        return res.json(user);
    } catch (error) {
        console.log(error);
        return res.status(500).json({error});
    }
}
...생략
```

- - -

## 참고
#### Reduce 메소드
[https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/Array/Reduce](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/Array/Reduce)

#### Object.entries
[https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/Object/entries](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/Object/entries)

<img src="\assets\img\posts\create-register-page\entries.png" style="border: 1px solid gray; width:80%" />