const STORAGE_KEYS = {
  users: 'demo.users',
  sessionUserId: 'demo.sessionUserId',
  characters: 'demo.characters',
  chatSessions: 'demo.chatSessions',
  chatMessages: 'demo.chatMessages',
}

const COUNTER_KEYS = {
  users: 'demo.nextUserId',
  characters: 'demo.nextCharacterId',
  chatSessions: 'demo.nextSessionId',
  chatMessages: 'demo.nextMessageId',
}

const DEMO_PASSWORD = '123456'

const parse = (value, fallback) => {
  if (!value) return fallback
  try {
    return JSON.parse(value)
  } catch {
    return fallback
  }
}

const getJson = (key, fallback) => parse(localStorage.getItem(key), fallback)
const setJson = (key, value) => localStorage.setItem(key, JSON.stringify(value))
const getNumber = (key, fallback) => Number(localStorage.getItem(key) || fallback)
const setNumber = (key, value) => localStorage.setItem(key, String(value))

const ok = (data, status = 200) => Promise.resolve({ data, status })
const errorOf = (status, message) => ({
  response: { status, data: { message } },
  message,
})
const fail = (status, message) => Promise.reject(errorOf(status, message))

const toUserDto = (user) => ({ id: user.id, username: user.username, displayName: user.displayName })

const seedIfNeeded = () => {
  const users = getJson(STORAGE_KEYS.users, null)
  if (!users || users.length === 0) {
    const generatedUsers = Array.from({ length: 50 }, (_, i) => {
      const n = i + 1
      const username = `user${String(n).padStart(3, '0')}`
      return {
        id: n,
        username,
        password: DEMO_PASSWORD,
        displayName: `Demo ${username}`,
      }
    })
    setJson(STORAGE_KEYS.users, generatedUsers)
    setNumber(COUNTER_KEYS.users, generatedUsers.length + 1)
  }

  const cards = getJson(STORAGE_KEYS.characters, null)
  if (!cards || cards.length === 0) {
    const demoCards = [
      {
        id: 1,
        ownerUserId: 1,
        name: '温柔学姐',
        description: '耐心、鼓励型对话伙伴',
        personality: '温柔、细致、善于倾听',
        scenario: '校园咖啡馆',
        firstMessage: '欢迎来找我聊天，今天想聊什么？',
        systemPrompt: '你是积极支持型角色',
        tags: '陪伴,学习',
      },
      {
        id: 2,
        ownerUserId: 1,
        name: '产品导师',
        description: '帮助梳理需求与优先级',
        personality: '理性、结构化',
        scenario: '产品评审会议',
        firstMessage: '把你的目标告诉我，我们一起拆解。',
        systemPrompt: '你擅长需求澄清',
        tags: '产品,规划',
      },
    ]
    setJson(STORAGE_KEYS.characters, demoCards)
    setNumber(COUNTER_KEYS.characters, 3)
  }

  if (!localStorage.getItem(STORAGE_KEYS.chatSessions)) {
    setJson(STORAGE_KEYS.chatSessions, [])
    setNumber(COUNTER_KEYS.chatSessions, 1)
  }
  if (!localStorage.getItem(STORAGE_KEYS.chatMessages)) {
    setJson(STORAGE_KEYS.chatMessages, [])
    setNumber(COUNTER_KEYS.chatMessages, 1)
  }
}

const requireAuth = () => {
  seedIfNeeded()
  const userId = getNumber(STORAGE_KEYS.sessionUserId, 0)
  if (!userId) throw errorOf(401, '未登录')
  const users = getJson(STORAGE_KEYS.users, [])
  const user = users.find((u) => u.id === userId)
  if (!user) throw errorOf(401, '登录状态失效，请重新登录')
  return user
}

const nextId = (counterKey) => {
  const id = getNumber(counterKey, 1)
  setNumber(counterKey, id + 1)
  return id
}

const ensureCharacterOwner = (characterId, userId) => {
  const cards = getJson(STORAGE_KEYS.characters, [])
  const card = cards.find((item) => item.id === Number(characterId))
  if (!card) throw errorOf(404, '角色卡不存在')
  if (card.ownerUserId !== userId) throw errorOf(403, '无权限访问该角色卡')
  return { cards, card }
}

const ensureSessionOwner = (sessionId, userId) => {
  const sessions = getJson(STORAGE_KEYS.chatSessions, [])
  const session = sessions.find((item) => item.id === Number(sessionId))
  if (!session) throw errorOf(404, '会话不存在')
  if (session.ownerUserId !== userId) throw errorOf(403, '无权限访问该会话')
  return session
}

const mockAssistantReply = (card, content) => {
  const firstMessage = card.firstMessage ? `开场白参考：「${card.firstMessage}」。` : ''
  return `你好，我是${card.name}。${firstMessage}你刚刚说“${content}”。我会以「${card.personality || '自然'}」风格继续回应你。`
}

