---
layout: post
title: Chapter 5. 인덱스 사용
date: 2022-12-08
updated: 
tags: [oracle, sql-tunning]
menu: sql-tune
---

## 인덱스 구조
- 칼럼의 값, ROWID가 항상 ***정렬된 상태***를 유지
- 칼럼의 값은 NULL을 제외한 모든 값 보유
- ROWID를 저장하고 있으므로 ***테이블의 불필요한 I/O를 줄일 수 있음***
- Root, Branch, Leaf Block을 이용하여 ***Tree 구조로 관리***

#### 테이블 데이터의 데이터 파일 정보 확인
```sql
SELECT employee_id, last_name, commission_pct, rowid,
 -- 데이터 파일 번호
 DBMS_ROWID.ROWID_RELATIVE_FNO(rowid) AS FILE_NO,
 -- 데이터 블록 번호
 DBMS_ROWID.ROWID_BLOCK_NUMBER(rowid) AS BLOCK_NO,
 -- Row Number
 DBMS_ROWID.ROWID_ROW_NUMBER(rowid) AS ROW_NO
 FROM employees ;
```

#### [테이블 데이터의 데이터 파일 정보 - 출력 결과]
```
172	Bates	        0.15	AAAUsCAANAABgWzABR	13	394675	81
173	Kumar	        0.1     AAAUsCAANAABgWzABS	13	394675	82
174	Abel	        0.3     AAAUsCAANAABgWzABT	13	394675	83
175	Hutton	        0.25	AAAUsCAANAABgWzABU	13	394675	84
176	Taylor	        0.2     AAAUsCAANAABgWzABV	13	394675	85
177	Livingston      0.2     AAAUsCAANAABgWzABW	13	394675	86
178	Grant	        0.15    AAAUsCAANAABgWzABX	13	394675	87
179	Johnson	        0.1     AAAUsCAANAABgWzABY	13	394675	88
180	Taylor		null    AAAUsCAANAABgWzABZ	13	394675	89
181	Fleaur		null    AAAUsCAANAABgWzABa	13	394675	90
182	Sullivan	null    AAAUsCAANAABgWzABb	13	394675	91
183	Geoni		null    AAAUsCAANAABgWzABc	13	394675	92
184	Sarchand	null    AAAUsCAANAABgWzABd	13	394675	93
185	Bull		null    AAAUsCAANAABgWzABe	13	394675	94
...
```

- - -

## 인덱스 사용 쿼리 예제
```sql
DEFINE rid = 'AAAUsCAANAABgWzAAE';

-- 컬럼 인덱스 생성
CREATE INDEX empl_comm_ix ON employees(commission_pct) ;

-- 실행 쿼리
SELECT employee_id, last_name, commission_pct, rowid
 FROM employees
 WHERE commission_pct = 0.4;
 -- * where 조건으로 치지 않음 : 실행계획 ID컬럼에 *문자 미포함
 -- WHERE rowid = chartorowid('&rid') ;

-- 실제 실행 계획 확인 
SELECT *
FROM table(dbms_xplan.display_cursor(null,null,'ALLSTATS LAST')) ;
```

#### [인덱스 사용 쿼리 예제 - 실행 계획]
* 조건절 : Id값 내 * 표시
* INDEX 범위 스캔. 
* 인덱스 이름 : EMPL_COMM_IX
* 예측 조회 ROW 수 : 5
* 실제 조회 ROW 수 : 1
* 응답 시간 : 0.01 초
* 메모리 버퍼 사용 개수 : 1
* 들여쓰기 깊이가 깊은 Id 순으로 실행됨 : 2-1-0

