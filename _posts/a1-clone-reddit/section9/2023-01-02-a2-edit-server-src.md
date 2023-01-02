---
layout: post
title: 서버 배포를 위한 소스 코드 변경
date: 2023-01-02
updated: 
tags: [typescript, node-js]
menu: clone-reddit
---
## 실행 환경에 따른 env 파일 생성
env-cmd 패키지를 이용해서 Application 실행 환경에 따라 .env파일을 따로 정의해서 사용할 수 있다.

기존의 `reddit-clone-app\server\.env` 파일은 개발 환경에서 사용하기 위해 `.env.development`   
파일로 파일명을 변경해준다. 이후 `reddit-clone-app\server\.env.production` 파일을 생성한다.
* `개발 환경` => `.env.development`
* `운영 환경` => `.env.production`

`reddit-clone-app\server\.env.production` 파일의 내용은 아래와 같다.   
현재 사용하고 있는 서버의 IP나 AWS EC2 인스턴스의 퍼블릭 IPv4 DNS를 사용하고    
NodeJS에서 설정한 포트를 사용해 `NEXT_PUBLIC_SERVER_BASE_URL` 값을 입력해준다.
```
PORT=5000
NODE_ENV=production
APP_URL=http://ec2-3-86-23-163.compute-1.amazonaws.com:5000
ORIGIN=http://ec2-3-86-23-163.compute-1.amazonaws.com:3000

JWT_SECRET=super_secret
```

- - -

## package.json 변경
NodeJS의 실행 스크립트를 변경하기 위해 `\reddit-clone-app\server\package.json` 파일의   
내용을 아래와 같이 변경한다.

```json
...생략
  "scripts": {
    "start": "ts-node src/server.ts",
    "dev": "env-cmd -f .env.development nodemon --exec ts-node ./src/server.ts",
    "start:prod": "env-cmd -f .env.production ts-node ./src/server.ts",
    "test": "echo \"Error: no test specified\" && exit 1",
    "typeorm": "typeorm-ts-node-commonjs"
  },
...생략
```

- - - 

## PM2(Process Manager)를 위한 설정 파일 생성
PM2는 NodeJS 프로세스를 관리하는 원활한 서버 운영을 위한 패키지 이다.   
cluster 모드, 무중지 서비스, 자동 재시작 등 다영한 기능을 제공한다.   
`\reddit-clone-app\server\ecosystem.config.js` 파일을 생성하고 아래와 같이 내용을 변경한다.
```javascript
module.exports = {
    apps:[{
        name: "reddit-server",
        script: "npm run start:prod"
    }]
}
```

- - - 

## 기타 배포 시 에러 발생 수정
`\reddit-clone-app\server\src\server.ts` 파일의 내용을 아래와 같이 변경한다.
```typescript
...생략
// const origin = "http://localhost:3000";
const origin = process.env.ORIGIN;
 
...생략
 
app.listen(port, async () => {
    // console.log(`Server running at http://localhost:${port}`);
    console.log(`Server running at ${process.env.APP_URL}`);
...생략
```