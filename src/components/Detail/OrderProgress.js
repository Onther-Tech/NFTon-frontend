import OrderStepModal from "../Modal/OrderStepModal";
import {useCallback, useEffect, useState} from "react";
import {ORDER_TYPE_BID, ORDER_TYPE_CHECKOUT} from "../../constants/sale";
import useParseTokenInfo from "../Widgets/useParseTokenInfo";
import {approveMax, checkApproved, getBalance, matchOrders} from "../../utils/nft";
import numeral from "numeral";
import {useDispatch} from "react-redux";
import {orderActions, registerOrderBuy} from "../../reducers/order";
import useGetUsdPrice from "../../hooks/useGetPrice";
import {useAlert} from "react-alert";
import { useTranslation } from 'react-i18next';

const ORDER_STEP_NONE = 0;
const ORDER_STEP_PLACE_BID = 1;
const ORDER_STEP_CHECK_OUT = 2;
const ORDER_STEP_TRANSACTION = 3;
const ORDER_STEP_SUCCESS = 4;

const OrderProgress = ({order, feeRatio, orderType, onCancel}) => {
  const { t }  = useTranslation(['alert']);
  const dispatch = useDispatch();
  const alert = useAlert();

  const [balance, setBalance] = useState('0');
  const [fee, setFee] = useState('0');
  const [totalPay, setTotalPay] = useState('0');

  const [orderStep, setOrderStep] = useState(ORDER_STEP_NONE);
  const [approved, setApproved] = useState(false);
  const [signed, setSigned] = useState(false);

  const {name, image, collectionName, price, unit} = useParseTokenInfo(null, order);
  const usdPrice = useGetUsdPrice(price, unit);

  // get my balance & calculate fee & calculate total pay
  useEffect(() => {
    if (price && unit) {
      getBalance(unit).then(setBalance);

      const fee = price * feeRatio;
      const totalPay = Number(price) + fee;
      setFee(numeral(fee).format('0[.][00000000]'));
      setTotalPay(numeral(totalPay).format('0[.][00000000]'));
    }
  }, [price, unit]);


  useEffect(() => {
    if (orderType === ORDER_TYPE_CHECKOUT) {
      setOrderStep(ORDER_STEP_CHECK_OUT);
    } else if (orderType === ORDER_TYPE_BID) {
      setOrderStep(ORDER_STEP_PLACE_BID);
    } else {
      setOrderStep(ORDER_STEP_NONE);
    }
  }, [orderType]);

  const handleApprove = useCallback(() => {
    (async () => {
      try {
        if (unit === 'ETH') {
          setApproved(true);
          return;
        }

        let isApproved = await checkApproved(order);
        if (isApproved) {
          setApproved(true);
          return;
        }

        isApproved = await approveMax(order);
        if (isApproved) {
          setApproved(true);
        } else {
          alert.error(t('ERROR_FROM_APPROVAL'));
          onCancel && onCancel();
        }
      } catch (e) {
        alert.error(t('ERROR_FROM_APPROVAL'));
        onCancel && onCancel();
        console.error(e);
      }
    })();
  }, [order, unit, onCancel]);

  const handleCheckout = useCallback(() => {
    (async () => {
      try {

        const matchResult = await matchOrders(order);

        if (!matchResult || !matchResult.executed) {
          alert.error(t("ERROR_FROM_TRANSACTION"));
          return;
        }

        setSigned(true);

        const {payload, error} = dispatch(registerOrderBuy({
          chainId: process.env.REACT_APP_CHAIN_ID,
          tx: matchResult.tx,
          idorders: matchResult.idorders,
          taker: matchResult.taker,
          takeAsset: matchResult.takeAsset,
          priceUSD: usdPrice
        }));

        if (error) {
          alert.error(t("ERROR_FROM_TRANSACTION"));
          onCancel && onCancel();
          console.error(error);
          return;
        }

        setOrderStep(ORDER_STEP_SUCCESS);
        dispatch(orderActions.clearOrder());

        // if (payload.success) {
        //   setOrderStep(ORDER_STEP_SUCCESS);
        // }
      } catch (e) {
        alert.error(t("ERROR_FROM_TRANSACTION"));
        onCancel && onCancel();
        console.error(e);
      }
    })();
  }, [order, usdPrice, onCancel]);

  useEffect(() => {
    if (orderStep === ORDER_STEP_TRANSACTION) {
      (async () => {
        if (!approved) {
          handleApprove();
        } else if (!signed) {
          if (orderType === ORDER_TYPE_CHECKOUT) {
            handleCheckout();
          }
        }
      })();
    }
  }, [orderStep, orderType, approved, signed, handleApprove, handleCheckout]);

  const handleConfirmModal = useCallback(() => {
    switch (orderStep) {
      case ORDER_STEP_CHECK_OUT:
        setOrderStep(ORDER_STEP_TRANSACTION);
        break;
      case ORDER_STEP_PLACE_BID:
        setOrderStep(ORDER_STEP_TRANSACTION);
        break;
      case ORDER_STEP_TRANSACTION:
        break;
      case ORDER_STEP_SUCCESS:
        break;
    }
  }, [orderStep]);

  return (
    <>
      {
        orderStep === ORDER_STEP_PLACE_BID && (
          <OrderStepModal
            onClose={onCancel}
            visible
            title={"Place a bid"}
            type={"bid"}
            content={{
              biddingBalance: "0.1",
              name: name,
              image: image,
              collectionName: collectionName,
              price: price,
              unit: unit,
              usdPrice: usdPrice,
              fee: fee,
              balance: balance,
              total: totalPay
            }}/>
        )
      }

      {
        orderStep === ORDER_STEP_CHECK_OUT && (
          <OrderStepModal
            onClose={onCancel}
            onConfirm={handleConfirmModal}
            visible
            title={"Checkout"}
            type={"checkout"}
            content={{
              name: name,
              image: image,
              collectionName: collectionName,
              price: price,
              unit: unit,
              usdPrice: usdPrice,
              fee: fee,
              balance: balance,
              total: totalPay
            }}/>
        )
      }
      {
        orderStep === ORDER_STEP_TRANSACTION && (
          <OrderStepModal
            onClose={onCancel}
            visible
            title={"Follow steps"}
            type={"progress"}
            content={{
              isCheckout: orderType === ORDER_TYPE_CHECKOUT,
              approved: approved,
              signed: signed
            }}/>
        )
      }

      {
        orderStep === ORDER_STEP_SUCCESS && (
          <OrderStepModal
            visible
            title={"Success!"}
            type={"done"}
            content={{
              subTitle: "Your transaction succeeded!",
              buttons: [
                {
                  title: "View your profile",
                  link: "/profile"
                },
                {
                  title: "Back to Marketplace",
                  link: "/marketplace/all"
                }
              ]
            }}/>
        )
      }
    </>
  )
};

export default OrderProgress;
