import {useEffect, useMemo, useState} from "react";
import {parsePrice} from "../../utils/nft";
import {useRouteMatch} from "react-router-dom";
import {ethers} from "ethers";
import produce from "immer";

const useParseTokenInfo = (metadata, order) => {
  const [value, setValue] = useState({
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
  });

  useEffect(() => {
    if (order && Object.keys(order).length > 0) {
      if(order && order.makeInfo?.asset) {
        setValue(produce(d => {
          d.name = order.makeInfo.asset.name;
          d.image = order.makeInfo.asset.image;
          d.type = order.makeInfo.asset.type;
          d.description = order.makeInfo.asset.description;
          d.creator = order.makeInfo.asset.creator;
          d.collectionName = order.makeInfo.collectionName;
          d.attributes = order.makeInfo.asset.attributes;
        }));
      }

      const {price, unit} = parsePrice(order.takeAsset);

      setValue(produce(d => {
        d.idorders = order.idorders;
        d.price = price;
        d.unit = unit;
        d.favoriteCount = order.favoriteCount;
        d.viewCount = 0;
        d.maker = order.maker;
      }));
    } else {
      if (metadata && Object.keys(metadata).length > 0) {
        setValue(produce(d => {
          d.name = metadata.name;
          d.image = metadata.image;
          d.type = metadata.type;
          d.description = metadata.description;
          d.attributes = metadata.attributes;
          d.creator = metadata.creator;
        }));
      }
    }
  }, [metadata, order]);

  return value;
};

export default useParseTokenInfo;
