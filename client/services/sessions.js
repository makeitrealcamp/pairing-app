import axios from '../axios';
import auth from './auth';

class Sessions {
  async getAll() {
    const response = await axios.get('/sessions');
    return response.data;
  }

  async create(data) {
    try {
      const response = await axios.post('/sessions', data);
      return response.data;
    } catch (err) {
      if (err.response.status == 409) throw new Error("Can't create session until active session is closed");
      if (err.response.status == 422) throw new Error(`Server rejected request`);
      throw err;
    }
  }

  async findActive() {
    try {
      const response = await axios.get('/sessions/open');
      return response.data;
    } catch (err) {
      if (err.response.status == 404) return null;
      throw err;
    }
  }

  async closeActive() {
    await axios.patch('/sessions/close', {});
  }
}

export default new Sessions();
