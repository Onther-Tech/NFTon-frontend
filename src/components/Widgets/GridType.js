import styled from "styled-components";
import {useCallback} from "react";

const Wrapper = styled.div`
  display: inline-block;
  
  ${p => p.center && `
    display: flex;
    align-items: center;
    justify-content: center;
  `};
`;

const Circle = styled.div`
  display: inline-block;
  background: #FAFAFA;
  transform: rotate(180deg);
  padding: 10px;
  border-radius: 50%;
  line-height: 0;
  box-shadow: 0 -2px 4px rgba(0, 0, 0, 0.04);
  
  > img {
    width: 19px;
    height: 19px;
    object-fit: contain;
    cursor: pointer;
  }
  
  &:not(:first-child) {
    margin-left: -8px;
  }
`;

const GridType = ({small, onClick, ...p}) => {
  const handleClickNormal = useCallback(() => {
    onClick && onClick(false);
  }, [onClick]);

  const handleClickSmall = useCallback(() => {
    onClick && onClick(true);
  }, [onClick]);

  return (
    <Wrapper {...p}>
      <Circle>
        <img src={`/img/ic_gridtype_normal_${!small ? 'on' : 'off'}.svg`} onClick={handleClickNormal}/>
      </Circle>
      <Circle>
        <img src={`/img/ic_gridtype_small_${small ? 'on' : 'off'}.svg`} onClick={handleClickSmall}/>
      </Circle>
    </Wrapper>
  )
};

export default GridType;
