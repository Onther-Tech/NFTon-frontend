import {useCallback, useEffect} from "react";
import {useHistory} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {userActions, userState} from "../reducers/user";
import {getAddress, isMetaMask, requestAccounts} from "../utils/metamask";
import {getAccessToken} from "../utils/user";
import {clearAuthorization, setAuthorization} from "../utils/axios";

const useWalletRequired = (required) => {
  const history = useHistory();
  const {address} = useSelector(userState);

  useEffect(() => {
    if(!required) {
      return;
    }

    if(!address) {
      console.log('not connected : ' +window.location.href);
      clearAuthorization();

      history.replace('/connect', {origin: window.location.href});
    } else {
      const accessToken = getAccessToken(address);
      if(!accessToken) {
        history.replace('/connect', {origin: window.location.href});
      }
    }
  }, [address, required]);
};

export default useWalletRequired;
