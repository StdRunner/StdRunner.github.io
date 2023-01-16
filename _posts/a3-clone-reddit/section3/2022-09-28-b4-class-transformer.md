---
layout: post
title: Class-transformer
date: 2022-09-28
updated: 
tags: [typescript, next-js]
menu: clone-reddit
---
## class-tranformer 모듈이란?
Class-transformer를 사용하면 Plain object를 클래스 인스턴스로 변환할 수 있다. 
<img src="\assets\img\posts\class-transformer\class-transformer.png" style="width:100%" />

- - -

## class-transformer를 이용해서 자바스크립트 리터럴 객체를 클래스의 인스턴스로 변경해주면 좋은 점
아래와 같은 자바스크립트 객체가 있다고 가정한다.   
이 객체들의 firstName과 lastName을 합치고자할 때를 예를 들어 보자
<img src="\assets\img\posts\class-transformer\objects.png" style="border: 1px solid gray; width: 20%" />

#### class-transformer 없이 구현
`toFullName(user)` 함수를 정의하고 FullName 반환값을 구하는 과정이 필요하다.
<img src="\assets\img\posts\class-transformer\no-class-trans.png" style="width:60%" />

#### class-transformer 사용해서 구현
<img src="\assets\img\posts\class-transformer\objects.png" style="border: 1px solid gray; width: 20%; display: inline-block; margin-right:10%" />
<img src="\assets\img\posts\class-transformer\class-obj.png" style="border: 1px solid gray; width: 40%; display: inline-block" />

class-transformer 내 plainToInstance 메서드를 사용하여 자바스크립트 객체 대신   
클래스의 인스턴스를 사용할 수 있다. 그래서 클래스에서 정의해둔 로직을 이용해서 Full Name을 만들 수 있다.
<img src="\assets\img\posts\class-transformer\use-class-trans.png" style="width:50%" />

#### 이러한 방식의 장점
* User 클래스에 정의한 로직을 바로 가져다 쓸 수 있기 때문에 상태와 행위가 함께 있는 응집력 있는 코드가 됨.
* 리터럴 객체 대신 클래스 인스턴스를 넘겨주려면 `class-transform` 내 `plainToInstance` 를 사용하면 된다.
* 이와 반대로 `instanceToPlain` 을 사용하여 클래스 인스턴스를 리터럴 객체로 변환할 수 있다.