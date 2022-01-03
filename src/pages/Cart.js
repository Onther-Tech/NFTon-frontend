import PageWrapper from "../components/Layouts/PageWrapper";
import {useCallback, useEffect, useMemo, useState} from "react";
import PageHeader from "../components/Layouts/PageHeader";
import CartItem from "../components/Cart/CartItem";
import styled from "styled-components";
import GradientButton from "../components/Widgets/GradientButton";
import {useHistory} from "react-router-dom";
import {cartList} from "../dummy/cart";
import useWallet from "../hooks/useWallet";

const Content = styled.div`
  display: flex;
  position: relative;
`;

const CartList = styled.div`
  flex: 1;

  > * {
    margin-bottom: 24px;
  }
`;

const StickyWrapper = styled.div`
  width: 341px;
  margin-left: 24px;
`;

const TotalWrapper = styled.div`
  padding: 48px 24px 24px;
  background: #FFFFFF;
  border-radius: 25px;
  position: sticky;
  top: 24px;

  .title {
    font-size: 22px;
    font-weight: 700;
    line-height: 28px;
    letter-spacing: -0.0026em;
    color: #000000;
    margin-bottom: 49px;
  }
`;

const TotalRow = styled.div`
  display: flex;

  ${p => p.sub && `
    border-bottom: 1px solid #E5E5EA;
    margin-bottom: 10px;
  `};

  > * {
    flex: 1;
    color: ${p => p.sub ? '#8E8E93' : '#000000'};
    line-height: ${p => p.sub ? 46 : 24}px;

    &:last-child {
      text-align: right;
    }
  }
`;

const OrderButton = styled(GradientButton)`
  width: 100%;
  font-size: 19px;
  font-weight: 400;
  line-height: 30px;
  margin-top: 40px;
`;

const BackToMarket = styled.div`
  width: 100%;
  font-size: 13px;
  line-height: 18px;
  background-image: url('/img/arrow_back_to_marketplace.svg');
  background-position: left bottom;
  background-repeat: no-repeat;
  text-align: right;
  padding-bottom: 4px;
  color: #535353;
  cursor: pointer;

  position: absolute;
  left: 0;
  bottom: -35px;

  b {
    font-weight: 700;
  }
`;

const Cart = () => {
  const history = useHistory();

  const [rows, setRows] = useState([]);

  const descriptionText = useMemo(() => `총 ${rows.length}개의 상품이 담겨있습니다.`, [rows]);

  useWallet(true);

  useEffect(() => {
    setRows(cartList);
  }, []);

  const handleBack = useCallback(() => {
    history.goBack();
  }, [history]);

  return (
    <PageWrapper hasTopNav>
      <PageHeader color={"#84A2C8"} title={"장바구니"} description={descriptionText}/>
      <Content>
        <CartList>
          {
            rows.map(x => (
              <CartItem key={x.id} item={x}/>
            ))
          }
        </CartList>
        <StickyWrapper>
          <TotalWrapper>
            <div className="title">총 주문금액</div>
            <TotalRow sub>
              <div>Subtotal</div>
              <div>0.2 TON</div>
            </TotalRow>
            <TotalRow>
              <div>Total</div>
              <div>0.2 TON</div>
            </TotalRow>
            <OrderButton>주문하기</OrderButton>
            <BackToMarket onClick={handleBack}><b>Marketplace</b>로 돌아가기</BackToMarket>
          </TotalWrapper>
        </StickyWrapper>
      </Content>

    </PageWrapper>
  )
};

export default Cart;
