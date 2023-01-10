---
layout: post
title: 스택 수열
date: 2023-01-09
updated: 
tags: [java]
menu: algorithm-matters
---
## 스택 수열
* Reference URL : [https://www.acmicpc.net/problem/1874](https://www.acmicpc.net/problem/1874)
> 백준 온라인 저지

#### 문제
스택 (stack)은 기본적인 자료구조 중 하나로, 컴퓨터 프로그램을 작성할 때 자주 이용되는 개념이다.    
스택은 자료를 넣는 (push) 입구와 자료를 뽑는 (pop) 입구가 같아 제일 나중에 들어간 자료가 제일 먼저 나오는 (LIFO, Last in First out) 특성을 가지고 있다.

1부터 n까지의 수를 스택에 넣었다가 뽑아 늘어놓음으로써, 하나의 수열을 만들 수 있다.    
이때, 스택에 push하는 순서는 반드시 오름차순을 지키도록 한다고 하자.   
임의의 수열이 주어졌을 때 스택을 이용해 그 수열을 만들 수 있는지 없는지, 있다면 어떤 순서로 push와 pop 연산을 수행해야 하는지를 알아낼 수 있다.    
이를 계산하는 프로그램을 작성하라.

#### 입력
첫 줄에 n (1 ≤ n ≤ 100,000)이 주어진다.    
둘째 줄부터 n개의 줄에는 수열을 이루는 1이상 n이하의 정수가 하나씩 순서대로 주어진다.   
물론 같은 정수가 두 번 나오는 일은 없다.

#### 출력
입력된 수열을 만들기 위해 필요한 연산을 한 줄에 한 개씩 출력한다.    
push연산은 +로, pop 연산은 -로 표현하도록 한다. 불가능한 경우 NO를 출력한다.

#### 힌트
1부터 n까지에 수에 대해 차례로 [push, push, push, push, pop, pop, push, push, pop, push, push, pop, pop, pop, pop, pop] 연산을 수행하면   
수열 [4, 3, 6, 8, 7, 5, 2, 1]을 얻을 수 있다.

#### 예제 입력/출력
* 예제 입력 1
```
8   
4
3
6
8
7
5
2
1
```

* 예제 출력 1
```
+
+
+
+
-
-
+
+
-
+
+
-
-
-
-
-
```

* 예제 입력 2
```
5
1
2
5
3
4
```
* 예제 출력 2
```
NO
```

- - -

## 풀이
사용자에게 입력을 받는 형태와, Method 파라미터로 입력 받는 형태를 모두 정의함

#### 소스
```java
package year2023.month01.day09;

import java.util.ArrayList;
import java.util.Scanner;

public class stack {
    public static void main(String[] args) {
        /**
         *  백준 온라인 저지
         *  https://www.acmicpc.net/problem/1874
         */
        // 스택 ArrayList
        ArrayList stk = new ArrayList();
        // POP한 정수를 저장할 수열 ArrayList
        ArrayList seq = new ArrayList();
        // 출력 StringBuffer : + + + + - - ...
        StringBuffer output = new StringBuffer();
        // 숫자 포인터
        int pointer = 0;

        System.out.println("[INPUT]");
        // 숫자 n 입력
        Scanner scanner = new Scanner(System.in);
        int n = scanner.nextInt();
        // 수열을 입력받을 배열
        int[] input = new int[n];

        // 1~n 정수를 n번 입력받아 배열에 저장
        for(int i=0; i<n; i++) {
            int tmp = scanner.nextInt();
            input[i] = tmp;
        }

        // 수열의 정수를 반복
        Loop1 :
        for(int nextNum : input) {
            // 현재 포인터가 0(수열의 첫 번째 정수)인지 판단
            if (pointer == 0) {
                // 수열의 첫 번째 정수일 때
                for (int i = 1; i <= n; i++) {
                    // 수열의 첫 번째 정수까지 PUSH, 마지막 숫자 POP 후 LOOP 종료
                    output.append("+");
                    output.append("\n");
                    stk.add(i);
                    if (i == nextNum) {
                        output.append("-");
                        output.append("\n");
                        seq.add(stk.get(stk.size() - 1));
                        stk.remove(stk.size() - 1);
                        // 포인터 = nextNum
                        pointer = nextNum;
                        break;
                    }
                }
            } else {
                // 수열의 첫 번째 정수X
                // 다음 수열 정수가 현재 포인터 이전인지 이후인지 판단
                if (pointer < nextNum) {
                    // 포인터 이후
                    for (int i = pointer + 1; i <= nextNum; i++) {
                        // 다음 수열 정수까지 PUSH, 마지막 숫자 POP 후 LOOP 종료
                        // 이미 POP한 숫자인지 판단
                        if (seq.indexOf(i) == -1) {
                            output.append("+");
                            output.append("\n");
                            stk.add(i);
                        }
                    }
                    output.append("-");
                    output.append("\n");
                    seq.add(stk.get(stk.size() - 1));
                    stk.remove(stk.size() - 1);
                    // 포인터 = nextNum
                    pointer = nextNum;
                } else {
                    // 포인터 이전
                    Loop2:
                    for (int i = pointer - 1; i > nextNum; i--) {
                        // 다음 정수~포인터 사이의 숫자 중 이미 POP한 정수가 아닌 경우 확인
                        //  => 수열 만들기 불가능
                        if (seq.indexOf(i) == -1) {
                            output = new StringBuffer();
                            output.append("NO");
                            break Loop1;
                        }
                    }
                    output.append("-");
                    output.append("\n");
                    seq.add(stk.get(stk.size() - 1));
                    stk.remove(stk.size() - 1);
                    // 포인터 = nextNum
                    pointer = nextNum;
                }
            }
        }

        System.out.println("[OUPUT]");
        System.out.println(output.toString());

        // 메서드 사용
        /*
        int n = 8;
        int n = 5;

        int[] input = {4, 3, 6, 8, 7, 5, 2, 1};
        int[] input = {1, 2, 5, 3, 4};

        System.out.println(stack(n, input));
        */
    }

    public static String stack(int n, int[] input) {
        ArrayList stk = new ArrayList();
        ArrayList seq = new ArrayList();
        StringBuffer output = new StringBuffer();
        int pointer = 0;

        // 다음 수열에 필요한 숫자를 반복
        Loop1 :
        for(int nextNum : input) {
            // 현재 포인터가 0(수열의 첫 번째 정수)인지 판단
            if(pointer == 0) {
                // 수열의 첫 번째 정수O
                for(int i=1; i<=n; i++) {
                    // 수열의 첫 번째 정수까지 PUSH, 마지막 숫자 POP 후 LOOP 종료
                    output.append("+");
                    output.append("\n");
                    stk.add(i);
                    if(i == nextNum) {
                        output.append("-");
                        output.append("\n");
                        seq.add(stk.get(stk.size()-1));
                        stk.remove(stk.size()-1);
                        // 포인터 = nextNum
                        pointer = nextNum;
                        break;
                    }
                }
            } else {
                // 수열의 첫 번째 정수X
                // 다음 수열 정수가 현재 포인터 이전인지 이후인지 판단
                if(pointer < nextNum) {
                    // 포인터 이후
                    for(int i=pointer+1; i<=nextNum; i++) {
                        // 다음 수열 정수까지 PUSH, 마지막 숫자 POP 후 LOOP 종료
                        // 이미 POP한 숫자인지 판단
                        if(seq.indexOf(i) == -1) {
                            output.append("+");
                            output.append("\n");
                            stk.add(i);
                        }
                    }
                    output.append("-");
                    output.append("\n");
                    seq.add(stk.get(stk.size()-1));
                    stk.remove(stk.size()-1);
                    // 포인터 = nextNum
                    pointer = nextNum;
                } else {
                    // 포인터 이전
                    Loop2 :
                    for(int i=pointer-1; i>nextNum; i--) {
                        // 다음 정수~포인터 사이의 숫자 중 이미 POP한 정수가 아닌 경우 확인
                        //  => 수열 만들기 불가능
                        if(seq.indexOf(i)==-1) {
                            output = new StringBuffer();
                            output.append("NO");
                            break Loop1;
                        }
                    }
                    output.append("-");
                    output.append("\n");
                    seq.add(stk.get(stk.size()-1));
                    stk.remove(stk.size()-1);
                    // 포인터 = nextNum
                    pointer = nextNum;
                }
            }
        }

        return output.toString();
    }
}
```

#### 예제 1
<img src="\assets\img\posts\algorithm\res1.png" style="width: 40%"/>

#### 예제 2
<img src="\assets\img\posts\algorithm\res2.png" style="width: 40%"/>