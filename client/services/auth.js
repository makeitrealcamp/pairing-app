import axios from "axios";

class Auth {
  constructor() {
    this.token = localStorage.getItem("auth_token");
  }

  isAuthenticated() {
    return this.token !== null;
  }

  async withCode(code) {
    try {
      const response = await axios.post("/auth/github/token", { code: code });
      localStorage.setItem('auth_token', response.data.token);
      this.token = response.data.token;
      return true;
    } catch (e) {
      console.error(e);
      return false;
    }
  }

  logout() {
    this.token = null;
    localStorage.removeItem("auth_token")
  }
}

export default new Auth();
