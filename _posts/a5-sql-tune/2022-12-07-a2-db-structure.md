---
layout: post
title: Chapter 1. 데이터베이스 구조
date: 2022-12-07
updated: 
tags: 
menu: sql-tune
---
## Oracle 데이터베이스 서버 구조
* 서버 프로세스 : User 프로세스의 요청을 수행하는 서버PC의 프로세스. 실제 DB가 설치된 서버 프로세스를 의미한다.
* 유저 프로세스 : 서버 프로세스와의 커넥션을 통해 사용자가 DB에 접근할 수 있도록 해주는 프로세스.
* SGA(System Global Area) : 모든 사용자가 공유하여 사용하는 메모리 공간.
* PGA(Program Global Area) : 사용자마다 공유하지 않고 개별적으로 사용하는 서버 프로세스 메모리

<img src="\assets\img\posts\sql-tunning\db-server-structure.png" style="width: 80%;" />   
#### SGA <-> PGA 
***공유와 비공유의 차이. SGA/PGA의 가장 큰 차이는 잠금장치 획득 여부***이다.   
SGA 메모리 영역을 사용하기 위해서는 영역의 사용여부를 확인하고 사용 가능여부를 확인하면 잠금장치를 통해 해당 영역을 선점.   
SGA 영역이 이미 선점된 상태라면 경합으로 인한 Waiting이 발생한다.   

SGA 영역을 사용하는 요청이 최적화되어 빠른 속도로 처리된다면 경합으로 인한 Waiting 시간을 줄일 수 있다.   
이러한 경합 상황에서 발생하는 지연을 줄이기 위해 DB, OS, Instance 영역의 최적화가 필요하다.   

- - -

## 데이터베이스의 저장 영역 구조
#### 주요 저장 영역
해당 영역의 파일이 손상되면 DB가 기동 상태를 유지할 수 없을 수도 있다.
* ***Control File*** : DB의 물리적인 구조정보를 저장한다. 데이터 파일, 온라인 리두 로그 파일의 위치 정보, 백업 파일의 위치정보, DB의 이름 정보 등이 포함된다.
* ***데이터 파일*** : DB의 실제 데이터가 저장되는 영역.
* ***온라인 리두 로그 파일*** : 프로세스가 수행한 SQL의 복구를 위한 리두 로그 파일.
<img src="\assets\img\posts\sql-tunning\db-strg-structrue.png" style="width: 80%;" />   

- - -

## 논리적, 물리적 데이터베이스 구조
***데이터파일***은 실제 데이터를 저장하는 물리적 영역을 의미한다.    
***테이블스페이스***는 이러한 데이터 파일을 관리하는 논리적인 영역을 의미한다.   

하나의 데이터 파일만, 단일 스토리지로만 데이터파일을 관리한다면 많은 프로세스의 I/O 작업으로인해 경합은 자연스레 발생하게 된다.   
Oracle의 테이블스페이스는 여러 디스크에 저장된 다수의 데이터파일을 논리적으로 관리하여 I/O 작업으로 인해 발생하는 경합을 줄일 수 있는 기능을 제공한다.   
테이블 스페이스에는 최대 1022 개의 데이터 파일이 포함될 수 있다.
<img src="\assets\img\posts\sql-tunning\logic-physic-structure.png" style="width: 60%;" />   

- - -

## 테이블스페이스 및 데이터 파일
DB 데이터파일은 ***블록*** 이라는 일정 크기의 물리적 데이터로 구성된다.   
블록 사이즈는 여러 단위로 사용이 가능하지만 일반적인 경우 크기가 고정된다.   
프로세스가 ***데이터파일에 접근해 I/O 작업이 이루어질 때 모든 작업은 이 블록 사이즈를 기준으로 수행***된다.   
ㅁ
블록사이즈가 상대적으로 크면 I/O 작업 한 번으로 더 많은 데이터를 읽을 수 있지만 경합으로 인한 Wait 시간은 늘어나게 된다.
반대로 블록사이즈가 작으면 I/O 작업 한 번으로 읽을 수 있는 데이터는 적어지지만 경합으로 인한 Wait 시간은 줄어들게 된다.

***시스템 특성에 맞는 최적화된 블록사이즈를 설정하는 것이 중요***하다.   
통상적인 시스템의 경우 8KB의 블록사이즈가 사용된다.

<img src="\assets\img\posts\sql-tunning\tablesapace-datafile.png" style="width: 60%;" />   

- - -

## 데이터베이스 버퍼 캐시
디스크 내 DB 데이터 파일 I/O 없이 메모리에서 읽어와 DB 성능을 높이기 위한 영역.   
메모리에 대한 경합이 증가할 수 있음.
<img src="\assets\img\posts\sql-tunning\buffer-cache.png" style="width: 70%;" />   

- - -

## 리두 로그 버퍼
<img src="\assets\img\posts\sql-tunning\redo-log-buffer.png" style="width: 70%;" />   

- - -

## Shared Pool
데이터 파일의 I/O를 위한 영역이 아닌 Oracle 인스턴스를 위한 영역.
<img src="\assets\img\posts\sql-tunning\shared-pool.png" style="width: 70%;" />   

- - -

## 프로세스 아키텍쳐
* ***User Process*** : 오라클 데이터베이스에 연결하는 응용 프로그램 또는 도구
* ***데이터베이스 프로세스*** :
  + 서버 프로세스 : Oracle Instance에 연결되며 유저가 세션을 설정하면 시작됩니다.
  + 백그라운드 프로세스 : Oracle Instance가 시작될 때 시작됩니다.
