import styled, {css} from "styled-components";
import {useCallback, useEffect, useMemo, useState} from "react";
import CloseArea, {Z_INDEX_DROPDOWN_LIST, Z_INDEX_DROPDOWN_THUMB} from "./CloseArea";
import {SIZE_BIG, SIZE_SMALL} from "../../constants/dropdown";
import { useTranslation } from 'react-i18next';

const Wrapper = styled.div`
  width: 160px;
  position: relative;
`;

const itemStyle = css`
  width: 100%;
  height: 40px;
  color: #535353;
  padding: 9px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #FAFAFA;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.04);
  border-radius: 40px;
  cursor: pointer;
  user-select: none;
  -webkit-user-drag: none;

  font-size: 12px;
  line-height: 22px;
`

const Thumb = styled.div`
  ${itemStyle};
  z-index: ${Z_INDEX_DROPDOWN_THUMB};

  .dropdown-label {
    color: #535353;
    font-size: 15px;
    line-height: 22px;
  }

  ${p => p.size === SIZE_BIG && `
    height: 48px;
    
    .dropdown-label {
      color: #151515;
      font-size: 18px;
      line-height: 46px;
    }
  `};

  .arrow {
    object-fit: contain;
    margin-left: 8px;
    transform: rotate(${p => p.expanded ? 180 : 0}deg);
  }
`;

const List = styled.div`
  width: 100%;
  position: absolute;
  top: 40px;
  opacity: ${p => p.expanded ? 1 : 0};
  transform: scale(${p => p.expanded ? 1 : 0});
  z-index: ${Z_INDEX_DROPDOWN_LIST};
`;

const ListItem = styled.div`
  ${itemStyle};
`;

const RoundedDropdown = ({size = SIZE_SMALL, items = [], defaultLabel, value, onChange, customList, ...p}) => {
  const [currentItem, setCurrentItem] = useState(null);
  const [expanded, setExpanded] = useState(false);
  const { t }  = useTranslation(['common']);

  const toggleExpand = useCallback(() => {
    setExpanded(expanded => !expanded);
  }, []);

  const objectItems = useMemo(() => {
    return items.map((x) => {
      return typeof x === 'object' ? x : {value: x, label: x};
    })
  }, [items]);

  const handleClickItem = useCallback((e) => {
    const index = e.target.getAttribute('data-index');
    const item = objectItems[index];

    toggleExpand();
    setCurrentItem(item);
    onChange && onChange(item.value, index, item.label);
  }, [toggleExpand, objectItems, onChange]);

  useEffect(() => {
    const defaultItem = !defaultLabel ? objectItems[0] : null;
    setCurrentItem(objectItems.find(x => x.value === value) || defaultItem);
  }, [objectItems, defaultLabel, value]);

  return (
    <Wrapper {...p}>
      <Thumb
        className={"dropdown-thumb" + (expanded ? ' expanded' : '')}
        size={size}
        expanded={expanded}
        onClick={toggleExpand}
      >
        <span className="dropdown-label">{currentItem?.label || defaultLabel}</span>
        <img className="arrow" src={"/img/ic_rd_arrowdown.svg"}/>
      </Thumb>
      {
        !customList ? (
          <List className="dropdown-list" expanded={expanded}>
            {
              objectItems.map(({label}, i) => (
                <ListItem className="dropdown-item" key={i} data-index={i} size={size}
                          onClick={handleClickItem}>{t(label)}</ListItem>
              ))
            }
          </List>
        ) : (
          {customList}
        )
      }
      <CloseArea expanded={expanded} onClick={toggleExpand}/>
    </Wrapper>
  )
};

export default RoundedDropdown;
