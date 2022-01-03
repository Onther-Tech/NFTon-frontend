import PageWrapper from "../components/Layouts/PageWrapper";
import PageHeader from "../components/Layouts/PageHeader";
import styled from "styled-components";
import {useDispatch, useSelector} from "react-redux";
import {accessToken, userActions, userState} from "../reducers/user";
import {useCallback, useEffect} from "react";
import {useHistory} from "react-router-dom";
import {getAddress, isMetaMask, personalSign, requestAccounts} from "../utils/metamask";
import {soliditySha3} from 'web3-utils';
import {hasAccessToken, setAccessToken} from "../utils/user";
import {setAuthorization} from "../utils/axios";
import {useAlert} from "react-alert";
import { useTranslation } from 'react-i18next';


const Content = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 60px 0;
`;

const ConnectButton = styled.div`
  width: 557px;
  padding: 27px;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #FAFAFC;
  border: 1px solid #C7C7CC;
  border-radius: 65px;
  cursor: pointer;
`;

const DirectLink = styled.div`
  position: absolute;
  bottom: -35px;
  font-size: 16px;
  line-height: 21px;
  color: #8E8E93;
  font-weight: 400;
`;

const Connect = () => {

  const { t }  = useTranslation(['common','alert']);

  const history = useHistory();
  const dispatch = useDispatch();
  const alert = useAlert();

  const user = useSelector(userState);

  useEffect(() => {
    if (!user.address) {
      return;
    } else if (user.address !== getAddress()) {
      return;
    }

    if (hasAccessToken(user.address)) {
      if (history.action === 'POP') {
        history.replace('/');
      } else {
        history.goBack();
      }
    } else {
      dispatch(userActions.clearAddress);
    }
  }, [user, history]);

  const handleConnectMetamask = useCallback(() => {
    if (!isMetaMask()) {
      alert.error(t('METAMASK_NOT_INSTALLED'));
      return;
    }

    let address;
    const ms = Date.now();

    requestAccounts()
      .then(([addr]) => {
        address = addr;

        return soliditySha3(
          {type: 'address', value: address},
          {type: 'string', value: 'NFTon Service'},
          {type: 'uint256', value: ms}
        )
      })
      // .then(hashMessage)
      .then(personalSign)
      .then(async (sign) => {
        try {
          const {payload} = await dispatch(accessToken({
            account: address,
            sign: sign,
            timestamp: ms
          }));

          if (payload?.success) {
            setAccessToken(address, payload.token);
            setAuthorization(payload.token);
            dispatch(userActions.setAddress(address));
          }
        } catch (e) {
          console.log(e);
        }
      });
  }, []);

  return (
    <PageWrapper hasTopNav footer>
      <PageHeader color={'#0C33FF'} title={t('CONNECT_WALLET')} description={t('CONNECT_WALLET_DESCRIPTION')}/>
      <Content>
        <ConnectButton onClick={handleConnectMetamask}>
          <img src={"/img/logo_connect_metamask.svg"}/>
          <DirectLink>{t('CONNECT_METAMASK')}</DirectLink>
        </ConnectButton>
      </Content>
    </PageWrapper>
  )
};

export default Connect;
