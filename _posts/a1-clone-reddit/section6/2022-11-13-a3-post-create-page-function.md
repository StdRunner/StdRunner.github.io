---
layout: post
title: 포스트 Create 페이지 기능 생성
date: 2022-11-13
updated: 
tags: [typescript, next-js, tailwindcss]
menu: clone-reddit
---
## 포스트 Create 페이지 기능
앞서 생성했던 포스트 Create 생성 페이지에서 `생성하기` 버튼을 통해 `form` 태그의 `onSubmit` 이벤트가 발생했을 때
동작하게 될 `submitPost` 함수를 아래와 같이 추가한다.

`reddit-clone-app\client\src\pages\r\[sub]\create.tsx`
```typescript
...생략
    // 페이지 URL내의 커뮤니티 이름(subName)을 사용하기 위해 추가
    const router = useRouter();
    const { sub: subName } = router.query;

    const submitPost= async (e: FormEvent) => {
        e.preventDefault();
        // form title이 빈 값이면 함수 종료
        if(title.trim() === "" || !subName) return;

        try {
            // 포스트 저장릉 위해 서버 요청
            const { data: post } = await axios.post<Post>("/posts", {
                title: title.trim(),
                body,
                sub: subName
            })

            // 서버 응답이 정상이면 해당 게시물 페이지로 이동 (아직 미구현)
            router.push(`/r/${subName}/${post.identifier}/${post.slug}`)
        } catch (error) {
            console.log(error);
        }
    }
...생략
```

- - -
## 포스트 Create API 생성(Create 핸들러)
`reddit-clone-app\server\src\routes\posts.ts` 파일을 생성하고 아래 내용을 추가한다.

```typescript
import { Router, Request, Response } from "express";
import userMiddleware from "../middlewares/user";
import authMiddleware from "../middlewares/auth";
import Sub from "../entities/Sub";
import Post from "../entities/Post";

const creatPost = async (req: Request, res: Response) => {
    const { title, body, sub } = req.body;

    // 포스트 제목이 빈 값일 때 예외처리
    if(title.trim() === "") {
        return res.status(400).json({ title: "비워둘 수 없습니다." });
    }

    // userMiddleware 에서 사용자 인정된 정보 가져오기
    const user = res.locals.user;

    try {
        // 요청받은 커뮤니티 이름을 가진 커뮤니티 조회
        const subRecord = await Sub.findOneByOrFail({ name: sub });
        const post = new Post();

        post.title = title;
        post.body = body;
        post.user = user;
        post.sub = subRecord;

        // 포스트 저장
        await post.save();

        return res.json(post);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: "문제가 발생했습니다." });
    }
}

const router = Router();
router.post("/", userMiddleware, authMiddleware, creatPost);

export default router;
```

서버가 생성한 API의 요청을 받을 수 있도록 `reddit-clone-app\server\src\server.ts` 파일에 아래 내용 추가
```typescript
...생략
import postRoutes from "./routes/posts";
...생략

// app.get의 url로 접속 시 해당 블록 코드 실행
// Controller

// [추가된 내용]
app.use("/api/posts", postRoutes)
...생략
```

- - -

## 커뮤니티 조회 요청 시 포스트 정보를 함께 조회
커뮤니티 상세 세이지 진입 시 `/r/{커뮤니티 이름}` 와 같은 `context path`로 이동하게 된다.   
이 때 커뮤니티 정보를 조회하게 되는데 추후 커뮤니티 상세 페이지 진입 시 포스트 리스트를 출력하기 위해   
***커뮤니티 조회 시 관련 포스트 정보를 함께 조회할 수 있도록 처리한다.***

`reddit-clone-app\server\src\routes\subs.ts` 파일 `getSub`함수의 내용을 아래와 같이 수정한다.
```typescript
...생략
const getSub = async (req: Request, res: Response) => {
    const name = req.params.name;
    try {
        const sub = await Sub.findOneByOrFail({ name });

        // [포스트를 생성한 후에 해당 sub에 속하는 포스트 정보를 넣어주기]
        // 조건에 일치하는 포스트 정보 조회
        const posts = await Post.find({
            where: { subName: sub.name },   // 커뮤니티 이름
            order: { createdAt: "DESC" },   // 생성일 내림차순 정렬
            relations: ["comments", "votes"]    // 관련 엔티티 정보 포함
        })

        sub.posts = posts;  // sub 객체 하위에 posts 정보 추가

        // **추후 포스트 투표와 관련된 로직
        if(res.locals.user) {
            sub.posts.forEach((p) => p.setUserVote(res.locals.user))
        }

        return res.json(sub);
    } catch (error) {
        return res.status(404).json({ error: "커뮤니티를 찾을 수 없습니다." });
    }
}
...생략
```