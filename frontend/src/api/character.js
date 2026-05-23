import http from './http'

export const listCharacters = () => http.get('/api/characters')
export const getCharacter = (id) => http.get(`/api/characters/${id}`)
export const createCharacter = (payload) => http.post('/api/characters', payload)
export const updateCharacter = (id, payload) => http.put(`/api/characters/${id}`, payload)
export const deleteCharacter = (id) => http.delete(`/api/characters/${id}`)
