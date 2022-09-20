---
layout: post
title: 도커 설치하기
date: 2022-09-20
updated: 
tags: [docker]
menu: clone-reddit
---
## Docker란?
간단히 말해 컨테이너 기반 가상화 도구로 애플리케이션을 신속하게 구축, 테스트 및 배포할 수 있는 소프트웨어 플랫폼이다.
Docker는 소프트웨어를 컨테이너라는 표준화된 유닛으로 패키징하며,   
이 컨테이너에는 라이브러리, 시스템 도구, 코드, 런타임 등 소프트웨어를 실행하는 데 필요한 모든 것이 포함된다.

Docker를 사용하면 현재 컨테이너를 이미지 형태로 원격 저장소에 저장하여   
환경에 구애받지 않고 간단한 애플리케이션을 신속하게 배포 및 확장 가능하다.

***안정적이며 저렴한 방식으로 애플리케이션을 구축, 제공 및 실행할 수 있음을 의미한다.***

VM이 서버 하드웨어를 가상화하는 방식과 비슷하게(직접 관리해야 하는 필요성 제거)   
컨테이너는 서버 운영 체제를 가상화합니다.
<img src="\assets\img\posts\how-to-install-docker\docker.png" style="width: 20%" />

- - - 

## Docker 설치
도커 웹 사이트 진입
[https://www.docker.com/](https://www.docker.com/) 

각자의 운영체제에 맞는 Docker Desktop 설치 (Linux, Windows, Mac etc)   
설치 직후 Docker 사용을 위해서는 PC 재부팅이 필요하니 주의하자.

**Docker 설치 후 사용자 PC 환경 설정에 따라 Hyper-V와 같은 CPU 가상화 설정,**   
**Linux 커널 업데이트와 같은 이슈가 있을 수 있다.**   
**구글링 시 해결법이 간단하게 설명되어 있으니 참고하면 된다.**

도커 설치가 정상적으로 완료되면 아래와 같은 화면을 확인할 수 있다.
<img src="\assets\img\posts\how-to-install-docker\docker-installed.png" style="border: 1px solid gray;" />