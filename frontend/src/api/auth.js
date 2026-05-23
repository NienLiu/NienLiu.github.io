import http from './http'

export const login = (payload) => http.post('/api/auth/login', payload)
export const me = () => http.get('/api/auth/me')
export const logout = () => http.post('/api/auth/logout')
