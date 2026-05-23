<script setup>
import { onMounted, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { me, logout } from '../api/auth'
import { createCharacter, deleteCharacter, listCharacters, updateCharacter } from '../api/character'

const router = useRouter()
const user = ref(null)
const characters = ref([])
const editingId = ref(null)
const error = ref('')
const form = reactive({
  name: '',
  description: '',
  personality: '',
  scenario: '',
  firstMessage: '',
  systemPrompt: '',
  tags: '',
})

const reset = () => {
  editingId.value = null
  Object.assign(form, { name: '', description: '', personality: '', scenario: '', firstMessage: '', systemPrompt: '', tags: '' })
}

const load = async () => {
  error.value = ''
  try {
    user.value = (await me()).data
    characters.value = (await listCharacters()).data
  } catch (e) {
    router.push('/login')
  }
}

const save = async () => {
  error.value = ''
  try {
    if (editingId.value) {
      await updateCharacter(editingId.value, form)
    } else {
      await createCharacter(form)
    }
    reset()
    await load()
  } catch (e) {
    error.value = e.response?.data?.message || '保存失败'
  }
}

const edit = (card) => {
  editingId.value = card.id
  Object.assign(form, card)
}

const remove = async (id) => {
  await deleteCharacter(id)
  await load()
}

const goChat = (id) => {
  router.push(`/chat?characterId=${id}`)
}

const doLogout = async () => {
  await logout()
  router.push('/login')
}

onMounted(load)
</script>

<template>
  <main class="page">
    <section class="panel wide">
      <div class="row between">
        <h1>人设卡管理</h1>
        <div>
          <span v-if="user">当前用户：{{ user.username }}</span>
          <button class="ml" @click="doLogout">退出</button>
        </div>
      </div>

      <div class="grid2">
        <section>
          <h2>{{ editingId ? '编辑人设卡' : '新建人设卡' }}</h2>
          <label>名称<input v-model="form.name" /></label>
          <label>描述<textarea v-model="form.description" /></label>
          <label>性格<textarea v-model="form.personality" /></label>
          <label>场景<textarea v-model="form.scenario" /></label>
          <label>开场白<textarea v-model="form.firstMessage" /></label>
          <label>系统提示词<textarea v-model="form.systemPrompt" /></label>
          <label>标签<input v-model="form.tags" /></label>
          <div class="row">
            <button @click="save">保存</button>
            <button class="secondary" @click="reset">重置</button>
          </div>
          <p v-if="error" class="error">{{ error }}</p>
        </section>

        <section>
          <h2>我的人设卡</h2>
          <ul class="list">
            <li v-for="card in characters" :key="card.id">
              <strong>{{ card.name }}</strong>
              <p>{{ card.description }}</p>
              <div class="row">
                <button class="secondary" @click="edit(card)">编辑</button>
                <button class="secondary" @click="remove(card.id)">删除</button>
                <button @click="goChat(card.id)">去聊天</button>
              </div>
            </li>
          </ul>
        </section>
      </div>
    </section>
  </main>
</template>
