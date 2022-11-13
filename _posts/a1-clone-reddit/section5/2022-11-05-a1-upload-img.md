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

- - - 

## 이미지 업로드 핸들러
이미지 업로드 핸들러를 서버 사이드에 구현할 예정이다.   
커뮤니티(Sub) 엔티티와 관련된 핸들러이므로 `reddit-clone-app\server\src\routes\subs.ts` 파일에 아래 내용을 추가한다.
```typescript
...생략
router.post('/', userMiddleware, authMiddleware, createSub);
router.get('/sub/topSubs', topSubs);
router.get('/:name', userMiddleware, authMiddleware, getSub);
// 추가 내용
// 추후 작성 예정
//  - ownSub
//  - upload.single("file")
//  - uploadSubImage
router.post("/:name/upload", userMiddleware, authMiddleware, ownSub, upload.single("file"), uploadSubImage);

export default router;
...생략
```

#### 본인이 생성한 커뮤니티인지 확인 : ownSub
커뮤니티의 프로필과, 배너 이미지를 업로드하기 위해서는 본인이 생성한 커뮤니티여야 하므로   
이미지 업로드 요청 시 ***커뮤니티 생성자 validation 체크를 위한*** ownSub을 구현한다.   
`reddit-clone-app\server\src\routes\subs.ts` 파일에 아래 핸들러를 추가한다.

```typescript
...생략
const ownSub = async (req: Request, res: Response, next: NextFunction) => {
    // userMiddleware에서 인증된 사용자 정보 가져오기
    const user: User = res.locals.user;
    try {
        // 프론트에서 요청한 커뮤니티 name으로 커뮤니티 엔티티 조회
        const sub = await Sub.findOneOrFail({ where: { name: req.params.name } })

        // 조회된 커뮤니티의 username과 현재 사용자의 username을 비교
        if(sub.username !== user.username) {
            return res.status(403).json({ error: "이 커뮤니티를 소유하고 있지 않습니다." });
        }

        // 사용자가 생성한 커뮤니티가 맞으면 next();
        res.locals.sub = sub;
        next();
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: "문제가 발생했습니다." });
    }
}
...생략
```

#### 이미지 파일 체크 및 저장 : upload.single("file")
프론트에서 업로드 요청한 파일의 mimetype이 `image/jpeg`, `image/png` 인지 체크한다.   
파일 mimetype 체크 후 `reddit-clone-app\server\public\images` 경로에 저장한다.

이러한 처리를 위해 multer 모듈을 아래 명령어를 사용하여 설치한다.   
```
npm install multer —save 
npm i --save-dev @types/multer
```
* ***의존성 에러 출력 시 `--force` 옵션을 사용해 강제 설치한다.***   
* ***multer 모듈 : 이미지, 동영상 등을 비롯한 여러 가지 파일들을 멀티파트 형식으로 업로드할 때 사용하는 모듈***   

`reddit-clone-app\server\src\routes\subs.ts` 파일에 아래 핸들러를 추가한다.
```typescript
const upload = multer({
    storage: multer.diskStorage({
        // 파일 저장 스토리지 경로
        destination: "public/images",
        // 저장 파일명 정의 callback 함수 - multer 모듈 정의
        filename: (_, file, callback) => {
            // helpers 유틸 사용하여 길이 10의 랜덤 파일명 생성
            const name = makeId(10);
            // 랜덤 파일명 + 파일 확장자
            callback(null, name + path.extname(file.originalname));
        },
    }),
    fileFilter: (_, file: any, callback: FileFilterCallback) => {
        // 업로드 요청 파일의 mimetype 확인
        if(file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
            callback(null, true);
        } else {
            callback(new Error("이미지가 아닙니다."));
        }
    }
})
```

#### 업로드 이미지 파일 Urn 교체, 이미지 파일 삭제 : uploadSubImage
커뮤니티(Sub) 엔티티 imageUrn, bannerUrn 값을 새로 업로드된 이미지파일 Urn으로 교체한다.   
이후 스토리지 내 사용하지 않는 이전의 이미지파일을 삭제한다.

