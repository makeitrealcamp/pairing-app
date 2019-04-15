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
      console.log(e);
      return null;
    }
  }
}

export default new Assistances();