```
SQL_ID  892vwpghpw26u, child number 0
-------------------------------------
SELECT employee_id, last_name, commission_pct, rowid  FROM employees  
-- where 조건으로 치지 않음 : 실행계획 ID컬럼에 *문자 미포함  WHERE commission_pct = 0.4
 
Plan hash value: 337358348
 
--------------------------------------------------------------------------------------------------------------
| Id  | Operation                           | Name         | Starts | E-Rows | A-Rows |   A-Time   | Buffers |
--------------------------------------------------------------------------------------------------------------
|   0 | SELECT STATEMENT                    |              |      1 |        |      1 |00:00:00.01 |       2 |
|   1 |  TABLE ACCESS BY INDEX ROWID BATCHED| EMPLOYEES    |      1 |      5 |      1 |00:00:00.01 |       2 |
|*  2 |   INDEX RANGE SCAN                  | EMPL_COMM_IX |      1 |      5 |      1 |00:00:00.01 |       1 |
--------------------------------------------------------------------------------------------------------------
 
Predicate Information (identified by operation id):
---------------------------------------------------
 
   2 - access("COMMISSION_PCT"=.4)
 
```

- - -

## Table Full Scan & Index Scan
모든 SQL 문장이 실행될 때 ***항상 인덱스를 사용하는 것이 올바른 실행 계획은 아니다.***   
전체의 데이터 중에 많은 양의 행을 검색하는 경우 Full Table Scan이 효율적이며 소량의 데이터를 검색할 경우   
Index Scan이 Full Table Scan 보다 I/O를 줄일 수 있는 실행 계획이 된다.

항상 Index Scan이 가능한 실행 계획을 사용하는 것보다 ***전체의 데이터 중 얼마만큼의 행을   
검색하는지를 확인하여 Index의 사용 유무를 결정하는 것이 더 중요***하다. 

#### Table Full Scan이 유리한 경우 예제
```sql
-- 힌트가 없는 테이블 조회 쿼리
SELECT cust_id, COUNT(*)
 FROM sales s
 WHERE channel_id = 3
 GROUP BY cust_id ;

-- 테이블 풀스캔 힌트 사용 쿼리
SELECT /*+ full(s) */ cust_id, COUNT(*)
 FROM sales s
 WHERE channel_id = 3
 GROUP BY cust_id ;

-- 컬럼 인덱스 힌트 사용 쿼리
SELECT /*+ index(s(channel_id)) */
 cust_id, COUNT(*)
 FROM sales s
 WHERE channel_id = 3
 GROUP BY cust_id ;
```

#### [Table Full Scan이 유리한 경우 예제 - 쿼리 실행 계획]
***실행 계획 조회 결과 테이블 풀스캔 사용 쿼리의 경우가 버퍼 I/O 횟수가 더 많다***   
<p style="color: red; font-weight: bold">
따라서 인덱스를 무조건 사용해야만 하는 것은 아니다.
</p>

***쿼리 튜닝의 시작은 실제 쿼리 실행 계획 확인하고 리소스의 사용과 응답 시간을 고려하는 데서 시작된다.***

```
// 테이블 풀스캔 사용 쿼리의 실행 계획
--------------------------------------------------------------------------------------
| Id  | Operation          | Name  | Starts | E-Rows | A-Rows |   A-Time   | Buffers |
--------------------------------------------------------------------------------------
|   0 | SELECT STATEMENT   |       |      1 |        |    200 |00:00:00.05 |    4438 |
|   1 |  HASH GROUP BY     |       |      1 |   7059 |    200 |00:00:00.05 |    4438 |
|*  2 |   TABLE ACCESS FULL| SALES |      1 |    540K|    540K|00:00:00.02 |    4438 |
--------------------------------------------------------------------------------------

// 컬럼 인덱스 힌트 사용 쿼리의 실행 계획
-------------------------------------------------------------------------------------------------------------------
| Id  | Operation                            | Name             | Starts | E-Rows | A-Rows |   A-Time   | Buffers |
-------------------------------------------------------------------------------------------------------------------
|   0 | SELECT STATEMENT                     |                  |      1 |        |    200 |00:00:00.30 |    5480 |
|   1 |  HASH GROUP BY                       |                  |      1 |   7059 |    200 |00:00:00.30 |    5480 |
|   2 |   TABLE ACCESS BY INDEX ROWID BATCHED| SALES            |      1 |    540K|    540K|00:00:00.19 |    5480 |
|*  3 |    INDEX RANGE SCAN                  | SALES_CHANNEL_IX |      1 |    540K|    540K|00:00:00.08 |    1059 |
-------------------------------------------------------------------------------------------------------------------
```

