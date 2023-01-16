---
layout: post
title: Chapter 2. 문장 처리 과정
date: 2022-12-07
updated: 
tags: [oracle, sql-tunning]
menu: sql-tune
---

## SQL문 구문 분석 : 개요
1. Parse : 구문 분석 (실행 계획 확보)
  * 문법 검사
  * 의미 분석 (객체, 권한 유무)
  * IF 동일 문장 사용 여부   
      TRUE : 실행 계획 재사용   
      FALSE : 실행 계획 생성 / 저장<br /><br />
2. Bind : 바인드 변수 사용 시 바인드 변수에 값 입력
```sql
SELECT * FROM EMP WHERE DEPTNO = ?;
```
3. ***Execute*** : 실행
4. Fetch : SELECT 명령문일 때 검색 결과 인출

<img src="\assets\img\posts\sql-tunning\sql-syntax.png" style="width: 70%;" />   

- - -

## 옵티마이저가 필요한 이유
<img src="\assets\img\posts\sql-tunning\optimizer.png" style="width: 70%;" />   

***옵티마이저***란 사람으로 생각하면 두뇌에 해당한다. SQL 실행을 위한 최적의 실행계획을 생성하는 알고리즘이다.   
옵티마이저의 종류는 크게 아래 두 가지가 있다. 현재는 Cost Based Optimizer (CBO)가 사용되고 있으나   
과거에는 Rule Based Optimizer(RBO)를 사용했었다
* ***Rule Based Optimizer***
  + RBO 는 각 조건에 만족하는 행의 개수를 예상하지 않고 조건식에 사용되는 칼럼에 인덱스 존재 유무, 또는 비교 연산자의 종류 중   
  보다 범위가 작을 수 있는 연산식을 우선적으로 처리하는 규칙을 가지고 있다. 
  + 교통 흐름 상태는 모르는 상태에서 원하는 목적지를 최소 거리를 기준으로 길 찾기를 하는 것과 별반 다르지 않다.
  + 최상의 실행 계획을 만들기 위해서는 현재의 데이터의 상태(Optimizer Statistics)를 통해서 가장 적은 비용으로 처리가 가능한    
  실행 계획을 생성하는 것이 최적의 실행 계획이라 할 수 있다. (Oracle Databse 10g 부터는 CBO 가 기본적으로 사용된다.)
* ***Cost Based Optimizer***
  + 해당 Table에 Analyze를 수행하여 통계 데이터를 수집해 놓아야 사용 가느한 옵티마이저 방식.
  + Cost Base 옵티마이저는 분포도 및 실제 데이터의 통계치를 가지고 실행 계획을 생성하기 때문에 데이터베이스 ***Migration 등의 작업 후에는 문제를 유발시킬 위험***이 많다.
