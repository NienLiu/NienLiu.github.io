<script setup>
import { onMounted, reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { me } from '../api/auth'
import { listCharacters } from '../api/character'
import { createSession, getMessages, sendMessage } from '../api/chat'

const route = useRoute()
const router = useRouter()
const characters = ref([])
const selectedCharacterId = ref(Number(route.query.characterId || 0))
const sessionId = ref(null)
const messages = ref([])
const form = reactive({ title: '新的对话', content: '' })
const error = ref('')

const roleLabel = (role) => {
  if (role === 'user') return '用户'
  if (role === 'assistant') return '助手'
  if (role === 'system') return '系统'
  return role
}

const load = async () => {
  try {
    await me()
    characters.value = (await listCharacters()).data
  } catch {
    router.push('/login')
  }
}

const startSession = async () => {
  error.value = ''
  try {
    const { data } = await createSession({ characterCardId: selectedCharacterId.value, title: form.title })
    sessionId.value = data.id
    messages.value = (await getMessages(sessionId.value)).data
  } catch (e) {
    error.value = e.response?.data?.message || '创建会话失败'
  }
}

const submit = async () => {
  if (!sessionId.value || !form.content) return
  const content = form.content
  form.content = ''
  const { data } = await sendMessage(sessionId.value, { content })
  messages.value.push(data.userMessage)
  messages.value.push(data.assistantMessage)
}

onMounted(load)
</script>

<template>
  <main class="page">
    <section class="panel wide">
      <div class="row between">
        <h1>对话页</h1>
        <button class="secondary" @click="router.push('/characters')">返回人设卡</button>
      </div>

      <div class="row">
        <label>角色
          <select v-model.number="selectedCharacterId">
            <option :value="0" disabled>请选择</option>
            <option v-for="card in characters" :key="card.id" :value="card.id">{{ card.name }}</option>
          </select>
        </label>
        <label>会话标题 <input v-model="form.title" /></label>
        <button @click="startSession">创建会话</button>
      </div>

      <p v-if="error" class="error">{{ error }}</p>

      <section class="chat-box">
        <article v-for="msg in messages" :key="msg.id" :class="['bubble', msg.role]">
          <strong>{{ roleLabel(msg.role) }}：</strong>{{ msg.content }}
        </article>
      </section>

      <div class="row">
        <input v-model="form.content" class="grow" placeholder="输入消息..." @keyup.enter="submit" />
        <button @click="submit">发送</button>
      </div>
    </section>
  </main>
</template>
