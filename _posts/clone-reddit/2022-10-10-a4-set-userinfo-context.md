---
layout: post
title: 유저 정보 Context에 담아주기
date: 2022-10-10
updated: 
tags: [typescript, next-js, tailwindcss]
menu: clone-reddit
---
## 사용자 정보를 Context에 담아 사용하는 이유
React Context를 사용하지 않고 User정보를 각각의 React 컴포넌트에서 사용하기 위해서는   
컴포넌트 간 User 정보를 주고 받는 작업이 매번 이루어진다.    

그러나 ***React Context에서 User 정보를 관리하게 되면*** 컴포넌트 간 데이터를 주고 받을 필요 없이   
로그인 후 ***언제든 React Context에서 User 정보를 사용 가능***하다.
<img src="\assets\img\posts\set-userinfo-context\using-context.png" style="border: 1px solid gray; width:80%" />

## React Context 파일 생성, 내용 작성
User 정보를 정의한 interface를 생성한다.   
`reddit-clone-app\client\src\types.tsx` 파일을 생성하고 아래 내용을 입력한다.
```typescript
export interface User {
    username: string;
    email: string;
    createdAt: string;
    updatedAt: string;
}
```

`reddit-clone-app\client\src\context\auth.tsx` 파일을 생성하고 아래 내용을 추가한다.
```typescript
import { createContext, useContext, useReducer } from "react";
import { User } from "../types";

// React Context에서 갖고 있어야할 정보를 정의한 interface
interface State {
    authenticated: boolean;
    user: User | undefined;
    loading: boolean;
}

// React Context에서 갖고 있어야할 기본 정보
const StateContext = createContext<State>({
    authenticated: false,
    user: undefined,
    loading: true,
})


const DispatchContext = createContext<any>(null);

interface Action {
    type: string;
    payload: any;
}

// dispatch Process 04
// User 정보를 dispatch 시 전달된 type으로 동작을 구분
const reducer = (state:State, { type, payload }:Action) => {
    switch (type) {
        case "LOGIN":
            return {
                ...state,
                authenticated: true,
                user: payload
            }
        case "LOGOUT":
            return {
                ...state,
                authenticated: false,
                user: null
            }
        case "STOP_LOADING":
            return {
                ...state,
                loading: false
            }
        default:
            throw new Error(`Unknown action type: ${type}`)
    }
}

// Context에 있는 value(User 정보)를 다른 컴포넌트에서 사용하기 위해서는 Context Provider로 감싸줘야 한다.
// 다른 컴포넌트를 감싸기 위한 Context Provider: AuthProvider 를 정의.
export const AuthProvider = ({children}:{children: React.ReactNode}) => {

    // dispatch Process 03
    // User정보를 dispath 시 reducer 함수를 사용
    const [state, defaultDispatch] = useReducer(reducer, {
        user: null,
        authenticated: false,
        loading: true
    })

    // User정보 Dispatch 시 확인용 로그
    console.log('state', state);

    // dispatch Process 02
    const dispatch = (type: string, payload?: any) => {
        defaultDispatch({ type, payload })
    }

    /* 
     * 최상위 컴포넌트 _app.tsx에서 타 컴포넌트를 보여줄 때
     * 아래와 같이 return 하도록 정의한다.
    */
    return (
        <DispatchContext.Provider value={dispatch}>
            <StateContext.Provider value={state}>{children}</StateContext.Provider>
        </DispatchContext.Provider>
    )
}


// 다른 컴포넌트에서 StateContext, DispatchContext의 value를 사용할 수 있도록 export
export const useAuthState = () => useContext(StateContext);
// dispatch Process 01
export const useAuthDispatch = () => useContext(DispatchContext);
```

React 최상위 컴포넌트인 `reddit-clone-app\client\src\pages\_app.tsx` 파일에 아래 내용을 추가한다.
```typescript
import { AuthProvider } from '../context/auth';

function MyApp({ Component, pageProps }: AppProps) {

  Axios.defaults.baseURL = process.env.NEXT_PUBLIC_SERVER_BASE_URL + "/api";
  
  // 추가된 내용
  return <AuthProvider>
    <Component {...pageProps} />
  </AuthProvider>
}
```

## 로그인 동작 시 User 정보를 React Context에 Dispatch
`reddit-clone-app\client\src\pages\login.tsx` 파일에 아래 내용을 추가
```typescript
...생략
    const handleSubmit = async (event: FormEvent) => {
        event.preventDefault();

        try {
            const res = await axios.post(
                "/auth/login",
                {
                    password,
                    username
                },
                {
                    withCredentials: true
                }
            ); 
            
            // [추가 부분]
            // 정상 로그인 유저정보 Context 저장
            dispatch("LOGIN", res.data?.user);

            // [추가 부분]
            // 로그인 후 '/' 로 이동
            router.push('/');

        } catch (error: any) {
            console.log(error);
            setErrors(error.response.data || {})
        }
    };
...생략
```

#### Context 동작 테스트 절차, 결과
1. 로그인 전 관리자 도구 콘솔의 State 로그 확인    
    => **[결과]**   
    ```json
    state : {
        "authenticated" : false
        "loading" : true
        "user" : null
    }
    ```
2. 로그인 후 관리자 도구 콘솔의 State 로그 확인   
    => **[결과]**    
    ```json
    state : {
        "authenticated" : true
        "loading" : true
        "user" : {
            "createdAt" : "2022-10-10T00:16:33.319Z"
            "email" : "kdy95@inzent.com"
            "id" : 7
            "password" : "$2a$06$4E9EgjZTq2uijDig1TTyl.queBrIVkmf2mmX6pORqQEgq0QdVtc1m"
            "updatedAt" : "2022-10-10T00:16:33.319Z"
            "username" : "doyun"
        }
    }
    ```