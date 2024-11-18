import axios from 'axios';

const instance = axios.create({
  baseURL: 'https://dev.moydomonline.ru',
  headers: {
    accept: 'application/json',
  },
});

export default instance;