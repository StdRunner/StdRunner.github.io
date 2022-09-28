---
layout: post
title: Post Entity
date: 2022-09-28
updated: 
tags: [typescript, next-js]
menu: clone-reddit
---
## 포스트 테이블 컬럼
<img src="\assets\img\posts\create-post-entity\post-cols.png" style="width:100%;" />

- - - 

## 포스트 엔티티 작성
```typescript
import { Exclude, Expose } from "class-transformer";
import { BeforeInsert, Column, Index, JoinColumn, ManyToOne, OneToMany } from "typeorm";
import { makeId, slugify } from "../utils/helpers";
import BaseEntity from "./Entity";
import Sub from "./Sub";
import { User } from "./User";

export default class Post extends BaseEntity {
    @Index()
    @Column()
    identifier: string

    @Column()
    title: string

    @Index()
    @Column()
    slug: string;

    @Column({nullable: true, type:"text"})
    body: string;

    @Column()
    subName: string;

    @Column()
    username: string;

    @ManyToOne(() => User, (user) => user.posts)
    @JoinColumn({ name: "username", referencedColumnName: "username" })
    user: User;

    @ManyToOne(() => Sub, (sub) => sub.posts)
    @JoinColumn({ name: "subname", referencedColumnName: "name" })
    sub: Sub;

    @Exclude()
    @OneToMany(() => Comment, (comment) => comment.post)
    comments: Comment[];

    @Exclude()
    @OneToMany(() => Vote, (vote => vote.post))
    votes: Vote[]

    @Expose() get url(): string {
        return `r/${this.subName}/${this.identifier}/${this.slug}`
    }

    @Expose() get commentCount(): number {
        return this.comments?.length;
    }

    @Expose() get voteScore(): number {
        return this.votes?.reduce((memo, curt) => memo + (curt.value || 0), 0);
    }

    protected userVote: number;

    setUserVote(user: User) {
        const index = this.votes?.findIndex(v => v.username == user.username);
        this.userVote = index > -1 ? this.votes[index].value : 0;
    }

    @BeforeInsert()
    makeIdAndSlug() {
        this.identifier = makeId(7);
        this.slug = slugify(this.title);
    }
}
```

- - - 

## 슬러그(slug)란?
슬러그는 페이지나 포스트를 설명하는 핵심 단어의 집합이다.   
원래 신문이나 잡지 등에서 제목을 쓸 때, 중요한 의미를 포함하는 단어만 이용해 제목을 작성하는 법을 말한다.   
보통 슬러그는 페이지나 포스트의 제목에서 조사, 전치사, 쉼표, 마침표 등을 빼고 띄어쓰기는   
***하이픈(-)으로 대체해서 만들며 URL*** 에 사용된다.   
슬러그를 URL에 사용함으로써, ***검색엔진의 최적화 정도와 정확도를 높여준다.***

- - -

## helper function을 위한 파일을 생성
```
\reddit-clone-app\server\src\utils\helpers.ts
```

#### Post 데이터 Insert 전 identifier, slug 생성
```typescript
    @BeforeInsert()
    makeIdAndSlug() {
        this.identifier = makeId(7);
        this.slug = slugify(this.title);
    }
```

#### Post 엔티티의 identifier를 생성하기 위한 makeId()
```typescript
export function makeId(length) {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * 
 charactersLength));
   }
   return result;
}
```

#### Post 엔티티의 slug를 생성하기 위한 slugify()
생성된 slug는 포스트 URL로 사용된다.
```typescript
export const slugify = function(str) {
    str = str.replace(/^\s+|\s+$/g, ''); // trim
    str = str.toLowerCase();
  
    // remove accents, swap ñ for n, etc
    var from = "ãàáäâẽèéëêìíïîõòóöôùúüûñç·/_,:;";
    var to   = "aaaaaeeeeeiiiiooooouuuunc------";
    for (var i = 0, l = from.length; i < l; i++) {
      str = str.replace(new RegExp(from.charAt(i), 'g'), to.charAt(i));
    }
  
    str = str.replace(/[^a-z0-9 -]/g, '') // remove invalid chars
             .replace(/\s+/g, '-') // collapse whitespace and replace by -
             .replace(/-+/g, '-'); // collapse dashes
  
    return str;
};
```