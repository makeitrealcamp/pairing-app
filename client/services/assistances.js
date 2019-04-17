import axios from "axios";
import auth from "./auth";

class Assistances {
  async findById(id) {
    try {
      const response = await axios.get(`/assistances/${id}`, {
        headers: { "Authorization": auth.token }
      });

      return response.data;
    } catch (e) {
      if (e.response.status != 404) throw e;
      return null;
    }
  }

  async findBySession(sessionId) {
    try {
      const response = await axios.get(`/sessions/${sessionId}/assistance`, {
        headers: { "Authorization": auth.token }
      });

      return response.data;
    } catch (e) {
      if (e.response.status != 404) throw e;
      return null;
    }
  }

  async create(sessionId) {
    const response = await axios.post(`/sessions/${sessionId}/assistances`, {}, {
      headers: { "Authorization": auth.token }
    });

    return response.data;
  }

  async update(assistance, data) {
    const response = await axios.patch(`/assistances/${assistance._id}`, data, {
      headers: { "Authorization": auth.token }
    });

    return response.data;
  }

  async enqueue(assistance) {
    const response = await axios.patch(`/assistances/${assistance._id}/enqueue`, {}, {
      headers: { "Authorization": auth.token }
    });

    return response.data;
  }

  async dequeue(assistance) {
    try {
      const response = await axios.patch(`/assistances/${assistance._id}/dequeue`, {}, {
        headers: { "Authorization": auth.token }
      });

      return response.data;
    } catch (e) {
      throw e;
    }
  }
}

export default new Assistances();
