---
layout: post
title: Jekyll 테마 커스텀 환경 구성(Ruby Installer, )
date: 2022-08-30
updated: 
tags: [jekyll-blog, vscode]
menu: jekyllblog
---
## jekyll 테마를 커스텀 하는 이유
블로그를 시작하기로 마음을 먹고 마음에 드는 Jekyll 테마를 선택했다.   
테마 개발자에게는 미안한 말이지만 꽤 많은 부분에서 100% 만족스럽지는 않았다.

그래서 나는 내가 직접 UI 디자인 커스텀이나, 미비한 기능을 보완하거나, 없는 기능을 추가하기로 했다.

이전 포스팅에서 사용했던 Github Repository와 Github Pages를 활용해   
***테마를 수정할 수 있는 환경을 구성***하고 ***변경점을 배포하는 과정***을 알아보겠다.
* * *
## Git Bash 설치
<img src="https://git-scm.com/images/logo@2x.png" style="width: 20%"/>
테마 커스텀 환경을 구성하고 손쉽게 배포하기 위해서는 Git Bash 설치가 필요하다.   
Git에 대한 이해가 선행되고 이미 설치한 사람은 넘어가도 좋다.

만약 Git이 무엇인지조차 모르는 사람이라면   
서칭을 통해 **형상 관리**와 Git, Github에 대한 어느 정도의 선행하고 진행하기 바란다.

Git 페이지에 접속하여 Git을 설치한다. **[https://git-scm.com/](https://git-scm.com/)**
<img src="\assets\img\posts\how-to-custom-jekyll\git.png" style="border: 1px solid gray;" />
* * *

## git clone을 통해 로컬 레파지토리 구성하기
자신의 PC에 Jekyll Repository 테마 소스를 저장할 경로를 정한다.   
나는 ***C:\JekyllTheme*** 경로로 지정했다.   
<img src="\assets\img\posts\how-to-custom-jekyll\git_repo.png" style="border: 1px solid gray;" /><br>

지정한 경로로 이동하여 탐색기 빈 공간을 우클릭하고 ***Git Bash Here*** 메뉴를 클릭하면   
Git Bash가 실행된다.
<img src="\assets\img\posts\how-to-custom-jekyll\git_bash.png" style="border: 1px solid gray;" /><br>
<img src="\assets\img\posts\how-to-custom-jekyll\git_bash2.png" style="border: 1px solid gray;" /><br>

이전 포스팅에서와 같이 Jekyll 테마를 업로드하고, Github Pages 기능을 통해 호스팅한 자신의 Github Repository로 이동한다.   
복사 버튼을 클릭하여 Repository URL을 복사한다.   
<img src="\assets\img\posts\how-to-custom-jekyll\copy_url.png" style="border: 1px solid gray;" /><br>

Git Bash 쉘에 ***git clone {복사한 Repository URL}***을 입력한다.   
git clone이 정상적으로 이루어지면 ***C:\JekyllTheme\{Repository 이름}*** 폴더가 생성되고 Jekyll 테마가 폴더 아래 다운로드 된다.   
나는 사전에 git clone한 상태라 폴더가 이미 존재한다.
<img src="\assets\img\posts\how-to-custom-jekyll\git_clone.png" style="border: 1px solid gray;" /><br>
* * *

## Ruby Installer 설치
Jekyll은 Ruby 언어로 개발되었으므로 정적 사이트 로컬 빌드/실행, 수정 사항 확인, 디버깅을 위해 Ruby Installer를 설치해야 한다.
<img src="\assets\img\posts\how-to-custom-jekyll\ruby_installer.png" style="width:30%" /><br>

링크로 접속하여 **=> {Ruby Installer}** 표시된 추천 버전으로 설치한다. **[https://rubyinstaller.org/downloads/](https://rubyinstaller.org/downloads/)**
<img src="\assets\img\posts\how-to-custom-jekyll\ruby_installer2.png" style="border: 1px solid gray;" /><br>

다운받은 installer를 실행하면 CMD창이 나타난다.   
1번과 3번을 선택하라는 안내가 나오면 1을(기본설치) 누르고 엔터를 누른다.   
설치가 완료되고 엔터를 한번더 누르면 CMD창이 종료된다.   
<img src="\assets\img\posts\how-to-custom-jekyll\ruby_installer3.png" /><br>
<img src="\assets\img\posts\how-to-custom-jekyll\ruby_installer4.png" />
> [https://ehdtnn.tistory.com/763](https://ehdtnn.tistory.com/763) [ds:티스토리]

* * *

## Bundler 설치 & Jekyll 테마 로컬 실행
Bundler는 정확히 필요한 gem과 그 gem의 버전을 설치하고, 추적하는 것으로 일관성 있는 Ruby 프로젝트를 제공하는 도구라고 설명하고 있다.
> [http://blog.kichul.co.kr/2017/03/24/2017-03-24-using-bundle-in-ruby/](http://blog.kichul.co.kr/2017/03/24/2017-03-24-using-bundle-in-ruby/)

간략히 서칭해본 결과 Ruby에 필요한 의존 라이브러리를 원격에서 설치할 수 있도록 돕는 도구 정도로 이해하면 될 것 같다.   
node의 npm, java의 gradle, maven과 유사하다.

***C:\JekyllTheme\{Repository 이름}*** 경로에서 CMD창을 열고 ***bundle install***을 입력한다.
<img src="\assets\img\posts\how-to-custom-jekyll\bundle_install.png" style="border: 1px solid gray;" /><br>

CMD창에서 ***bundle exec jekyll serve***을 입력한다. 현 폴더의 Jekyll 테마를 로컬에서 기동하는 명령어이다.   
정상적으로 로컬 기동이 완료되면 아래 메시지를 확인할 수 있다.
```
    Server address: http://127.0.0.1:4000
  Server running... press ctrl-c to stop.
```
<img src="\assets\img\posts\how-to-custom-jekyll\run_jekyll.png" style="border: 1px solid gray;" /><br>

이후 브라우저에서 ***http://localhost:4000/*** 로 진입 시 로컬에서 기동한 jekyll 테마 페이지가 출력된다.
<img src="\assets\img\posts\how-to-custom-jekyll\run_jekyll2.png" style="border: 1px solid gray;" /><br>
* * *

## Visual Studio Code
나는 Jekyll 테마 소스를 수정하기 위한 편집기(개발 도구)로 Visual Studio Code를 사용할 것이다.   
물론 다른 편집기를 사용해도 무방하다.   

이하 VS Code는 다양한 확장자에 대해 하이라이팅을 지원하며 파일에 대한 형상 관리가 용이하다.   
다양한 플러그인을 지원할 뿐 아니라 Git Bash를 내부 기본 터미널로 사용이 가능하다.
<img src="https://code.visualstudio.com/opengraphimg/opengraph-home.png" style="border: 1px solid gray; width:50%" /><br>

VS Code를 실행 후 ***폴더 선택***을 클릭하여 작업할 폴더를 선택한다.   
사전에 Jekyll 테마를 git clone 했던 ***C:\JekyllTheme\{Repository 이름}*** 경로를 선택한다.
<img src="\assets\img\posts\how-to-custom-jekyll\vs_code.png" style="border: 1px solid gray;" /><br>
<img src="\assets\img\posts\how-to-custom-jekyll\vs_code2.png" style="border: 1px solid gray;" /><br>