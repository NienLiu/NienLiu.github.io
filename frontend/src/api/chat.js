import http from './http'
import { isMockMode } from './mode'
import { mockApi } from './mockApi'

export const createSession = (payload) =>
  isMockMode ? mockApi.chat.createSession(payload) : http.post('/api/chat/sessions', payload)
export const sendMessage = (sessionId, payload) =>
  isMockMode ? mockApi.chat.sendMessage(sessionId, payload) : http.post(`/api/chat/sessions/${sessionId}/messages`, payload)
export const getMessages = (sessionId) =>
  isMockMode ? mockApi.chat.getMessages(sessionId) : http.get(`/api/chat/sessions/${sessionId}/messages`)
