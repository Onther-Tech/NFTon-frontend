import styled from "styled-components";
import {useEffect, useState} from "react";
import {Button, ButtonList} from "./ModalButton";
import useGetUsdPrice from "../../../hooks/useGetPrice";

const ItemWrapper = styled.div`
  border-bottom: 1px solid #E5E5EA;
  padding: 16px 4px;
`;
const Item = styled.div`
  position: relative;
  background: #FFFFFF;
  border-radius: 10px;
  box-shadow: 0px 1px 4px #0000000a;
  padding: 14px 20px 14px 80px;
  display: flex;
  align-items: center;

  img {
    position: absolute;
    width: 60px;
    height: 60px;
    border-radius: 10px;
    overflow: hidden;
    top: 0;
    left: 0;
    object-fit: cover;
  }

  > .names {
    flex: 1;

    .collection-name {
      font-size: 12px;
      line-height: 14px;
      color: #3B5AFE;
    }

    .item-name {
      font-size: 16px;
      line-height: 14px;
      color: #000000;
      margin-top: 4px;
    }
  }

  > .prices {
    > span {
      vertical-align: middle;
    }

    .price {
      font-weight: 600;
      font-size: 16px;
      line-height: 14px;
      color: #151515;
    }

    .usd {
      font-size: 12px;
      line-height: 14px;
      color: #8E8E93;
      margin-left: 4px;
    }
  }

`;
const InputTitle = styled.h3`
  font-size: 22px;
  margin: 0;

  ${p => p.isCheckout && `
    border-bottom: 1px solid #E5E5EA;
    padding-bottom: 8px;
  `};
`;
const InputWrapper = styled.div`
  position: relative;
  margin-top: 8px;
`;
const Input = styled.input`
  width: 100%;
  border: 0;
  border-bottom: 1px solid #AEAEB2;
  padding: 20px;
  outline-width: 0;
  outline: none;

  &::placeholder {
    color: #8E8E93;
  }
`;
const InputDropdown = styled.div`
  position: absolute;
  right: 10px;
  bottom: 20px;

  .token {
    color: #AEAEB2;
  }
`;
const AmountWrapper = styled.ul`
  padding: 0;
  margin-top: 24px;
`;
const AmountRow = styled.li`
  display: flex;
  justify-content: space-between;
  margin-top: 15px;
  align-items: center;

  .key {
    color: #8E8E93;
  }

  .value {
    color: #151515;
    font-weight: 500;
    font-size: 16px;
    line-height: 21px;
  }
`;

const Total = styled(AmountRow)`
  margin-top: 25px;

  .key {
    font-weight: 600;
    font-size: 22px;
    line-height: 28px;
    color: #000000;
  }

  .value {
    font-weight: 600;
    font-size: 16px;
    line-height: 14px;
  }
`;

const UsdValue = styled.span`
  font-size: 12px;
  font-weight: normal;
  line-height: 14px;
  color: #8E8E93;
  margin-left: 4px;
  vertical-align: middle;
`;

const BidOrCheckout = ({checkout, content, onClose, onConfirm}) => {
  const [bidValue, setBidValue] = useState('');

  const usdTotalPay = useGetUsdPrice(content.total, content.unit);

  useEffect(() => {
    if (checkout) {
      setBidValue(' ');
    }
  }, [checkout]);

  return (
    <>
      {
        checkout ? <>
          <InputTitle isCheckout={checkout}>Item</InputTitle>
          <ItemWrapper>
            <Item>
              <div className="names">
                <img src={content.image}/>
                <div className="collection-name">{content.collectionName}</div>
                <div className="item-name">{content.name}</div>
              </div>
              <div className="prices">
                <span className="price">{content.price} {content.unit}</span>
                <span className="usd">${content.usdPrice}</span>
              </div>
            </Item>
          </ItemWrapper>
        </> : <>
          <InputTitle>Your bid</InputTitle>
          <InputWrapper>
            <Input autoFocus="autoFocus" value={bidValue} onChange={e => setBidValue(e.target.value)} type={"number"}
                   placeholder={"가격을 입력해 주세요"}/>
            <InputDropdown>
              <span className="token">{content.unit}</span>
              {/*<img src={"/img/ic_rd_arrowdown.svg"} />*/}
            </InputDropdown>
          </InputWrapper>
        </>
      }
      <AmountWrapper>
        {
          !checkout && (
            <AmountRow>
              <span className="key">Your bidding balance</span>
              <span className="value">{content.biddingBalance} TON</span>
            </AmountRow>
          )
        }
        <AmountRow>
          <span className="key">Your balance</span>
          <span className="value">{content.balance} {content.unit}</span>
        </AmountRow>
        <AmountRow>
          <span className="key">Service fee</span>
          <span className="value">{content.fee} {content.unit}</span>
        </AmountRow>
        <Total>
          <span className="key">Total</span>
          <span className="value">
            {content.total} {content.unit}
            <UsdValue>${usdTotalPay}</UsdValue></span>
        </Total>
      </AmountWrapper>
      <ButtonList>
        {bidValue != '' && <Button onClick={onConfirm}>Continue</Button>}
        {bidValue == '' && <Button className="disabled" onClick={onClose}>Cancel</Button>}
      </ButtonList>
    </>
  );
}
export default BidOrCheckout;
