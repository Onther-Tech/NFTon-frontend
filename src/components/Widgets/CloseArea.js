import styled from "styled-components";

export const Z_INDEX_DROPDOWN_CLOSE_AREA = 1;
export const Z_INDEX_DROPDOWN_THUMB = 1;
export const Z_INDEX_DROPDOWN_LIST = 2;

const CloseArea = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: ${Z_INDEX_DROPDOWN_CLOSE_AREA};
  
  ${p => !p.expanded && `
    display: none;
  `};
`;

export default CloseArea;
