---
layout: post
title: EC2 인스턴스에 Docker 설치 및 실행
date: 2022-12-30
updated: 
tags: [typescript, next-js, tailwindcss, aws, docker]
menu: clone-reddit
---
## AWS EC2 인스턴스 생성
AWS 계정을 생성하고 EC2 인스턴스를 프리티어(무료)로 사용하는 방법에 대해서는 사전에   
블로그에 작성한 포스트를 참고하면 된다.
해당 포스트에서는 아마존 리눅스 2 이미지를 사용해 서버를 구성했으므로 필요에 따라 다른   
이미지를 선택해도 무방하다.

* [무료로 AWS EC2 인스턴스 사용하기(프리 티어)](https://stdrunner.github.io/2022/10/18/a1-create-ec2-free.html)

- - - 

## AWS에 Docker 설치
내가 사용하는 AWS 서버 OS 이미지는 아마존 리눅스 버전2이므로   
Docker와 Docker Compose 확장 설치는 해당 OS 기준으로 작성하겠다.

다른 OS의 Docker 설치는 잘 작성된 오픈소스가 많이 존재하며 공식 문서를 참고해서 설치해도 무방하다.

* [Docker 공식 문서](https://docs.docker.com/get-started/)

#### Docker 설치
AWS 프리티어 서버를 사용하고 있으므로 root계정으로 접속 후 아래 명령을 사용해 Docker를 설치한다.
```
~$ yum install docker -y
```

정상적으로 Docker가 설치되었는지 확인하기 위해서는 아래 명령어를 입력한다. 
Docker가 정상 설치되었다면 설치된 Docker 버전을 쉘에 출력한다.
```
~$ docker -v
```
<img src='\assets\img\posts\section9\docker-version.png' style='border: 1px solid gray; width: 40%'>  

#### Docker Compose 설치
Docker Compose는 Docker 가상화 컨테이너를 사전에 yaml 파일로 정의하여 실행하기 위한 도구이다.
Docker Compose를 설치하는 방법은 다양하다. 오픈소스 또는 공식 문서를 참조해도 상관 없다.

* [Docker Compose 설치 문서](https://docs.docker.com/get-started/08_using_compose/)

사전에 yaml파일에 `Docker 이미지, 컨테이너 이름, 호스트 서버-컨테이너 간 포트/볼륨 공유 설정,   
전체 수명 주기를 관리` 등을 정의한다.

아래 명령을 사용해 Docker Compose를 설치한다.
```
sudo curl -L https://github.com/docker/compose/releases/download/1.22.0/docker-compose-$(uname -s)-$(uname -m) -o /usr/local/bin/docker-compose
```

Docker Compose 정상 설치를 확인하기 위해 아래 명령어를 쉘에 입력한다.   
Docker Compose가 정상 설치되었다면 설치된 Docker Compose의 버전을 쉘에 출력한다.
```
~$ docker-compose --version
```
<img src='\assets\img\posts\section9\docker-compose-version.png' style='border: 1px solid gray; width: 50%'>  

- - - 

