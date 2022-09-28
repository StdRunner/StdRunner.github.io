---
layout: post
title: Entity 생성하기
date: 2022-09-28
updated: 
tags: [typescript, next-js]
menu: clone-reddit
---
## 레딧 앱 E-R Diagram
강의의 주제인 레딧 앱의 DB E-R Diagram이다.
<img src="\assets\img\posts\create-entity\erd.png" style="width:80%" />

- - -

## Entity를 생성하는 이유
ORM의 사용 없이 DB 테이블을 생성하기 위해서는 DDL (Database Definition Language)를 사용하여   
일일히 테이블을 생성해줘야하지만, TypeORM을 사용할 때는 Entity Class가 데이터 베이스 테이블로 변환되기 때문에
Class를 생성한 컬럼을 정의해주면 된다.

- - -

## E-R Diagram와 일치하는 Entity 생성
<img src="\assets\img\posts\create-entity\entities.png" style="width:20%" />
* Users : 로그인을 위한 사용자 정보 엔티티
* Subs : 레딧에서 커뮤니티 의미하는 엔티티
* Posts : subs 하위의 포스트 엔티티
* Votes : 포스트와 코멘트에 대한 투표 엔티티
* Comment : 포스트 하위의 코멘트 엔티티

- - -

## Entity 생성을 위해 필요한 모듈 설치
* bcrypjs : 비밀번호를 암호화하여 데이터베이스에 저장할 수 있도록 해준다.
* class-validator : 데코레이터를 이용해서 요청 시 오브젝트의 프로퍼티를 검증하는 라이브러리
* class-transformer : 일반 개체를 클래스의 일부 인스턴스로 또는 그 반대로 변환 가능하다.
<img src="\assets\img\posts\create-entity\class-transformer.png" style="width:100%" />

- - -

## Base Entity 생성
모든 Entity에 id, createdAt, updatedAt 컬럼이 필요하다.   
공통된 컬럼을 하나로 정의하기 위해 BaseEntity를 따로 생성하고, 다른 엔티티에서 BaseEntity를 상속받아 사용한다.
<img src="\assets\img\posts\create-entity\base-entity.png" style="width:60%" />

#### @PrimaryGeneratedColumn()
PrimaryGeneratedColumn() 데코레이터 클래스는 id 열이 Board 엔터티의 기본 키 열임을 나타내는 데 사용됩니다.   
아래의 id컬럼의 타입이 number임을 보면 알 수 있듯 자동으로 생성되어 증가하는 컬럼이다.
```javascript
@PrimaryGeneratedColumn()
id: number;
```