- - -

## 인덱스를 사용하지 못하는 경우
- 조건식의 부재
- 칼럼의 변형
- IS NULL, IS NOT NULL 비교
- LIKE 비교 시 %,_ 와일드카드가 앞에 오는 경우 
  + ***오래된 버전의 옵티마이저의 경우 사용이 불가했으나 현재는 가능하다.***
- 부정형 비교
- 암시적인 데이터 타입 변환

#### 1. 사례 연구 : 조건식의 부재
Cost Based Optimizer가 사용되고 있다면 항상 고정화된 인덱스의 사용 유/무의 규칙은 존재하지 않는다.     
경우에 따라 인덱스의 사용 유/무는 달라질 수 있으므로 실행 계획을 확인하는 습관이 필요하다.

실제 실행 계획을 살펴보면    
HAVING 절을 이용하여 DEPTNO 칼럼의 조건식이 존재하지만 DEPTNO 칼럼의 인덱스를 사용하지 않았다.

***인덱스의 사용 유/무를 결정하는 것은 일반적으로 WHERE 절에 의해서 결정***되므로 일반 칼럼의 조건식은 WHERE을
이용한다. 

```sql
-- 조건식이 없는 SQL
SELECT deptno, SUM(sal)
 FROM emp
 GROUP BY deptno
 HAVING deptno IN (10,20) ;

-- where 조건식이 존재하는 SQL
SELECT deptno, SUM(sal)
 FROM emp
 WHERE deptno IN (10,20)
 GROUP BY deptno ;
```

#### 1-1. [사례 연구 : 조건식의 부재 - 실행계획]
```
// 조건식이 없는 SQL의 실행 계획
-----------------------------------------------------------------------------------------------------------------
| Id  | Operation           | Name | Starts | E-Rows | A-Rows |   A-Time   | Buffers |  OMem |  1Mem | Used-Mem |
-----------------------------------------------------------------------------------------------------------------
|   0 | SELECT STATEMENT    |      |      1 |        |      2 |00:00:00.01 |       2 |       |       |          |
|*  1 |  FILTER             |      |      1 |        |      2 |00:00:00.01 |       2 |       |       |          |
|   2 |   HASH GROUP BY     |      |      1 |      1 |      3 |00:00:00.01 |       2 |  1452K|  1452K|   11M (0)|
|   3 |    TABLE ACCESS FULL| EMP  |      1 |     14 |     14 |00:00:00.01 |       2 |       |       |          |
-----------------------------------------------------------------------------------------------------------------

// where 조건식을 추가한 SQL의 실행 계획
---------------------------------------------------------------------------------------------------------
| Id  | Operation                     | Name          | Starts | E-Rows | A-Rows |   A-Time   | Buffers |
---------------------------------------------------------------------------------------------------------
|   0 | SELECT STATEMENT              |               |      1 |        |      2 |00:00:00.01 |       3 |
|   1 |  SORT GROUP BY NOSORT         |               |      1 |      2 |      2 |00:00:00.01 |       3 |
|   2 |   INLIST ITERATOR             |               |      1 |        |      8 |00:00:00.01 |       3 |
|   3 |    TABLE ACCESS BY INDEX ROWID| EMP           |      2 |      8 |      8 |00:00:00.01 |       3 |
|*  4 |     INDEX RANGE SCAN          | EMP_DEPTNO_IX |      2 |      8 |      8 |00:00:00.01 |       2 |
---------------------------------------------------------------------------------------------------------
```

#### 2. 사례 연구 : 칼럼의 변형
모든 인덱스는 칼럼에 저장되어 있는 값을 기반으로 정렬되어 있다. 때문에 계산된 결과를 비교하거나 예제와 같이 함수를   
적용한 칼럼은 인덱스를 사용하는 실행 계획을 생성하지 않는다. 

