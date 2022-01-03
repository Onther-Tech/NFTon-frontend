import styled from "styled-components";
import {useCallback} from "react";

const Tab = styled.div`
  margin-top: 5px;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 20px;
  margin-bottom: -2px;
`;

const TabItem = styled.div`
  min-width: 72px;
  font-size: 14px;
  font-weight: 700;
  line-height: 21px;
  color: #C4C4C4;
  letter-spacing: -0.01em;
  text-align: center;
  padding: 11px 0;
  cursor: pointer;
  z-index: 1;
  user-select: none;

  ${p => p.selected && `
    color: #000000;
    box-shadow: inset 0px -2px 0px 0px #6f86ff;
  `};
`;

const PageTab = ({items, current, onChange, ...p}) => {
  const handleClickTab = useCallback((i) => {
    onChange && onChange(i)
  }, [onChange]);

  return (
    <Tab {...p}>
      {
        items.map((x, i) => (
          <TabItem key={i} selected={current === i} onClick={() => handleClickTab(i)}>{x}</TabItem>
        ))
      }
    </Tab>
  )
};

export default PageTab;
