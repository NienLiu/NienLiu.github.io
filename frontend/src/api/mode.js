const mode = (import.meta.env.VITE_API_MODE || 'mock').toLowerCase()

export const isMockMode = mode !== 'real'
