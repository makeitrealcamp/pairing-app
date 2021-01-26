import axios from 'axios';
import auth from './services/auth'

const instance = axios.create()

instance.interceptors.request.use(config => {
  const token = auth.token
  if (auth.isAuthenticated()) {
    config.headers.Authorization = auth.token
  }
  return config
})

instance.interceptors.response.use(response => {
   return response
}, error => {
  if (error.response.status === 401) {
    auth.logout()
    throw new Error('Authentication failed')
  }
  return error
});

export default instance