`reddit-clone-app\server\src\routes\subs.ts` 파일에 아래 핸들러를 추가한다.
```typescript
const uploadSubImage = async (req: Request, res: Response) => {
    // ownSub에서 인증한 커뮤니티 정보 가져오기
    const sub: Sub = res.locals.sub;
    try {
        const type = req.body.type;
        // 파일 유형을 지정치 않았을 시에는 업로드 된 파일 삭제
        if(type !== "image" && type !== "banner") {
            if(!req.file?.path) {
                return res.status(400).json({ error: "유효하지 않은 파일" })
            }

            // 파일 지워주기
            //  - unlinkSync : 파일 시스템에서 파일이나 심볼릭 링크를 동기적으로 제거하는 데 사용
            unlinkSync(req.file.path);
            return res.status(400).json({ error: "잘못된 유형" });
        }

        let oldImageUrn:string = "";

        if(type === "image") {
            // 사용중인 Urn을 저장합니다. (이전 파일을 아래서 삭제하기 위해서)
            oldImageUrn = sub.imageUrl || "";
            // 새로운 파일 이름을 Urn 으로 넣어줍니다.
            sub.imageUrn = req.file?.filename || "";
        } else if (type === "banner") {
            oldImageUrn = sub.bannerUrn || "";
            sub.bannerUrn = req.file?.filename || "";
        }
        await sub.save();

        // 사용하지 않는 이미지 파일 삭제
        if(oldImageUrn !== "") {
            const fullFilename = path.resolve(
                process.cwd(),
                "public",
                "images",
                oldImageUrn
            );
            
            unlinkSync(fullFilename);
        }

        return res.json(sub);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: "문제가 발생했습니다." })
    }
}
```

- - -

## 에러 수정
#### 1. Invalid src prop
Next.js의 이미지 태그를 사용하여 외부 링크 이미지를 불러오고자 하면 발생하는 에러다.
<img src="\assets\img\posts\comm-list\err1.png" style="border: 1px solid gray; width: 50%" />

`reddit-clone-app\client\next.config.js` 파일 `images > domains`에 외부 링크의 도메인을 추가하면   
해결할 수 있다.
```typescript
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images:{
    domains: ["www.gravatar.com", "localhost"]
  }
}

module.exports = nextConfig
```

#### 2. Failed to parse src
Next.js의 이미지 태그를 사용 시 잘못된 src 값을 사용했을 때 발생하는 에러다.   
에러 원인은 간단하나 ***커뮤니티 상세 페이지에서 호출하는 src는 문제가 없었고***   
런타임 에러라서 디버깅하는데 많은 시간이 소요됐다.

이전에 커뮤니티 엔티티의 ImageUrl을 TypeORM QueryBuilder와 COALESCE함수를 사용해 가져오는 부분이 문제가 됐다.

***ImageUrl은 엔티티 컬럼이 아닌 `서버호스트 + ImageUrn` Action형태로 가져오는데***   
***QueryBuilder를 사용하게 되어 엔티티 전체를 가져오지 않다보니 발생한 문제였다.***   
<img src="\assets\img\posts\comm-list\err2.png" style="border: 1px solid gray;" />

`reddit-clone-app\server\src\routes\subs.ts` 파일, topSubs 핸들러의   
NULL 체크를 위한 COALESCE 함수를 사용한 쿼리를 IF THEN 구문으로 변경해주면 해결된다.
```typescript
...생략
const topSubs = async (_:Request, res:Response) => {
    try {
        const imageUrlExp = `COALESCE('${process.env,APP_URL}/images/'|| s."imageUrn", 'http://www.gravatar.com/avatar?d=mp&f=y')`;
        const subs = await AppDataSource
            .createQueryBuilder()
            .select(`s.title, s.name, ${imageUrlExp} as "imageUrl", count(p.id) as "postCount"`)
            .from(Sub, "s")
            .leftJoin(Post, "p", `s.name = p."subName"`)
            .groupBy('s.title, s.name, "imageUrl"')
            .orderBy(`"postCount"`, "DESC")
            .limit(5)
            .execute();
...생략
```