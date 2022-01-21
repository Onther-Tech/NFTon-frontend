import styled from "styled-components";
import CloseArea, {Z_INDEX_DROPDOWN_LIST} from "./CloseArea";
import {useCallback, useEffect, useMemo, useState} from "react";
import FlexBox from "../FlexBox";
import {chainList} from "../../constants/dropdown";
import {dismissEvent} from "../../utils";
import { useTranslation } from 'react-i18next';

const Wrapper = styled.div`
  width: 100%;
  max-width: 596px;
  position: relative;
`;


const Thumb = styled.div`
  width: 100%;
  max-width: 557px;
  height: 51px;
  margin: 0 auto;
  box-sizing: border-box;
  font-size: 14px;
  line-height: 24px;
  position: relative;
  user-select: none;
  display: flex;
  align-items: center;
  cursor: pointer;
  z-index: ${Z_INDEX_DROPDOWN_LIST + 1};

  input {
    flex: 1;
    padding: 16px 20px;
    font-size: 16px;
    font-weight: 500;
    line-height: 19px;
    border: none;
    outline: none;
    background-color: transparent;

    &:focus {
      + .bg {
        ${p => !p.expanded && `
          border: 1px solid #CED6FF;
          background-color: #FAFAFA;
          border-radius: 5px;
        `};

      }
    }


    &::placeholder {
      color: #C4C4C4;
    }
  }

  .bg {
    content: ' ';
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    border-bottom: 1px solid #929292;
    pointer-events: none;
    z-index: -1;
  }

  .unit {
    font-size: 16px;
    font-weight: 500;
    line-height: 17px;
    color: #929292;
    cursor: pointer;
    margin-right: 20px;

    ${p => p.expanded && `
      color: #0C33FF;
    `};

    img {
      width: 12px;
      margin-left: 5px;
    }
  }
`;

const List = styled.div`
  width: 100%;
  position: absolute;
  padding: 51px 0 16px 0;
  z-index: ${Z_INDEX_DROPDOWN_LIST};
  opacity: ${p => p.expanded ? 1 : 0};
  transform: scale(${p => p.expanded ? 1 : 0});
  border: 1px solid #CED6FF;
  background-color: #FAFAFA;
  border-radius: 5px;
  margin-top: -51px;
`;

const Item = styled.div`
  width: 100%;
  display: flex;
  padding: 8px 20px;
  align-items: center;
  justify-content: center;
  cursor: pointer;

  &:not(:last-child) {
    border-bottom: 1px solid #F2F2F7;
  }

  > .name {
    flex: 1;
    font-size: 16px;
    line-height: 19px;
    color: #292929;
    text-align: center;
  }
`;


const PriceInput = ({nested, value, unitFixed, priceName, onChangePrice, onChangeUnit}) => {
  const [currentItem, setCurrentItem] = useState(null);
  const [expanded, setExpanded] = useState(false);
  const { t }  = useTranslation(['common']);

  useEffect(() => {
    const item = chainList[0];
    onChangeUnit && onChangeUnit(item.value, 0, item.label);
  }, [onChangeUnit]);

  const toggleExpand = useCallback(() => {
    if(!unitFixed) {
      setExpanded(expanded => !expanded);
    }
  }, [unitFixed]);

  const handleClickItem = useCallback((index) => {
    const item = chainList[index];
    toggleExpand();
    setCurrentItem(item);
    onChangeUnit && onChangeUnit(item.value, index, item.label);
  }, [toggleExpand, onChangeUnit]);

  useEffect(() => {
    const defaultItem = chainList[0];
    setCurrentItem(chainList.find(x => x.value === value) || defaultItem);
  }, [value]);

  const label = useMemo(() => currentItem?.label, [currentItem]);

  return (
    <Wrapper expanded={expanded}>
      <Thumb expanded={expanded}>
        <input type="number" placeholder={t('ENTER_PRICE')} name={priceName} onChange={onChangePrice}
               onWheel={dismissEvent}/>
        <div className="bg"/>
        <FlexBox className="unit" onClick={toggleExpand}>
          {currentItem?.label}
          {
            !unitFixed && (
              <img src={`/img/ic_create_unit_arrow${expanded ? 'up' : 'down'}.svg`}/>
            )
          }
        </FlexBox>
      </Thumb>
      <List expanded={expanded}>
        {
          chainList.map((x, i) => (
            <Item key={i} onClick={() => handleClickItem(i)}>
              <div className="name">{x.label}</div>
            </Item>
          ))
        }
      </List>
      <CloseArea expanded={expanded} onClick={toggleExpand}/>
    </Wrapper>
  )
};

export default PriceInput;
