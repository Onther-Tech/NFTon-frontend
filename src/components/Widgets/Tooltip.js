import styled from 'styled-components';
import {forwardRef} from "react";

const Wrapper = styled.div`
  display: none;
  position: absolute;
  padding: 12px 20px;
  background-color: #FFFFFF;
  border-radius: 15px;
  filter: drop-shadow(0px 8px 8px rgba(0, 0, 0, 0.08)) drop-shadow(0px 8px 16px rgba(0, 0, 0, 0.06));
  text-align: center;

  &::after {
    content: ' ';
    position: absolute;
    width: 24px;
    height: 7px;
    background-image: url('/img/tooltip_bottom.svg');
    bottom: -7px;
    left: calc(50% - 12px);
    background-size: contain;
  }
`;


const Tooltip = forwardRef(({children, ...p}, ref) => {
  return (
    <Wrapper ref={ref} {...p}>
      {children}
    </Wrapper>
  )
});

export default Tooltip;
