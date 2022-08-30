---
layout: post
title: Jekyll을 사용하여 블로그 만들기(Github Pages 호스팅)
date: 2022-08-29
updated: 
tags: jekyll-blog
menu: jekyllblog
---
## 개인 블로그를 생성한 이유
내가 IT분야에서 첫 발을 내딛은 회사는 솔루션 기반 사업을 주로 수행하는 기업이다.   
신입 JAVA 개발자 라는 모호한 기준 아래 지원했던 나의 현재 롤은   
아이러니하게도 ***개발자와는 다소 거리가 있는 포지션***이다.   

솔루션 엔지니어, 서버/웹 QA, 서버 인프라 담당자   
나의 바람인 개발자와는 다른 업무를 수행한 지 벌써 2년을 채워 간다.

더 늦기 전에 내가 바라는 포지션의 ***개발자로 일하기 위한 공부를 시작***하고,   
***기록으로 남기고자 개인 블로그를 운영***하고자 한다.
* * *
## Jekyll이란 무엇인가?
간단히 말해 ***정적 사이트 생성기***이다. Ruby 언어로 개발되었으며   
다양한 오픈소스 테마를 기반으로 개인 사이트, 블로그를 간단히 생성하고 커스텀할 수 있다.   
DBMS를 사용하지 않아 빠르고, 가볍다.

물론 커스텀을 위해서는 Jekyll의 동작방식과 폴더구조를 어느 정도 이해하고,   
HTML&CSS, liquid, 마크다운 사용방식을 알고 있어야 한다.
<img src="/assets/img/posts/how-to-use-jekyll/jekyll.png" style="width:20%;" /><br>
* * *
## 이 포스트에서 설명할 내용
* Github 레파지토리 생성
* 개인 블로그에 사용할 Jekyll 테마 선택과 Github 업로드
* Github Pages 기능을 활용한 블로그 호스팅

* * *
## Github 레파지토리 생성
우선 Github 페이지에 진입한다. **[https://github.com/](https://github.com/)**   
Github 계정을 보유한 사람은 ***Sign in***을   
가입이 필요한 사람은 ***Sign up***을 클릭하여 로그인
<img src="\assets\img\posts\how-to-use-jekyll\open_github.png" style="border: 1px solid gray;" /><br>

로그인 후 Github Repository를 생성하기 위해 ***New*** 클릭   
***Github Repository란*** Github 라는 서버에 Repository라는 나의 저장 공간을 만든다고 생각하면 이해가 쉽다.<br>
우리는 이 저장 공간에 블로그 소스를 업로드할 것이다.
<img src="\assets\img\posts\how-to-use-jekyll\create_repo.png" style="border: 1px solid gray;" /><br>

***"{사용자 이름}.github.io"***으로 Repository 명을 입력 후 ***Create Repository*** 클릭<br>
미리 생성해두어 이미 존재하는 Repository라는 경고가 표시된다.   
추후 ***"{사용자 이름}.github.io"*** 는 내 블로그의 접속 도메인이 될 예정이다.
<img src="\assets\img\posts\how-to-use-jekyll\create_repo2.png" style="border: 1px solid gray;" />
* * *

## 개인 블로그에 사용할 Jekyll 테마 선택과 Github 업로드
오픈소스로 공개된 Jekyll 테마는 굉장히 다양하다.   
Jekyll 테마를 구글링으로 검색하면 어렵지 않게 마음에 드는 테마를 고를 수 있다.

나는 **[https://jekyll-themes.com/](https://jekyll-themes.com/)** 사이트에서
***"Pudhina Fresh"*** 라는 테마를 선택했다.   
<img src="\assets\img\posts\how-to-use-jekyll\jekyll_theme.png" style="border: 1px solid gray;" /><br>

테마 소스를 내 Github Repository에 업로드하기 위해 우선 다운로드 한다.   
이번 포스팅에서는 Git에 대한 이해도 없이 정적 사이트를 생성하기 위한 사람들을 위해 UI 업로드 방식을 설명한다.   
테마 커스텀 환경을 위해서는 Git을 사용해야 하므로 미리 Git을 사용해 Repository에 업로드해도 무방하다.   

테마 소스는 테마 사이트에서 즉시 다운로드하거나,
<img src="\assets\img\posts\how-to-use-jekyll\jekyll_theme2.png" style="border: 1px solid gray;" /><br>

테마 Repository에 진입하여 ***Download ZIP***을 클릭해도 무방하다.   
<img src="\assets\img\posts\how-to-use-jekyll\jekyll_theme3.png" style="border: 1px solid gray;" /><br>

다운로드 받은 zip파일을 압축 해제한다.   
<img src="\assets\img\posts\how-to-use-jekyll\unzip_theme.png" style="border: 1px solid gray;" /><br>

Github 페이지에서 이전에 생성해둔 Repository로 이동한다.   
<img src="\assets\img\posts\how-to-use-jekyll\my_repo.png" style="border: 1px solid gray;" /><br>

테마 소스를 Repository로 업로드하기 위해 ***Upload files*** 를 클릭한다.   
사전에 업로드 해둔 테마 파일 목록이 출력됩니다.   
<img src="\assets\img\posts\how-to-use-jekyll\my_repo2.png" style="border: 1px solid gray;" /><br>

이전에 압축 해제해둔 테마 파일 전체를 Github으로 드래그 앤 드랍한다.   
업로드 완료 후 ***Commit changes***를 클릭하여 진행   
<img src="\assets\img\posts\how-to-use-jekyll\upload_theme.png" style="border: 1px solid gray;" />
* * *

## Github Pages 기능을 활용한 블로그 호스팅
이전에 생성해둔 Repository로 이동하여 Settigns => Pages 진입   
Source 에서 ***Deploy from a branch*** 클릭    
Branch 에서 main 브랜치, / (root) 경로 선택 후 Save 클릭

순서대로 진행했다면 블로그 소스가 배포되는 데 시간이 소요되므로 잠시 기다린다.   
블로그 소스 배포가 완료되면 ***Your site is live at 사이트 URL*** 문구와 함께 ***Visit Site*** 버튼이 생성된다.   
<img src="\assets\img\posts\how-to-use-jekyll\github_pages.png" style="border: 1px solid gray;" /><br>

사이트 URL 진입 시 나의 블로그가 호스팅된 것을 확인 할 수 있다.   
<img src="\assets\img\posts\how-to-use-jekyll\my_blog.png" style="border: 1px solid gray;" />
* * *

## 다음 포스트
Jekyll 테마를 선택했다면 알게된 점이 하나 있을 것이다.   
누구나 그렇지는 않겠지만 적어도 나는 나에게 100% 만족스러운 테마는 없다는 것을 느꼈다.

UI나 디자인, 기능적인 면에서도 커스텀이 필요하다고 생각했고,   
이후 포스팅에서 선택한 **[테마를 수정하기 위한 환경을 구성]({{site.author.homepage}}2022/08/30/how-to-custom-jekyll.html/)**하는 방법을 알아보자.