해당 쿼리를 튜닝하기 위해 ***Function Based Index를 이용하여 계산된 값을 저장하도록 인덱스를 생성***하거나    
***칼럼의 가공 또는 변형이 발생하지 않도록 조건 식을 수정한다.***
```sql
-- 칼럼의 변경으로 FULL SCAN 쿼리
SELECT cust_id, cust_first_name, cust_last_name, cust_postal_code
 FROM customers
 WHERE SUBSTR(cust_last_name,1,3) = 'You' ;

-- 칼럼이 변형되지 않도록 조건 식 수정한 쿼리
SELECT cust_id, cust_first_name, cust_last_name, cust_postal_code
 FROM customers
 WHERE cust_last_name LIKE 'You%' ;

-- Function Based 인덱스 생성
CREATE INDEX custs_ix01 ON customers(SUBSTR(cust_last_name,1,3)) ;
-- 관련 함수 인덱스 힌트 사용 쿼리
SELECT /*+ INDEX (c cust_ix01) */
 cust_id, cust_first_name, cust_last_name, cust_postal_code
 FROM customers c
 WHERE SUBSTR(cust_last_name,1,3) = 'You' ;
```

#### 2-1. [사례 연구 : 칼럼의 변형 - 실행 계획]
```
// 칼럼의 변형으로 FULL SCAN 쿼리 실행 계획
-----------------------------------------------------------------------------------------
| Id  | Operation         | Name      | Starts | E-Rows | A-Rows |   A-Time   | Buffers |
-----------------------------------------------------------------------------------------
|   0 | SELECT STATEMENT  |           |      1 |        |     80 |00:00:00.01 |    1456 |
|*  1 |  TABLE ACCESS FULL| CUSTOMERS |      1 |    555 |     80 |00:00:00.01 |    1456 |
-----------------------------------------------------------------------------------------

// 칼럼이 변형되지 않도록 조건 식 수정한 쿼리 실행 계획
-----------------------------------------------------------------------------------------------------------------------------
| Id  | Operation                           | Name               | Starts | E-Rows | A-Rows |   A-Time   | Buffers | Reads  |
-----------------------------------------------------------------------------------------------------------------------------
|   0 | SELECT STATEMENT                    |                    |      1 |        |     80 |00:00:00.01 |      13 |      1 |
|   1 |  TABLE ACCESS BY INDEX ROWID BATCHED| CUSTOMERS          |      1 |     61 |     80 |00:00:00.01 |      13 |      1 |
|*  2 |   INDEX RANGE SCAN                  | CUST_LAST_NAME_IDX |      1 |     61 |     80 |00:00:00.01 |       2 |      1 |
-----------------------------------------------------------------------------------------------------------------------------

// 함수 기반 인덱스 생성한 쿼리 실행 계획
---------------------------------------------------------------------------------------------------------------------
| Id  | Operation                           | Name       | Starts | E-Rows | A-Rows |   A-Time   | Buffers | Reads  |
---------------------------------------------------------------------------------------------------------------------
|   0 | SELECT STATEMENT                    |            |      1 |        |     80 |00:00:00.01 |      13 |      1 |
|   1 |  TABLE ACCESS BY INDEX ROWID BATCHED| CUSTOMERS  |      1 |    555 |     80 |00:00:00.01 |      13 |      1 |
|*  2 |   INDEX RANGE SCAN                  | CUSTS_IX01 |      1 |    222 |     80 |00:00:00.01 |       2 |      1 |
---------------------------------------------------------------------------------------------------------------------
```


#### 3. 사례 연구 : IS NULL 비교
일반 인덱스 (B*Tree Index)는 NULL의 ROWID를 기록하고 있지 않으므로 조건 식의 IS NULL의 비교는 항상 인덱스를   
사용할 수 없다.   
NULL 을 갖는 행의 수가 많은 경우라면 FULL TABLE SCAN이 올바른 실행 계획이겠으나 소수의 행만이 NULL 을 가지고 있다면   
INDEX SCAN이 보다 나은 실행 계획일 수 있다.

