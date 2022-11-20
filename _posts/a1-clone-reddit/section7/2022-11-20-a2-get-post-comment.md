---
layout: post
title: 포스트 댓글 가져오기
date: 2022-11-20
updated: 
tags: [typescript, next-js, tailwindcss]
menu: clone-reddit
---
## 코멘트 리스트 가져오기
포스트 내용 페이지 진입 시 SWR을 사용해서 해당 포스트에 작성된 코멘트를 가져온다.   
`reddit-clone-app\client\src\pages\r\[sub]\[identifier]\[slug].tsx` 파일에 아래 내용을 추가한다.
```typescript
...생략
const PostPage = () => {
    const router = useRouter();
    const { identifier, sub, slug } = router.query;
    const { authenticated, user } = useAuthState();
    const [ newComment, setNewComment ] = useState("");
    const { data: post, error } = useSWR<Post>(identifier && slug ? `/posts/${identifier}/${slug}` : null)

    // 코멘트 정보를 가져오는 요청
    const { data: comments } = useSWR<Comment[]>(
        identifier && slug ? `/posts/${identifier}/${slug}/comments` : null
    )
    // 코멘트 정보를 로그로 확인
    console.log('comments :', comments);
...생략
```

#### 코멘트 리스트 결과 확인
<img src='\assets\img\posts\comment-vote\comment-list.png' style='border: 1px solid gray; width: 70%'>

- - -

## API 생성
포스트 하위에 생성되는 코멘트 이므로 포스트 관련 API 라우트인   
`reddit-clone-app\server\src\routes\posts.ts` 파일에 아래 내용을 추가한다.
```typescript
...생략
// API 요청 시 수행되는 핸들러
const getPostComments = async (req: Request, res: Response) => {
    // URL에서 id, slug 가져오기
    const { identifier, slug } = req.params;
    try {
        // 포스트 정보 가져오기
        const post = await Post.findOneByOrFail({ identifier, slug });
        // 코멘트 정보 가져오기
        const comments = await Comment.find({
            where: { postId: post.id },
            order: { createdAt: "DESC" },
            relations: ["votes"],
        });

        // 각 코멘트 별 setUserVote
        if(res.locals.user) {
            comments.forEach((c) => c.setUserVote(res.locals.user));
        }
        
        // 코멘트 정보 응답
        return res.json(comments);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: "문제가 발생했습니다." });
    }
}
...생략
// API path 생성
router.get("/:identifier/:slug/comments", userMiddleware, getPostComments);
...생략
```

- - -

## 코멘트 리스트 나열하기
포스트 내용 페이지 아래 코멘트 리스트를 추가하기 위해   
`reddit-clone-app\client\src\pages\r\[sub]\[identifier]\[slug].tsx` 파일에 아래 내용을 추가한다.
```typescript
...생략
// 코멘트 데이터를 SWR로 로드한 후 코멘트 타입을 사용하기 위해 import
import { Comment } from '../../../../types';
...생략
                            {/* 댓글 리스트 부분 */}
                            {comments?.map((comment) = > (
                                <div className="flex" key={comment.identifier}> 
                                    <div className="py-2 pr-2">
                                        <p className="mb-1 text-xs leading-none">
                                            <Link href={`/u/${comment.username}`}>
                                                <a className="mr-1 font-bold hover:underline">
                                                    {comment.username}
                                                </a>
                                            </Link>
                                            <span className="text-gray-600">
                                                {`
                                                    ${comment.voteScore}
                                                    posts
                                                    ${dayjs(comment.createdAt).format('YYYY-MM-DD HH:mm')}
                                                `}
                                            </span>
                                        </p>
                                        <p>{comment.body}</p>
                                    </div>
                                </div>
                            ))}
...생략
```