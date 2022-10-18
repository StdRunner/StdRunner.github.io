---
layout: post
title: 무료로 AWS EC2 인스턴스 사용하기(프리 티어)
date: 2022-10-18
updated: 
tags: [aws]
menu: aws
---
## 개요
진행중인 ***사이드 프로젝트의 배포 관리***를 위해 AWS(Amazon Web Service) EC2 인스턴스를 생성할 이유가 생겼다.   
현재 회사에서도 기업용 AWS를 사용중이고 6개의 EC2 인프라를 관리중이지만   
직접 무료버전의 개인용 인스턴스는 생성해본 바는 없었다.   

업무적으로도 AWS Lightsail (경량 인스턴스)만 생성해봤고, 담당자에게 요청한 스펙의 인스턴스를   
제공 받아 사용했을 뿐 직접 인스턴스를 생성한 적은 없기에 좋은 기록이 될 것 같았다.

**나아가 개인용 무료 인스턴스를 생성하고자 하는 사람들에게 도움이 되고자 이 포스트를 작성한다.**

- - -

## AWS 프리티어?
***AWS 프리티어***란 신규 AWS 계정에서 자동으로 활성화되는 일종의 평가판이다.   
AWS 프리 티어를 사용하면 일부 AWS 서비스를 매월 특정한 최대 사용량까지 무료로 사용해 볼 수 있다.

AWS 프리 티어를 사용할 때의 ***주의점***이나 FAQ는 아래 AWS 페이지에서 쉽게 알 수 있다.   
AWS 프리 티어 외의 서비스 중 일부도 평가판을 제공하니 필요한 사람은 관련 레퍼런스를 검색해보면 된다.
[https://aws.amazon.com/ko/premiumsupport/knowledge-center/what-is-free-tier/](https://aws.amazon.com/ko/premiumsupport/knowledge-center/what-is-free-tier/)
<img src="/assets/img/posts/aws/aws.png" style="width: 20%;" />   

- - -

## AWS 프리티어 계정 생성
* 우선 AWS 프리티어 계정을 생성하기 위해 AWS 페이지로 접속하여 헤더 메뉴 중   
    `요금` >> `AWS 프리 티어` >> `무료 계정 생성`을 차례로 클릭한다.   
    [https://aws.amazon.com/ko/](https://aws.amazon.com/ko/)    
    <img src="/assets/img/posts/aws/aws-index.png" style="border: 1px solid gray;" />   

    <img src="/assets/img/posts/aws/aws-free-tier.png" style="border: 1px solid gray;" />   

    <img src="/assets/img/posts/aws/aws-sign-on.png" style="border: 1px solid gray;" />   

* 이메일 인증, 주소 입력, 카드 정보 입력, 휴대폰 인증 등 총 5단계를 거져 가입 절차를 수행하게 된다.   
    카드 정보 입력 시 해외 결제가 가능한 Master, VISA 카드를 사용해야 하니 참고하자.

    <img src="/assets/img/posts/aws/aws-sign-on-2.png" style="border: 1px solid gray; width: 60%;" />   
    <img src="/assets/img/posts/aws/aws-sign-on-3.png" style="border: 1px solid gray; width: 60%;" />   

- - -

## 로그인 및 인스턴스 생성
* AWS 페이지에 접속해 앞서 가입한 계정으로 로그인 한다.   
    [https://aws.amazon.com/ko/](https://aws.amazon.com/ko/)    

    <img src="/assets/img/posts/aws/aws-sign-in.png" style="border: 1px solid gray;" />   

* 로그인 후 AWS 콘솔 페이지에 오면 ***Region 설정***을 한다.   
    AWS 인스턴스가 어떤 지역에 위치할지를 정해주는 것이다.

    구축할 서비스의 서버 위치와 서비스 대상의 거리가 멀면 속도가 느려지기 때문에   
    서비스 주 이용자가 어디 지역인지 고려하여 선택해야 한다.   
    또한 Region의 위치에 따라 리소스 사용료가 상이하므로 요금도 고려가 필요하다.

    <img src="/assets/img/posts/aws/aws-console.png" style="border: 1px solid gray;" />   

* ***Region 설정***을 마치고 EC2 서비스를 검색해 `EC2 대시보드`로 이동한다.   
    `인스턴트 시작`을 클릭한다.
    <img src="/assets/img/posts/aws/aws-ec2-dashboard.png" style="border: 1px solid gray;" />   
    <img src="/assets/img/posts/aws/aws-start-ec2.png" style="border: 1px solid gray; width: 80%" />   

* ***인스턴스 이름 및 태그***를 입력한다.   
    기업에서는 다양한 인스턴스를 사용할 수 있으므로 인스턴스 이름, 태그 NAMMING RULE이 존재하지만,   
    개인의 사이드 프로젝트용 인스턴스 이므로 자유 규칙으로 입력해도 무방하다.
    <img src="/assets/img/posts/aws/aws-start-ec2-name.png" style="border: 1px solid gray; width: 80%" />   

    EC2 인스턴스에서 사용할 ***OS 이미지나, Applicaiton을 선택***한다.   
    OS 이미지 또는 App을 선택 후에 사용할 ***아키텍처***를 자신의 상황에 맞게 선택한다.
    <img src="/assets/img/posts/aws/aws-start-ec2-img.png" style="border: 1px solid gray; width: 80%" />   

* `새 키 페어 생성` 버튼을 클릭하여 ***키 페어***를 생성해준다.   
    키 페어를 생성하면 ssh 연결 시 패스워드를 사용하지 않고 암호화된 키 파일을 사용해 로그인할 수 있다.   
    
    키 페어 이름, 암호화 방식, 키 파일 확장자를 선택해 키 페어를 생성한다.
    <img src="/assets/img/posts/aws/aws-start-ec2-key.png" style="border: 1px solid gray; width: 80%" />   
    <img src="/assets/img/posts/aws/aws-start-ec2-key2.png" style="border: 1px solid gray; width: 60%" />   

* 아래 화면에서 인스턴스의 ***네트워크 설정***을 한다.   
    사전에 생성된 보안 그룹(인스턴스 방화벽)이 없으므로 `보안 그룹 설정`을 선택한다.   
    ssh 트래픽을 허용하고 외부 접근을 차단하기 위해 ***내 IP***로 설정하는 것이 안전하다.   

    `0.0.0.0/0` 형태로 방화벽 허용 시 무차별 포트 연결 시도를 통해 서버에 접근하여   
    멀웨어나 채굴 프로세스를 설치하는 경우가 종종 발견되므로 미리 주의하는 것이 좋다.
    <img src="/assets/img/posts/aws/aws-start-ec2-net.png" style="border: 1px solid gray; width: 60%" />   

* 스토리지 크기는 `30GB`크기의 `gp2`로 입력한다.   
    info에서 알려주듯 30GB까지는 프리 티어 사용이 가능하다.
    <img src="/assets/img/posts/aws/aws-start-ec2-strg.png" style="border: 1px solid gray; width: 60%" />   

* 여기까지 설정 완료 후 `인스턴스 시작`을 누르면 인스턴스가 시작된다.   
    Default 계정은 대부분 `ec2-user`지만, OS AMI에 따라 다르다.    
    인스턴스 목록에서 `Running` 상태라면 이전에 생성한 키 파일을 사용하여 ssh 접속이 가능하다.   
    <img src="/assets/img/posts/aws/aws-start-ec2-list.png" style="border: 1px solid gray;" />   
    **[ssh 접속]**
    <img src="/assets/img/posts/aws/aws-start-ec2-ssh.png" style="border: 1px solid gray; width:60%" />   