INDEX SCAEN을 위해 ***Function Based Index를 이용하여 NULL 의 ROWID를 인덱스에 저장하게 하거나 Bitmap Index를 이용한다.***

```sql
-- IS NULL 조건의 FULL SCAN 쿼리
SELECT empno, ename, sal, comm, deptno
 FROM emp
 WHERE comm IS NULL ;

-- 함수 기반 인덱스 생성
CREATE INDEX emp_fix ON emp(NVL(comm,-1)) ;
-- 해당 인덱스를 사용한 쿼리
SELECT empno, ename, sal, comm, deptno
 FROM emp
 -- 컬럼 값이 NULL일 경우 치환하여 저장
 WHERE NVL(comm,-1) = -1 ; 
```

#### 3-1. [사례 연구 : IS NULL 비교 - 실행 계획]
IS NULL 의 비교는 B*Tree Index를 이용하는 경우 항상 인덱스를 사용할 수 없다.   
NULL 의 값이 대량으로 들어 있어서 인덱스를 사용하지 않아도 상관없는 경우를 제외하고 소량의 NULL을 검색해야 하는 경우가 있다면   
함수 기반 인덱스를 활용한다.   
***가급적 칼럼에 NULL 이 존재하지 않도록 DEFAULT 값을 지정하거나 임의의 다른 값으로 NULL을 대체하는 것이 더 좋은 방법이 된다.***
```
// IS NULL 조건의 FULL SCAN 쿼리 실행 계획
------------------------------------------------------------------------------------
| Id  | Operation         | Name | Starts | E-Rows | A-Rows |   A-Time   | Buffers |
------------------------------------------------------------------------------------
|   0 | SELECT STATEMENT  |      |      1 |        |     10 |00:00:00.01 |       2 |
|*  1 |  TABLE ACCESS FULL| EMP  |      1 |     11 |     10 |00:00:00.01 |       2 |
------------------------------------------------------------------------------------

// 함수 기반 인덱스를 사용한 쿼리의 실행 계획
---------------------------------------------------------------------------------------------------------
| Id  | Operation                           | Name    | Starts | E-Rows | A-Rows |   A-Time   | Buffers |
---------------------------------------------------------------------------------------------------------
|   0 | SELECT STATEMENT                    |         |      1 |        |     10 |00:00:00.01 |       2 |
|   1 |  TABLE ACCESS BY INDEX ROWID BATCHED| EMP     |      1 |      1 |     10 |00:00:00.01 |       2 |
|*  2 |   INDEX RANGE SCAN                  | EMP_FIX |      1 |      1 |     10 |00:00:00.01 |       1 |
---------------------------------------------------------------------------------------------------------
```

#### 4. 사례 연구 : IS NOT NULL 비교
IS NOT NULL 의 비교에 Table Full Scan 이 사용되었다. 하지만 테이블의 대부분의 행을 검색하는 경우이므로 Full Table   
Scan 이 올바른 실행 계획임을 확인할 수 있다. 
```sql
-- IS NOT NULL 풀스캔이 유리한 SQL
SELECT employee_id, last_name, commission_pct, salary
 FROM employees
 WHERE salary IS NOT NULL ; 
```

IS NOT NULL 의 비교 시 검색 되는 데이터의 양에 따라 Full Table Scan 과 Index Scan 이 각각 사용된다. 힌트를   
이용하여 인덱스의 사용을 강제화 시킨 후 작업량을 비교한다.

힌트를 이용하여 인덱스 사용을 강제화 시켰으며 실제 실행 계획을 확인하면 ***Index Full Scan을 이용하여 오히려    
Full Table Scan 보다 작업량이 늘어난 것을 확인*** 할 수 있다

```sql
-- 힌트를 사용하여 인덱스 사용을 강제한 SQL
SELECT /*+ index(employees(salary)) */
 employee_id, last_name, commission_pct, salary
 FROM employees영
 WHERE salary IS NOT NULL ; 
```

