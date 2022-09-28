---
layout: post
title: Data Fetching
date: 2022-09-12
updated: 
tags: next-js
menu: clone-reddit
---
## Data Fetching
보통 React JS에서 데이터를 가져올 때 useEffect 안에서 가져온다.   
하지만 Next JS 에서는 다른 방법을 사용해서 가져오는데 무엇인지 알아보자.

#### getStaticProps
Static Generation으로 빌드(build)할 때 데이터를 불러온다.   
(데이터를 미리 만들어 둠)

* ***getStaticProps***를 사용해야 할 때
  * 페이지를 렌더링하는 데 필요한 데이터. 사용자의 요청보다 먼저 build 시간에 필요한 데이터를 가져올 때
  * 데이터는 Headless CMS에서 데이터를 가져올 때
  * 데이터를 공개적으로 캐시할 수 있을 때(사용자별이 아님)
  * 페이지는 미리 렌더링되어야 하고(SEO의 경우) 매우 빨라야할 때.   
   (getStaticProps는 성능을 위해 CDM에서 캐시할 수 있는 HTML 및 JSON 파일을 생성합니다)

#### getStaticPaths
Static Generation으로 데이터에 기반하여 pre-render시 특정한 동적 라우팅 구현   
`(/pages/post/[id].js)`

동적 라우팅이 필요할 때 getStaticPaths로 경로 리스트를 정의하고, build 시간에 렌더링된다.
Next JS는 pre-rendering에서 정적으로 getStaticPaths에서 호출하는 경로들을 가져온다.

* paths
  + 어떠한 context path가 pre-render 될지를 결정한다.
  + 만약 `/pages/posts/[id].js` 라는 이름의 동적 라우팅을 사용하는 페이지가 있다면 아래와 같다.   
  ```javascript
  return {
    paths: [
      { params: {id: '1'} },
      { params: {id: '2'} }
    ],
    fallback: ...
  }
  ```
  + 빌드하는 동안 `/posts/1`과 `/posts/2`를 생성

* params
  + 페이지 이름이 `/pages/posts/[postId]/[commentId]` 라면, params는 postId와 commentId이다.
  + 만약 페이지 이름이 `/pages/[...slug]` 와 같이 모든 경로를 사용한다면, params는 slug가 담긴 배열이어야 한다. ['postId', 'commentId']

* fallback
  + false 라면 getStaticPaths로 리턴되지 않는 것은 모두 404 페이지 출력
  + true 하면 getStaticPaths로 리턴되지 않는 것은 404가 아닌, fallback 페이지가 출력 (개발자가 의도한 페이지)

#### getServerSideProps 
Server Side Rendering으로 요청이 있을 때 데이터를 불러온다.

getServerSideProps 함수를 async로 export하면,   
Next는 각 요청마다 리턴된 데이터를 getServerSideProps로 pre-redner 한다.

* ***getServerSideProps***를 사용해야 할 때
  * 요청할 때 데이터를 가져와야 하는 페이지를 미리 렌더링 해야할 때 사용.   
 서버가 모든 요청에 대한 결과를 계산하고, 추가 구성 없이 CDM에 의해 결과를 캐시할 수 없기 때문에 첫 번째 바이트까지의 시간은
 getStaticProps보다 느리다.

  * 변화 주기가 짧은 데이터를 화면에 렌더링해야할 때 사용