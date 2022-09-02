---
layout: post
title: Next JS란?, Next JS를 사용하는 이유
date: 2022-09-01
updated: 
tags: next-js
menu: clone-reddit
---
## Next JS란?
React의 SSR(Server Side Rendering)을 쉽게 구현할 수 있게 도와주는 간단한 프레임워크. (리액트는 라이브러리)   
React로 개발할 때 SPA(Single Page Application)을 이용하여 CSR(Client Side Rendering)을 하기 때문에 좋은 점도 있지만   
단점도 있는데 그 부분이 ***바로 검색 엔진 최적화(SEO)*** 부분이다.   
Client Side Rendering을 하면 첫페이지에서 빈 html을 가져와 JS파일을 해석하여 화면을 구성하기 때문에  
포털 검색에 거의 노출 될 일이 없다.

하지만 ***Next.js***에서는 Pre-Rendering을 통해서 페이지를 미리 렌더링 하며 ***완성된 HTML***을 가져오기 때문에 사용자와 검색 엔진   
크롤러에게 ***바로 렌더링 된 페이지를 전달***할 수 있게 된다.

React에서도 SSR을 지원하지만 구현하기 굉장히 복잡하기 때문에 Next.js를 통해서 이 문제를 해결해주게 된다.

#### CSR 동작 순서
1. 브라우저(클라이언트)에 서버 응답
2. 브라우저가 Javascript 다운로드
3. 브라우저가 React를 실행
4. 이후 페이지가 렌더링 및 상호작용 ***(C-S)*** <span style="color: chocolate; font-weight: bold;">(Viewable)</span>   

#### SSR 동작 순서
1. 서버가 준비된 HTMl 페이지를 브라우저(클라이언트)로 응답
2. 브라우저는 서버가 응답한 페이지 렌더링, Javascript 다운로드 <span style="color: chocolate; font-weight: bold;">(Viewable)</span>
3. 브라우저가 React를 실행
4. 페이지 상호작용 ***(C-S)***

#### Server Side Rendering
- 클라이언트 대신 ***서버에서 페이지를 준비***하는 원리 
  + 많은 레거시 페이지들이 HTML, JSP 기반 SSR을 사용.   
<br>
- 원래 React에서는 클라이언트 사이드 렌더링하기 때문에 서버에서 클라이언트로 응답해서 보낸 html도 거의 빈 페이지
  + <span style="color: crimson; font-weight: bold;">[단점]</span> 이 방식은 서버에서 데이터를 가져올 때 지연 시간 발생으로 UX 측면에서 좋지 않을 수 있습니다.
  + <span style="color: crimson; font-weight: bold;">[단점]</span> 검색 엔진에 검색 시 웹 클롤링이 동작할 때 내용을 제대로 가져와 읽을 수 없기에 검색엔진 최적화에 문제가 된다.   
    * <span style="color: #57a; font-style: italic">검색 엔진 최적화?<span>   
      <span style="color: #57a; font-style: italic"> : 구글 또는 네이버와 같은 검색 엔진에서 키워드를 입력했을 때 검색이 잘 될 수 있도록 하는 구조화<span>   
<br>
- Next.js에서는 서버 사이드 렌더링을 이용하므로 사용자와 검색 엔진 크롤러에게 ***바로 렌더링 된 페이지를 전달*** 할 수 있어   
검색엔진 최적화에 좋은 영향을 준다.
* * *

## Next JS를 앱 만들기
선행 사항으로 Node.js가 설치되어 있어야 한다.
우선 Next JS를 사용해 기본 앱을 만들 폴더를 생성한다.

나는 nextjs-app으로 이름을 정했다
<img src="\assets\img\posts\what-is-nextjs\make_dir.png" style="border: 1px solid gray; width: 80%" /><br>

생성한 폴더 경로에서 터미널(CMD 등)을 열어 다음 명령어를 입력한다.   
`npx create-next-app@latest --typescript ./`   

현재 경로(./)를 입력 시 앱 폴더를 따로 생성하지 않고 현재 폴더를 앱 폴더로 사용한다.   
앱 폴더명을 지정해 생성하고 싶은 사람은 `./`를 입력하지 않아도 괜찮다.   

앱 생성이 완료되면
아래와 같은 폴더 구조가 생성된다.

<img src="\assets\img\posts\what-is-nextjs\nextjs_app.png" style="border: 1px solid gray;" /><br>