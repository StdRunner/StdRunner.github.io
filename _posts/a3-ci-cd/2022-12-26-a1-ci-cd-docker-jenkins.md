---
layout: post
title: CI/CD 환경 구성(Docker Compose로 Jenkins 설치, 빌드 환경 구성)
date: 2022-12-26
updated: 
tags: [jenkins, docker]
menu: ci-cd
---
## 개요
웹 어플리케이션은 크게 두 프로젝트(Server, Front)로 구성되어있을 가능성이 높다.   

1. Server는 말 그대로 ***클라이언트 요청을 처리***하고 ***Database 서비스를 처리***하는 프로젝트이고,   
2. Front는 ***브라우저 위에서 동작하는 화면***으로 ***어플리케이션 클라이언트 역할***을 수행하게된다.

내가 맡고 있는 제품(웹앱)을 기준으로 CI/CD 환경을 구성하는 방법에 대해 정리할 예정이다.

- - -

## Docker
Docker에 대한 설명은 [이전 포스트](https://stdrunner.github.io/2022/09/20/d2-how-to-install-docker-windows.html)를 참고하기 바람.

Docker를 사용해 Jenkins와 DBMS 인스턴스의 가상화 환경을 구성할 것이다.
이를 위해 Docker와 Docker Compose 모듈 설치한다. 
 * *Linux환경에 Docker와 Docker Compose 설치하는 방법은 다른 문서를 참고 바람*
 * [Docker 공식 문서](https://docs.docker.com/desktop/install/linux-install/)
 * [Docker Compose 공식 문서](https://docs.docker.com/compose/install/)

- - -

## Jenkins
Jenkins는 웹 어플리케이션의 빌드/테스트 자동화 과정을 수행하게되며   
개요에서 설명한 ***Server, Front 프로젝트를 통합***하는 과정을 수행하게 된다.

=> <span style="color : #57a;"><b>Server, Front 프로젝트는 각각의 Repository를 가진 별도의 프로젝트이며 하나의 앱으로 동작하기 위해서는   
소스 빌드 및 통합 과정이 반드시 필요하다.</b></span>

Jenkins는 **node.js, gradle, maven, ant** 등 여러 환경의 빌드를 플러그인 형태로 지원하기 때문에   
각 빌드 도구의 버전별로 프로젝트를 관리하기에도 용이하다.

- - -

## Docker Compose로 Jenkins 설치 및 실행
Docker Compose는 Docker 가상화 컨테이너를 사전에 yaml 파일로 정의하여 실행하기 위한 도구이다.   

사전에 yaml파일에 Docker 이미지, 컨테이너 이름, 호스트 서버-컨테이너 간 포트/볼륨 공유 설정,   
전체 수명 주기를 관리 등을 정의한다.

Docker 컨테이너를 실행할 폴더를 생성하고 `docker-compose-jenkins.yml` 파일을 아래와 같이 작성한다.
```yaml
# Docker 버전
version: '3'
# Docker 컨테이너 서비스 정의
services:
  # 젠킨스 컨테이너 서비스 정의
  jenkins:
    # 젠킨스 이미지:태그
    image: jenkins/jenkins:2.346
    # 컨테이너 명
    container_name: jenkins_edm
    stdin_open: true
    # 컨테이너 중단 시 자동 재시작
    restart: always
    # 볼륨 동기화
    volumes:
      - '/home/user/Docker/Jenkins_EDM/jenkins_home:/var/jenkins_home'
    # 컨테이너 실행 USER
    user: root:root
    # 호스트:컨테이너 포트 매핑
    ports:
      - 8083:8080
    # 컨테이너 환경변수
    environment:
```

해당 yaml 파일을 사용해 Docker 컨테이너를 실행하는 쉘 파일 `docker-jenkins.sh`을 아래와 같이 작성한다.
```sh
# docker-compose 
## -f $1    : 파일 명시
## --build  : 캐싱된 이미지가 아닌 이미지 빌드 후 시작
## -d       : Docker 컨테이너 백그라운드 실행

case "$1" in
    'start') # Start Jenkins Docker Container
        echo "Start Jenkins Docker Container...: "
        sudo docker-compose -f ./docker-compose-jenkins.yml up --build -d

        # 직전 실행 커맨트 성공 값 (0 : 성공 / 1 : 실패)
        RVAL=$?
        echo $RVAL
        exit $RVAL
        ;;

    'stop') # Stop Jenkins Docker Container
        echo "Stop Jenkins Docker Container...: "
        sudo docker-compose -f ./docker-compose-jenkins.yml down

        RVAL=$?
        echo $RVAL
        exit $RVAL
        ;;

    'restart') # Restart Jenkins Docker Container
        echo "Restart Jenkins Docker Container...: "
        sudo docker-compose -f ./docker-compose-jenkins.yml down
        sudo docker-compose -f ./docker-compose-jenkins.yml up --build -d

        RVAL=$?
        echo $RVAL
        exit $RVAL
        ;;
esac
```

아래 명령어로 매개변수와 함께 sh파일을 실행하여 Jenkins 컨테이너를 실행한다.
```sh
~$ ./docker-jenkins.sh start
```

Docker 컨테이너 확인 명령어를 통해 아래와 같이 실행된 Jenkins 컨테이너를 확인할 수 있다.
```
~$ docker ps -a
```
```
// STATUS : Up 상태를 통해 정상적으로 실행된 상태임을 알 수 있다.
CONTAINER ID   IMAGE                   COMMAND                  CREATED        STATUS       
12f2141e5d16   jenkins/jenkins:2.346   "/usr/bin/tini -- /u…"   3 months ago   Up 5 weeks   

PORTS                                                   NAMES
50000/tcp, 0.0.0.0:8083->8080/tcp, :::8083->8080/tcp    jenkins_edm
```

=> <span style="color : #57a;"><b>컨테이너를 실행중인 서버의 8083 포트로 접속 시 Jenkins 로그인 화면을 확인할 수 있다.</b></span>
<img src="\assets\img\posts\ci-cd\jenkins-login.png" style="border : 1px solid gray;"/>

- - -

## Jenkins Plugin 설치
처음 젠킨스 컨테이너를 시작하고 접속하면 필요한 플러그인을 선택하고 설치를 진행하게 된다.   
플러그인 간 의존성으로 처음부터 설치 요청한 모든 플러그인이 정상적으로 설치되지 않을 수 있다.   
스킵하고 진행 하더라도 **Jenkins 플러그인 관리**메뉴에서 재설치가 가능하다.

Jenkins에서는 Job 이라는 단위의 Task를 생성하여 프로젝트를 빌드하고 통합하는 과정을 거치게 되므로   
**node.js, gradle, maven, ant** 등 프로젝트 별 빌드에 필요한 플러그인을 설치해야한다.

`Jenkins 대시보드 >> Jenkins 관리` 메뉴로 진입한다.
<img src="\assets\img\posts\ci-cd\jenkins-menu.png" style="border : 1px solid gray; width : 30%;"/>

`플러그인 관리`를 클릭한다.
<img src="\assets\img\posts\ci-cd\plugin-mng.png" style="border : 1px solid gray; "/>

각자의 프로젝트 빌드 환경에 맞는 플러그인을 설치해준다.   
나는 **Gitlab, gradle, Apache Ant, NodeJS** 플러그인을 설치해줄 것이다.   

현재 레파지토리를 Gitlab으로 관리하고 있으므로 Gitlab 플러그인을 추가 설치해준다.

<img src="\assets\img\posts\ci-cd\plugins.png" style="border : 1px solid gray; width: 70%"/>

#### Jenkins Global Tool Configuration
앞서 설치한 빌드 툴 플러그인을 Jenkins 전역에서 사용하기 위해   
`Jenkins 대시보드 >> Jenkins 관리 >> Global Tool Configuration` 메뉴로 진입한다.
<img src="\assets\img\posts\ci-cd\global-tools.png" style="border : 1px solid gray; width: 100%"/>

프로젝트에서 빌드에 사용하고 있는 gradle 버전에 맞게 **버전을 선택**하고   
Jenkins Job에서 어플리케이션 빌드/통합 과정에서 **참조할 gradle의 name을 입력**하고 저장한다.   \

단일 빌드 환경이라면 간단하게 gradle로 입력하면 된다.   
**다중 버전의 빌드 환경이라면 gradle 버전을 추가하고 configuration name을 다르게 저장**하면 된다.
<img src="\assets\img\posts\ci-cd\gradle-setting.png" style="border : 1px solid gray; width: 100%"/>

Apache Ant, NodeJS도 마찬가지로 설정해준다.
<img src="\assets\img\posts\ci-cd\ant-setting.png" style="border : 1px solid gray; width: 100%"/>
<img src="\assets\img\posts\ci-cd\nodejs-setting.png" style="border : 1px solid gray; width: 100%"/>

- - -

## Gitlab credential 추가
내 시스템에서 소스 레파지토리는 Gitlab에서 관리하고 있으므로 Jenkins에서 레파지토리에 접근하여   
소스를 빌드하기 위해 Gitlab credential을 추가해야 한다.

1. 젠킨스 대시보드 메뉴 중 `Jenkins 관리` 클릭
<img src="\assets\img\posts\ci-cd\jenkins-menu.png" style="border : 1px solid gray; width: 30%"/>

2. `Security > Manage Credential` 클릭
<img src="\assets\img\posts\ci-cd\mng-credential.png" style="border : 1px solid gray; width: 100%"/>

3. `global scope` 클릭 후 `Add credential` 클릭
<img src="\assets\img\posts\ci-cd\add-credential.png" style="border : 1px solid gray; width: 100%"/>

4. 아래 내용을 입력하고 `Create` 버튼을 눌러 프로젝트 레파지토리에 접근 가능한 Gitlab Credential을 등록한다.
* Username with password : id, pw를 사용한 인증
* Scope : Credential의 사용 가능 범위를 지정
* Username : Gitlab 사용자 이름 
  + 로그인 E-mail이 아닌 사용자 이름만 입력
* Passowrd : Gitlab 사용자 패스워드
* ID : 해당 Credential을 참조하기 위한 고유 ID
* Description : Credential에 대한 간단한 설명
<img src="\assets\img\posts\ci-cd\add-credential2.png" style="border : 1px solid gray; width: 100%"/>