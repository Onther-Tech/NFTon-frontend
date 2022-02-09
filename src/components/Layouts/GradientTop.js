import styled from "styled-components";

const GradientTop = styled.div`
  position: absolute;
  left: 0;
  top: 0;
  min-width: 1140px;
  width: 100%;
  height: 368px;
  background: linear-gradient(180deg, ${p => p.color} 0%, rgba(242, 242, 247, 0) 70%, rgba(255, 255, 255, 0) 70.01%);
  z-index: -1;
`;

export default GradientTop;
