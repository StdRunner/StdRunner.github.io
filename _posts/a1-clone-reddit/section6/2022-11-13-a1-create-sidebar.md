---
layout: post
title: 사이드 바 생성하기
date: 2022-11-13
updated: 
tags: [typescript, next-js, tailwindcss]
menu: clone-reddit
---
## 사이드 바 컴포넌트 생성, 적용
`reddit-clone-app\client\src\components\SideBar.tsx` 경로에 파일을 생성하고 아래 내용을 입력한다.
```typescript
import dayjs from 'dayjs';
import Link from 'next/link';
import React from 'react'
import { useAuthState } from '../context/auth';

const SideBar = ({ sub }) => {
    const { authenticated }  = useAuthState();

    return (
        <div className='hidden w-4/12 ml-3 md:block'>
            <div className='bg-white border rounded'>
                <div className='p-3 bg-gray-400 rounded-t'>
                    <p className='font-semibold text-white'>커뮤니티에 대해서</p>
                </div>
                <div className='p-3'>
                    <p className='mb-3 text-base'>{sub?.description}</p>
                    <div className='flex mb-3 text-sm font-medium'>
                        <div className='w-1/2'>
                            <p>100</p>  
                            <p>멤버</p> // 추후 커뮤니티에 속한 멤버를 출력
                        </div>
                    </div>
                    <p className='my-3'>
                        // 커뮤니티 생성 시간을 출력
                        { dayjs(sub?.createdAt).format('MM.DD.YYYY') }
                    </p>
                    {authenticated && (
                        <div className='mx-0 my=2'>
                            <Link href={`/r/${sub.name}/create`}>
                                <a className='w-full p-2 text-sm text-white bg-gray-400 rounded'>
                                    포스트 생성
                                </a>
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default SideBar
```

그리고 커뮤니티 상세 페이지인 `reddit-clone-app\client\src\pages\r\[sub].tsx`에 사이드 바 컴포넌트를 추가해주기 위해   
아래 내용을 추가한다.

**[사이드 바]**
<img src="\assets\img\posts\sub-post\side-bar.png" style="border: 1px solid gray;" />

```typescript
...생략
import Sidebar from '../../components/SideBar';
...생략
                {/* 포스트와 사이드바 */}
                <div className='flex max-w-5xl px-4 pt-5 mx-auto'>
                    <div className='w-full md:mr-3 md:w-8/12'></div>
                    <Sidebar sub={sub} />
                </div>
            </>
        }
        </>
    )
}

export default SubPage
```

#### 사이드 바 "커뮤니티 생성 시간" 표시
사이드 바에서 `createdAt` 시간을 원해는 포멧에 맞게 표현하기 위해 `dayjs` 모듈을 아래 명령어를 사용해 설치한다.
```
npm install dayjs —save
```

`dayjs`모듈을 사용해 날짜 포멧을 변경해 출력하기 위해 `SideBar.tsx` 컴포넌트에서 아래와 같이 적용한다.
```typescript
...생략
<p className='my-3'>
    { dayjs(sub?.createdAt).format('MM.DD.YYYY') }
</p>
...생략
```