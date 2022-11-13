---
layout: post
title: 포스트 Create 페이지 UI 생성
date: 2022-11-13
updated: 
tags: [typescript, next-js, tailwindcss]
menu: clone-reddit
---
## 포스트 Create 페이지 UI
<img src="\assets\img\posts\sub-post\create-post.png" style="border: 1px solid gray; width: 40%" />

## 포스트 Create 페이지 UI 구현
포스트 Create 페이지의 context path를 `/r/{커뮤니티명}/create` 으로 해주기 위해   
`reddit-clone-app\client\src\pages\r\[sub]\create.tsx` 경로에 파일을 생성한다.
아래의 내용을 입력한다.

```typescript
import axios from 'axios';
import { GetServerSideProps } from 'next';
import React, { useState } from 'react'

const PostCreate = () => {
    // 포스트 create 페이지에서 사용할 State 선언
    const [title, setTitle] = useState('');
    const [body, setBody] = useState('');

    return (
        <div className='flex flex-col justify-center pt-16'>
            <div className='w-10/12 mx-auto md:w-96'>
                <div className='p-4 bg-white rounded'>
                    <h1 className='mb-3 text-lg'>포스트 생성하기</h1>
                    <form onSubmit={submitPost}>
                        <div className='relative mb-2'>
                            <input 
                                type="text" 
                                className='w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500'
                                placeholder='제목'
                                maxLength={20}

                            />
                            <div
                                style={{ top: 10, right: 10 }}
                                className='absolute mb-2 text-sm text-gray-400 select-none'
                            >
                                    /20
                            </div>
                        </div>
                        <textarea 
                            rows={4}
                            placeholder="설명"
                            className='w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-blue-500'

                        />
                        <div className='flex justify-end'>
                            <button
                                className='px-4 py-1 text-sm font-semibold text-white bg-gray-400 border rounded'
                            >
                                생성하기
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default PostCreate

// getServerSideProps을 사용해 쿠키가 없을 시 login 페이지로 이동
export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
    try {
        const cookie = req.headers.cookie;
        if(!cookie) throw new Error("쿠키가 없습니다.")

        await axios.get("/auth/me", { headers: { cookie } });
        return { props: {} }
    } catch (error) {
        res.writeHead(307, {Location: "/login"}).end()
        return { props: {} }
    }
}
```