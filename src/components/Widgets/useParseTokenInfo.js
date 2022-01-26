import {useEffect, useMemo, useState} from "react";
import {parsePrice} from "../../utils/nft";
import {useRouteMatch} from "react-router-dom";
import {ethers} from "ethers";
import produce from "immer";
import {init} from "i18next";

const initValue = {
  name: null,
  image: null,
  type: null,
  description: null,
  attributes: [],
  collectionName: null,
  price: null,
  unit: null,
  favoriteCount: 0,
  viewCount: 0,
  creator: null,
  maker: null,
  owner: null,
  tokenType: 'ERC721',
  chainId: process.env.REACT_APP_CHAIN_ID,
  platform: process.env.REACT_APP_CHAIN_PLATFORM,
  idorders: null,
};

const useParseTokenInfo = (metadata, order) => {
  const [value, setValue] = useState(initValue);

  useEffect(() => {
    const newValue = JSON.parse(JSON.stringify(initValue));

    if (order && Object.keys(order).length > 0) {
      if(order && order.makeInfo?.asset) {
        newValue.name = order.makeInfo.asset.name;
        newValue.image = order.makeInfo.asset.image;
        newValue.type = order.makeInfo.asset.type;
        newValue.description = order.makeInfo.asset.description;
        newValue.creator = order.makeInfo.asset.creator;
        newValue.collectionName = order.makeInfo.collectionName;
        newValue.attributes = order.makeInfo.asset.attributes;
      }

      const {price, unit} = parsePrice(order.takeAsset);

      newValue.idorders = order.idorders;
      newValue.price = price;
      newValue.unit = unit;
      newValue.favoriteCount = order.favoriteCount;
      newValue.viewCount = 0;
      newValue.maker = order.maker;
    } else {
      if (metadata && Object.keys(metadata).length > 0) {
        newValue.name = metadata.name;
        newValue.image = metadata.image;
        newValue.type = metadata.type;
        newValue.description = metadata.description;
        newValue.attributes = metadata.attributes;
        newValue.creator = metadata.creator;
      }
    }

    setValue(newValue);
  }, [metadata, order]);

  return value;
};

export default useParseTokenInfo;
