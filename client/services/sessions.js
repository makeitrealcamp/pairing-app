import axios from "axios";
import auth from "./auth";

class Sessions {
  async findActive() {
    try {
      const response = await axios.get("/sessions/open", {
        headers: { "Authorization": auth.token }
      });

      return response.data;
    } catch (e) {
      if (err.response.status != 404) console.log(e);
      return null;
    }
  }
}

export default new Sessions();
