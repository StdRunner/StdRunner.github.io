---
layout: post
title: 도커를 이용한 Postgres 실행
date: 2022-09-21
updated: 
tags: [docker, postgresql]
menu: clone-reddit
---
## docker-compose를 사용해 Postgresql 컨테이너 실행
docker-compose란 Docker 이미지를 이용해 컨테이너를 실행하는 것에 더해
`docker-compose.yml`, `Dockerfile` 등의 설정파일을 사용하여   
host/guest 포트 설정, volume 매핑, 환경변수 설정, 컨테이너 실행 후 shell 수행 등   
다양한 설정을 추가할 수 있는 Docker의 기능이다.

#### docker-compose.yml 파일 생성
`reddit-clone-app/` 경로에 `docker-compose.yml` 파일 생성하여 아래 내용 기입한다.
```yml
version: "3"
services:
    db:
        image: postgres:latest
        container_name: postgres
        restart: always
        ports:
            - "5432:5432"
        environment:
            POSTGRES_USER: "${DB_USER_ID}"
            POSTGRES_PASSWORD: "${DB_USER_PASSWORD}"
        volumes:
            - ./data:/var/lib/postgresql/data
```

동일 경로에 `DB_USER_ID`, `DB_USER_PASSWORD` 프로퍼티를 저장할 `.env`파일을 생성하고 아래 내용을 기입한다.
```properties
DB_USER_ID=postgres
DB_USER_PASSWORD=1234
```

#### 컨테이너 볼륨을 매핑 하는 data 폴더 생성
`reddit-clone-app/` 경로에 `data` 폴더를 생성한다.   
Postgresql 컨테이너가 실행되면서 data파일을 이곳에 저장하고 Postgresql 컨테이너와 볼륨을 공유하게 된다.

#### docker-compose로 Postgresql 컨테이너 실행
`reddit-clone-app/` 경로 터미널에서 아래 명령어를 실행한다.   

해당 경로의 `docker-compose.yml` 파일을 참조하여 docker 이미지를 사용해
컨테이너를 실행하게 된다.
```
docker-compose up
```

실행 완료 시 터미널 로그
<img src="\assets\img\posts\start-docker-container\postgres-container.png" style="border: 1px solid gray; width: 80%" />

#### Postgresql 컨테이너 실행 확인 
Dbeaver 웹 페이지 진입 후 다운로드.   
[https://dbeaver.io/download/](https://dbeaver.io/download/)
Postgresql 연결을 지원하는 다른 DBMS 툴을 사용해도 무방하다.

다음과 같이 Postgresql 컨테이너 접속 정보로 DBMS 연결 후   
`Test Connection` 버튼 클릭 시 아래 화면이 나타난다.
<img src="\assets\img\posts\start-docker-container\postgresql.png" style="border: 1px solid gray;" />
