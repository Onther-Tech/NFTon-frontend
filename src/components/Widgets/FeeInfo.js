import styled from "styled-components";
import Tooltip from "./Tooltip";

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  position: absolute;
  right: 0;
  color: #8E8E93;
  font-size: 14px;
  line-height: 17px;
  letter-spacing: -0.02em;

  .tooltip {
    position: relative;

    img {
      vertical-align: middle;
      margin-left: 5px;

      &:hover + div {
        display: initial !important;
      }
    }
  }
`;

const PriceTooltip = styled(Tooltip)`
  bottom: calc(100% + 15px);
  left: calc(50% + 3px);
  transform: translateX(-50%);
  white-space: nowrap;
  color: #000000;
  font-size: 14px;
  line-height: 18px;
  padding: 12px 20px;
  z-index: 5;
`;

const FeeInfo = ({fee, ...p}) => {
  return (
    <Wrapper {...p}>
      + {fee}%
      <div className={"tooltip"}>
        <img src={"/img/ic_detail_fee_info.svg"}/>
        <PriceTooltip>Description of the fee</PriceTooltip>
      </div>
    </Wrapper>
  )
};

export default FeeInfo;
