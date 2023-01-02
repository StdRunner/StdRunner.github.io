---
layout: post
title: 클라이언트 배포를 위한 소스 코드 변경
date: 2023-01-02
updated: 
tags: [typescript, next-js]
menu: clone-reddit
---
## 실행 환경에 따른 env 파일 생성
env-cmd 패키지를 이용해서 Application 실행 환경에 따라 .env파일을 따로 정의해서 사용할 수 있다.

기존의 `reddit-clone-app\client\.env` 파일은 개발 환경에서 사용하기 위해 `.env.development`   
파일로 파일명을 변경해준다. 이후 `reddit-clone-app\client\.env.production` 파일을 생성한다.
* `개발 환경` => `.env.development`
* `운영 환경` => `.env.production`

`reddit-clone-app\client\.env.production` 파일의 내용은 아래와 같다.   
현재 사용하고 있는 서버의 IP나 AWS EC2 인스턴스의 퍼블릭 IPv4 DNS를 사용하고    
NextJS Application에서 설정한 포트를 사용해 `NEXT_PUBLIC_SERVER_BASE_URL` 값을 입력해준다.
```
NEXT_PUBLIC_SERVER_BASE_URL=http://ec2-3-86-23-163.compute-1.amazonaws.com:5000
```

- - -

## package.json 변경
Application의 실행 스크립트를 변경하기 위해 `\reddit-clone-app\client\package.json` 파일의   
내용을 아래와 같이 변경한다.

```json
...생략
  "scripts": {
    "dev": "next dev",
    "build:dev": "env-cmd -f .env.development next build",
    "build:prod": "env-cmd -f .env.production next build",
    "start:dev": "env-cmd -f .env.development next start",
    "start:prod": "env-cmd -f .env.production next start",
    "lint": "next lint"
  },
...생략
```

- - - 

## PM2(Process Manager)를 위한 설정 파일 생성
PM2는 NodeJS 프로세스를 관리하는 원활한 서버 운영을 위한 패키지 이다.   
cluster 모드, 무중지 서비스, 자동 재시작 등 다영한 기능을 제공한다.   
`\reddit-clone-app\client\ecosystem.config.js` 파일을 생성하고 아래와 같이 내용을 변경한다.
```javascript
module.exports = {
    apps:[{
        name: "reddit-client",
        script: "npm run start:prod"
    }]
}
```

- - - 

## 기타 배포 시 에러 발생 수정
`\reddit-clone-app\client\src\pages\index.tsx` 파일을 아래 내용으로 수정한다.
```typescript
...생략
const Home: NextPage = () => {
  const { authenticated } = useAuthState();
  // const address = "http://localhost:5000/api/subs/sub/topSubs";
  const address = "/subs/sub/topSubs";
...생략
```

`\reddit-clone-app\client\src\pages\r\[sub]\create.tsx` 파일을 아래 내용으로 수정한다.
```typescript
...생략
export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
    try {
        const cookie = req.headers.cookie;
        if(!cookie) throw new Error("쿠키가 없습니다.")

        // 수정 부분
        await axios.get(`${process.env.NEXT_PUBLIC_SERVER_BASE_URL}/auth/me`, { headers: { cookie } });
        return { props: {} }
    } catch (error) {
        res.writeHead(307, {Location: "/login"}).end()
        return { props: {} }
    }
}
...생략
```

`\reddit-clone-app\client\src\pages\subs\create.tsx` 파일을 아래 내용으로 수정한다.
```typescript
export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
    try {
        const cookie = req.headers.cookie;
        
        if(!cookie) throw new Error("Missing auth token cookie");

        // 수정 부분
        await axios.get(`${process.env.NEXT_PUBLIC_SERVER_BASE_URL}/auth/me`, { headers: { cookie } })

        return { props: {} }
        
    } catch (error) {
        res.writeHead(307, { Location: "/login" }).end()
        return { props: {} };
    }
}
```

- - - 

## Sharp 모듈 설치 및 nextConfig에 domain 추가
운영 환경의 이미지 렌더링 시 이미지의 최적화를 위해 Sharp 모듈을 설치한다.
```
npm install sharp --save
```

URL을 통해 타 서버의 이미지를 렌더링하기 위해 `\reddit-clone-app\client\next.config.js` 파일을   
아래와 같은 내용으로 수정한다.
```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images:{
    domains: [
      "www.gravatar.com", 
      "localhost",
      "ec2-3-86-23-163.compute-1.amazonaws.com"
    ]
  }
}

module.exports = nextConfig
```