인덱스에는 NULL 의 ROWID를 보관하지 않는다. 그렇다면 IS NOT NULL 은 인덱스의 모든 행을 검색해야 하는 상황이므로   
Index Full Scan 은 어쩔 수 없는 선택이 된다. 때문에 칼럼의 대부분의 값이 NULL이고 값을 가지고 있는 경우가
소량이라면 인덱스를 활용하는 것이 좋을 수도 있다. 

<span style="color: green; font-weight: bold">
=> IS NULL 의 비교는 인덱스를 항상 사용하지 못한다. 하지만 IS NOT NULL 은 경우에 따라 인덱스를 사용할 수 있다. 단,   
INDEX FULL SCAN이 사용됨을 확인하고 작업의 범위가 넓지 않은 경우에만 인덱스를 활용할 수 있도록 한다.
<span>

```sql
-- IS NOT NULL 인덱스 풀스캔이 유리한 SQL
SELECT empno, ename, sal, comm, deptno
 FROM emp
 WHERE comm IS NOT NULL ;
```

#### 4-1. [사례 연구 : IS NOT NULL 비교 - 실행 계획]
```
// IS NOT NULL 풀스캔이 유리한 SQL의 실행 계획
-----------------------------------------------------------------------------------------
| Id  | Operation         | Name      | Starts | E-Rows | A-Rows |   A-Time   | Buffers |
-----------------------------------------------------------------------------------------
|   0 | SELECT STATEMENT  |           |      1 |        |    107 |00:00:00.01 |       3 |
|*  1 |  TABLE ACCESS FULL| EMPLOYEES |      1 |    107 |    107 |00:00:00.01 |       3 |
-----------------------------------------------------------------------------------------

// 힌트를 사용하여 인덱스 사용을 강제한 SQL의 실행 계획
-------------------------------------------------------------------------------------------------------------
| Id  | Operation                           | Name        | Starts | E-Rows | A-Rows |   A-Time   | Buffers |
-------------------------------------------------------------------------------------------------------------
|   0 | SELECT STATEMENT                    |             |      1 |        |    107 |00:00:00.01 |      18 |
|   1 |  TABLE ACCESS BY INDEX ROWID BATCHED| EMPLOYEES   |      1 |    107 |    107 |00:00:00.01 |      18 |
|*  2 |   INDEX FULL SCAN                   | EMPL_SAL_IX |      1 |    107 |    107 |00:00:00.01 |       1 |
-------------------------------------------------------------------------------------------------------------

// IS NOT NULL 인덱스 풀스캔이 유리한 SQL의 실행 계획
-------------------------------------------------------------------------------------------------------------
| Id  | Operation                           | Name        | Starts | E-Rows | A-Rows |   A-Time   | Buffers |
-------------------------------------------------------------------------------------------------------------
|   0 | SELECT STATEMENT                    |             |      1 |        |      4 |00:00:00.01 |       2 |
|   1 |  TABLE ACCESS BY INDEX ROWID BATCHED| EMP         |      1 |      4 |      4 |00:00:00.01 |       2 |
|*  2 |   INDEX FULL SCAN                   | EMP_COMM_IX |      1 |      4 |      4 |00:00:00.01 |       1 |
-------------------------------------------------------------------------------------------------------------
```

#### 5. 사례 연구 : LIKE 비교 시 %,_ 와일드 카드가 앞에 오는 경우
```sql
-- 와일드 카드가 뒤에 오는 경우 SQL
SELECT cust_id, cust_first_name, cust_last_name, cust_postal_code
 FROM customers
 WHERE cust_last_name LIKE 'You%' ;
```
 
LIKE 비교 시 %를 앞에 사용했으므로 Table Full Scan 이 사용되었다. 대량의 데이터를 검색하는 경우라면 상관없겠으나    
한 개의 행을 검색하는데 Full Table Scan 은 비효율적인 엑세스 방법이다.
```sql
-- 와일드 카드가 앞에 오는 경우 SQL
SELECT cust_id, cust_first_name, cust_last_name, cust_postal_code
 FROM customers
 WHERE cust_last_name LIKE '%itt' ;
```

