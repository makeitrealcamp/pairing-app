import axios from '../axios'
import auth from './auth'

class Assistances {
  async getAll(sessionId) {
    const { data } = await axios.get(`/sessions/${sessionId}/assistances`)
    return data
  }

  async findById(id) {
    try {
      const response = await axios.get(`/assistances/${id}`)
      return response.data
    } catch (e) {
      if (e.response.status != 404) return null
      console.error(e)
      throw e
    }
  }

  async findBySession(sessionId) {
    try {
      const response = await axios.get(`/sessions/${sessionId}/assistance`)
      return response.data
    } catch (e) {
      if (e.response.status != 404) throw e
      return null
    }
  }

  async create(sessionId) {
    const response = await axios.post(`/sessions/${sessionId}/assistances`, {})
    return response.data
  }

  async update(assistance, data) {
    const response = await axios.patch(`/assistances/${assistance._id}`, data)
    return response.data
  }

  async enqueue(assistance) {
    const response = await axios.patch(`/assistances/${assistance._id}/enqueue`, {})
    return response.data
  }

  async dequeue(assistance) {
    const response = await axios.patch(`/assistances/${assistance._id}/dequeue`, {})
    return response.data
  }
}

export default new Assistances()
