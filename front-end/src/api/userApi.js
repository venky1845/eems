import axios from 'axios'

const api = axios.create({ baseURL: '/api' })

export const getUsers = () =>
  api.get('/users').then(r => r.data)

export const signupUser = (payload) =>
  api.post('/users/signup', payload).then(r => r.data)

export const deactivateUser = (id) =>
  api.patch(`/users/${id}/deactivate`).then(r => r.data)