---
layout: post
title: CI/CD 환경 구성(Database 인스턴스와 스토리지 초기화)
date: 2022-12-26
updated: 
tags: [jenkins, docker]
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

***이러한 고민을 해결하기 위해 Jenkins에서는 아래와 같은 Job을 생성하는 과정을 정리해보자***
* 레파지토리에서 DBMS별 설치 스크립트 폴더를 가져온다.
  + 해당 과정을 위해서는 어플리케이션 기동에 필요한 설치 스크립트를 버전 별 또는 브랜치 별로 정리하는 정책이 선행되어야한다.
* DBMS 인스턴스를 재구성하고 설치 스크립트를 수행한다.
* 어플리케이션에서 사용하는 OS레벨 폴더를 초기화한다.
  + 기존 어플리케이션에서 작성한 파일이 더미 파일로 남아있게됨.

- - -

## Jenkins Job 생성
젠킨스가 작업을 구분하는 단계는 `Jenkins > View > Item`로 설명 가능하다.   
젠킨스의 작업(Job)을 Item이라고 명명하며 이 작업들을 탭으로 구분하여 볼 수 있는 기능을 제공하는 것을 View 라고 한다.

##### View, Item
<img src="\assets\img\posts\ci-cd\jenkins-cons.png" style="border : 1px solid gray;"/>

1. 젠킨스 작업을 생성하기 위해서는 Jenkins 대시보드 메뉴의 `+ 새로운 Item` 을 클릭한다.
<img src="\assets\img\posts\ci-cd\create-item.png" style="border : 1px solid gray; width: 30%;"/>

2. Enter an item name : 젠킨스 작업 이름을 입력
3. Pipeline : 파이프라인 스크립트로 젠킨스 작업 내용을 작성할 것이므로 선택 후 `OK` 클릭
<img src="\assets\img\posts\ci-cd\create-item2.png" style="border : 1px solid gray;"/>

4. 생성 완료된 젠킨스 Item 확인
<img src="\assets\img\posts\ci-cd\new-item.png" style="border : 1px solid gray;"/>

- - -

## Jenkins Pipeline Script 작성
젠킨스 대시보드에서 앞서 생성한 젠킨스 Item `Test_Item`를 클릭 하면 Item 대시보드로 이동한다.

1. Item 대시보드 메뉴 중 `구성` 을 클릭
<img src="\assets\img\posts\ci-cd\item-detail.png" style="border : 1px solid gray; width: 70%;"/>

2. Pipeline 항목으로 이동.   
`try sample Pipeline` 드롭박스를 클릭하면 groovy 파이프라인 샘플 스크립트를 확인할 수 있다.
<img src="\assets\img\posts\ci-cd\pipeline.png" style="border : 1px solid gray;"/>

3. 아래 스크립트를 입력
```groovy
pipeline {
    agent any
    
    // pipeline 스크립트에서 사용할 환경변수를 정의
    environment {
        // 릴리즈 타입을 명시
        //  release  : 시스템을 고도화하여 정기적으로 배포하는 릴리즈
        //  hotfix   : 긴급하거나 중대한 결함이 발견되어 수정 후 배포하는 릴리즈
        GIT_RELEASE_TYPE = 'hotfix'
        // 릴리즈 버전을 명시
        GIT_VERSION = 'V.6.5.5.2'
        GITLAB_CREDENTIAL_ID = 'gitlab_jenkins'
    }

    stages {

        stage('Run Xedm Build') {
            steps {
                // Get some code from a GitHub repository
                git branch: "xedrm_server_${GIT_BRANCH}_${GIT_VERSION}", credentialsId: "${GITLAB_CREDENTIAL_ID}", url: 'http://183.111.104.110:8081/xedrm_admin/xedrm_server.git'
                
                sh "tar cf xedrm_${GIT_BRANCH}_${GIT_VERSION}_db.tar scripts/*"
                //sh "gradle clean build bootJar bootWar -x test && gradle createMakeInstall"
            }
        }
        
        stage('File Transfer') {
            steps {
                sh "scp -i ~/.secure/xedrm_postgres_database.pem xedrm_${GIT_BRANCH}_${GIT_VERSION}_db.tar ec2-user@54.180.30.151:/home/ec2-user/dbscript"
            }
        }
        
        stage('Build And ReStart DB') {
            options {
                timeout (time: 60, unit: "SECONDS")
            }
            steps {
                script {
                    try {
                        /* 브랜치 버전 [~ V.6.5.5.1] 일 때 주석 해제 */
                        // sh "ssh -i ~/.secure/xedrm_postgres_database.pem ec2-user@54.180.30.151 '/home/ec2-user/dbscript/deploy_dbscript.sh xedrm_${GIT_BRANCH}_${GIT_VERSION}_db.tar'"
                        /* 브랜치 버전 [V.6.5.5.2 ~] 일 때 주석 해제 */
                        sh "ssh -i ~/.secure/xedrm_postgres_database.pem ec2-user@54.180.30.151 '/home/ec2-user/dbscript/deploy_dbscript_since_6552.sh xedrm_${GIT_BRANCH}_${GIT_VERSION}_db.tar'"
                        
                        sh "ssh -i ~/.secure/xedrm_postgres_database.pem ec2-user@54.180.30.151 '/home/ec2-user/docker-restart.sh'"
                    } catch (Throwable e) {
                        echo "Catch ${e.toString()}"
                        echo "SUCCESS"
                    }
                }
            }
        }
        
        stage('WAS StorageClear') {
            options {
                timeout (time: 60, unit: "SECONDS")
            }
            steps {
                script {
                    try {
                        sh "ssh -i ~/.secure/xedrm_was.pem ec2-user@3.36.146.103 'sudo rm -rf /edmsnas/11521/* && sudo rm -rf /edmsnas/15432/* && sudo rm -rf /edmsnas/18629/*'"
                        //sh "ssh -i ~/.secure/xedrm_was.pem ec2-user@13.125.16.36 'sudo rm -rf /home/centos/xedrm_server_oracle_postgres_tibero/21521/* && sudo rm -rf /home/centos/xedrm_server_oracle_postgres_tibero/25432/* && sudo rm -rf /home/centos/xedrm_server_oracle_postgres_tibero/28629/*'"
                    } catch (Throwable e) {
                        echo "Catch ${e.toString()}"
                        echo "SUCCESS"
                    }
                }
            }
        }
    }
}
```