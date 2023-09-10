'use client'
import {useEffect, useState} from "react";
import { useRouter } from 'next/router'

import axios from "@/lib/fetch";

import {USER_TOKEN} from "../lib/constants";


export default function Protected() {
  const router = useRouter()
  const [userInfo, setUserInfo] = useState<User>()

  useEffect(() => {
    const fetch = async () => {
      const data = await axios.get('/user/info')
      setUserInfo(data)
    }
    fetch();
  }, [])

  const logout = () => {
    localStorage.removeItem(USER_TOKEN);
    router.replace('/login');
  }

  if (!userInfo) {
    return null
  }

  return (
    <main style={{ minHeight: '48rem', justifyContent: 'flex-start', background: '#fff' }}>
      <h1>DEMO 首页</h1>
      <section style={{ marginTop: 24 }}>
        <div>
          <p>该页面进入会默认发起<code>/api/user/info</code>请求获取用户信息</p>
          <p>当前登录用户 ID：{userInfo?.userId}</p>
          <hr />
          <p>如果当前用户未登录或者 token 过期，则会自动跳转到登录页面</p>
          <p>当然，你可以尝试通过修改当前 token 的值模拟过期</p></div>
        <button
          style={{ marginTop: 32 }}
          onClick={() => {
            localStorage.setItem(USER_TOKEN, '1');
            router.reload()
          }}
        >
          设置 token 过期，并重新刷新当前页面
        </button>
        <a onClick={logout}>退出当前登录</a>
      </section>
    </main>
  )
}
