import {getAxios} from "../../utils/axios";
import {asFormData} from "../../utils";

const IndexAPI = {
  async registerOrder(jsonBody) {
    return await getAxios().post(
      process.env.REACT_APP_API_ENDPOINT_V2 + '/orders',
      jsonBody,
    ).then(res => res.data);
  },

  async fetchOrders({chainId, platform, maker, type, status, includeCategoryName}) {
    return await getAxios().get(
      process.env.REACT_APP_API_ENDPOINT_V2 + '/orders',
      {
        params: {
          chainId: process.env.REACT_APP_CHAIN_ID,
          platform: process.env.REACT_APP_CHAIN_PLATFORM,
          ...arguments[0]
        }
      }
    ).then(res => res.data);
  },

  async fetchOrderByAddress({contractAddress, tokenId}) {
    return await getAxios().get(
      process.env.REACT_APP_API_ENDPOINT_V2 + '/orders/' + contractAddress + '/' + tokenId,
      {
        params: {
          chainId: process.env.REACT_APP_CHAIN_ID
        }
      }
    ).then(res => res.data);
  },

  async fetchOrder({idorders}) {
    return await getAxios().get(
      process.env.REACT_APP_API_ENDPOINT_V2 + '/orders/' + idorders,
    ).then(res => res.data);
  },

  async registerOrderBuy({chainId, tx, idorders, taker, takeAsset, priceUSD}) {
    return await getAxios().put(
      process.env.REACT_APP_API_ENDPOINT_V2 + '/orders/' + idorders + '/exchange',
      arguments[0]
    ).then(res => res.data);
  },

  async registerCollection(
    {
      name,
      platform,
      chain_id,
      symbol,
      contract,
      type,
      feature,
      description,
      symbolLink,
      banner,
      preview,
      categoryIdcategores,
      facebook,
      twitter,
      instagram
    }
  ) {
    const f = asFormData(arguments[0]);

    return await getAxios().post(
      process.env.REACT_APP_API_ENDPOINT_V2 + '/collection',
      f,
      {headers: {'Content-Type': 'multipart/form-data'}}
    ).then(res => res.data);
  },

  async updateCollection(
    {
      idcollections,
      description,
      facebook,
      twitter,
      instagram,
      symbolLink,
      symbolLink_change,
      banner,
      banner_change,
      preview,
      preview_change
    }
  ) {
    const f = asFormData(arguments[0]);

    return await getAxios().put(
      process.env.REACT_APP_API_ENDPOINT_V2 + '/collection/' + idcollections,
      f,
      {headers: {'Content-Type': 'multipart/form-data'}}
    ).then(res => res.data);
  },

  async fetchMyCollections({address}) {
    return await getAxios().get(
      process.env.REACT_APP_API_ENDPOINT_V2 + '/collection/getByOwner/' + address,
      {
        params: {
          chainId: process.env.REACT_APP_CHAIN_ID
        }
      }
    ).then(res => res.data);
  },

  async fetchCollection({contractAddress}) {
    return await getAxios().get(
      process.env.REACT_APP_API_ENDPOINT_V2 + '/collection/getByAddress/',
      {
        params: {
          chainId: process.env.REACT_APP_CHAIN_ID,
          contract: contractAddress
        }
      }
    ).then(res => res.data);
  },

  async fetchCategories() {
    return await getAxios().get(
      process.env.REACT_APP_API_ENDPOINT_V2 + '/categories'
    ).then(res => res.data);
  },

  async fetchFavoriteOrders({idprofiles}) {
    return await getAxios().get(
      process.env.REACT_APP_API_ENDPOINT_V2 + '/favoriteOrders/profile/' + idprofiles
    ).then(res => res.data);
  },

  async favoriteOrder({idorders}) {
    return await getAxios().post(
      process.env.REACT_APP_API_ENDPOINT_V2 + '/favoriteOrders',
      arguments[0]
    ).then(res => res.data);
  },

  async cancelFavoriteOrder({idfavoriteOrders}) {
    return await getAxios().delete(
      process.env.REACT_APP_API_ENDPOINT_V2 + '/favoriteOrders/' + idfavoriteOrders,
    ).then(res => res.data);
  },

  async linkContract({chainId, platform, contract, name}) {
    return await getAxios().post(
      process.env.REACT_APP_API_ENDPOINT_V2 + '/linkedContracts',
      arguments[0]
    ).then(res => res.data);
  },

  async fetchLinkedContracts({address}) {
    return await getAxios().get(
      process.env.REACT_APP_API_ENDPOINT_V2 + '/linkedContracts/account/' + address,
    ).then(res => res.data);
  },

  async fetchTrendOrders() {
    return await getAxios().get(
      process.env.REACT_APP_API_ENDPOINT_V2 + '/orders/trend/',
      {
        params: {
          chainId: process.env.REACT_APP_CHAIN_ID,
          platform: process.env.REACT_APP_CHAIN_PLATFORM,
          includeCategoryName: 1
        }
      }
    ).then(res => res.data);
  },

  async fetchHotCollections() {
    return await getAxios().get(
      process.env.REACT_APP_API_ENDPOINT_V2 + '/collection/hot/',
      {
        params: {
          chainId: process.env.REACT_APP_CHAIN_ID,
          platform: process.env.REACT_APP_CHAIN_PLATFORM
        }
      }
    ).then(res => res.data);
  }
};

export default IndexAPI;
