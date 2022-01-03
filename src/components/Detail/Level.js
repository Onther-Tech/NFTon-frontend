import styled from "styled-components";
import {useMemo} from "react";
import FlexBox from "../FlexBox";

const Wrapper = styled.div`
  padding: 12px 20px;
  background: #F2F2F7;
  border: 1px solid #E5E5EA;
  box-sizing: border-box;
  border-radius: 25px;

  &:not(:last-child) {
    margin-bottom: 8px;
  }
`;

const NameText = styled.div`
  font-size: 18px;
  line-height: 23px;
  font-weight: 600;
  color: #000000;
  flex: 1;
`;

const LevelText = styled.div`
  float: right;
  font-size: 14px;
  line-height: 18px;
  color: #8E8E93;
  top: 0;
`;

const Gauge = styled.div`
  position: relative;
  width: 100%;
  height: 7px;
  background: #E5E5EA;
  border-radius: 8px;
  margin-top: 10px;

  &::after {
    position: absolute;
    left: 0;
    top: 0;
    content: ' ';
    width: ${p => p.percentage}%;
    height: 100%;
    background: #9EADFF;
    border-radius: 8px;
  }
`;

const Level = ({name, level, max}) => {
  const percentage = useMemo(() => {
    return Math.floor(level / max * 100);
  }, [level, max]);

  return (
    <Wrapper>
      <FlexBox>
        <NameText>{name}</NameText>
        <LevelText>{level}/{max}</LevelText>
      </FlexBox>
      <Gauge percentage={percentage}/>
    </Wrapper>
  )
};

export default Level;
