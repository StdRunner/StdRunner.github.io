---
layout: post
title: 디렉토리 패키지 구조의 선택과 이해
date: 2023-01-16
updated: 
tags: 
menu: spring-boot
---
## 개요
Java 기반 서버 프로젝트 개발 시 많은 개발자들이 패키지 구조를 스프링 웹 계층형 구조를 기반으로 구성할 것이다.   
이러한 패키징 방식은 `Controller, Service, Repository, Domain` 과 같이 각각의 웹 계층을 대표 혹은 구성하는   
클래스로 이루어진다.

프로젝트 패키지 구조에 관심을 갖고 관련 내용을 찾기 전에는 이러한 사실 조차 몰랐었고,   
이러한 서버 패키지 구조는 언제부턴가 무의식적으로 사용해왔던 것 같다.   
하여 이번을 기회로 서버 디렉토리 구조 설계 **방법과 종류, 각각의 장단점**을 알아보고자 한다.

- - - 

## 계층형 디렉토리 구조
```
com
 ㄴ corpname
     ㄴ appname
         ㄴ config
         ㄴ controller
         ㄴ domain
         ㄴ repository
         ㄴ service
         ㄴ security
         ㄴ exception
```

위와 같은 패키지 구조는 통상적인 서버 프로젝트의 디렉토리 구조이다.   
앞서 설명했던 것처럼 이러한 방식은 스프링 웹 계층의 대표 클래스 혹은 디렉토리들을 기반으로 구성된다.

스프링 웹계층에 대한 간단한 구조와 설명은 아래를 살펴보자
<img src="/assets\img\posts\springboot\web-layer.png" style="width: 60%">

* **Web Layer** : 사용자의 요청과 이에 대한 응답 반환의 전반적인 처리가 일어나는 영역
* **Service Layer** : `Web Layer`와 `Repository Layer` 사이에서 실질적인 어플리케이션 비즈니스 로직이 일어나는 영역
* **Repository Layer** : `DB`에 접근 및 통신하는 영역

이러한 각 계층들에는 `Controller, Service, Repository` 등과 같이 그 계층들을 대표하는 다양한 클래스와 디렉터리가 존재하고,   
이들을 기반으로 디렉터 구조를 패키징하는 방식이 ***계층형 디렉터리 구조***입니다.

#### 계층형 디렉토리 구조의 장단
계층형 구조는 전체적인 구조를 빠르게 파악할 수 있는 **장점**이 있다.   
다만 서버가 고도화될수록 각각의 패키지 디렉토리에 클래스들이 너무 많이 모이게 된다는 단점이 존재한다.

객체 지향 설계를 위한 SOLID 원칙중 하나인 **SRP 원칙(단일 책임 원칙)**을 준수하기 위해 `Service` 디렉토리에는   
특정 역할을 하는 전용 구현체 클래스들을 많이 생성하게 된다. 

* ***SRP(Single responsibility principle) 원칙 : 한 클래스는 하나의 책임만 가져야 한다.***

이렇게 되면 나름의 정해진 클래스별 명명 규칙이 존재하더라도    
여러 도메인의 클래스들이 개발자 측면에서 다루기 어렵게 뒤섞이게 된다.

이러한 방법을 개선한 구조가 `도메인형 디렉토리 구조` 이다.

- - -

## 도메인형 디렉토리 구조
```
com
 ㄴ corpname
     ㄴ appname
         ㄴ domain
         |   ㄴ user
         |   |   ㄴ controller
         |   |   |   ㄴ UserController.java
         |   |   |   ...
         |   |   ㄴ application
         |   |   |   ㄴ UserProfileService.java
         |   |   |   ㄴ UserSearchService.java
         |   |   |   ...
         |   |   ㄴ dao
         |   |   |   ㄴ UserFindDao.java
         |   |   |   ㄴ UserRepository.java
         |   |   |   ...
         |   |   ㄴ domain
         |   |   |   ㄴ User.java
         |   |   ㄴ dto
         |   |   |   ㄴ UserProfileUpdate.java
         |   |   |   ㄴ UserResponse.java
         |   |   |   ㄴ SignUpRequest.java
         |   |   |   ...
         |   |   ㄴ exception
         |   |   |   ㄴ EmailDuplicateException.java
         |   |   ...
         |   ㄴ post
         |   |   ㄴ controller
         |   |   ㄴ application
         |   |   ㄴ dao
         |   |   ㄴ domain
         |   |   ㄴ dto
         |   |   ㄴ exception
         |   ...
         ㄴ global
             ㄴ auth
             ㄴ common
             ㄴ config
             ㄴ error
             ㄴ infra
             ㄴ util
```

위와 같은 디렉토리 구조는 도메인형 디렉토리 구조를 기반으로 프로젝트를 패키징을 구성한 예시이다.   
도메인형 디렉토리 구조는 스프링 웹 계층에 주목하기보다 **도메인에 더 주목**하고 있다.   

