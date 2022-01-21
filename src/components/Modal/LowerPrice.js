import styled from "styled-components";
import GradientButton from "../Widgets/GradientButton";
import React, {useCallback, useRef, useState} from "react";
import {useTranslation} from "react-i18next";
import {useAlert} from "react-alert";
import {useDispatch} from "react-redux";
import PriceInput from "../Widgets/PriceInput";
import {decodeRoyaltyData, getRoyaltyInfo, makeOrder} from "../../utils/nft";
import {registerOrder} from "../../reducers/order";


const ModalWrapper = styled.div`
  box-sizing: border-box;
  display: ${(props) => (props.visible ? 'block' : 'none')};
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 99;
  overflow: auto;
  outline: 0;
`

const ModalOverlay = styled.div`
  box-sizing: border-box;
  display: ${(props) => (props.visible ? 'block' : 'none')};
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  background-color: rgba(0, 0, 0, 0.6);
`

const ModalInner = styled.div`
  box-sizing: border-box;
  position: relative;
  box-shadow: 0 0 6px 0 rgba(0, 0, 0, 0.5);
  background-color: #F2F2F7;
  border-radius: 10px;
  width: 558px;
  top: 50%;
  transform: translateY(-50%);
  margin: 0 auto;
  padding: 40px 60px;

  .title {
    font-weight: bold;
    font-size: 22px;
    line-height: 34px;
    text-align: center;
    color: #000000;
  }
`

const ModalHead = styled.div`
  display: flex;
  user-select: none;
  margin-bottom: 34px;

  h1 {
    flex: 1;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    margin: 0;
  }
`;

const Content = styled.div`

`;

const Description = styled.div`
  font-size: 18px;
  line-height: 28px;
  margin: 50px 0;
  text-align: center;
`;

const ButtonWrapper = styled.div`
  display: flex;
  gap: 30px;
  justify-content: center;

  > * {
    flex: 1;
  }
`;

const Button = styled(GradientButton)`
  max-width: 180px;

  ${p => p.cancel && `
    background: #AEAEB2;
  `};
`;

const LowerPrice = ({order, currentPrice, currentUnit, visible, onClose}) => {
  const {t} = useTranslation();
  const alert = useAlert();
  const dispatch = useDispatch();

  const wrapperRef = useRef(null);
  const [price, setPrice] = useState();

  const handleChangePrice = useCallback((e) => {
    setPrice(e.target.value);
  }, []);

  const handleConfirm = () => {
    if(price <= 0) {
      return alert.error(t('PRICE_GREATER_THAN_ZERO'));
    }

    if(+price >= +currentPrice) {
      return alert.error(t('PRICE_LOWER_THAN_CURRENT'));
    }

    const collection = {
      name: order.makeInfo.collectionName,
      contract: order.makeInfo.contractAddress,
    }

    const royalty = getRoyaltyInfo(order.data);

    const loadingAlert = alert.show({
      title: t('PLEASE_WAIT'),
      loading: true,
      disableBackdropClick: true
    });

    (async () => {
      const jsonBody = await makeOrder(
        collection,
        order.makeInfo.tokenId,
        order.makeInfo.asset,
        order.type,
        price,
        currentUnit,
        royalty.ratio,
        royalty.address
      );

      const {payload, error} = await dispatch(registerOrder(jsonBody));

      loadingAlert.close();

      if (error) {
        alert.error(error.message);
      } else if (!payload?.success) {
        alert.show(payload?.message);
      } else if (Array.isArray(payload?.data)) {
        onClose && onClose();
        alert.show(t('UPDATE_ORDER_SUCCESS'));
      }
    })();

  };

  return (
    <ModalWrapper tabIndex="-1" visible={visible}>
      <ModalOverlay visible={visible} onClick={onClose}/>
      <ModalInner tabIndex="0" className="modal-inner" ref={wrapperRef}>
        <ModalHead>
          <h1 className="title">List item for sale</h1>
        </ModalHead>
        <Content>
          <PriceInput onChangePrice={handleChangePrice} value={currentUnit} unitFixed/>
          <Description>You must pay an additional gas fee if you want to cancel this listing at a later
            point.</Description>
          <ButtonWrapper>
            <Button cancel onClick={onClose}>Never mind</Button>
            <Button onClick={handleConfirm}>Set new price</Button>
          </ButtonWrapper>
        </Content>
      </ModalInner>
    </ModalWrapper>
  )
};

export default LowerPrice;

