import styled from "styled-components";

const GradientButton = styled.button`
  width: 140px;
  padding: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: radial-gradient(54.71% 75.06% at 67.06% 72%, #0C33FF 0%, #6F86FF 100%);
  border-radius: 46px;
  font-size: 18px;
  font-weight: 700;
  line-height: 30px;
  color: #ffffff;
  border: none;
  outline: none;
  user-select: none;
  -webkit-user-drag: none;
  cursor: pointer;

  ${p => p.disabled && `
    background: #AEAEB2;
    pointer-events: none;
    cursor: initial;
  `};
`;

export default GradientButton
