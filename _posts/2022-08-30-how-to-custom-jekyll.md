---
layout: post
title: Jekyll 테마 커스텀 환경 구성(Ruby Installer, VS Code)
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
* * *

## 변경점 Github commit, 배포
소스 편집기로 VS Code를 사용한다고 가정하고 소스 변경점을 Github Repository에 push 하고   
Github Pages 배포하는 과정을 알아보자.

변경된 파일들은 로컬 Repository 내에만 존재하고 있으므로 Github Repository에 commit&push할 것이다.   
변경된 소스가 ***로컬 Repository에서 Github Repository(원격 레파지토리)로 push***되면 Github Pages가 자동으로   
변경된 페이지를 배포할 것이다.

소스 clone 이후 VS Code로 테마 소스를 변경했다면, 좌측 ***소스 제어*** 탭에 변경파일이 표시된다.
<img src="\assets\img\posts\how-to-custom-jekyll\src_ctrl.png" style="border: 1px solid gray;" /><br>

로컬 Repository에 변경사항을 저장하기 위해 커밋 버튼을 클릭하면 아래 팝업이 출력된다.   
커밋 전 변경 사항을 저장하는 스테이징 영역에 아무것도 없으니 변경사항을 스테이징 후 커밋하겠냐는 의미이다.   
예를 클릭하면 커밋된다.   
<img src="\assets\img\posts\how-to-custom-jekyll\commit_btn.png" style="border: 1px solid gray; width: 50%" /><br>
<img src="\assets\img\posts\how-to-custom-jekyll\commit_alert.png" style="border: 1px solid gray; width: 40%" /><br>

예를 누르면 ***커밋 메시지를 입력하는 페이지***가 나타난다.   
메시지 없이 커밋할 수 없으며, 메시지 입력 후 해당 페이지를 닫으면 커밋이 완료되고,   
메시지 입력 없이 페이지를 닫으면 커밋이 진행되지 않는다.
<img src="\assets\img\posts\how-to-custom-jekyll\commit_msg.png" style="border: 1px solid gray; width: 80%" /><br>

로컬 Repository에 commit을 완료했으면 Github Repository(원격 저장소)로 push해야 비로소 소스 수정이 완료된다.
<img src="\assets\img\posts\how-to-custom-jekyll\push_origin.png" style="border: 1px solid gray; width: 50%" /><br>

수정 사항을 Github에 push하고, Github Repository로 이동하여 Actions를 클릭하면   
조금 전 push로 인한 Github Pages 배포 작업 상태를 확인할 수 있다.
<img src="\assets\img\posts\how-to-custom-jekyll\deploy_status.png" style="border: 1px solid gray;" /><br>

현재 배포중인 작업을 클릭하면 세부적인 배포 작업 상태를 알 수 있다.   
배포 작업이 성공하면 Job 상태가 <span style="color:green; font-weight: bold;">녹색(V)</span> 체크 표시로 변경되고   
Pages URL로 접근하면 변경사항이 적용되어 배포되어 있음을 확인할 수 있다.
<img src="\assets\img\posts\how-to-custom-jekyll\deploy_status2.png" style="border: 1px solid gray;" /><br>
* * *

### 포스팅을 마치며
여기까지 Jekyll 테마 커스텀 환경 구성이 완료되었다.   

나는 Jekyll 테마 커스텀을 무작정 시작하다보니 UI변경, 기능 보완/추가 작업을 진행하는데 생각보다 삽질을 많이 했다.   
만약 시간 투자와 삽질할 여건이 되지 않는 사람은 티스토리, 네이버 등 기존 블로그 플랫폼을 이용하는 것도 하나의 방법이다.   

직접 Jekyll 테마를 수정할 사람이라면 HTML&CSS, js는 당연하고   
***Jekyll 테마 동작 방식, 폴더 구조, liquid, 마크다운***에 대한 이해를 선행하기 바란다.   