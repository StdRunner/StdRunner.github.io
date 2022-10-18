---
layout: post
title: 회원 가입 페이지 UI 생성하기
date: 2022-10-08
updated: 
tags: [typescript, next-js, tailwindcss]
menu: clone-reddit
---
## 회원가입 UI 페이지 완성 모습
<img src="\assets\img\posts\create-register-page\register-ui.png" style="border: 1px solid gray; width:40%" />

- - - 

## register.tsx 파일 생성
`reddit-clone-app/client/src/pages/register.tsx` 파일을 생성한다.   
UI를 다음과 같이 작성한다.

``` typescript
import Link from 'next/link'
import React from 'react'

const register = () => {
  return (
    <div className="bg-white">
        <div className='flex flex-col items-center justify-center h-screen p-6'>
            <div className='w-10/12 mx-auto md:w-96'>
                <h1 className='mb-2 text-lg font-medium'>회원가입</h1>
                <form>

                    <button className='w-full py-2 mb-1 text-xs font-bold text-white uppercase bg-gray-400 border border-gray-400 rounded'>
                        회원 가입
                    </button>
                </form>
                <small>
                    이미 가입하셨나요?
                    <Link href="/login">
                        <a className='ml-1 text-blue-500 uppercase'>로그인</a>
                    </Link>
                </small>
            </div>
        </div>
    </div>
  )
}

export default register
```

- - -

## InputGroup 컴포넌트 생성
`reddit-clone-app\client\src\components\InputGroup.tsx` 파일을 생성한다.   
아래와 같이 내용을 편집한다.

`InputGroup.tsx` 파일의 용도는 회원가입 페이지에 존재하는 ***INPUT에 대한 동작을 정의***하고    
세 개의 INPUT에서 이를 ***재사용***하기 위한 내용이다.

placeholder를 입력받아 보여주고, 입력된 값의 동작을 제어하고,   
Validation Check를 수행하는 등의 역할을 한다.

```typescript
import React from 'react';
import cls from 'classnames';

interface InputGrouProps {
    className?: string;
    type?: string;
    placeholder?: string;
    value: string;
    error: string | undefined;
    setValue: (str: string) => void;
}

const InputGroup: React.FC<InputGrouProps> = ({
    className = "mb-2",
    type = "text",
    placeholder = "",
    error,
    value,
    setValue
}) => {
    return (
        <div className={className}>
            <input 
                type={type} 
                style={ { minWidth: 300 } }
                className={cls(`w-full p-3 transition duration-200 border border-gray-400 rounded bg-gray-50 focus:bg-white hover:bg-white`,
                    {"border-red-500": error}
                )}
                placeholder={placeholder}
                value={value}
                onChange={(e) => setValue(e.target.value)}
            />
            <small className='font-medium text-red-500'>{error} </small>
        </div>
    )
}

export default InputGroup
```

- - - 

## classnames 모듈 설치
`reddit-clone-app/client` 경로에서 아래 명령어 입력
```
npm install classnames --save
```

#### classnames 모듈 사용법
`border-red-500` className은 뒤에 오는 값(error)에 따라 className이 추가되고 제거될 수 있도록 하는 기능을 제공한다.    

우리는 register 페이지에서 이메일의 Validation Check 수행 후 ***error 여부***(true/false) 를 판단하여    
Tailwind `border-red-500` 클래스 추가 여부를 결정한다.   
해당 클래스는 INPUT 테두리를 빨간색으로 변경할지 말지 여부를 결정하는데 사용할 것이다.

<img src="\assets\img\posts\create-register-page\classnames.png" style="border: 1px solid gray;" />