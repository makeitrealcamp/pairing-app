import axios from 'axios'
import auth from './auth'

class Participants {
  async findAll(query = '', page = 1) {
    try {
      const response = await axios.get(`/participants?q=${query}&p=${page}`, {
        headers: { Authorization: auth.token },
      })

      return response.data
    } catch (err) {
      console.log(err)
      return null
    }
  }
}

export default new Participants()
