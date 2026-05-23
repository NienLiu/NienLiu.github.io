import http from './http'
import { isMockMode } from './mode'
import { mockApi } from './mockApi'

export const login = (payload) => (isMockMode ? mockApi.auth.login(payload) : http.post('/api/auth/login', payload))
export const me = () => (isMockMode ? mockApi.auth.me() : http.get('/api/auth/me'))
export const logout = () => (isMockMode ? mockApi.auth.logout() : http.post('/api/auth/logout'))
