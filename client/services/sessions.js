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

      handleUnauthorized(err)
    }
  }

  async create(data) {
    try {
      const response = await axios.post('/sessions',
        data, { headers: { Authorization: auth.token }
      })

      return response.data
    } catch (err) {
      if (err.response.status == 404) return null

      handleUnauthorized(err)
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

      handleUnauthorized(err)
    }
  }

  async closeActive() {
    try {
      const response = await axios.patch('/sessions/close', {},
        { headers: { Authorization: auth.token } }
      )

      return response.data
    } catch (err) {
      if (err.response.status == 404) return null

      handleUnauthorized(err)
    }
  }
}

export default new Sessions()

function handleUnauthorized(err) {
  if (err.response.status == 401) {
    auth.logout()
    throw new Error('Authentication failed')
  }
}
