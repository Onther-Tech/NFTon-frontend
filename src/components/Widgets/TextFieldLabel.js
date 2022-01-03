import styled from "styled-components";
import Tooltip from "./Tooltip";
import {breakLine} from "../../utils";

const Wrapper = styled.div`
  display: flex;
  font-size: 18px;
  font-weight: 700;
  line-height: 24px;
  color: #000000;
  align-items: center;
  margin-bottom: 10px;
`;

const TooltipIcon = styled.span`
  width: 15px;
  height: 15px;
  background-image: url('/img/ic_form_tooltip_icon.svg');
  background-size: contain;
  margin-left: 6px;
  cursor: help;
  position: relative;
  
  &:hover {
    > div {
      display: inherit;
    }
  }
`;

const StyledTooltip = styled(Tooltip)`
  width: 340px;
  bottom: 30px;
  left: calc(50% - 169px);
  font-size: 14px;
  line-height: 18px;
  text-align: center;
  font-weight: normal;
  color: #292929;
`

const TextFieldLabel = ({children, tooltip}) => {
  return <Wrapper>
    {breakLine(children)}
    {
      tooltip && (
        <TooltipIcon>
          <StyledTooltip>{tooltip}</StyledTooltip>
        </TooltipIcon>
      )
    }
  </Wrapper>
};

export default TextFieldLabel;
