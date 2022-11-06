---
layout: post
title: 이미지 업로드 하기
date: 2022-11-05
updated: 
tags: [typescript, next-js, tailwindcss]
menu: clone-reddit
---
## ref를 사용하여 이미지 올리기
먼저 DOM상에 이미지 파일을 업로드하기 위해   
`reddit-clone-app\client\src\pages\r\[sub].tsx` 파일에 아래 내용을 추가해준다.

```typescript

import React, { ChangeEvent, useEffect, useRef, useState } from 'react';
...생략
const fileInputRef = useRef<HTMLInputElement>(null);
...생략
    return (
        <>
        {sub && 
            <>
                <div>
                    // 추가 부분
                    <input 
                        type="file" 
                        hidden={true} 
                        ref={fileInputRef} 
                        onChange={uploadImage}
                    />
...생략
```

* fileInputRef : 리액트에서 특정 DOM 엘리먼트를 선택할 때 사용하는 `useRef`를 활용한 ref 변수
* uploadImage : 배너와, 프로필 이미지를 업로드하는 함수

#### useRef 란?
javascript 에서는 getElementById, querySelector 같은 DOM Selector 함수를 사용해서 DOM을 선택하지만   
***리액트에서 특정 DOM 엘리먼트를 선택할 때 사용하는 방식***이다.   

##### [DOM을 직접 선택해야할 경우]
* 엘리먼트 크기를 가져와야 할 때 
* 스크롤바 위치를 가져와야 할 때
* 엘리먼트에 포커스를 설정 해줘야 할 때 
* etc...

 - - -

#### 커뮤니티 배너, 프로필 DOM 엘리먼트 클릭 시 이미지 파일 업로드 구현
커뮤니티의 배너, 프로필을 클릭 시 앞서 생성한 Input엘리먼트에 이미지 파일을 업로드하기 위해   
`reddit-clone-app\client\src\pages\r\[sub].tsx` 파일에 onClick 이벤트를 추가해준다.

```typescript
...생략
                    {/* 배너 이미지 */}
                    <div className='bg-gray-400'>
                    {sub.bannerUrl ? (
                        <div 
                            className='h-56'
                            style={ {
                                backgroundImage: `url( ${ sub.bannerUrl } )`,
                                backgroundRepeat: 'no-repeat',
                                backgroundSize: 'cover',
                                backgroundPosition: 'center',
                            } }
                            // 추가 부분
                            onClick={ () => openFileInput("banner") }
                        >
                        </div>
                    ) : (
                        <div className='h-20 bg-gray-400'
                            // 추가 부분
                            onClick={ () => openFileInput("banner") }
                        ></div>
                    )}
                    </div>
                    {/* 커뮤니티 메타 데이터 */}
                    <div className='h-20 bg-white'>
                        <div className='relative flex max-w-5xl px-5 mx-auto'>
                            <div className='absolute' style={ { top: -15 } }>
                            {
                                sub.imageUrl && (
                                    <Image 
                                        src={ sub.imageUrl }
                                        alt="커뮤니티 이미지"
                                        width={70}
                                        height={70}
                                        className='rounded-full'
                                        // 추가 부분
                                        onClick={ () => openFileInput("image") }
                                    />
                                )
                            }
                            </div>
                            <div className='pt-1 pl-24'>
                                <div className='flex items-center'>
                                    <h1 className='text-3xl font-bold'>{ sub.title }</h1>
                                </div>
                                <p className='text-small font-bold text-gray-400'>
                                    /r/{ sub.name }
                                </p>
                            </div>
                        </div>
                    </div>
...생략
```

* openFileInput : 커뮤니티의 배너, 프로필을 클릭 시 앞서 생성한 Input엘리먼트에 이미지 파일을 업로드하는 함수
openFileInput 함수를 아래와 같이 정의해준다.

```typescript
...생략
import { useAuthState } from '../../context/auth';

const SubPage = () => {
    // 로그인된 계정이 커뮤니티 생성자인지 판단하는 State 선언
    const [ownSub, setOwnSub] = useState(false);
    const { authenticated, user } = useAuthState();
     
...생략

    useEffect(() => {
        if(!sub || !user) return;
        // 사용자 인증 여부 확인
        // 현재 로그인된 사용자 === 현재 커뮤니티의 생성자 여부 확인
        setOwnSub(authenticated && user.username === sub.username);
    }, [sub])

...생략

    const openFileInput = (type: string) => {
        // 커뮤니티 소유자가 아니라면 함수 리턴
        if(!ownSub) return;

        // 커뮤니티 소유자라면
        const fileInput = fileInputRef.current;
        if(fileInput) {
            fileInput.name = type;
            fileInput.click();
        }
    }
...생략
```

#### Input 엘리먼트에 업로드한 이미지 파일로 커뮤니티 배너, 프로필을 교체
uploadImage 함수는 Input 엘리먼트의 파일이 변경됐을 때 실행되는 함수로   
변경된 이미지 파일을 사용해 배너, 프로필 이미지를 변경할 수 있도록 서버에 요청한다.
```typescript
...생략
    const uploadImage = async (event: ChangeEvent<HTMLInputElement>) => {
        if(event.target.files === null) return;

        const file = event.target.files[0];
        console.log('file', file);

        const formData = new FormData();
        formData.append("file", file);
        formData.append("type", fileInputRef.current!.name);

        try {
            await axios.post(`/subs/${sub.name}/upload`, formData, {
                headers: {"Context-Type": "multipart/form-data"}
            });
        } catch (error) {
            console.log(error);
        }
    }
...생략
```