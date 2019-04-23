import axios from "axios";

class Auth {
  constructor() {
    this.token = global.localStorage.getItem("auth_token");
    this.participant();
  }

  isAuthenticated() {
    return this.token !== null;
  }

  async participant() {
    if (this._participant) {
      return participant;
    }

    if (!this.token) {
      return null;
    }

    try {
      const response = await axios.get("/participant", {
        headers: { "Authorization": this.token }
      });

      this._participant = response.data;
      return this._participant;
    } catch (err) {
      console.error(err);
      this.logout();
      return null;
    }
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
    this._participant = null;
    localStorage.removeItem("auth_token")
  }
}

export default new Auth();
