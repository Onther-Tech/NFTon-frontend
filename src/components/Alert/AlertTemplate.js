import React, {useCallback, useMemo} from 'react';
import styled from "styled-components";
import Spin from "../keyframes/Spin";
import GradientButton from "../Widgets/GradientButton";
import { useTranslation } from 'react-i18next';

const AlertWrapper = styled.div`
  box-sizing: border-box;
  display: block;
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 1000;
  overflow: auto;
  outline: 0;
`

const AlertOverlay = styled.div`
  box-sizing: border-box;
  display: block;
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  background-color: rgba(0, 0, 0, 0.6);
`

const AlertTitle = styled.h1`
  font-size: 22px;
  font-weight: bold;
  margin: 0 0 30px;
`
const AlertMessage = styled.p`
  line-height: 23px;
  font-size: 18px;
  margin: 0 0 30px;
`

const AlertInner = styled.div`
  box-sizing: border-box;
  position: relative;
  box-shadow: 0 0 6px 0 rgba(0, 0, 0, 0.5);
  background-color: #FAFAFA;
  border-radius: 10px;
  width: 558px;
  top: 50%;
  transform: translateY(-50%);
  margin: 0 auto;
  padding: 35px 40px;
  text-align: center;

  .title {
    font-size: 64px;
    font-weight: bold;
    margin: 0;
    margin-bottom: 80px;
  }
`

const Button = styled(GradientButton)`
  width: 316px;
  margin: 0 auto;
`;

const LoadingWrapper = styled.div`
  margin: 50px 0;

  img {
    width: 38px;
    height: 38px;
    animation: ${Spin} 1s linear infinite;
  }
`

const AlertTemplate = ({style, options, message, close}) => {
  const { t }  = useTranslation(['alert']);
  const handleClickBackdrop = useCallback(() => {
    if (!message.disableBackdropClick) {
      close && close();
    }
  }, [message, close]);

  const title = useMemo(() => {
    if (message.title) {
      return message.title;
    } else if (options.type === 'error') {
      return t('ERROR');
    }
  }, [message, options]);

  const text = useMemo(() => {
    if (typeof message === 'string') {
      return message;
    } else {
      return message.text;
    }
  }, [message]);

  const buttonText = useMemo(() => {
    if (typeof message === 'object' && message.buttonText) {
      return message.buttonText;
    } else {
      return "닫기";
    }
  }, []);

  return (
    <AlertWrapper style={style} tabIndex="-1">
      <AlertOverlay onClick={handleClickBackdrop}/>
      <AlertInner tabIndex="0" className="Alert-inner">
        {
          title && (
            <AlertTitle>{t(title)}</AlertTitle>
          )
        }
        {
          text && (
            <AlertMessage>{t(text)}</AlertMessage>
          )
        }
        {
          message.loading ? (
            <LoadingWrapper>
              <img src="/img/ic_spinner.svg"/>
            </LoadingWrapper>
          ) : (
            buttonText && (
              <Button onClick={close}>{buttonText}</Button>
            )
          )
        }
      </AlertInner>
    </AlertWrapper>
  );
}

export default AlertTemplate;
