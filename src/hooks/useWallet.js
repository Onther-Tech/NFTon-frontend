import {useCallback, useEffect} from "react";
import {useHistory} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {userActions, userState} from "../reducers/user";
import {isMetaMask, requestAccounts} from "../utils/metamask";
import {getAccessToken} from "../utils/user";
import {clearAuthorization, setAuthorization} from "../utils/axios";

const useWallet = (required) => {
  const history = useHistory();
  const dispatch = useDispatch();
  const {address} = useSelector(userState);

  const notConnected = useCallback(() => {
    clearAuthorization();

    if (required) {
      history.push('/connect');
    }
  }, [required]);

  useEffect(() => {
    if (isMetaMask()) {
      requestAccounts().then(([addr]) => {
        const accessToken = getAccessToken(addr);

        if (addr && accessToken) {
          setAuthorization(accessToken);
          dispatch(userActions.setAddress(addr));
        } else {
          notConnected();
        }
      })
    } else {
      notConnected();
    }
  }, [notConnected]);
};

export default useWallet;
