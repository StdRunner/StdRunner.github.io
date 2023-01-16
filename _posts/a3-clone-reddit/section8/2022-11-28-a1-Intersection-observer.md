---
layout: post
title: Intersection observer
date: 2022-11-28
updated: 
tags: [typescript, next-js, tailwindcss]
menu: clone-reddit
---
## Intersection observer
화면에 DOM 엘리먼트가 교차되는 것을 감시하고 개발자가 정의한 부분만큼 교차되었을 때   
원하는 로직을 실행하기 위해 사용한다.

`threshold`는 DOM엘리먼트가 뷰포트와 교차된 비율을 의미하며 해당 비율만큼 교차되었을 때 구문이 실행됨을 의미한다.

<img src='\assets\img\posts\section8\intersection-observer-01.png' style='border: 1px solid gray; width: 80%'>   

<img src='\assets\img\posts\section8\intersection-observer-02.png' style='border: 1px solid gray; width: 80%'>   

<img src='\assets\img\posts\section8\intersection-observer-03.png' style='border: 1px solid gray; width: 80%'>

## 마지막 포스트가 화면에 교차되었을 때 다음 포스트 가져오기
`reddit-clone-app\client\src\pages\index.tsx` 파일에 아래 내용을 추가한다.
```typescript
...생략
    // 현재 감시중인 ELEMENT의 id값 state
    const [observedPost, setObservedPost] = useState("");

    // 컴포넌트가 렌더링될 때 실행되는 React 훅
    useEffect(() => {
        // 포스트가 없다면 return
        if(!posts || posts.length === 0) return;
        // posts 배열 안에 마지막 post의 id를 가져온다.
        const id = posts[posts.length-1].identifier;
        // posts 배열에 post가 추가돼서 마지막 post가 바뀌었다면
        // 바뀐 post 중 마지막 post를 odbservedPost 로
        if(id !== observedPost) {
            setObservedPost(id);
            observeElement(document.getElementById(id));
        }
    }, [posts])

    // 새로 포스트 데이터를 가져왔을 때 동작
    const observeElement = (element: HTMLElement | null) => {
        if(!element) return;
        // 브라우저 뷰포트(ViewPort)와 설정한 요소(Element)의 교차점을 관찰
        const observer = new IntersectionObserver(
        // entries는 IntersectionObserverEntry 인스턴스의 배열
        (entries) => {
            // isIntersecting: 관찰 대상의 교차 상태 (Boolean)
            if(entries[0].isIntersecting === true) {
            console.log("마지막 포스트에 왔습니다.");
            // 다음 페이지로 이동
            setPage(page + 1);
            // 지금까지 감시중인 element를 제거
            observer.unobserve(element);
            }
        },
        {threshold: 1}
        );
        // 새로운 element 감시 시작
        observer.observe(element);
    }
...생략
```