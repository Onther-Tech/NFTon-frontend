import NavigationBar from "./components/Layouts/NavigationBar";
import {useDispatch, useSelector} from "react-redux";
import {
  accessToken,
  fetchAccessToken,
  fetchFavoriteOrders,
  fetchMyProfile,
  userActions,
  userState
} from "./reducers/user";
import {useEffect} from "react";
import {getAccessToken, hasAccessToken, removeAccessToken} from "./utils/user";
import {clearAuthorization, setAuthorization} from "./utils/axios";
import {useHistory} from "react-router-dom";
import {fetchCategories} from "./reducers/category";
import {isMetaMask, isValidNetwork, requestAccounts} from "./utils/metamask";
import {useTranslation} from "react-i18next";

const Container = ({children}) => {
  const {t} = useTranslation();
  const history = useHistory();
  const dispatch = useDispatch();
  const {idprofiles, address, me} = useSelector(userState);

  useEffect(() => {
    dispatch(fetchCategories());

    if (isMetaMask()) {
      if(!isValidNetwork()) {
        alert.error(t('WALLET_NETWORK_NOT_VALID'));
        return;
      }

      requestAccounts().then(([addr]) => {
        const accessToken = getAccessToken(addr);

        if(accessToken) {
          setAuthorization(accessToken);
          dispatch(userActions.setAddress(addr));
        }
      })
    }

    window.ethereum && window.ethereum.on('accountsChanged', ([newAddress]) => {
      const accessToken = getAccessToken(newAddress);

      if(accessToken) {
        setAuthorization(accessToken);
        dispatch(userActions.setAddress(newAddress));
      } else {
        clearAuthorization();
        dispatch(userActions.clearUser());
      }
    })
  }, []);

  useEffect(() => {
    if(!address || !hasAccessToken(address)) {
      return;
    }

    // fetch user profile if access token not empty
    dispatch(fetchAccessToken()).then(res => {
      if (res.error) {
        if (res.error.message.indexOf('419') !== -1) {
          removeAccessToken(address);
          clearAuthorization();
          dispatch(userActions.clearUser());
        }
      } else {
        dispatch(fetchMyProfile());
      }
    });
  }, [address]);


  // fetch user's favorite orders
  useEffect(() => {
    if (idprofiles) {
      dispatch(fetchFavoriteOrders({idprofiles}));
    }
  }, [idprofiles]);

  // redirect profile setting page if user name is null
  useEffect(() => {
    if (me.hasOwnProperty('user_name') && !me.user_name) {
      history.replace('/profile/settings');
    }
  }, [me]);

  // scroll to top
  useEffect(() => {
    if (history.action !== 'POP') {
      window.scrollTo(0, 0);
    }
  }, [history.action]);

  return (
    <>
      <NavigationBar/>
      {children}
    </>
  )
};

export default Container;
