import styled from "styled-components";

const FlexBox = styled.div`
  display: flex;
  align-items: center;
  
  ${p => p.centerHorizontal && `
    justify-content: center;
  `};
`;

export default FlexBox;
