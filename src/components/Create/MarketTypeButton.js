import styled from "styled-components";
import {useMemo} from "react";
import {ORDER_FIXED_PRICE, ORDER_OPEN_BID, ORDER_TIMED_AUCTION} from "../../constants/sale";

const Wrapper = styled.div`
  width: 170px;
  height: 170px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: #FAFAFA;
  border: 1px solid #C4C4C4;
  border-radius: 25px;
  margin-top: 30px;
  cursor: pointer;
  user-select: none;
  -webkit-user-drag: none;

  &:not(:last-of-type) {
    margin-right: 24px;
  }

  ${p => p.selected && `
    border: 2px solid #6D84FF;
  `};
`;

const Icon = styled.img`
  margin-bottom: 12px;
  -webkit-user-drag: none;
`

const Label = styled.div`
  font-size: 16px;
  line-height: 24px;
  color: #000000;
`;

const MarketTypeButton = ({type, current, ...p}) => {
  const {icon, label} = useMemo(() => {
    switch (type) {
      case ORDER_FIXED_PRICE:
        return {icon: '/img/ic_create_fixed_price.svg', label: 'Fixed price'};
      case ORDER_TIMED_AUCTION:
        return {icon: '/img/ic_create_auction.svg', label: 'Timed auction'};
      case ORDER_OPEN_BID:
        return {icon: '/img/ic_create_open_bids.svg', label: 'Open for bids'};
    }
  }, [type]);

  return (
    <Wrapper {...p} selected={current === type}>
      <Icon src={icon}/>
      <Label>{label}</Label>
    </Wrapper>
  )
}

export default MarketTypeButton;
