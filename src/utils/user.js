import axios from "axios";
import {fetchAccessToken} from "../reducers/user";
import {ORDER_TYPE_CHECKOUT} from "../constants/sale";

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

export const checkValidAccessToken = (history, dispatch, onValid) => {
  dispatch(fetchAccessToken()).then(({error}) => {
    if(error) {
      history.replace('/connect', {origin: window.location.href});
    } else {
      onValid && onValid();
    }
  });
}
