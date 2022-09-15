---
layout: post
title: Typescript Type
date: 2022-09-16
updated: 
tags: [typescript]
menu: clone-reddit
---
## Typescript의 Type이란?
그 value가 가지고 있는 프로퍼티나 함수를 추론할 수 있는 방법이다.

* "apple"
  : 두 가지로 말할 수 있음
  + String 문자열
  + value인데 문자열이 가지는 프로퍼티, 메소드를 가지고 있는 value   
<br><br>
* 자바스크립트에서 문자열
  : Properties + Methods
    ```typescript
    let string: string;

    // 프로퍼티
    'string'.length

    // 여러 메소드 존재
    'string'.replace();
    'string'.split();
    ...
    ```

#### Properties   
    string.length는 문자열의 속성인 문자열의 길이를 제공.   
    문자열 자체에는 아무 것도 하지 않는다.
#### Methods
    string.toLowerCase()는 문자열을 소문자로 변환한다.   
    즉, 문자열에 작업을 수행한 후 반환한다.   

#### Types in Typescript 
Typescript 는 Javascript에서 기본으로 제공하는 기본 제공 유형을 상속한다.   
Typescript 유형은 다음과 같이 분류 된다.

* Primitive Types
  + string
  + nubmer
  + boolean
  + null
  + undefined
  + symbol
<br><br>
* Object Types
  + function
  + array
  + classes
  + object

- - -

## Typescript에서 추가로 제공하는 Type
#### Any
App을 만들 때, 잘 알지 못하는 타입을 표현해야할 때가 있다.   
동적인 컨텐츠로부터 반환받는 경우 타입 검사를 하지 않는다.   
이 때 컴파일을 넘어가기 위해 any 타입을 사용할 수 있다.   

하지만 최대한 사용을 ***지양*** 하는 것이 좋다.    
noImplicitAny 옵션을 주면 any를 사용했을 때 오류가 나오게 할 수 있다.

#### Union
Typescript에서는 변수 또는 함수 매개변수에 둘 이상의 데이터 유형을 사용할 수 있다.
```typescript
let code: (string | number);
let code: string | number;

code = 123;     // 컴파일 가능
code = "ABC";   // 컴파일 가능
code = false;   // 컴파일 에러
```

#### Enum
enumerated type(열거형)의 줄임말이다.   
값들의 집합을 명명하고, 사용할 수 있도록 한다.

기억하기 어려운 이름 대신 친숙한 이름으로 사용하기 위해 활용 가능하다.

```typescript
// Enum을 선 생성
enum PrintMedia {
    Newspaper,  // 0 로 지정
    //  Newspaper = 0 형식도 가능하나 지정하지 않으면 0...n으로 지정
    Nesletter,  // 1 로 지정
    Magazine=2,   // 2 로 지정
    Book        // 3 로 지정
}

// 코드 값을 사용 시 본래 값이 무엇인지 알기 힘들다
let mediaType: number = 3   // 3

// PrintMedia집합 안에 Book을 의미 => 가독성 증가
let mediaType: number = PrintMedia.Book // 3을 의미

// Book의 코드를 명시하지 않으면 Magazine + 1과 동일
let mediaType: number = PrintMedia.Book // 3을 의미

// 코드로 원본 문자열 도출 가능
let mediaType: number = PrintMedia[2]   // 'Magazine'

// 언어 집합 정의
enum LanguageCode {
    korean = 'ko',
    english = 'en',
    japanese = 'ja',
    chinese = 'zh',
    spanish = 'es'
}

// 가독성 증가
const code: LanguageCode = LanguageCode.english
```

Javascript의 object와 큰 차이가 없다.   
enum은 그 자체로 객체이다.   

다음을 수행하면 실제 키 또는 값이 배열에 담겨 반환된다.
```javascript
Object.keys(LanguageCode)
// ['korean', 'english', ...]

Object.values(LanguageCode)
// ['ko', 'en', ...]
```

* enum과 객체의 차이
1. 객체는 선언 후 코드레벨에서 속성 추가가 자유롭다. enum은 선언 이후 변경할 수 없다.   
2. 객체의 속성값은 JS가 허용하는 모든 타입이 올 수 있다. enum의 속성값으로는 문자열 혹은 숫자만 허용된다.

## Void
Java와 유사하게 데이터가 없는 경우 void가 사용됨.   
함수가 값을 반환하지 않으면 void를 지정할 수 있다.

타입이 없는 상태이며, any와 반대의 의미
void 소문자로 사용해주어야 하며, 함수의 리턴이 없을 때 사용.

```javascript
function sayHi(): void {
    console.log('Hi!');
}

let speech: void = sayHi();
console.log(speech);    // undefined
```

## Never
절대 발생하지 않을 값을 나타내는 Type이다.

일반적으로 함수의 반환형으로 사용되며, never가 사용될 경우,   
항상 오류를 반환하거나 반환값을 절대 내보내지 않음을 의미한다.   
이는 무한 루프와 같다.

```javascript
function throwError(errorMsg: string): never {
    throw new Error(errorMsg);
}

function keepProcessing(): never {
    while(true) {
        console.log('I always does something and never ends.);
    }
}
```

#### Void와 Nver의 차이
Void 유형은 값으로 undefined 이나 null 값을 가질 수 있으며   
Never는 어떤 값도 가질 수 없다.

```javascript
let something: void = null;
let nothing: never = null;  // Error: Never 타입에는 null값이 들어갈 수 없다.
```