import NavigationBar from "./components/Layouts/NavigationBar";
import {useDispatch, useSelector} from "react-redux";
import {fetchAccessToken, fetchFavoriteOrders, fetchMyProfile, userActions, userState} from "./reducers/user";
import {useEffect} from "react";
import {removeAccessToken} from "./utils/user";
import useWallet from "./hooks/useWallet";
import {clearAuthorization} from "./utils/axios";
import {useHistory} from "react-router-dom";
import {fetchCategories} from "./reducers/category";

const Container = ({children}) => {
  const history = useHistory();
  const dispatch = useDispatch();
  const {idprofiles, address, me} = useSelector(userState);

  useWallet();

  useEffect(() => {
    dispatch(fetchCategories());
  }, []);

  // fetch user profile
  useEffect(() => {
    if (address !== null) {
      dispatch(fetchAccessToken()).then(res => {
        if (res.error) {
          if (res.error.message.indexOf('419') !== -1) {
            removeAccessToken(address);
            clearAuthorization();
            dispatch(userActions.clearAddress());
          }
        } else {
          dispatch(fetchMyProfile());
        }
      })
    }
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
