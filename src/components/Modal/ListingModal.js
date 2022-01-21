import styled from "styled-components";
import {useCallback, useEffect, useRef, useState} from "react";
import MarketTypes from "../CreateFormElements/MarketTypes";
import Price from "../CreateFormElements/Price";
import Royalty from "../CreateFormElements/Royalty";
import {ORDER_FIXED_PRICE} from "../../constants/sale";
import GradientButton from "../Widgets/GradientButton";
import {isNull} from "../../utils";
import {approveTransferProxy, isValidMetadata, makeOrder} from "../../utils/nft";
import {useTranslation} from "react-i18next";
import {useAlert} from "react-alert";
import produce from "immer";
import {registerOrder} from "../../reducers/order";
import {useDispatch} from "react-redux";


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
  width: 852px;
  top: 50%;
  transform: translateY(-50%);
  margin: 0 auto;
  padding: 35px 40px;

  .title {
    font-size: 64px;
    font-weight: bold;
    margin: 0;
    margin-bottom: 80px;
  }
`

const ModalHead = styled.div`
  display: flex;
  user-select: none;

  h1 {
    flex: 1;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
`;

const ModalCloseButton = styled.div`
  width: 24px;
  height: 24px;
  background-image: url('/img/ic_modal_close.svg');
  cursor: pointer;
`;

const Content = styled.div`

`;

const ConfirmButton = styled(GradientButton)`
  width: 316px;
  margin: 50px 10px 15px auto;
`;

const ListingModal = ({collection, tokenId, metadata, visible, onClose, onConfirm}) => {
  const {t} = useTranslation();
  const alert = useAlert();
  const dispatch = useDispatch();

  const wrapperRef = useRef(null);
  const [marketType, setMarketType] = useState(ORDER_FIXED_PRICE);

  const [params, setParams] = useState({});

  useEffect(() => {
    if (visible) {
      document.body.style.cssText = `overflow: hidden; top: -${window.scrollY}px`;
      return () => {
        const scrollY = document.body.style.top;
        document.body.style.cssText = `position: ""; top: "";`
        window.scrollTo(0, parseInt(scrollY || '0') * -1);
      }
    }
  }, [visible]);

  const handleChange = useCallback((e) => {
    const key = e.target.name;
    const value = e.target.value;
    console.log(key, value)

    setParams(params => ({...params, [key]: value}));
  }, []);

  const handleChangeUnit = useCallback((value) => {
    setParams(params => ({...params, unit: value}));
  }, []);

  const handleConfirm = () => {
    if (!collection.hasOwnProperty('name') || !collection.contract)
      return;
    if (isNull(tokenId))
      return;
    if (!isValidMetadata(metadata))
      return;

    if(!params.price) {
      return alert.error("PRICE_NEEDED");
    } else if(!params.unit) {
      return alert.error("SYMBOL_NEEDED");
    } else if(!params.royalty_ratio || params.royalty_ratio < 0 || params.royalty_ratio > 100) {
      return alert.error("ROYALTY_VALUE_NOT_RIGHT");
    } else if(!params.royalty_to)   {
      return alert.error("ROYALTY_NO_RECEIVER");
    }

    const loadingAlert = alert.show({
      title: t('PLEASE_WAIT'),
      loading: true,
      disableBackdropClick: true
    });

    (async () => {
      await approveTransferProxy(collection.contract);

      const jsonBody = await makeOrder(
        collection,
        tokenId,
        metadata,
        marketType,
        params.price,
        params.unit,
        params.royalty_ratio,
        params.royalty_to,
      );

      const {payload, error} = await dispatch(registerOrder(jsonBody));

      loadingAlert.close();

      if (error) {
        alert.error(error.message);
      } else if (!payload?.success) {
        alert.show(payload?.message);
      } else if (Array.isArray(payload?.data)) {
        onClose && onClose();
        alert.show(t('REGISTER_ORDER_SUCCESS'));
      }
    })();

  }

  return (
    <ModalWrapper tabIndex="-1" visible={visible}>
      <ModalOverlay visible={visible}/>
      <ModalInner tabIndex="0" className="modal-inner" ref={wrapperRef}>
        <ModalHead>
          <h1 className="title">List item for sale</h1>
          <ModalCloseButton onClick={onClose}/>
        </ModalHead>
        <Content>
          <MarketTypes title={"Type"} current={marketType} setMarketType={setMarketType}/>
          <Price priceFieldName="price" onChange={handleChange} onChangeUnit={handleChangeUnit}/>
          <Royalty ratioFieldName={"royalty_ratio"} toFieldName={"royalty_to"} onChange={handleChange}/>
          <ConfirmButton onClick={handleConfirm}>Complete listing</ConfirmButton>
        </Content>
      </ModalInner>
    </ModalWrapper>
  )
}
export default ListingModal;
