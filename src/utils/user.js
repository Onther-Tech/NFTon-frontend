import axios from "axios";

export const setAccessToken = (address, token) => {
  localStorage.setItem(address, token);
}

export const getAccessToken = (address) => {
  return localStorage.getItem(address);
}

export const removeAccessToken = (address) => {
  return localStorage.removeItem(address);
}

export const hasAccessToken = (address) => {
  return !!getAccessToken(address);
}
