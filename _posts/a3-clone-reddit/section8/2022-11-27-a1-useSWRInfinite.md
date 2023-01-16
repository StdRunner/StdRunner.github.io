---
layout: post
title: useSWRInfinite을 사용해 포스트 무한 스크롤 구현
date: 2022-11-27
updated: 
tags: [typescript, next-js, tailwindcss]
menu: clone-reddit
---
## useSWRInfinite 이란
##### [useSWRInfinite 문서]
[https://swr.vercel.app/ko/docs/pagination#useswrinfinite](https://swr.vercel.app/ko/docs/pagination#useswrinfinite)

SWR은 페이지 매김 및 무한 로딩과 같은 일반적인 UI 패턴을 지원하기 위해 전용 API useSWRInfinite를 제공한다.   
무한 스크롤 UI패턴의 경우 지속적으로 다음 페이지 데이터를 가져오기 위한 용도로 사용된다.
<img src='\assets\img\posts\section8\useswrinfinite.png' style='border: 1px solid gray; width: 70%'>

##### [useSWRInfinite 반환 값]
* `data` : 요청을 통해 각 페이지 응답 값의 배열
* `error` : useSWR의 error와 동일
* `isValidating` : useSWR의 isValidating과 동일
* `mutate` : useSWR의 바인딩 된 뮤테이트 함수와 동일하지만 데이터 배열을 다룸
* `size` : 가져올 페이지 및 반환될 페이지의 수
* `setSize` : 가져와야 하는 페이지의 수를 설정

- - -

## index페이지에서 포스트 카드 무한 스크롤 구현
#### useSWRInfinite을 통해 포스트 카드 페이지 가져오기
`reddit-clone-app\client\src\pages\index.tsx` 파일에 아래 내용을 추가한다.
```typescript
...생략
import useSWRInfinite from 'swr/infinite';
...생략
const getKey = (pageIndex: number, previousPageData: Post[]) => {
    if(previousPageData && !previousPageData.length) return null;
    return `/posts?page=${pageIndex}`;
  } 

const {data, error, size: page, setSize: setPage, isValidating, mutate} = useSWRInfinite<Post[]>(getKey);
...생략
```

- - -

## useSWRInfinite 요청을 받을 API 생성
포스트 관련 API 핸들러 파일인 `reddit-clone-app\server\src\routes\posts.ts` 파일에 아래 API를 추가한다.
```typescript
...생략
const getPosts = async (req: Request, res: Response) => {
    // 현재 페이지
    const currentPage: number = (req.query.page || 0) as number;
    // 각 페이지에 담을 데이터 개수
    const perPage: number = (req.query.count || 8) as number;

    try {
        const posts = await Post.find({
            order: {createdAt: "DESC"},
            relations: ["sub", "votes", "comments"],
            // 스킵할 데이터 수
            skip: currentPage * perPage,
            // 가져올 데이터 수
            take: perPage
        })

        // 가져온 각 포스트에 현재 사용자의 투표 데이터 SET
        if(res.locals.user) {
            posts.forEach(p => p.setUserVote(res.locals.user));
        }

        return res.json(posts);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: "문제가 발생했습니다." })
    }
}
...생략
router.get("/", userMiddleware, getPosts);
...생략
```

- - -

## 루트 페이지에 포스트 나열하기
`reddit-clone-app\client\src\pages\index.tsx` 파일에 아래 내용을 추가한다.
```typescript
...생략
    const {data, error, size: page, setSize: setPage, isValidating, mutate} = useSWRInfinite<Post[]>(getKey);

    // 추가된 내용
    // useSWRInfinite에서 가져온 포스트데이터가 없고, 에러도 없을 때 = 포스트 로딩중
    const isInitialLoading = !data && !error;
    // concat() 메서드 : 인자로 주어진 배열이나 값들을 기존 배열에 합쳐서 새 배열을 반환
    // API 요청으로 가져온 데이터를 사용해 새 배열 생성
    const posts: Post[] = data ? ([] as Post[]).concat(...data) : [];
...생략
  return (
    <div className='flex max-w-5xl px-4 pt-5 mx-auto'>
      {/* 포스트 리스트 */}
      <div className='w-full md:mr-3 md:w-8/12'>
        // 로딩중일 때
        {isInitialLoading && <p className='text-lg text-center'>로딩중입니다...</p>}
        // 데이터 로딩완료 후
        {posts?.map(post => (
          <PostCard
            key={post.identifier}
            post={post}
            subMutate={mutate}
          />
        ))}
      </div>
...생략      
```

`reddit-clone-app\client\src\components\PostCard.tsx` 파일을 아래와 같이 수정
```typescript
...생략
interface PostCardProps {
    post: Post
    // subMutate를 Props로 전달받지 않을 수 있음을 정의
    subMutate?: () => void
}
...생략
    const vote = async (value: number) => {
        if(!authenticated) router.push("/login");

        if(value === userVote) value = 0;

        try {
            await axios.post("/votes", { identifier, slug, value });
            // subMutate가 없을 때 실행하지 않는다.
            if(subMutate) subMutate();
        } catch (error) {
            console.log(error);
        }
    }
...생략
```