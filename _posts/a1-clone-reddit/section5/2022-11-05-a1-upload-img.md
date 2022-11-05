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

* fileInputRef : 리액트에서 특정 DOM 엘리먼트를 선택할 때 사용하는 `useRef`를 활용한 변수
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

## 