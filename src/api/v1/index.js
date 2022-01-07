import {getAxios} from "../../utils/axios";

const IndexAPI = {
  async fetchExchangeEvent({eventName, account}) {
    return await getAxios().get(
      process.env.REACT_APP_API_ENDPOINT_V1 + '/events',
      {
        params: {
          chainId: process.env.REACT_APP_CHAIN_ID,
          eventName: eventName || 'LogTransfer',
          account: account
        }
      },
    ).then(res => res.data);
  },

};

export default IndexAPI;
