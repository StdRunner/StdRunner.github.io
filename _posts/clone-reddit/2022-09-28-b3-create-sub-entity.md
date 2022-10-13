---
layout: post
title: Sub Entity 생성하기(Community)
date: 2022-09-28
updated: 
tags: [typescript, next-js]
menu: clone-reddit
---
## 테이블 컬럼
<img src="\assets\img\posts\create-sub-entity\sub-cols.png" style="width:100%" />

- - -

## 엔티티 작성
```typescript
import { Expose } from "class-transformer";
import { Column, Entity, Index, JoinColumn, ManyToMany, ManyToOne, OneToMany } from "typeorm";
import BaseEntity from './Entity';
import Post from "./Post";
import { User } from "./User";

@Entity("subs")
export default class Sub extends BaseEntity {
    @Index()
    @Column({ unique: true })
    name: string;

    @Column()
    title: string;

    @Column({ type: 'text', nullable: true })
    description: string;

    @Column({ nullable: true })
    imageUrn: string;

    @Column({ nullable: true })
    bannerUrn: string;

    @Column()
    username: string;

    @ManyToOne(() => User)
    @JoinColumn({ name: "username", referencedColumnName:"username" })
    user: User;

    @OneToMany(() => Post, (post) => post.sub)
    posts: Post[]

    @Expose()
    get imageUrl(): string {
        return this.imageUrn ? `${process.env.APP_URL}/images/${this.imageUrn}` : 
        "http://www.gravatar.com/avatar?d=mp&f=y"
    }
    
    @Expose()
    get bannerUrl(): string {
        return this.bannerUrn ? `${process.env.APP_URL}/images/${this.bannerUrn}` : 
        undefined;
    }
}
```

#### 데코레이터
* @JoinColumn() : 
  + @JoinColumn을 통해 어떤 관계쪽이 외래 키(Foreign Key)를 가지고 있는지 나타낸다.
  + @JoinColumn을 설정하면 데이터베이스에 propertyName + referencedColumnName이라는 열이 자동으로 생성된다.
  + 이 데코레이터는 @ManyToOne의 경우 선택 사항이지만 @OneToOne의 경우 필수.

```
[ Sub 테이블 ] ━━━━━━━━━━━━━━━━━━━━ [ User 테이블 ]
```
```typescript
@ManyToOne(() => User)
@JoinColumn({ name: "username", referencedColumnName:"username" })
user: User;
```

* name 
  + FK 속성명
  + name이 없다면 property + referencedColumnName 이 default이다.

* referencedColumnName
  + 참조 엔티티의 참조 속성명. (User 엔티티 username)
  + id가 default
  + 둘 다 없다면 FK 필드는 FK속성명 + id가 된다. (user_id)

#### 예시
```typescript
@ManyToOne(type => Category)
@JoinColumn({ name: "cat_id" })
category: Category;
```
이 코드는 데이터베이스에 categoryId 열을 생성한다.   
데이터베이스에서 이 이름을 변경하려면 사용자 정의 조인 열 이름을 지정할 수 있다.

```typescript
@ManyToOne(type => Category)
@JoinColumn({ referencedColumnName: "name" })
category: Category;
```
조인 열은 항상 다른 열에 대한 참조이다(외래 키 사용).   
기본적으로 관계는 항상 관련 엔터티의 기본 열을 참조한다.   
관련 엔터티의 다른 열과 관계를 생성하려면 @JoinColumn에서도 지정할 수 있다.   

이제 관계는 id 대신 Category 엔터티의 이름을 참조한다.   
해당 관계의 열 이름은 categoryName이 된다.