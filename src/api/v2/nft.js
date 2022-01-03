import axios from "axios";
import {getAxios} from "../../utils/axios";

const NftAPI = {
  async mints(
    {
      chainId,
      platform,
      name,
      description,
      royalty_to,
      royalty_ratio,
      attributes,
      contract,
      attachment
    } = {}
  ) {
    const f = new FormData();
    for(let [key, value] of Object.entries(arguments[0])){
      f.append(key, value);
    }

    return await getAxios().post(
      process.env.REACT_APP_API_ENDPOINT_V2 + '/nft/mints',
      f,
      {headers: {'Content-Type': 'multipart/form-data'}}
    ).then((res) => res.data);
  },

  async assets({chainId, platform, account, order}) {
    return await getAxios().get(
      process.env.REACT_APP_API_ENDPOINT_V2 + '/assets',
      {
        params: arguments[0]
      }
    ).then((res) => res.data)
  }

};

export default NftAPI;
