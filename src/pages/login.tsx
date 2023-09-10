'use client'
import {useRouter} from 'next/navigation'
import React, {useState} from "react";
import type { KeyboardEvent, MouseEvent } from 'react'
import cls from 'classnames';
import md5 from 'md5';
import {AxiosError} from "axios";

import axios from "@/lib/fetch";
import {USER_TOKEN} from "@/lib/constants";

import styles from './login.module.css'


const toast = (msg: string) => {
  // 这里就不写样式了，简单的做一个提示交互
  alert(msg);
}

export default function Home() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('111');
  const [loading, setLoading] = useState(false);

  const router = useRouter()

  const attemptLogin = async () => {
    try {
      if (!username.trim() || !password.trim()) {
        toast('请输入账号和密码')
        return;
      }

      setLoading(true)
      const { token } = await axios.post('/login', {username, password: md5(password)}) as Data
      localStorage.setItem(USER_TOKEN, token);
      router.replace('/')
    } catch (error) {
      if (error instanceof AxiosError) {
        alert(error.response?.data?.message || '登录失败');
      }

    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    attemptLogin();
  }

  const handleInputPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      attemptLogin();
    }
  }

  return (
    <main>
      <section className={styles.loginSection}>
        <h1 style={{ marginBottom: 24, textAlign: 'center' }}>JWT-DEMO</h1>
        <form>
          <input
            type="text"
            placeholder="admin/user，可区分当前登录的用户"
            value={username}
            onKeyPress={handleInputPress}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            type="password"
            placeholder="密码，111"
            value={password}
            onKeyPress={handleInputPress}
            onChange={(e) => setPassword(e.target.value)}
          />
        </form>
        <button disabled={loading} className={cls({[styles.loading]: loading})} onClick={handleSubmit}>登录</button>
      </section>
    </main>
  )
}
