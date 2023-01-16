---
layout: post
title: 포스트 댓글 생성하기
date: 2022-11-20
updated: 
tags: [typescript, next-js, tailwindcss]
menu: clone-reddit
---
## 포스트 댓글 UI
로그인 된 상태에서는 댓글 작성이 가능하도록, 로그인이 되지 않은 상태에서는 `댓글 작성을 위해 로그인 해주세요` 메시지를 출력한다.   
완성된 UI는 아래와 같다.
<img src='\assets\img\posts\comment-vote\post-comment.png' style='border: 1px solid gray; width: 70%'>

- - - 

## 포스트 댓글 UI 템플릿 작성
댓글은 포스트 내용 페이지에 진입 시 작성할 수 있어야 하므로   
`reddit-clone-app\client\src\pages\r\[sub]\[identifier]\[slug].tsx` 파일에 템플릿을 아래와 같이 추가한다.   
```typescript
...생략
    // 로그인 여부에 따라 댓글 작성 가능 여부가 달라지므로 useAuthState 초기화
    const { authenticated, user } = useAuthState();
    // 댓글 내용 State 초기화
    const [ newComment, setNewComment ] = useState("");
...생략
                            <div>
                                {/* 댓글 작성 구간*/}
                                <div className="pr-6 mb-4">
                                    // 로그인 상태일 때 마크업
                                    {authenticated ? 
                                    (<div>
                                        <p className="mb-1 text-xs">
                                            <Link href={`/u/${user?.username}`}>
                                                <a className="font-semibold text-blue-500">
                                                    {user?.username}
                                                </a>
                                            </Link>
                                            {" "}으로 댓글 작성
                                        </p>
                                        <form onSubmit={handleSubmit}>
                                            <textarea 
                                                className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-gray-600"
                                                onChange={e => setNewComment(e.target.value)}
                                                value={newComment}
                                            ></textarea>
                                            <div className="flex justify-end">
                                                <button 
                                                    className="px-3 py-1 text-white bg-gray-400 rounded"
                                                    disabled={newComment.trim() === ""}
                                                >
                                                    댓글 작성
                                                </button>
                                            </div>
                                        </form>
                                    </div>) 
                                    : 
                                    // 로그아웃 상태일 때 마크업
                                    (<div className="flex items-center justify-between px-2 py-4 border border-gray-200 rounded">
                                        <p className="font-semibold text-gray-400">
                                            댓글 작성을 위해서 로그인 해주세요.
                                        </p>
                                        <div>
                                            <Link href={`/login`}>
                                                <a className="px-3 py-1 text-white bg-gray-400 rounded">
                                                    로그인
                                                </a>
                                            </Link>
                                        </div>
                                    </div>) }
                                </div>
                            </div>
...생략
```

#### handleSubmit 함수 작성
`reddit-clone-app\client\src\pages\r\[sub]\[identifier]\[slug].tsx` 파일에 댓글 form 태그가 Submit 시   
실행하게 될 handleSubmit 함수를 아래와 같이 작성한다.
```typescript
...생략
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
...생략
```

- - - 

## API 생성
포스트 하위에 생성되는 코멘트 이므로 포스트 관련 API 라우트인   
`reddit-clone-app\server\src\routes\posts.ts` 파일에 아래 내용을 추가한다.
```typescript
// 댓글 추가 핸들러 함수
const createPostComment = async (req: Request, res: Response) => {
    const { identifier, slug } = req.params;
    const { body } = req.body;
    
    try {
        // 댓글을 저장할 포스트 가져오기
        const post = await Post.findOneByOrFail({ identifier, slug });

        const comment = new Comment();
        comment.body = body;
        comment.user = res.locals.user;
        comment.post = post;

        // 투표 관련 작업
        if(res.locals.user) {
            post.setUserVote(res.locals.user);
        }

        // 댓글 저장
        await comment.save();
        return res.json(comment);
    } catch (error) {
        console.log(error);
        return res.status(404).json({ error: "게시물을 찾을 수 없습니다." });
    }
}

const router = Router();
router.get("/:identifier/:slug", userMiddleware, getPost);
router.post("/", userMiddleware, authMiddleware, creatPost);
// 추가 API
router.post("/:identifier/:slug/comments", userMiddleware, authMiddleware, createPostComment)

export default router;
```