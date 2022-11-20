---
layout: post
title: 포스트와 댓글의 Vote 적용 시 바로 업데이트 하기
date: 2022-11-20
updated: 
tags: [typescript, next-js, tailwindcss]
menu: clone-reddit
---
## 투표 적용 시 즉시 업데이트
코멘트와 마찬가지로 `useSWR` 사용 구문에서 mutate를 가져오고 이를 투표 요청하는 `vote`함수에서 실행해주면 된다.   
`reddit-clone-app\client\src\pages\r\[sub]\[identifier]\[slug].tsx` 파일에 아래 내용을 추가해 본다.
```typescript
...생략
const { data: post, error, mutate } = useSWR<Post>(identifier && slug ? `/posts/${identifier}/${slug}` : null)
...생략
    const vote = async (value: number, comment?:Comment) => {
        if(!authenticated) router.push("/login");

        // 이미 클릭한 vote 버튼을 눌렀을 시에는 reset
        if(
            (!comment && value === post?.userVote) || 
            (comment && comment.userVote === value)
        ) {
            value = 0;
        }

        try {
            await axios.post("/votes", {
                identifier,
                slug,
                commentIdentifier: comment?.identifier,
                value
            })
            mutate();
            comment
        } catch (error) {
            console.log(error);
        }
    }
...생략 
```

위와 같이 수정할 경우 코멘트 정보를 가져오는 `useSWR` 구문에서 가져오는 mutate와 변수명이 겹치게 된다.   
코멘트에 정보를 가져오는 부분에서 `mutate`를 제거하면 포스트의 투표 정보는 투표 즉시 화면에 갱신되나   
***코멘트 투표는 갱신되지 않고, 댓글 입력 시 화면이 즉시 갱신되지 않는다.***

##### [코멘트 정보를 가져오는 `useSWR` 구문]
```typescript
    const { data: comments, mutate } = useSWR<Comment[]>(
        identifier && slug ? `/posts/${identifier}/${slug}/comments` : null
    )

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        // 코멘트의 내용이 없을 시 함수 종료
        if(newComment.trim() === "") {
            return;
        }

        // 코멘트 내용이 있다면
        try {
            // 코멘트 등록 post 요청
            await axios.post(`/posts/${post?.identifier}/${post?.slug}/comments`, {
                body: newComment
            });
            mutate();
            // 요청 후 코멘트 초기화
            setNewComment("");
        } catch (error) {
            console.log(error);
        }
    }
```

이런 현상을 해결하기 위해 포스트, 코멘트 데이터를 가져오는 `useSWR` 구문에서 mutate를 가져올 때 상수명을 다르게    
선언하고 필요 시마다 다르게 호출하면 해결된다.

투표 진행 시 `postMutate`, `commentMutate`를 동시에 수행하면 포스트, 코멘트 투표 상태가 즉시 갱신된다.

```typescript
    // mutate : postMutate
    const { data: post, error, mutate: postMutate } = useSWR<Post>(identifier && slug ? `/posts/${identifier}/${slug}` : null)
    console.log('post :', post);

    // mutate : commentMutate
    const { data: comments, mutate: commentMutate } = useSWR<Comment[]>(
        identifier && slug ? `/posts/${identifier}/${slug}/comments` : null
    )

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        // 코멘트의 내용이 없을 시 함수 종료
        if(newComment.trim() === "") {
            return;
        }

        // 코멘트 내용이 있다면
        try {
            // 코멘트 등록 post 요청
            await axios.post(`/posts/${post?.identifier}/${post?.slug}/comments`, {
                body: newComment
            });
            // *****
            // 코멘트 등록 시 코멘트 정보 갱신
            commentMutate();
            // 요청 후 코멘트 초기화
            setNewComment("");
        } catch (error) {
            console.log(error);
        }
    }

    const vote = async (value: number, comment?:Comment) => {
        if(!authenticated) router.push("/login");

        // 이미 클릭한 vote 버튼을 눌렀을 시에는 reset
        if(
            (!comment && value === post?.userVote) || 
            (comment && comment.userVote === value)
        ) {
            value = 0;
        }

        try {
            await axios.post("/votes", {
                identifier,
                slug,
                commentIdentifier: comment?.identifier,
                value
            })
            // *****
            // 투표 시 포스트, 코멘트 정보 갱신
            postMutate();
            commentMutate();
            comment
        } catch (error) {
            console.log(error);
        }
    }
```