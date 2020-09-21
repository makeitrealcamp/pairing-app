import axios from 'axios'
import auth from './auth'

class Sessions {
  async getAll() {
    try {
      const response = await axios.get('/sessions', {
        headers: { Authorization: auth.token },
      })

      return response.data
    } catch (err) {
      if (err.response.status == 404) return null
      if (err.response.status == 401) {
        auth.logout()
        throw new Error('Authentication failed')
      }

      return null
    }
  }

  async findActive() {
    try {
      const response = await axios.get('/sessions/open', {
        headers: { Authorization: auth.token },
      })

      return response.data
    } catch (err) {
      if (err.response.status == 404) return null
      if (err.response.status == 401) {
        auth.logout()
        throw new Error('Authentication failed')
      }
      return null
    }
  }
}

export default new Sessions()
