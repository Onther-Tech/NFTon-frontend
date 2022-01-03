import styled from "styled-components";
import {HEIGHT} from "./NavigationBar";
import Footer from "./Footer";
import {forwardRef} from "react";

const Wrapper = styled.div`
  ${p => p.hasTopNav && `
    padding-top: ${HEIGHT};
  `};
  
  ${p => p.leftMargin && `
    margin-left: ${p.leftMargin};
  `};
`;

const PageWrapper = forwardRef(({children, hasTopNav, leftMargin, footer, ...p}, ref) => {
  return <Wrapper ref={ref} leftMargin={leftMargin} hasTopNav={hasTopNav} {...p}>
    {children}
    <Footer/>
  </Wrapper>
});

export default PageWrapper;