힌트를 이용하여 인덱스 사용을 강제화 시켰으며 Index Full Scan 이 이용되었다. 역시 한 개의 행을 찾기 위해 불필요한   
Index Full Scan 은 효율적인 엑세스 방법은 아니다
```sql
-- 와일드 카드가 앞에 오는 경우 SQL (인덱스 강제 힌트 사용)
SELECT /*+ index(c(cust_last_name)) */
 cust_id, cust_first_name, cust_last_name, cust_postal_code
 FROM customers c
 WHERE cust_last_name LIKE '%itt' ;
```

이를 해결하기 위한 방법으로 칼럼을 분리하여 LIKE 비교 시 앞에 %,_ 를 사용하지 않거나 Function Based Index를 이용한다.

```sql
-- 조회 조건의 함수 인덱스를 생성
CREATE INDEX custs_fix ON customers(REVERSE(cust_last_name)) ;
 
-- 조회 조건의 함수 인덱스 사용한 SQL
SELECT cust_id, cust_first_name, cust_last_name, cust_postal_code
 FROM customers
 WHERE REVERSE(cust_last_name) LIKE 'tti%' ;
```

<span style="color: green; font-weight: bold">
=> LIKE 비교 시 Full Table Scan을 해도 상관없는 경우를 제외한 앞에 %,_ 를 사용하지 않는다. 만약 사용한다면 인덱스를   
사용할 수 있도록 Function Based Index를 구성하거나 칼럼을 분리하여 저장한다.
<span>

#### 5-1. [사례 연구 : LIKE 비교 시 %,_ 와일드 카드가 앞에 오는 경우 - 실행 계획]
```
// 와일드 카드가 뒤에 오는 경우 SQL 실행 계획
--------------------------------------------------------------------------------------------------------------------
| Id  | Operation                           | Name               | Starts | E-Rows | A-Rows |   A-Time   | Buffers |
--------------------------------------------------------------------------------------------------------------------
|   0 | SELECT STATEMENT                    |                    |      1 |        |     80 |00:00:00.01 |      13 |
|   1 |  TABLE ACCESS BY INDEX ROWID BATCHED| CUSTOMERS          |      1 |     61 |     80 |00:00:00.01 |      13 |
|*  2 |   INDEX RANGE SCAN                  | CUST_LAST_NAME_IDX |      1 |     61 |     80 |00:00:00.01 |       2 |
--------------------------------------------------------------------------------------------------------------------

// 와일드 카드가 앞에 오는 경우 SQL 실행 계획
-----------------------------------------------------------------------------------------
| Id  | Operation         | Name      | Starts | E-Rows | A-Rows |   A-Time   | Buffers |
-----------------------------------------------------------------------------------------
|   0 | SELECT STATEMENT  |           |      1 |        |      1 |00:00:00.01 |    1456 |
|*  1 |  TABLE ACCESS FULL| CUSTOMERS |      1 |      1 |      1 |00:00:00.01 |    1456 |
-----------------------------------------------------------------------------------------

// 와일드 카드가 앞에 오는 경우 SQL (인덱스 강제 힌트 사용) 실행 계획
--------------------------------------------------------------------------------------------------------------------
| Id  | Operation                           | Name               | Starts | E-Rows | A-Rows |   A-Time   | Buffers |
--------------------------------------------------------------------------------------------------------------------
|   0 | SELECT STATEMENT                    |                    |      1 |        |      1 |00:00:00.01 |     143 |
|   1 |  TABLE ACCESS BY INDEX ROWID BATCHED| CUSTOMERS          |      1 |   2775 |      1 |00:00:00.01 |     143 |
|*  2 |   INDEX FULL SCAN                   | CUST_LAST_NAME_IDX |      1 |   2775 |      1 |00:00:00.01 |     142 |
--------------------------------------------------------------------------------------------------------------------

// 조회 조건의 함수 인덱스 사용한 SQL 실행 계획
--------------------------------------------------------------------------------------------------------------------
| Id  | Operation                           | Name      | Starts | E-Rows | A-Rows |   A-Time   | Buffers | Reads  |
--------------------------------------------------------------------------------------------------------------------
|   0 | SELECT STATEMENT                    |           |      1 |        |      1 |00:00:00.01 |       3 |      1 |
|   1 |  TABLE ACCESS BY INDEX ROWID BATCHED| CUSTOMERS |      1 |   2775 |      1 |00:00:00.01 |       3 |      1 |
|*  2 |   INDEX RANGE SCAN                  | CUSTS_FIX |      1 |    499 |      1 |00:00:00.01 |       2 |      1 |
--------------------------------------------------------------------------------------------------------------------
```

