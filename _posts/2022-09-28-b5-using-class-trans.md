---
layout: post
title: 이 프로젝트에서 Class Transformer를 이용하는 방법
date: 2022-09-28
updated: 
tags: [typescript, next-js]
menu: clone-reddit
---
## 개요
엔티티를 생성할 때 상태뿐 아니라 행위까지 엔티티 내 정의하여 행위의 반환값까지 프론트엔드에서 사용할 수 있게 한다. 
이를 풀어서 설명하면 데이터베이스에서 User객체를 조회할 때   
아래 User 클래스의 행위인 `getter : name(), getFullName()` 값을 함께 조회하게 된다.
마찬가지로 조회 시 제외해야할 행위에 대해 정의할 수 있다.

```typescript
import { Expose } from 'class-transformer';

export class User {
  id: number;
  firstName: string;
  lastName: string;
  password: string;

  @Expose()
  get name() {
    return this.firstName + ' ' + this.lastName;
  }

  @Expose()
  getFullName() {
    return this.firstName + ' ' + this.lastName;
  }
}
```

- - -

## @Expose()
Entity 클래스의 행위 중 @Expose() 데코레이터를 선언한 행위는   
데이터베이스에서 Entity를 조회할 때 Entity 클래스의 행위까지 포함하여 조회할 것을 명시한다.
```
엔티티 행위 url(), commentCount(), voteScore()
```

## @Exclude()
Entity 클래스의 관계 멤버 중 @Exclude() 데코레이터를 선언한 행위는   
데이터베이스에서 Entity를 조회할 때 제외하여 조회할 것을 명시한다.
```
엔티티 관계 멤버 comments, votes
```

***[Entity]*** / ***[조회 결과]***   
<img src="\assets\img\posts\class-transformer\entity.png" style="width:45%; display : inline-block;" />
<img src="\assets\img\posts\class-transformer\result.png" style="width:45%; display : inline-block;" />
- - -

