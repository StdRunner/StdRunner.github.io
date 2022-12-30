---
layout: post
title: CI/CD 환경 구성(Docker Compose로 Database 인스턴스 구성)
date: 2022-12-26
updated: 
tags: [jenkins, docker, oracle, postgrsql, tibero]
menu: ci-cd
---
## 개요
계정 정보가 있는 보통의 웹 어플리케이션은 DBMS를 필수적으로 사용하게 된다.  

신규 기능이나, 제품 구조가 변경되어야 하는 개발 요구사항이 있다고 가정해보자.   
이 때 ***제품의 버전이나 브랜치 단위로 DB 테이블 스키마가 변경될 수 있으며,***   
***서버 설치 시 필수적인 초기 데이터 또한 추가/수정/삭제될 수 있다.***

CI/CD 환경을 구성할 때 Server, Front 소스만 통합하여 배포한다면   
변경된 테이블 스키마, 추가/수정/삭제된 데이터는 DB에 반영되지 않은 상태이므로   
<span style="color : #57a;"><b>무결한 배포 환경을 구성했다고 할 수 없을 것이다.</b></span>

배포 때마다 개발자가 매 번 변경된 DDL을 실행해주고, 누락된 데이터를 수기로 넣어준다면   
해당 DB를 사용한 배포는 <span style="color : #57a;"><b>무결한 상태라고 말할 수 있을까?</b></span>

***이러한 고민을 해결하기 위해 Jenkins에서는 아래와 같은 작업을 진행하게 된다.***
* 레파지토리에서 DBMS별 설치 스크립트 폴더를 가져온다.
  + 해당 과정을 위해서는 어플리케이션 기동에 필요한 설치 스크립트를 버전 별 또는 브랜치 별로 정리하는 정책이 선행되어야한다.
* DBMS 인스턴스를 재구성하고 설치 스크립트를 수행한다.
* 어플리케이션에서 사용하는 OS레벨 폴더를 초기화한다.
  + 기존 어플리케이션에서 작성한 파일이 더미 파일로 남아있게됨.

이 과정 중 ***"DBMS 인스턴스를 재구성하고 설치 스크립트를 수행"***하기 위해   
<span style="color : #57a;"><b>빠른 시작/종료, 재구성에 용이한 Docker 컨테이너로 DBMS 인스턴스를 관리</b></span>해야 한다.

- - -

## Docker Compose로 DB 인스턴스 생성, 실행
Docker Compose는 앞서 말한 바와 같이 Docker 컨테이너를 사전에 yaml 파일로 정의하여 실행하기 위한 도구이다.   
추가적인 내용과 설치/사용 방법은 공식 문서 또는 오픈소스를 참조하도록 하자.

