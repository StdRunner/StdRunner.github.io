---
layout: post
title: 커뮤니티 상세 페이지 생성하기
date: 2022-11-01
updated: 
tags: [typescript, next-js, tailwindcss]
menu: clone-reddit
---
## 커뮤니티 상세 페이지 UI 템플릿
`reddit-clone-app\client\src\pages\r\[sub].tsx` 경로의 파일을 생성하고 아래 내용을 입력한다.
```typescript
import axios from 'axios'
import { useRouter } from 'next/router';
import React from 'react'
import useSWR from 'swr';

const SubPage = () => {
    const fetcher = async (url: string) => {
        try {
            const res = await axios.get(url);
            return res.data;
        } catch (error: any) {
            throw error.response.data;
        }
    }
    
    const router = useRouter();
    // url의 subName 가져오기 "/r/test" 일 경우 test를 가져온다.
    const subName = router.query.sub;
    // swr 사용하여 서버 요청
    const {data: sub, error} = useSWR(subName ? `/subs/${subName}` : null, fetcher);

    return (
        <div>
            [SubPage]
        </div>
    )
}

export default SubPage
```
<img src="\assets\img\posts\comm-list\comm-detail-temp.png" style="border: 1px solid gray;" />

- - -

## 커뮤니티 정보를 가져오는 핸들러
`reddit-clone-app\server\src\routes\subs.ts` 파일에 아래 내용을 추가한다.
```typescript
...생략
const getSub = async (req: Request, res: Response) => {
    // "/subs/{name}" 요청이 왔을 때 "router.get('/:name'" 부분의 name을 가져온다
    const name = req.params.name;
    try {
        // One or Nothing 조회
        const sub = await Sub.findOneByOrFail({ name });

        return res.json(sub);
    } catch (error) {
        return res.status(404).json({ error: "커뮤니티를 찾을 수 없습니다." });
    }
}
...생략
const router = Router();

router.post('/', userMiddleware, authMiddleware, createSub);
router.get('/sub/topSubs', topSubs);
router.get('/:name', userMiddleware, authMiddleware, getSub);

export default router;
```

- - -

## 커뮤니티 상세 페이지 UI 생성하기
`reddit-clone-app\client\src\pages\r\[sub].tsx` 파일을 아래 내용으로 수정한다.
```typescript
import axios from 'axios'
import { useRouter } from 'next/router';
import Image from 'next/image';
import React from 'react';
import useSWR from 'swr';

const SubPage = () => {
    const fetcher = async (url: string) => {
        try {
            const res = await axios.get(url);
            return res.data;
        } catch (error: any) {
            throw error.response.data;
        }
    }
    
    const router = useRouter();
    const subName = router.query.sub;
    const {data: sub, error} = useSWR(subName ? `/subs/${subName}` : null, fetcher);

    return (
        /**
         * Fragment 형태로 템플릿 작성
         *  : DOM에 별도의 노드를 추가하지 않고 여러 자식 노드를 그룹화할 수 있습니다.
         */
        <>
        {sub && 
            <>
                <div>
                    {/* 배너 이미지 */}
                    <div className='bg-gray-400'>
                    {sub.bannerUrl ? (
                        <div 
                            className='h-56'
                            style={ {
                                backgroundImage: `url(${ sub.bannerUrl })`,
                                backgroundRepeat: 'no-repeat',
                                backgroundSize: 'cover',
                                backgroundPosition: 'center',
                            } }
                        >
                        </div>
                    ) : (
                        <div className='h-20 bg-gray-400'></div>
                    )}
                    </div>
                    {/* 커뮤니티 메타 데이터 */}
                    <div className='h-20 bg-white'>
                        <div className='relative flex max-w-5xl px-5 mx-auto'>
                            <div className='absolute' style={ { top: -15 } }>
                            {
                                sub.imageUrl && (
                                    <Image 
                                        src={sub.imageUrl}
                                        alt="커뮤니티 이미지"
                                        width={70}
                                        height={70}
                                        className='rounded-full'
                                    />
                                )
                            }
                            </div>
                            <div className='pt-1 pl-24'>
                                <div className='flex items-center'>
                                    <h1 className='text-3xl font-bold'>{sub.title}</h1>
                                </div>
                                <p className='text-small font-bold text-gray-400'>
                                    /r/{sub.name}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>  
                {/* 포스트와 사이드바 */}
                <div className='flex max-w-5xl px-4 pt-5 mx-auto'>

                </div>
            </>
        }
        </>
    )
}

export default SubPage
```

<img src="\assets\img\posts\comm-list\comm-detail-ui.png" style="border: 1px solid gray;" />

## InstanceToPlain
`reddit-clone-app\server\src\entities\Sub.ts` Sub(커뮤니티) 엔티티 정의 파일 내용을 확인해보면
```typescript
...생략
    @Expose()
    get imageUrl(): string {
        return this.imageUrn ? `${process.env.APP_URL}/images/${this.imageUrn}` : 
        "http://www.gravatar.com/avatar?d=mp&f=y"
    }
    
    @Expose()
    get bannerUrl(): string {
        return this.bannerUrn ? `${process.env.APP_URL}/images/${this.bannerUrn}` : 
        undefined;
    }
}
```

행위 데이터(imageUrl, bannerUrl)를 ***@Expose()*** 데코레이터를 사용해 엔티티에 포함하고 있다.   
그러나 커뮤니티 상세 페이지 에서 `/subs/{subName}` 요청의 응답 데이터에는    
imageUrl, bannerUrl이 누락되고 있음을 확인할 수 있다.

<img src="\assets\img\posts\comm-list\comm-detail-data.png" style="border: 1px solid gray;" />

이러한 현상을 해결하기 위해 BaseEntity에 (`E:\study\reddit-clone-app\server\src\entities\Entity.ts`)   
아래 내용을 추가해준다.
```typescript
import { instanceToPlain } from "class-transformer";
import { BaseEntity, CreateDateColumn, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

export default abstract class Entity extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    // 추가 내용
    toJSON() {
        return instanceToPlain(this);
    }    
}
```