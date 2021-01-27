import axios from '../axios';
import auth from './auth';

class Participants {
  async findAll(query = '', page = 1) {
    const response = await axios.get(`/participants?q=${query}&p=${page}`);
    return response.data;
  }
}

export default new Participants();
