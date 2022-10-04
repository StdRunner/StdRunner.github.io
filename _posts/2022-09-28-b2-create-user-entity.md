---
layout: post
title: User Entity 생성하기, Relationships
date: 2022-09-28
updated: 
tags: [typescript, next-js]
menu: clone-reddit
---
## User 테이블 컬럼
<img src="\assets\img\posts\create-user-entity\user-cols.png" style="border: 1px solid gray; width:80%" />

- - -

## User 엔티티 작성
```typescript
import { IsEmail, Length } from "class-validator"
import { Entity, Column, Index, OneToMany, BeforeInsert } from "typeorm"
import BaseEntity from './Entity';
import bcrypt from 'bcryptjs';
import Vote from "./Vote";
import Post from "./Post";

@Entity("users")
export class User extends BaseEntity {

    @Index()
    @IsEmail(undefined, { message: "이메일 주소가 잘못되었습니다." })
    @Length(1, 255, { message: "이메일 주소는 비워둘 수 없습니다." })
    @Column({ unique: true })
    email: string;

    @Index()
    @Length(3, 32, { message: "사용자 이름은 3자 이상이어야 합니다." })
    @Column({ unique: true })
    username: string;

    @Column()
    @Length(6, 255, { message: "비밀번호는 6자리 이상이어야 합니다." })
    password: string;

    @OneToMany(() => Post, (post) => post.user)
    posts: Post[]

    @OneToMany(() => Vote, (vote) => vote.user)
    votes: Vote[]

    @BeforeInsert()
    async hashPassword() {
        this.password = await bcrypt.hash(this.password, 6)
    }
}
```

#### 데코레이터
* @Entity() : User 클래스가 엔티티임을 나타내는 데 사용된다.
* @Column() : User 엔티티의 email 및 username과 같은 다른 컬럼을 나타내는 데 사용된다.
* @Index() : 데이터베이스 인덱스를 생성한다. 엔터티 속성(컬럼) 또는 엔터티에 사용할 수 있다.   
엔티티에 사용될 때 복합 열로 인덱스를 생성할 수 있다.
* @IsEmail() : 이메일인지 판단하는 Validator이며 아닐 경우 응답 메시지를 지정할 수 있다.
* @Length() : 길이를 지정할 수 있으며, 정의한 길이에 부합하지 않으면 응답 메시지를 지정할 수 있다.

- - -

## 데이터베이스 인덱스 생성 이유
- 책에서 목차를 이용해서 특정 주제를 찾을 때 더 빨리 찾을 수 있다. 책에 가나다순으로 정리한 목록처럼 인덱스가 그러한 역할을 한다.
- 테이블 쿼리 속도를 올려준다. 특정 컬럼 값을 가지고 열이나 값을 빠르게 찾을 수 있다. 
- 어떠한 정보를 찾을 때 처음부터 모든 데이터를 조회하지 않고 중간에서 검색위치를 빠르게 잡을 수 있다. 
- 데이터 양이 많고 변경보다 검색이 빈번한 경우 인덱싱을 하면 좋다.

- - -

## One to many, Many to one Relationship
엔티티간 관계를 형성하기 위해서는 엔티티에 서로의 필드를 넣어줘야 합니다.
```
                     ┏━━━━━━━━━━ Post 1
User ━━━━━━━━━━━━━━━━╋━━━━━━━━━━ Post 2
                     ┗━━━━━━━━━━ Post 3
```
* User : OneToMany Relationship
* Post : ManyToOne Relationship

#### 필드 정의
```typescript
@OneToMany(() = Post, (post) => post.user)
posts: Post[]
```

* Type : `() = Post`
* InverseSide : `User 에서 Post로 접근하려면 post.user로 접근해야 한다`