각각의 **도메인 별로 패키지 분리하여 개발자가 소스를 관리하는데 있어 계층형 방식보다 직관적**이다.   
각각의 도메인들은 서로를 의존하는 코드가 없도록 설계하기 적합해서 **코드의 재활용성이 향상**될 수 있다.

또한 `OOP`(Object Oriented Programming) 관점과 `ORM`(Object Relational Mapping) 기술을 사용함에 있어    
핵심이 되는 `Entity`의 특성을 기반으로 패키징할 수 있으며, 해당 기술들의 지향점과 궤를 같이하는 디렉토리 구조라고 할 수 있다.

#### 도메인형 디렉토리 구조의 장단
도메인형 구조는 **관련 클래스와 코드들이 도메인 패키지 하위에 응집되어 있다는 것이 장점**이다.   
단점으로는 **프로젝트에 대한 이해가 낮을 경우 전체적인 구조를 파악하기 어렵다**는 단점이 있다.

#### 최상위 레벨의 패키지
* **dmain** : 프로젝트와 DB 구조에서 핵심 역할을 하는 domain entity를 기준으로 하위 패키지를 구성한다.
* **global** : 패키지에서는 프로젝트 전체적으로 사용할 수 있는 클래스들로 구성된다.

#### domain 하위 패키지
* 앞서 말한 바와 같이 `user`, `video`와 같이 핵심 domain entity 별로 패키지가 구성된다.
* 각 domain 하위 패키지는 `api`, `application`, `dao`, `domain`, `dto`, `exception` 패키지로 구성된다.
    - - -
* **controller** : `Controller` 클래스가 존재한다. 서버의 특성에 따라 Rest API 서버로의 역할만 하는 경우 `api` 패키지명으로   
  명명하기도 한다.
* **application** : 주로 `Service` 클래스들이 존재한다. DB 트랜잭션이 일어나며, 주된 비즈니스 로직을 담당한다.   
  `Service` 클래스들 뿐만 아니라 `Hanlder`와 같은 성격의 다른 클래스또한 포함하므로 `application`이라고 명명.
* **dao** : `dao`, `repository` 클래스들로 구성됩니다.
* **domain** : `ORM` 사용을 위한 Entity 클래스들로 구성된다.
* **dto** : `dto` 클래스들로 구성된다.
* **exception** : `exception` 클래스들로 구성된다.

#### global 하위 패키지
* 특정 domain에 종속되지 않고, 프로젝트 전체적으로 사용할 수 있는 클래스들이 모여있다.
* global 패키지는 `auth`, `common`, `config`, `error`, `infra`, `util` 패키지로 구성됩니다.
    - - -
* **auth** : `인증`, `인가`와 관련된 클래스들로 구성된다.
* **common** : `공통 클래스` 혹은 `공통 value` 클래스들로 구성된다.
* **config** : 각종 `Configuration` 클래스로 구성된다.
* **error** : 각종 `exception`, `error`와 관련된 클래스로 구성된다.
* **infra** : `외부 모듈`, `api`등을 사용하는 클래스로 구성된다.
* **util** : 공통 `util`성 클래스 들로 구성된다.

- - - 

## 결론
계층형 디렉토리 구조에서는 프로젝트 구조를 한 눈에 파악할 수 있다는 장점이 있다.
하지만 Application이 거대해지고 액션을 정의하는 서비스 클래스가 많아질수록 `Service` 패키지에는   
무수한 클래스가 쌓일 수 있는 구조이다.    
이에 따라 개발자가 서비스 클래스를 관리하기 힘들어질 여지가 분명 존재한다.

최근 `ORM` 개념을 기반으로한 `Hibernate`, `JPA`, `TypeORM` 등을 이용한 DB 엑세스 기술을 프로젝트에 적용하는 추세이고    
개발자의 측면에서 보면 **도메인, 즉 Entity 기반의 관련 있는 클래스들을 한 패키지에서 관리할 수 있다는 점에서   
유리한 측면이 다양하게 존재**한다.
도메인 별 의존 관계를 줄일 수 있도록 설계하기 적합하다는 점도 플러스 요인 중 하나이다.

**디렉토리 구조를 정하는 데 있어 정답은 없다. 프로젝트의 성격에 맞게, 보다 프로젝트 관리가 용이한 방향으로
얼마든 변경할 수 있는 것이 디렉토리 구조라고 생각한다.**
- - -

## 참고
> [https://velog.io/@jsb100800/Spring-boot-directory-package#-background](https://velog.io/@jsb100800/Spring-boot-directory-package#-background)   
> [https://cheese10yun.github.io/spring-guide-directory](https://cheese10yun.github.io/spring-guide-directory)