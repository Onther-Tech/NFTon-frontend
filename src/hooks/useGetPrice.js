import axios from 'axios';
import {useEffect, useState} from "react";
import {coinId} from "../constants/coingekco";
import numeral from "numeral";

const useGetUsdPrice = (amount, symbol) => {
  const [price, setPrice] = useState(0);

  useEffect(() => {
    if(!amount || !symbol) {
      return;
    }

    const id = coinId[symbol.toUpperCase()];

    axios.get('https://api.coingecko.com/api/v3/simple/price', {
      params: {
        ids: id,
        vs_currencies: 'usd'
      }
    })
      .then(res => res.data)
      .then((res) => {
        setPrice(numeral(amount * res[id].usd).format('0[.][00]'));
      });

  }, [amount, symbol]);

  return price;
};

export default useGetUsdPrice;
