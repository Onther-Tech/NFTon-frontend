import styled from "styled-components";

const Section = styled.section`
  ${p => p.num && `
    position: relative;
    padding-bottom: 20px;
  `};
  
  &:not(:first-child) {
    padding-top: 30px;
  }

  input {
    &:not(:nth-of-type(1)) {
      margin-left: 24px;
    }
  }
`;

export default Section;
