import axios from 'axios'

const api = axios.create({ baseURL: 'http://localhost:8000' })

export const getUsers       = ()     => api.get('/api/users').then(r => r.data)
export const signupUser     = (data) => api.post('/api/users/signup', data).then(r => r.data)
export const loginUser      = (data) => api.post('/api/users/login', data).then(r => r.data)
export const deactivateUser = (id)   => api.patch(`/api/users/${id}/deactivate`).then(r => r.data)
export const forgotPassword = (data) => api.post('/api/users/forgot-password', data).then(r => r.data)
export const resetPassword  = (data) => api.post('/api/users/reset-password', data).then(r => r.data)