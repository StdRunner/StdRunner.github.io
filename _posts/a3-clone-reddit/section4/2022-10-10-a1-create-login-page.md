---
layout: post
title: 로그인 페이지 UI 생성하기
date: 2022-10-10
updated: 
tags: [typescript, next-js, tailwindcss]
menu: clone-reddit
---
## 로그인 페이지 UI 생성
`reddit-clone-app\client\src\pages\login.tsx` 파일을 생성하고 
아래의 내용으로 편집한다.

```typescript
import React from 'react'
import InputGroup from '../components/InputGroup'

const Login = () => {
  return (
    <div className='bg-white'>
        <div className='flex flex-col items-center justify-center h-screen p-6'>
            <div className='w-10/12 mx-auto md:w-96'>
                <h1 className='mb-2 text-lg font-medium'>로그인</h1>
                <form onSubmit={handleSubmit}>
                    <InputGroup 
                        placeholder='Username'
                        value={username}
                        setValue={setUsername}
                        error={errors.username}
                    />
                    <InputGroup 
                        placeholder='Password'
                        value={password}
                        type='password'
                        setValue={setPassword}
                        error={errors.password}
                    />
                    <button className={`w-full py-2 mb-1 text-xs font-bold text-white uppercase bg-gray-400 border border-gray-400 rounded`}>
                        로그인
                    </button>
                </form>
                <small>
                    아직 아이디가 없나요?
                    <Link href="/register">
                        <a className='ml-1 text-blue-500 uppercase'>회원가입</a>
                    </Link>
                </small>
            </div>
        </div>
    </div>
  )
}

export default Login
```