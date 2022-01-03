import styled from "styled-components";
import CloseArea, {Z_INDEX_DROPDOWN_LIST} from "./CloseArea";
import {useCallback, useEffect, useMemo, useState} from "react";
import {SIZE_BIG, SIZE_SMALL} from "../../constants/dropdown";

const Wrapper = styled.div`
  width: 100%;
  position: relative;

  ${p => p.expanded && `
    box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.04);
  `};


  ${p => p.size === SIZE_SMALL && `
    width: 300px;
    border-radius: 36px;
  `};
  
  ${p => p.disabled && `
    pointer-events: none;
    
    * {
      color: #AEAEB2 !important;
    }
    
    .arrow {
      display: none;
    }
  `};
`;

const Thumb = styled.div`
  width: 100%;
  box-sizing: border-box;
  font-size: 14px;
  line-height: 24px;
  padding: 13px 20px;
  position: relative;
  z-index: ${Z_INDEX_DROPDOWN_LIST + 1};
  user-select: none;
  display: flex;
  align-items: center;
  cursor: pointer;

  > .label {
    color: ${p => !p.expanded ? p.size === SIZE_BIG ? '#AEAEB2' : '' : '#0C33FF'};

    &:not([data-empty="true"]) {
      color: #151515;
    }
  }


  ${p => p.size === SIZE_BIG && `
    height: 50px;
    border: 1px solid #C7C7CC;
    justify-content: space-between;
    border-radius: 5px;
    color: #AEAEB2;
  `};

  ${p => p.size === SIZE_SMALL && `
    height: 48px;
    justify-content: center;
    background: #FFFFFF;
    border-radius: 36px;
    box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.04);
    
    > .label {
      font-size: 18px;
      line-height: 46px;
    }
    
    > .arrow {
      margin-left: 10px;
    }
  `};

  ${p => p.expanded && `
    box-shadow: none;
   
    ${p.size === SIZE_BIG && `
      border: 1px solid #CED6FF;
      background: #FFFFFF;
    `};
  `};
`;


const ListWrapper = styled.div`
  width: 100%;
  position: absolute;
  padding: 26px 0;
  background-color: #ffffff;
  z-index: ${Z_INDEX_DROPDOWN_LIST};
  opacity: ${p => p.expanded ? 1 : 0};
  transform: scale(${p => p.expanded ? 1 : 0});
  border-radius: 0 0 10px 10px;
  margin-top: -20px;

  ${p => p.size === SIZE_SMALL && `
    border-radius: 0 0 25px 25px;
  `};
`;

const List = styled.div`
  width: 100%;
  max-height: 278px;
  padding: 0 15px;
  overflow: auto;
`;

const Item = styled.div`
  width: 100%;
  padding: 8px;
  cursor: pointer;
  border-bottom: 1px solid #F2F2F7;
  position: relative;
  text-align: center;

  > .name {
    font-size: 16px;
    line-height: 19px;
    color: #292929;
  }

  > .check {
    position: absolute;
    right: 0;
    top: calc(50% - 10px);
    padding: 0 11px;
  }
`;


const CategoryDropdown = ({size = SIZE_SMALL, items = [], value, defaultLabel, disabled, onChange}) => {
  const [currentItem, setCurrentItem] = useState(null);
  const [expanded, setExpanded] = useState(false);

  const toggleExpand = useCallback(() => {
    if(!disabled)
      setExpanded(expanded => !expanded);
  }, [disabled]);

  const handleClickItem = useCallback((index) => {
    const item = items[index];
    toggleExpand();
    setCurrentItem(item);
    onChange && onChange(item.value, index, item.label);
  }, [toggleExpand, items, onChange]);

  useEffect(() => {
    const defaultItem = !defaultLabel ? items[0] : null;
    setCurrentItem(items.find(x => x.value === value) || defaultItem);
  }, [items, defaultLabel, value]);

  const label = useMemo(() => currentItem?.label || defaultLabel, [currentItem, defaultLabel]);

  return (
    <Wrapper size={size} expanded={expanded} disabled={disabled}>
      <Thumb size={size} expanded={expanded} onClick={toggleExpand}>
        <div className="label" data-empty={!currentItem}>{label}</div>
        <img className="arrow" src={`/img/ic_cd${size === SIZE_BIG ? 'b' : 's'}_arrow${expanded ? 'up' : 'down'}.svg`}/>
      </Thumb>
      <ListWrapper size={size} expanded={expanded}>
        <List>
          {
            items.map((x, i) => (
              <Item key={i} onClick={() => handleClickItem(i)}>
                <div className="name">{x.label}</div>
                {
                  currentItem?.value === x.value && (
                    <img className="check" src={'/img/ic_dropdown_selected.svg'}/>
                  )
                }
              </Item>
            ))
          }
        </List>
      </ListWrapper>
      <CloseArea expanded={expanded} onClick={toggleExpand}/>
    </Wrapper>
  )
};

export default CategoryDropdown;
