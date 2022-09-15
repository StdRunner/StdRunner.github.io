---
layout: post
title: Next JS Tutorial (간단한 Blog)
date: 2022-09-12
updated: 
tags: [next-js, typescript]
menu: clone-reddit
---
## Markdown 파일이란? (.md 파일)
***Markdown***은 텍스트 기반의 마크업 언어로 쉽게 쓰고 읽을 수 있으며 HTML로 변환이 가능하다.   
특수 기호와 문자를 이용한 매우 간단한 구조의 무넙을 사용하여 웹에서도 보다 빠르게 컨텐츠를 작성하고   
직관적으로 인식할 수 있다.  

마크다운이 최근 각광받기 시작한 이유는 깃헙에서 사용하는 README.md 덕분이다.   
마크다운을 통해서 설치방법, 소스 코드 설명, 이슈 등을 간단하게 기록하고 가독성을 높일 수 있다는 강점이 있어,   
여러 곳에서 사용중이다.

지금 이 블로그 포스팅 또한 .md 파일을 사용했다.

***=> 서버가 없는 블로그 App을 위해 포스트 정보들을 .md 파일로 넣어 사용할 것이다.***   
***=> 사전에 생성한 Next JS 앱 폴더의 root에 posts 폴더를 생성하고 그 안에 .md 파일을 생성해 사용할 것이다.***

<img src="\assets\img\posts\nextjs-tutorial\posts_dir.png" style="border: 1px solid gray;" />

- - - 

## 마크다운 파일을 데이터로 추출
마크다운 파일의 텍스트를 데이터로 추출하여 브라우저 DOM에 보여줄 HTML로 변경하기 위함.   
Next JS 앱 폴더의 root에 `lib/posts.ts` 파일를 생성하여 posts에 관련된 함수를 작성한다.

```typescript
// 필요한 npm 모듈 import
import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

// 포스트 폴더의 경로를 가져옴
const postsDirectory = path.join(process.cwd(), 'posts');

// 마크다운 파일로부터 데이터를 추출하는 함수
export function getSortedPostsData() {
    // 포스트 파일 이름을 초기화
    const fileNames = fs.readdirSync(postsDirectory);
    // ['filename1', 'filename2']

    // 파일명을 순회하며 변수에 담기
    const allPostsData = fileNames.map(fileName => {
        // .md 확장자 제거
        const id = fileName.replaceAll(/\.md/, "");

        // posts 폴더 경로 + 파일명
        const fullPath = path.join(postsDirectory, fileName);

        // 파일 본문 읽기
        const fileContents = fs.readFileSync(fullPath, 'utf-8');

        // gray-matter 모듈 사용해 변환
        const matterResult = matter(fileContents);

        // 포스트 데이터를 리턴
        return {
            id,
            ...allPostsData(matterResult.data as { date: string; title: string })
        }
    })

    return allPostsData.sort((a, b) => {
        // 마크다운 파일의 추출한 배열 중 date 값을 비교하여 최신순으로 정렬
        // Date를 내림차순 정렬 수행
        if(a.date < b.date) {
            return 1
        } else {
            return -1
        }
    })
}
```