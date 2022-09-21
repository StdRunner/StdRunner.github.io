---
layout: post
title: Vanilla.js 모달(Modal) 만들기
date: 2022-09-21
updated: 
tags: [vanilla-js, html-css]
menu: jekyllblog
---
## 개요
처음엔 이력서 양식으로 블로그 내 하나의 페이지를 구성하고자 했다.   
블로그 URL만으로 내 정보와 이력을 조회할 수 있어 접근성, 준비성 면에서 좋겠다고 생각을 했다.

개인정보가 포함된 페이지이다 보니 누구에게나 공개할 수는 없었고      
패스워드 모달을 통해 접근을 제한하고자 했으나, 서버를 두지 않는 정적 페이지 특성상   
브라우저에 패스워드를 저장하지 않고는, 인증 처리를 간단히 수행할 방법이 없겠다는 결론이 나왔다.

해시 알고리즘을 사용하면 평문 그대로를 노출하지는 않겠지만, 그렇게까지 구현할 필요를 느끼지 못했다.

거두절미하고 Vanilla.js, Html, CSS 만을 활용한 Modal 생성 방법을 설명하겠다.

- - -

## 모달 템플릿
간단한 모달의 템플릿을 생성한다.

#### 모달 템플릿
```javascript
<div class="modal hidden" id="modal">
    <div class="modal-header">
        <span class="modal-title">{모달 제목}</span>
    </div>

    <div class="modal-content">
        <span>{모달 내용}</span>
    </div>

    <div class="modal-footer">  
        <button class="confirm-btn">{확인}</button>
        <button class="cancel-btn">{취소}</button>
    </div>
</div>
```
모달 자체를 출력할 템플릿으로 각 하위 템플릿의 구성은 아래와 같다.
* `career-password__header` : 모달의 제목이 들어갈 부분
* `career-password__content` : 모달의 내용이 들어가는 부분
모달 설명과 패스워드 입력란이 들어가게 될 것이다.
* `career-password__footer` : 모달의 버튼이 출력된느 부분
 
#### 배경 템플릿
```javascript
<div class="modal-background hidden" id="modal-bg"></div>
```
모달의 배경으로 모달 외 부분을 비활성화하고, 모달 창 외 부분을 클릭 시   
모달이 클로즈 되도록하는 역할.

[모달 예시]
<img src="\assets\img\posts\javascript modal\modal.png" style="border: 1px solid gray;" /><br>

- - -

## 모달 스타일
모달을 화면에 중앙에 위치 시키거나, 모달과 모달 배경의 상하를 결정한다.
기타 기입되지 않은 스타일은 자유롭게 추가한다.

#### 모달 템플릿 스타일
```css
.modal {
    z-index: 101;               /* 모달 배경과의 앞 뒤 순서를 명시 */
    position: absolute;         /* 모달의 위치를 절대 위치로 */
    width: 370px;               /* 모달 너비 */
    height: 190px;              /* 모달 높이 */
    padding: 5px 10px 10px;     /* 모달 패딩 */
    border-radius: 5px;         /* 모서리 둥글게 */
    background-color: white;    /* 모달 배경색 */
    top: 20%;                   /* 모달의 상하 : 화면의 20% 지점 */
    left: calc(50% - 185px);    /* 모달의 좌우 : 정 중앙 위치 */
}
```

#### 배경 템플릿 스타일
```css
.modal-background {
    z-index: 100;               /* 모달과의 앞 뒤 순서를 명시 */
    position: absolute;         /* 모달의 위치를 절대 위치로 */
    top: 0;                     /* 모달 상하 시작지점 */
    left: 0;                    /* 모달 좌우 시작지점 */
    width: 100%;                /* 모달 너비 */
    height: 100%;               /* 모달 높이 */
    background-color: #66666644 /* 배경색 */
}
```

#### hidden 클래스 스타일
모달과 배경은 hidden 클래스를 추가하여 기본적으로 보이지 않도록 한다.
```css
.hidden {
    display: none;
}
```

#### 모달 애니메이션
아래와 같이 모달이 나타나는 효과와 사라지는 효과를 정의하고,   
모달과, 모달 배경에 javascript로 적용할 것이다.
(fade-in, fade-out)

 - 0.2초에 걸쳐 투명도가 0에서 1으로
 - 0.2초에 걸쳐 투명도가 1에서 0으로

```css
/* Animation */
.appear {
    animation: fade-in 0.2s;
    display: block;
}

.disappear {
    animation: fade-out 0.2s;
}

@keyframes fade-in {
    from {
        opacity: 0;
    }
    to {
        opacity: 1;
    }
}

@keyframes fade-out {
    from {
        opacity: 1;

    }
    to {
        opacity: 0;
    }
}
```

- - -

## Javascript 
앞서 생성한 템플릿과, 스타일을 활용해서 모달이 나타나고, 사라지는 기능을 구현한다.

모달을 나타나게 하는 함수를 구현하고, DOM 엘리먼트에서 이벤트발생 시 함수를 호출해준다.   
***[버튼]***
```html
<button onclick="showPasswordModal()">Button</button>
```
***[함수]***
```javascript
function showPasswordModal() {
    const modal = document.getElementById('modal');
    const modalBg = document.getElementById('modal-bg');

    modal.classList.remove('disappear');
    modalBg.classList.remove('disappear');
    modal.classList.add('appear');
    modalBg.classList.add('appear');
}
```

모달을 사라지게 하는 함수를 구현하고, DOM 엘리먼트에서 이벤트발생 시 함수를 호출해준다.   

fade-in, fade-out 애니메이션이 0.2초간 실행되나, setTimeout 설정을 190ms인 이유는   
200으로 설정할 경우 
fade-out 완료 이후 appear 클래스가 제거되는 타이밍 이슈로 DOM이 깜빡이는 것 같은 효과가 종종 발생함   

***[버튼]***
```html
<button class="cancel-btn">{취소}</button>
```
***[함수]***
```javascript
function hidePasswordModal() {
    const modal = document.getElementById('modal');
    const modalBg = document.getElementById('modal-bg');

    modal.classList.add('disappear');
    modalBg.classList.add('disappear');

    setTimeout(function(){
        modal.classList.remove('appear');
        modalBg.classList.remove('appear');
    }, 190);
}
```