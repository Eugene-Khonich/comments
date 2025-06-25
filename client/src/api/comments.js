import axios from 'axios'

const API = axios.create({
  baseURL: '/api',
})

export const fetchCaptcha = async () => {
  const res = await API.get('/captcha')
  return res.data
}

export const sendComment = async (values) => {
  const formData = new FormData()
  Object.entries(values).forEach(([key, val]) => {
    if (val) formData.append(key, val)
  })
  const res = await API.post('/comments', formData)
  return res.data
}

export const fetchComments = async (params) => {
  const res = await API.get('/comments', { params })
  return res.data
}

export const fetchReplies = async (parentId) => {
  const res = await API.get(`/comments/replies/${parentId}`)
  return res.data
}
