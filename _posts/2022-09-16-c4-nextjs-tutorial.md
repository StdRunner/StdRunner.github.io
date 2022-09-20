---
layout: post
title: Next JS Tutorial2 (간단한 Blog)
date: 2022-09-16
updated: 
tags: [next-js, typescript]
menu: clone-reddit
---
## getStaticProps를 이용한 포스트 리스트 나열
* props로 포스트 데이터 가져오기
  +  index.tsx   

        ```javascript
        // getStaticProps 의 반환값(포스팅 md파일 데이터)을 빌드 시 가져옴
        const Home = ({allPostsData}: {
            allPostsData: {
                date: string
                title: string
                id: string 
            }[]
        }) => {
            return (
                <HTML>
                    ...
                </HTML>
            )
        }

        export default Home

        // lib/post.js 에서 생성한 md파일 데이터 추출 함수 호출부
        export const getStaticProps: GetStaticProps = async () => {
            const allPostsData = getSortedPostsData();

            return {
                props: {
                allPostsData
                }
            }
        }
        ``` 
* 가져온 리스트 나열하기
    ```javascript
    <HTML>
        ...
        {allPostsData.map(({id, title, date}) => 
            <li className={homeStyles.listItem} key={id}>
            <a>{title}</a>
            <br />
            <small className={homeStyles.lightText}>
                {date}
            </small>
            </li>
        )}
        ...
    </HTML>
    ```

- - -

## 포스트 자세히 보기 페이지로 이동(file system 기반의 라우팅)
* 파일 기반 네비게이션 기능    
  리액트에는 route를 위해 react-router라는 lib를 사용하지만   
  Next JS에는 페이지 개념을 기반으로 구축된 파일 시스템 기반 라우터가 있다.   

  파일이 페이지 디렉토리에 추가되면 자동으로 경로로 사용할 수 있다.    
  ***페이지 디렉토리 내의 파일은 가장 일반적인 패턴을 정의***하는데 사용한다.

* 예시
  + `pages/index.js` -> `/`
  + `pages/blog/index.js` -> `/blog`

  + `pages/blog/first-post.js` -> `/blog/first-post`

  + `pages/blog/[slug].js` -> `/blog/:slug`(/blog/hello-world)
  + `pages/[username]/settings.js` -> `/:username/settings` (/foo/settings)
  + `pages/post/[...all].js` -> `/post/*` (/post/2020/id/title)
<br><br>
* 포스트 라우팅 파일 생성
  - `/pages/post` 폴더 생성
  - `/pages/post/[id].tsx]` 파일 생성

    ```javascript
    import React from "react";

    const Post = () => {
        return (
            <div>[id]</div>
        )
    }

    export default Post
    ```

* 링크 함수를 이용한 페이지 이동   
    ```HTML
    <Link href={`/post/${id}`}>
        <a>{title}</a>
    </Link>
    ```

    포스팅 제목 클릭 시 title 기반 routing 구현됨
    <img src="\assets\img\posts\nextjs-tutorial2\route.png" style="border: 1px solid gray; width: 80%" />