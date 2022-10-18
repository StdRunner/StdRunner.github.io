---
layout: post
title: Pre-rendering
date: 2022-09-12
updated: 
tags: next-js
menu: clone-reddit
---
## Next JS 와 Pre-rendering
Next JS는 모든 페이지를 pre-rendering한다.   

***pre-rendering***한다는 의미는 모든 페이지를 위한 HTML을 Client 사이드에서 Javascript로 처리하기 전,   
***사전에*** 생성한다는 것을 의미한다.   
이렇게 하기 때문에 SEO(Search Engine Obtivization), 검색 엔진 최적화에 유리.

* * *

## Pre-rendering 테스트
브라우저에서 Javascript 사용을 하지 못하도록 만들면 Client 사이드(브라우저)에서   
Pre-rendering한 HTML을 확인할 수 있다.

#### 1. Javascript 비활성화
우선 브라우저(Chrome) 개발자 도구로 진입한다.   
<img src="\assets\img\posts\what-is-pre-rendering\browser_dev.png" style="border: 1px solid gray;" />

우측 상단의 Settings(톱니바퀴 아이콘)을 클릭한 후   
***Disable Javascript***를 체크해준다
<img src="\assets\img\posts\what-is-pre-rendering\dis_js.png" style="border: 1px solid gray;" />

개발자 도구 설정을 나와 Source 탭에 ! 아이콘이 생성되면   
브라우저에서 정상적으로 Javascript를 비활성화한 것을 확인할 수 있다.   
<img src="\assets\img\posts\what-is-pre-rendering\confirm_dis_js.png" style="border: 1px solid gray;" />

#### 2. 보통 React 사이트 진입 (No Pre-rendering)
React JS 사이트에 진입하여 Javascript 처리 전 Pre-rendering여부를 확인해보자
```
https://create-react-app.examples.vercel.com/
```

Javascript 비활성 후 React 페이지를 새로고침하면   
***You need to enable JavaScript to run this app.*** 문구와 함께    
보통의 React App에서는 Javascript 처리 전 Client사이드에서 HTML을 생성하는 의미인   
Pre-rendering을 하지 않음을 알 수 있다.
<img src="\assets\img\posts\what-is-pre-rendering\react_app_no_js.png" style="border: 1px solid gray; width: 80%;" />

#### 3. Next JS 사이트 진입 (Pre-rendering)
Next JS 사이트에 진입하여 Javascript 처리 전 Pre-rendering여부를 확인해보자
```
https://next-learn-starter.vercel.app/
```

Javascript 비활성 후 Next 페이지를 새로고침해도    
기존과 ***동일한 페이지를 로드***하고있으므로 Javascript 처리 전에 HTML을 미리 생성하는    
Pre-rendering을 하고 있음을 알 수 있다.
<img src="\assets\img\posts\what-is-pre-rendering\next_app_no_js.png" style="border: 1px solid gray; width: 80%;" />

## Summary
<img src="\assets\img\posts\what-is-pre-rendering\no_pre_rendering.png" style="border: 1px solid gray; width: 80%;" />
* Normal React App
  + 최초 Load
    - Not use Pre-rendering
    - 첫 화면에서 보여줄 HTML 없음
  + JS Load
  + Hydration
    - 리액트 컴포넌트 초기화
    - App 상호작용 가능      

<br>
<img src="\assets\img\posts\what-is-pre-rendering\pre_rendering.png" style="border: 1px solid gray; width: 80%;" />
* Next JS App
  + 최초 Load
    - use Pre-rendering
  + JS Load
  + Hydration
    - 리액트 컴포넌트 초기화
    - App 상호작용 가능    