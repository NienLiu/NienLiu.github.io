import http from './http'
import { isMockMode } from './mode'
import { mockApi } from './mockApi'

export const listCharacters = () => (isMockMode ? mockApi.characters.list() : http.get('/api/characters'))
export const getCharacter = (id) => (isMockMode ? mockApi.characters.get(id) : http.get(`/api/characters/${id}`))
export const createCharacter = (payload) =>
  isMockMode ? mockApi.characters.create(payload) : http.post('/api/characters', payload)
export const updateCharacter = (id, payload) =>
  isMockMode ? mockApi.characters.update(id, payload) : http.put(`/api/characters/${id}`, payload)
export const deleteCharacter = (id) => (isMockMode ? mockApi.characters.delete(id) : http.delete(`/api/characters/${id}`))
