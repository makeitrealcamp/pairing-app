import axios from "axios";
import auth from "./auth";

class Assistances {
  async findBySession(sessionId) {
    try {
      const response = await axios.get(`/sessions/${sessionId}/assistance`, {
        headers: { "Authorization": auth.token }
      });

      return response.data;
    } catch (e) {
      if (e.response.status != 404) console.log(e);
      return null;
    }
  }

  async create(sessionId) {
    try {
      const response = await axios.post(`/sessions/${sessionId}/assistances`, {}, {
        headers: { "Authorization": auth.token }
      });

      return response.data;
    } catch (e) {
      throw e;
    }
  }

  async enqueue(assistance) {
    try {
      const response = await axios.patch(`/assistances/${assistance._id}/enqueue`, {}, {
        headers: { "Authorization": auth.token }
      });

      return response.data;
    } catch (e) {
      throw e;
    }
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
