---
layout: post
title: 로그인된 사람만 커뮤니티 생성 페이지 들어가
date: 2022-10-23
updated: 
tags: [typescript, next-js, tailwindcss]
menu: clone-reddit
---
## 인증에 따른 제한
현재 로그인 전 브라우저 쿠키에 token이 없는 상태로 `/subs/create` 페이지에 접속이 가능하다.   
인증되지 않은 사용자가 커뮤니티 생성 페이지에 접근이 가능하다는 것이다.

이러한 문제점을 해결하기 위해 Next.js의 `getServerSideProps`를 사용한다.   
`reddit-clone-app\client\src\pages\subs\create.tsx` 파일에 아래 내용을 추가한다.
```typescript
...생략
// 서버 사이드 렌더링으로 서버 요청 시 데이터를 불러온다
export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
    try {
        const cookie = req.headers.cookie;
        
        // 쿠키가 없다면 에러 보내기
        if(!cookie) throw new Error("Missing auth token cookie");

        // 쿠키가 있다면 그 쿠키를 이용하여 백엔드에서 인증 처리하기
        await axios.get("/auth/me", { headers: { cookie } })

        return { props: {} }
        
    } catch (error) {
        // 요청에서 던져준 쿠키를 이용해 백엔드에서 인증 처리할 때 에러가 나면 /login 페이지로 이동
        // (307 : 임시 리다이렉션 코드)
        res.writeHead(307, { Location: "/login" }).end()
        return { props: {} };
    }
}
```

그리고 로그인 상태 인증 확인 API를 생성한다. (`/api/me`)   
`reddit-clone-app\server\src\routes\auth.ts` 파일에 아래 내용을 추가한다.
이후 로그인 되지 않은 상태로 `/subs/create` 페이지 진입 시 로그인 페이지로 이동됨을 확인할 수 있다.

```typescript
...생략
const me = async (_: Request, res: Response) => {
    return res.json(res.locals.user);
}
...생략
const router = Router();
router.get("/me", userMiddleware, authMiddleware, me);
router.post("/register", register);
router.post("/login", login);
...생략
```

- - -

## 로그인 이후 로그인, 회원가입 페이지 진입 불가
현재 로그인 이후에도 로그인, 회원가입 페이지 진입이 가능하다.
이를 차단하기 위해 `reddit-clone-app\client\src\context\auth.tsx` 파일에 아래 내용을 추가한다.

```typescript 
...생략
export const AuthProvider = ({children}:{children: React.ReactNode}) => {
...생략
    useEffect(() => {
        async function loadUser() {
            try {
                const res = await axios.get("/auth/me");
                console.log("loadUser : ", res.data);
                dispatch("LOGIN", res.data);
            } catch (error) {
                console.log(error);
            } finally {
                dispatch("STOP_LOADING");
            }
        }
        
        // 컴포넌트가 마운트되면 호출
        loadUser();
    }, [])
...생략
```

이후 `reddit-clone-app\client\src\pages\login.tsx`, `reddit-clone-app\client\src\pages\register.tsx` 페이지에   
아래 내용을 추가한다.

```typescript
...생략
import { useAuthDispatch, useAuthState } from '../context/auth';
...생략

const Login = () => {
...생략
    const dispatch = useAuthDispatch();

    // 이미 로그인된 사람일 경우 / 페이지로 이동
    if(authenticated) router.push("/");
...생략
```