#### 6. 사례 연구 : 부정형 비교
NOT IN 과 같은 부정형 비교 사용 시 인덱스 사용은 불가능 한 경우가 많다.      
부정형 비교는 특정 값을 제외한 나머지 모든 값을 비교해야 하는 상황이므로 인덱스의 검색 범위가 넓어질 수 있다는 단점이 있기 때문에   
Rule Based Optimizer에서는 항상 인덱스를 사용하지 않았다. 

하지만 Cost Based Optimizer 가 사용된다면 검색 되는 데이터의 양을 비교하여 인덱스를 사용하는 실행계획이 만들어지는 경우도 존재한다.   
***단, 부정형 비교는 특정 값을 제외한 나머지 모든 값이므로 Index Full Scan 이 사용되는 것을 확인할 수 있다.***

```sql
-- 부정형 비교 조건 SQL
SELECT employee_id, last_name, salary, department_id
 FROM employees
 WHERE department_id NOT IN (10,20) ;

-- 부정형 비교 조건 SQL (인덱스 사용 강제 힌트)
SELECT /*+ index(employees(department_id)) */
 employee_id, last_name, salary, department_id
 FROM employees
 WHERE department_id NOT IN (10,20) ; 
```

부정형 비교의 사용은 가급적 자제하는 것이 좋다. Index Full Scan 의 범위가 극히 적을 경우가 아니라면 부정형 비교가   
아닌 다른 방법으로 ***동일한 결과를 검색할 수 있도록 문장을 작성한다.*** 

<span style="color: green; font-weight: bold">
=> 부정형 비교 연산자의 사용을 자제하며 필요시 실행계획을 확인하여 인덱스를 활용할 수 있도록 적절한 힌트를 지정한다.
</span>

```sql
-- 부정형 비교 조건과 동일한 결과의 조건을 사용한 SQL
SELECT /*+ index(employees(department_id)) */
 employee_id, last_name, salary, department_id
 FROM employees
 WHERE department_id IN (30,40,50,60,70,80,90,100,110) ;

-- 부정형 비교 조건과 동일한 결과의 조건을 사용한 SQL
SELECT /*+ index(employees(department_id)) */
 employee_id, last_name, salary, department_id
 FROM employees
 WHERE department_id > 20 ;
```

#### 7. 암시적 데이터 타입 변환
employee_id 컬럼에 인덱스가 분명 존재하지만 실행 계획 상에서는 FULL SCAN을 수행한다.   
employee_id의 데이터타입은 문자열이지만 where절 비교 대상이 숫자이므로 암시적인 형변환을   
처리하며 FULL SCAN을 수행하게 된다.   
<p style="color: red; font-weight: bold">
따라서 인덱스 스캔을 사용하기 위해서는 데이터 타입을 맞춰 사용해야 한다.
</p>

```sql
SELECT employee_id, last_name, hire_date, salary, department_id
 FROM employee
 WHERE employee_id = 100 ;
```

#### 7-1. [암시적 데이터 타입 변환 - 실행 계획]
```
-------------------------------------------------------------------------------------------------
| Id  | Operation         | Name     | Starts | E-Rows | A-Rows |   A-Time   | Buffers | Reads  |
-------------------------------------------------------------------------------------------------
|   0 | SELECT STATEMENT  |          |      1 |        |      1 |00:00:00.01 |       4 |      2 |
|*  1 |  TABLE ACCESS FULL| EMPLOYEE |      1 |      1 |      1 |00:00:00.01 |       4 |      2 |
-------------------------------------------------------------------------------------------------
```