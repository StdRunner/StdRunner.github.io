---
layout: post
title: useSWR mutate
date: 2022-11-20
updated: 
tags: [typescript, next-js, tailwindcss, swr]
menu: clone-reddit
---
## useSWR mutate 란? 
캐시 된 데이터를 개발자가 원하는 시점에서 갱신하기 위한 함수이다.   
useSWRConfig() hook으로부터 mutate 함수를 얻을 수 있으며,   
`mutate(key)`를 호출하여 동일한 키를 사용하는 다른 SWR hook*에게 갱신 메시지를 전역으로 `브로드캐스팅`할 수 있습니다.

- - - 

## 포스트 코멘트 작성에서 mutate 적용
현재 댓글 작성 후 작성한 코멘트가 즉시 화면에 갱신되지 않는다.   
새로고침을 수행하면 그때서야 코멘트가 화면에 출력되는데 작성 버튼 클릭 즉시 화면이 갱신되도록 하기 위해   
`useSWR mutate`를 사용한다.

`reddit-clone-app\client\src\pages\r\[sub]\[identifier]\[slug].tsx` 파일 `SWR`을 사용해서 포스트 코멘트 정보를    
가져오는 부분을 아래와 같이 수정한다.
```typescript
    // [수정 전]
    const { data: comments } = useSWR<Comment[]>(
        identifier && slug ? `/posts/${identifier}/${slug}/comments` : null
    )

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        // 코멘트의 내용이 없을 시 함수 종료
        if(newComment.trim() === "") {
            return;
        }
        console.log('newComment', newComment);

        // 코멘트 내용이 있다면
        try {
            // 코멘트 등록 post 요청
            await axios.post(`/posts/${post?.identifier}/${post?.slug}/comments`, {
                body: newComment
            });
            // 요청 후 코멘트 초기화
            setNewComment("");
        } catch (error) {
            console.log(error);
        }
    }

    // [수정 후]
    // *****
    // useSWR 구문에서 mutate 초기화
    const { data: comments, mutate } = useSWR<Comment[]>(
        identifier && slug ? `/posts/${identifier}/${slug}/comments` : null
    )

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        // 코멘트의 내용이 없을 시 함수 종료
        if(newComment.trim() === "") {
            return;
        }
        console.log('newComment', newComment);

        // 코멘트 내용이 있다면
        try {
            // 코멘트 등록 post 요청
            await axios.post(`/posts/${post?.identifier}/${post?.slug}/comments`, {
                body: newComment
            });
            // *****
            // 데이터 즉시 갱신 시점을 mutate()로 명시
            mutate();
            // 요청 후 코멘트 초기화
            setNewComment("");
        } catch (error) {
            console.log(error);
        }
    }
```