import http from './http'

export const createSession = (payload) => http.post('/api/chat/sessions', payload)
export const sendMessage = (sessionId, payload) => http.post(`/api/chat/sessions/${sessionId}/messages`, payload)
export const getMessages = (sessionId) => http.get(`/api/chat/sessions/${sessionId}/messages`)
