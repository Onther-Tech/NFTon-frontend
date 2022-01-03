import axios from "axios";
import {getAxios} from "../../utils/axios";

const UtilsAPI = {
  ipfs: async ({uploadFile}) => {
    const form = new FormData();
    form.append('uploadFile', uploadFile);

    return await getAxios().post(
      process.env.REACT_APP_API_ENDPOINT_V2 + '/utils/ipfs',
      form,
      {headers: {'Content-Type': 'multipart/form-data'}}
    ).then((res) => res.data);
  },
};

export default UtilsAPI;
