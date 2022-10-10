---
layout: post
title: 로그인 시 Cookie 처리
date: 2022-10-10
updated: 
tags: [typescript, next-js, tailwindcss]
menu: clone-reddit
---
## 로그인 후 Client Cookie 처리
로그인 요청 후 response 쿠기에 정상적으로 jwt 토큰이 담겨 오는 것을 확인했다.
그러나 `개발자도구` > `Application` 탭 내 jwt 토근이 저장되지 않는다.

이유는 Server에서 로그인 후 response 객체에 쿠키를 Set 하는 과정에서 옵션넣어줘야 한다.
`reddit-clone-app\server\src\routes\auth.ts` 파일에 아래 내용을 추가한다.

```typescript
...생략
const login = async (req : Request, res: Response) => {
...생략
        // 쿠키 저장
        // var setCookie = cookie.selialize('foo', 'bar');
        res.set(
            "Set-Cookie",
            cookie.serialize("token", token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "development",
                sameSite: "strict",
                maxAge: 60 * 60 * 24 * 7, // 1week
                path: "/"
            })
        );
...생략
}
...생략
```

옵션 설명 참조: [https://ko.javascript.info/cookie](https://ko.javascript.info/cookie)
* `httpOnly` : 이 옵션은 자바스크립트 같은 클라이언트 측 스크립트가 쿠키를 사용할 수 없게 합니다. document.cookie를 통해 쿠키를 볼 수도 없고 조작할 수도 없다.
* `secure` : secure 는 HTTPS 연결에서만 쿠키를 사용할 수 있게 한다.
* `samesite` : 요청이 외부 사이트에서 일어날 때, 브라우저가 쿠키를 보내지 못하도록 막아줍니다. XSRF 공격을 막는 데 유용하다.
* `expires/max-age` : 쿠키의 만료 시간을 정해줍니다. 이 옵션이 없으면 브라우저가 닫힐 때 쿠키도 같이 삭제된다.