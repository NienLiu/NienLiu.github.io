<script setup>
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { login } from '../api/auth'

const router = useRouter()
const form = reactive({ username: 'user001', password: '123456' })
const error = ref('')

const submit = async () => {
  error.value = ''
  try {
    await login(form)
    router.push('/characters')
  } catch (e) {
    error.value = e.response?.data?.message || '登录失败'
  }
}
</script>

<template>
  <main class="page">
    <section class="panel">
      <h1>登录</h1>
      <p>默认账号：user001 / 123456</p>
      <label>用户名 <input v-model="form.username" /></label>
      <label>密码 <input v-model="form.password" type="password" /></label>
      <button @click="submit">登录</button>
      <p v-if="error" class="error">{{ error }}</p>
    </section>
  </main>
</template>
