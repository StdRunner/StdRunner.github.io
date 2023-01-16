---
layout: post
title: Vote Entity
date: 2022-10-01
updated: 
tags: [typescript, next-js]
menu: clone-reddit
---
## Vote 기능 화면
<img src="\assets\img\posts\create-vote-entity\vote.png" style="border: 1px solid gray; width:40%;" />

- - -

## Vote 테이블 컬럼
<img src="\assets\img\posts\create-vote-entity\vote-cols.png" style="border: 1px solid gray; width:100%;" />

- - -
## Vote 엔티티 작성
```typescript
import { Column, Entity, JoinColumn, ManyToOne } from "typeorm"
import BaseEntity from './Entity';
import Post from "./Post";
import { User } from "./User";

@Entity("votes")
export default class Vote extends BaseEntity {
    @Column()
    value: number;

    @ManyToOne(() => User)
    @JoinColumn({name: "username", referencedColumnName: "username"})
    user: User

    @Column()
    username: string;

    @Column({nullable: true})
    postId: number

    @ManyToOne(() => Post)
    post: Post;

    @Column({nullable: true})
    commentId: number;

    @ManyToOne(() => Comment)
    comment: Comment
}
```