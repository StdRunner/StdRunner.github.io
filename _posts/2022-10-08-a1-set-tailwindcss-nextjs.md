---
layout: post
title: Nextjs 앱에 Tailwind CSS 적용하기
date: 2022-10-08
updated: 
tags: [typescript, next-js, tailwindcss]
menu: clone-reddit
---
## Tailwind CSS 적용을 위한 모듈 설치하기
`reddit-clone-app/client` 경로에서 npm 모듈 설치
```
npm i -D postcss-preset-env tailwindcss
```

- - -

## Tailwind 설정 파일 생성
`reddit-clone-app/client` 경로 터미널에서 아래 명령어 입력
```
npx tailwind init
```

아래와 같이 `tailwind.config.js` 파일이 생성됩니다.
<img src="\assets\img\posts\set-tailwindcss-nextjs\tailwind-config-file.png" style="border: 1px solid gray; width:30%" />

- - -

## PostCSS 빌드 적용을 위한 postcss 설정 파일 생성
`reddit-clone-app/client` 경로 터미널에서 아래 명령어 입력
```
touch postcss.config.js
```

아래와 같이 `postcss.config.js` 파일이 생성됩니다.
<img src="\assets\img\posts\set-tailwindcss-nextjs\postcss-config-file.png" style="border: 1px solid gray; width:30%" />

- - - 

## tailwind.config.js 파일 plugins에 tailwind, postcss webpack preset을 추가
PostCSS를 통해 `tailwindcss`, `postcss-preset-env` 를 사용할 수 있도록 설정하는 것.
`postcss.config.js` 파일을 아래와 같이 편집한다.
```javascript
module.exports = {
    plugins: ["tailwindcss", "postcss-preset-env"]
}
```

- - -

## PostCSS 란?
PostCSS란?    
POST CSS는 우리의 CSS를 조금 더 현대적으로 바꿔주는 플러그인이다.    
좀 더 풀어 설명하자면 ***POST CSS는 JS 플러그인을 사용하여 CSS를 변환***시키는 툴.    
```html
<!-- className으로 css 변환-->
<h1 className="text-3xl font-bold underline">
    Hello World!
</h1>
```
POST CSS는 언어가 아니라 자동으로 현대적인 CSS를 호환 가능하도록 변환시켜주는 플러그인일 뿐이다.   

POST CSS는 CSS에 문제가 없는지 미리 확인해서 에러 로그를 준다.    
***PostCSS 자체는 아무 일도 하지 않습니다.***    
다만 다양한 플러그인과, 플러그인을 추가할 수 있는 ***환경을 제공***할 뿐입니다.

tailwindcss, postcss-preset-env 플러그인을 추가하는 환경 제공.

- - -

## CSS 파일에 Tailwind 사용하기
`reddit-clone-app/client/src/styles/globals.css` 파일을 아래와 같이 편집한다.   
이는 .css 파일에서 tailwind 플러그인을 사용하기 위함.
```css
/* Tailwind 사용을 위해 추가된 부분 */
@tailwind base;
@tailwind components;
@tailwind utilities;

html,
body {
  padding: 0;
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen,
    Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif;
}

a {
  color: inherit;
  text-decoration: none;
}

* {
  box-sizing: border-box;
}

@media (prefers-color-scheme: dark) {
  html {
    color-scheme: dark;
  }
  body {
    color: white;
    background: black;
  }
}
```

`tailwind.config.js` 파일을 열어 아래와 같이 내용을 편집한다.   
tailwind를 적용 대상 컨텐츠를 경로로 입력.
```javascript
/** @type {import('tailwindcss').Config} */
module.exports = {
  // tailwind 적용 대상 컨텐츠 경로 입력
  content: ['./src/pages/**/*.tsx'],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

#### Tailwind 적용 여부 확인
`reddit-clone-app/client/src/pages/index.tsx` 파일을 아래와 같이 편집한다.
```typescript
import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'

const Home: NextPage = () => {
  return (
    <div className={styles.container}>
      <!-- Tailwind 적용 부분 -->
      <h1 className="text-3xl font-bold underline">
        Hello World!
      </h1>
    </div>
  )
}

export default Home
```