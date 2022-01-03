import axios from "axios";
import {asFormData} from "../../utils";
import {getAxios} from "../../utils/axios";

const UserAPI = {
  async accessToken({account, sign, timestamp}) {
    return await getAxios().post(
      process.env.REACT_APP_API_ENDPOINT + '/accessToken1',
      arguments[0]
    ).then((res) => res.data);
  },

  async fetchAccessToken() {
    return await getAxios().get(
      process.env.REACT_APP_API_ENDPOINT + '/accessToken'
    ).then((res) => res.data);
  },

  async fetchProfile({address}) {
    return await getAxios().get(
      process.env.REACT_APP_API_ENDPOINT_V2 + '/userProfiles/' + address
    ).then((res) => res.data);
  },

  async updateProfile(
    {
      idprofiles,
      user_name,
      bio,
      email,
      facebook,
      twitter,
      instagram,
      website,
      attachment,
      photo_change,
      cover,
      cover_change
    }
  ) {
    const f = asFormData(arguments[0]);

    return await getAxios().put(
      process.env.REACT_APP_API_ENDPOINT_V2 + '/userProfiles',
      f,
      {headers: {'Content-Type': 'multipart/form-data'}}
    ).then((res) => res.data);
  },

  async orderExchange({tx, idorders, taker, takeAsset, priceUSD}) {
    return await getAxios().put(
      process.env.REACT_APP_API_ENDPOINT_V2 + '/orders/' + idorders + '/exchange',
      arguments[0]
    ).then((res) => res.data);
  }
};

export default UserAPI;
