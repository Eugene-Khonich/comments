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
  for (let pair of formData.entries()) {
    console.log(pair[0], pair[1])
  }
  await API.post('/comments', formData)
}
