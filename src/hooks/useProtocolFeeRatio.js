import {useEffect, useState} from "react";
import {getProtocolFee} from "../utils/nft";

const useProtocolFeeRatio = () => {
  const [ratio, setRatio] = useState(0);

  useEffect(() => {
    getProtocolFee().then(setRatio);
  }, []);

  return ratio;
};

export default useProtocolFeeRatio;
