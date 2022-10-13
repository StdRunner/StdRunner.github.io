---
layout: post
title: Comment Entity
date: 2022-10-04
updated: 
tags: [typescript, next-js]
menu: clone-reddit
---
## Comment 기능 화면
<img src="\assets\img\posts\create-comment-entity\comment-func.png" style="border: 1px solid gray; width:40%;" />

- - - 

## Comment 컬럼
<img src="\assets\img\posts\create-comment-entity\comment-cols.png" style="border: 1px solid gray;" />

- - -

## Comment Entity 작성
```typescript
import { Exclude, Expose } from 'class-transformer';
import { BeforeInsert, Column, Entity, Index, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { makeId } from '../utils/helpers';
import BaseEntity from './Entity';
import Post from './Post';
import { User } from './User';
import Vote from './Vote';

@Entity("comments")
export default class Comment extends BaseEntity {
    @Index()
    @Column()
    identifier: string;
    
    @Column()
    body: string;

    @Column()
    username: string;

    @ManyToOne(() => User)
    @JoinColumn({ name: "username", referencedColumnName: "username" })
    user: User

    @Column()
    postId: number;

    @ManyToOne(() => Post, (post) => post.comments, {nullable: false})
    post: Post;

    @Exclude()
    @OneToMany(() => Vote, (vote) => vote.comment)
    votes: Vote[] 

    protected userVote: number;

    setUserVote(user: User) {
        const index = this.votes?.findIndex(v => v.username === user.username);
        this.userVote = index > -1 ? this.votes[index].value : 0;
    }
    
    @Expose() get voteScore(): number {
        const initialValue = 0;
        return this.votes?.reduce((previousValue, currentObject) => 
            previousValue + (currentObject.value || 0), initialValue)
    }

    @BeforeInsert()
    makeId() {
        this.identifier= makeId(8)
    }
}
```