const auth = {
  login(payload) {
    seedIfNeeded()
    const users = getJson(STORAGE_KEYS.users, [])
    const user = users.find((item) => item.username === payload?.username && item.password === payload?.password)
    if (!user) return fail(401, '用户名或密码错误')
    localStorage.setItem(STORAGE_KEYS.sessionUserId, String(user.id))
    return ok(toUserDto(user))
  },
  me() {
    const user = requireAuth()
    return ok(toUserDto(user))
  },
  logout() {
    localStorage.removeItem(STORAGE_KEYS.sessionUserId)
    return ok({ message: '已退出登录' })
  },
}

const characters = {
  list() {
    const user = requireAuth()
    const cards = getJson(STORAGE_KEYS.characters, []).filter((item) => item.ownerUserId === user.id)
    return ok(cards)
  },
  get(id) {
    const user = requireAuth()
    const { card } = ensureCharacterOwner(id, user.id)
    return ok(card)
  },
  create(payload) {
    const user = requireAuth()
    if (!payload?.name?.trim()) return fail(400, '角色名称不能为空')
    const cards = getJson(STORAGE_KEYS.characters, [])
    const card = {
      id: nextId(COUNTER_KEYS.characters),
      ownerUserId: user.id,
      name: payload.name.trim(),
      description: payload.description || '',
      personality: payload.personality || '',
      scenario: payload.scenario || '',
      firstMessage: payload.firstMessage || '',
      systemPrompt: payload.systemPrompt || '',
      tags: payload.tags || '',
    }
    cards.push(card)
    setJson(STORAGE_KEYS.characters, cards)
    return ok(card, 201)
  },
  update(id, payload) {
    const user = requireAuth()
    if (!payload?.name?.trim()) return fail(400, '角色名称不能为空')
    const { cards, card } = ensureCharacterOwner(id, user.id)
    Object.assign(card, {
      name: payload.name.trim(),
      description: payload.description || '',
      personality: payload.personality || '',
      scenario: payload.scenario || '',
      firstMessage: payload.firstMessage || '',
      systemPrompt: payload.systemPrompt || '',
      tags: payload.tags || '',
    })
    setJson(STORAGE_KEYS.characters, cards)
    return ok(card)
  },
  delete(id) {
    const user = requireAuth()
    const cards = getJson(STORAGE_KEYS.characters, [])
    const index = cards.findIndex((item) => item.id === Number(id) && item.ownerUserId === user.id)
    if (index < 0) return fail(404, '角色卡不存在')
    cards.splice(index, 1)
    setJson(STORAGE_KEYS.characters, cards)
    return ok(null, 204)
  },
}

const chat = {
  createSession(payload) {
    const user = requireAuth()
    const characterId = Number(payload?.characterCardId || 0)
    if (!characterId) return fail(400, '请选择角色')
    const { card } = ensureCharacterOwner(characterId, user.id)
    const sessions = getJson(STORAGE_KEYS.chatSessions, [])
    const session = {
      id: nextId(COUNTER_KEYS.chatSessions),
      ownerUserId: user.id,
      characterCardId: card.id,
      title: payload?.title?.trim() || `与${card.name}的新会话`,
    }
    sessions.push(session)
    setJson(STORAGE_KEYS.chatSessions, sessions)

    const allMessages = getJson(STORAGE_KEYS.chatMessages, [])
    if (card.firstMessage) {
      allMessages.push({
        id: nextId(COUNTER_KEYS.chatMessages),
        sessionId: session.id,
        role: 'assistant',
        content: card.firstMessage,
      })
      setJson(STORAGE_KEYS.chatMessages, allMessages)
    }
    return ok(session, 201)
  },
  getMessages(sessionId) {
    const user = requireAuth()
    ensureSessionOwner(sessionId, user.id)
    const allMessages = getJson(STORAGE_KEYS.chatMessages, []).filter((msg) => msg.sessionId === Number(sessionId))
    return ok(allMessages)
  },
  sendMessage(sessionId, payload) {
    const user = requireAuth()
    const session = ensureSessionOwner(sessionId, user.id)
    const content = payload?.content?.trim()
    if (!content) return fail(400, '消息不能为空')
    const cards = getJson(STORAGE_KEYS.characters, [])
    const card = cards.find((item) => item.id === session.characterCardId)
    if (!card) return fail(404, '角色卡不存在')

    const allMessages = getJson(STORAGE_KEYS.chatMessages, [])
    const userMessage = {
      id: nextId(COUNTER_KEYS.chatMessages),
      sessionId: session.id,
      role: 'user',
      content,
    }
    const assistantMessage = {
      id: nextId(COUNTER_KEYS.chatMessages),
      sessionId: session.id,
      role: 'assistant',
      content: mockAssistantReply(card, content),
    }
    allMessages.push(userMessage, assistantMessage)
    setJson(STORAGE_KEYS.chatMessages, allMessages)
    return ok({ userMessage, assistantMessage })
  },
}

export const mockApi = {
  auth,
  characters,
  chat,
}
