---
layout: post
title: 커뮤니티 생성 페이지 UI 만들기
date: 2022-10-19
updated: 
tags: [typescript, next-js, tailwindcss]
menu: clone-reddit
---
## 커뮤니티 생성 페이지 UI
현재 개발하고 있는 `Reddit-clone-app`에서 커뮤니티를 생성하는 페이지의 UI는 아래와 같다.
<img src="\assets\img\posts\gen-comm\gen-comm-ui.png" style="border: 1px solid gray; width:40%" />

- - -

## 커뮤니티 생성 페이지 UI 파일 생성
`reddit-clone-app\client\src\pages\subs\create.tsx` 폴더 구조와 파일을 생성하고,      
아래 소스를 입력한다.

구분 폴더명이 `subs`인 이유는 Reddit 서비스에서 커뮤니티를 `Subreddits` 라고 지칭하기 때문이다.   
```typescript
import React from 'react'
import InputGroup from '../../components/InputGroup'

const SubCreate = () => {
  return (
    <div className='flex flex-col justify-center pt-16'>
        <div className='w-10/12 mx-auto md:w-96'>
            <h1 className=',b-2 text-lg font-medium'>
                커뮤니티 만들기
            </h1>
            <hr />
            <form>
                <div className='my=6'>
                    <p className='font-medium'>Name</p>
                    <p className='mb-2 text-xs text-gray-400'>
                        커뮤니티 이름은 변경할 수 없습니다.
                    </p>
                    <InputGroup
                        placeholder='이름'
                        value       // 추후 입력 예정
                        setValue    // 추후 입력 예정
                        error       // 추후 입력 예정
                    />
                </div>
                <div className='my=6'>
                    <p className='font-medium'>Title</p>
                    <p className='mb-2 text-xs text-gray-400'>
                        주제를 나타냅니다. 언제든지 변경할 수 있습니다.
                    </p>
                    <InputGroup
                        placeholder='주제'
                        value       // 추후 입력 예정
                        setValue    // 추후 입력 예정
                        error       // 추후 입력 예정
                    />
                </div>
                <div className='my=6'>
                    <p className='font-medium'>Description</p>
                    <p className='mb-2 text-xs text-gray-400'>
                        해당 커뮤니티에 대한 설명입니다.
                    </p>
                    <InputGroup
                        placeholder='이름'
                        value       // 추후 입력 예정
                        setValue    // 추후 입력 예정
                        error       // 추후 입력 예정
                    />
                </div>
                <div className='flex justify-end'>
                    <button
                        className='px-4 py-1 text-sm font-semibold rounded text-white bg-gray-400 border'
                    >
                        커뮤니티 만들기
                    </button>
                </div>
            </form>
        </div>
    </div>
  )
}

export default SubCreate
```