* [https://docs.docker.com/compose/](https://docs.docker.com/compose/)

우선 컨테이너 정의 파일인 `docker-compose-db.yml` 파일을 생성하고 아래 내용을 추가한다.
내 시스템의 지원 DBMS 세 가지 Oracle, Postgresql, Tibero가 정의되어 있다.
##### [docker-compose-db.yml]
```yaml
# Docker 버전
version: "3"

# Docker 컨테이너 서비스 정의
services:
  # Oracle
  db-oracle:
      # 이미지 명:태그 대신 Dockerfile 사용
      # Dockerfile - Docker 이미지를 빌드하는 데 사용
      build:
        # Dockerfile의 경로
        context: ../db/oracle/
        # Dockerfile의 이름
        dockerfile: Dockerfile
      container_name: oracleHA-database
      restart: always
      # 컨테이너 환경변수를 파일로 정의 (DB스키마 Username, PW 정의)
      env_file:
        - ../db/oracle/oracle.env
      # 볼륨 매핑 (어플리케이션 설치 스크립트 경로)
      volumes:
        - ../db/oracle/script:/docker-entrypoint-initdb.d
      # 호스트 서버:컨테이너 포트 매핑
      ports:
        - "11521:1521"

  # Postgresql
  db-postgres:
    # 이미지:태그
    image: postgres:13-alpine
    container_name: postgres13HA-database
    restart: always
    # 컨테이너 환경변수
    environment:
      - POSTGRES_PASSWORD=1234
    # 볼륨 매핑 (어플리케이션 설치 스크립트 경로)
    volumes:
      - ../db/postgres/script:/docker-entrypoint-initdb.d
    # 호스트 서버:컨테이너 포트 매핑
    ports:
      - "15432:5432"

  # Tibero
  db-tibero:
    # 이미지 명:태그 대신 Dockerfile 사용
    build:
      context: ../db/tibero/tibero-docker/
      dockerfile: Dockerfile
    container_name: tiberoHA-database
    # OS 호스트네임 (티베로 라이센스 파일용)
    hostname: docker_tibero
    stdin_open: true
    # 컨테이너 커널 매개변수
    # Docker 컨테이너는 호스트 OS의 커널 매개변수를 참조하여 로딩되므로
    # 경우에 따라 수정 필요
    sysctls:
      - kernel.sem=10000 32000 10000 10000
        # TCP 소켓 개수 설정
      - net.ipv4.ip_local_port_range=1024 65500
    # 환경변수
    environment:
      - LANG=en_US.UTF-8
      - TB_MAX_SESSION_COUNT=100
      - TB_MEMORY_TARGET=4G
      - TB_TOTAL_SHM_SIZE=2G
      # specify all below for triggering tbimport from '/opt/tibero/dump'
      - TB_IMPORT_ENABLE=true # default `false`
      - TB_IMPORT_SID=TIBERO
      - TB_IMPORT_PORT=8629
      - TB_IMPORT_USERNAME=XEDRM5
      - TB_IMPORT_PASSWORD=1234
      - TB_IMPORT_SCRIPT=y
      - TB_IMPORT_IGNORE=y
      - TB_IMPORT_ROWS=y
      - TB_IMPORT_CONSTRAINT=y
      - TB_IMPORT_INDEX=y
      - TB_IMPORT_TRIGGER=y
      - TB_IMPORT_SYNONYM=n
      - TB_IMPORT_SEQUENCE=y
      - TB_IMPORT_USER=XEDRM5
      - TB_NLS_LANG=UTF8
    # 볼륨 동기화
    volumes:
      - ../db/tibero/tibero/init/:/opt/tibero/init
      - ../db/tibero/tibero/license:/opt/tibero/license
      - ../db/tibero/tibero/dump:/opt/tibero/dump
      # 볼륨 매핑 (어플리케이션 설치 스크립트 경로)
      - ../db/tibero/script:/scripts
    # 호스트 서버:컨테이너 포트 매핑
    ports:
      - "18629:8629"
```

`docker-compose-db.yml` 파일로 정의한 Docker 컨테이너를 실행해주는 쉘 파일을 생성한다.   
`docker-onlydb.sh`파일을 생성하고 아래 내용을 입력한다.

해당 쉘 파일은 실행 시 start, stop, restart 매개변수를 받아 컨테이너를 ***실행/중지/재시작***할 수 있도록 한다.   
이제 DBMS 별 상세 설정에 대해 살펴보자
##### [docker-onlydb.sh]
```sh
#!/bin/bash

case "$1" in
    'start')    # Start docker oracle & postgres & tibero
        echo "Starting Docker Oracle & Postgres & Tibero Service...: "

        #docker compose 실행명령
        docker-compose -f ./docker-compose-db.yml up --build -d

        RVAL=$?
        echo $RVAL
        exit $RVAL
            ;;

    'stop')    # Stop docker oracle & postgres & tibero
        echo "Stop Docker Oracle & Postgres & Tibero Service...: "

        docker-compose -f ./docker-compose-db.yml down

        exit $RVAL
        ;;

    'restart')    # Restart docker oracle & postgres & tibero
        echo "Restarting Docker Oracle & Postgres & Tibero Service...: "

        docker-compose -f ./docker-compose-db.yml down
        docker-compose -f ./docker-compose-db.yml up --build -d

        RVAL=$?
        echo $RVAL
        exit $RVAL
        ;;
esac
```

`docker-compose-db.yml` 파일에 사전 정의한 DBMS 별 컨테이너를 시작하기 위해   
`docker-onlydb.sh` 아래 명령어로 쉘 파일을 실행한다.

```
~$ ./docker-onlydb.sh start
```

- - - 

## Oracle 상세 설정
`docker-compose-db.yml` 파일에서 정의한 Oracle 서비스 컨테이터의 환경변수 파일 `oracle.env` 내용은 아래와 같다.
##### [oracle.env]
```
# 오라클 유저 패스워드를 변경하기 위한 환경변수
JDBC_USERNAME=XEDRM5
JDBC_PASSWORD=1234
JDBC_USERNAME1=XEDRM6
JDBC_PASSWORD1=1234
```

`docker-compose-db.yml` 파일에 정의한 Oracle 컨테이너 Dockerfile의 내용은 아래와 같다.

***FROM 구문***에서 어떤 Docker 이미지를 사용할지 정의한다.   
Oracle Database는 Docker 공식 이미지가 없으므로 다른 사용자의 이미지를 활용했다.

구문 별 상세 내용은 아래 주석을 참고하면 된다.
##### [Dockerfile]
```Dockerfile
# Docker 컨테이너 이미지
FROM jaspeen/oracle-xe-11g
# 작성자 데이터를 기입 (MAINTAINER : deprecated)
LABEL name="stdrunner"
LABEL email="kjb119912@gmail.com"
LABEL description="Oracle Database xe-11g"

# ADD : 호스트 서버의 파일을 컨테이너 특정 경로로 추가
ADD entrypoint.sh /entrypoint.sh
ADD setPassword.sh /setPassword.sh
ADD setUserPassword.sh /setUserPassword.sh

# RUN : Linux에선 "/bin/sh -c" 로 쉘 실행
# 쉘 파일 실행 권한 추가
RUN chmod -R +x /entrypoint.sh
RUN chmod -R +x /setPassword.sh
RUN chmod -R +x /setUserPassword.sh

# /db 폴더 추가 
RUN mkdir /db
RUN chmod -R +x /db

# 컨테이너 실행 시 수행해야할 쉘 작업 실행
ENTRYPOINT ["/entrypoint.sh"]
```

Dockerfile 내에서 컨테이너 기동 작업으로 수행하는 `entrypoint.sh` 파일의 주요 내용을 살펴보자.
##### [entrypoint.sh]
```sh
#!/bin/bash

# Oracle 설치 폴더 하위 소유자 변경 (소유자 이슈 예방)
chown -R oracle:dba /u01/app/oracle
# 기존 product 폴더 제거 및 심볼릭 링크로 대체
rm -f /u01/app/oracle/product
ln -s /u01/app/oracle-product /u01/app/oracle/product

# CHARSET 환경변수 설정
export CHARACTER_SET="AL32UTF8"
echo "CHARACTER_SET=AL32UTF8"

if [ -z "$CHARACTER_SET" ]; then
        if [ "${USE_UTF8_IF_CHARSET_EMPTY}" == "true" ]; then
                export CHARACTER_SET="AL32UTF8"
                #export CHARACTER_SET="KO16MSWIN949"
                #echo "CHARACTER_SET=KO16MSWIN949"
        fi
fi

if [ -n "$CHARACTER_SET" ]; then
        export CHARSET_MOD="NLS_LANG=.$CHARACTER_SET"
        export CHARSET_INIT="-characterSet $CHARACTER_SET"
        echo "CHARSET_INIT=-characterSet $CHARACTER_SET"
fi

# hostname 갱신
sed -i -E "s/HOST = [^)]+/HOST = $HOSTNAME/g" /u01/app/oracle/product/11.2.0/xe/network/admin/listener.ora
# port 갱신
sed -i -E "s/PORT = [^)]+/PORT = 1521/g" /u01/app/oracle/product/11.2.0/xe/network/admin/listener.ora
# ORACLE 환경변수 추가 및 반영
echo "export ORACLE_HOME=/u01/app/oracle/product/11.2.0/xe" > /etc/profile.d/oracle-xe.sh
echo "export PATH=\$ORACLE_HOME/bin:\$PATH" >> /etc/profile.d/oracle-xe.sh
echo "export ORACLE_SID=XE" >> /etc/profile.d/oracle-xe.sh
. /etc/profile


case "$1" in
        '')
                # 오라클 초기화 Config 설정
                #Check for mounted database files
                if [ "$(ls -A /u01/app/oracle/oradata)" ]; then
                        # 오라클 자동실행 OFF로 설정 : /etc/oratab
                        echo "Custom found files in /u01/app/oracle/oradata Using them instead of initial database"
                        echo "XE:$ORACLE_HOME:N" >> /etc/oratab
                        chown oracle:dba /etc/oratab
                        chown 664 /etc/oratab
                        # 오라클 초기화 Config 설정 : /etc/default/oracle-xe
                        printf "ORACLE_DBENABLED=false\nLISTENER_PORT=1521\nHTTP_PORT=8080\nCONFIGURE_RUN=true\n" > /etc/default/oracle-xe

                        rm -rf /u01/app/oracle-product/11.2.0/xe/dbs
                        ln -s /u01/app/oracle/dbs /u01/app/oracle-product/11.2.0/xe/dbs
                else
                        echo "Custom Database not initialized. Initializing database."
                        export IMPORT_FROM_VOLUME=true

                        printf "Setting up:\nprocesses=$processes\nsessions=$sessions\ntransactions=$transactions\n"
                        echo "If you want to use different parameters set processes, sessions, transactions env variables and consider this formula:"
                        printf "processes=x\nsessions=x*1.1+5\ntransactions=sessions*1.1\n"

                        mv /u01/app/oracle-product/11.2.0/xe/dbs /u01/app/oracle/dbs
                        ln -s /u01/app/oracle/dbs /u01/app/oracle-product/11.2.0/xe/dbs

                        #Setting up processes, sessions, transactions.
                        echo "Setting up processes, sessions, transactions."
                        sed -i -E "s/processes=[^)]+/processes=$processes/g" /u01/app/oracle/product/11.2.0/xe/config/scripts/init.ora
                        sed -i -E "s/processes=[^)]+/processes=$processes/g" /u01/app/oracle/product/11.2.0/xe/config/scripts/initXETemp.ora

                        sed -i -E "s/sessions=[^)]+/sessions=$sessions/g" /u01/app/oracle/product/11.2.0/xe/config/scripts/init.ora
                        sed -i -E "s/sessions=[^)]+/sessions=$sessions/g" /u01/app/oracle/product/11.2.0/xe/config/scripts/initXETemp.ora

                        sed -i -E "s/transactions=[^)]+/transactions=$transactions/g" /u01/app/oracle/product/11.2.0/xe/config/scripts/init.ora
                        sed -i -E "s/transactions=[^)]+/transactions=$transactions/g" /u01/app/oracle/product/11.2.0/xe/config/scripts/initXETemp.ora

                        printf 8080\\n1521\\noracle\\noracle\\ny\\n | /etc/init.d/oracle-xe configure

                        echo "Database initialized. Please visit http://#containeer:8080/apex to proceed with configuration"
                fi

                # 오라클 인스턴스 기동
                /etc/init.d/oracle-xe start

                echo "oracle password settings ================================================================== $syspassword"
                # setPassword.sh : Dockerfile에서 정의한 호스트 서버에서 컨테이너로 옯긴 파일
                # Oracle User Password 변경 쉘
                /setPassword.sh $JDBC_PASSWORD

                # Oracle Database 초기 실행 여부 판단
                # 공유 볼륨에서 설치 스크립트 수행
                if [ $IMPORT_FROM_VOLUME ]; then
                        echo "Starting import from '/docker-entrypoint-initdb.d':"

                        # /docker-entrypoint-initdb.d 경로 하위 파일 LOOP
                        # sh, sql, dmp 파일 실행, 이외의 파일은 미실행
                        # impdb 명령이 없어 불가
                        for f in $(ls /docker-entrypoint-initdb.d/*); do
                                echo "found file $f"
                                case "$f" in
                                        *.sh)     echo "[IMPORT] $0: running $f"; . "$f" ;;
                                        # sqlplus slient 모드로 sql파일 실행
                                        *.sql)    echo "[IMPORT] $0: running $f"; echo "exit" | su oracle -c "$CHARSET_MOD $ORACLE_HOME/bin/sqlplus -S / as sysdba @$f"; echo ;;
                                        *.dmp)    echo "[IMPORT] $0: running $f"; "$CHARSET_MOD $ORACLE_HOME/bin/impdp system/$JDBC_PASSWORD dumpfile=$f"; echo ;;
                                        *)        echo "[IMPORT] $0: ignoring $f" ;;
                                esac
                                echo
                        done

                        echo "Import finished"
                        echo
                else
                        echo "[IMPORT] Not a first start, SKIPPING Import from Volume '/docker-entrypoint-initdb.d'"
                        echo "[IMPORT] If you want to enable import at any state - add 'IMPORT_FROM_VOLUME=true' variable"
                        echo
                fi

                # App DB 유저 계정 변경
                # setUserPassword.sh : Dockerfile에서 정의한 호스트 서버에서 컨테이너로 옯긴 파일
                echo "oracle user password settings ================================================================== $JDBC_USERNAME"
                echo "oracle user password settings ================================================================== $JDBC_PASSWORD"
                /setUserPassword.sh $JDBC_USERNAME '$JDBC_PASSWORD'
                /setUserPassword.sh $JDBC_USERNAME1 '$JDBC_PASSWORD1'

                echo "Database ready to use. Enjoy! ;)"

                ##
                ## Workaround for graceful shutdown. ....ing oracle... ‿( ́ ̵ _-`)‿
                ##
                while [ "$END" == '' ]; do
                        sleep 1
                        trap "/etc/init.d/oracle-xe stop && END=1" INT TERM
                done
                ;;

        *)
                echo "Database is not configured. Please run /etc/init.d/oracle-xe configure if needed."
                $1
                ;;
esac
```

`entrypoint.sh` 에서 사용하기 위해 컨테이너로 이동한 파일을 확인해보자
##### [setPassword.sh]