import axios from 'axios';

let instance = axios.create();

export const getAxios = () => {
  return instance;
}

export const setAuthorization = (token) => {
  instance.defaults.headers.Authorization = token;
}

export const clearAuthorization = () => {
  delete instance.defaults.headers.Authorization;
}
