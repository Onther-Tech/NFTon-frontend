import styled from "styled-components";
import FilterButton from "./FilterButton";
import FilterOptions, {labels} from "./FilterOptions";
import SelectedFilter from "./SelectedFilter";
import {Fragment, useCallback, useEffect, useMemo, useState} from "react";
import produce from "immer";
import GridType from "./Widgets/GridType";
import RoundedDropdown from "./Widgets/RoundedDropdown";
import {CREATE_TYPE_BUNDLE, CREATE_TYPE_SINGLE} from "./Create/ChooseType";
import {
  SORT_TYPE_MOST_LIKED,
  SORT_TYPE_PRICE_HIGH_TO_LOW,
  SORT_TYPE_PRICE_LOW_TO_HIGH,
  SORT_TYPE_RECENTLY_CREATED,
  SORT_TYPE_RECENTLY_LISTED,
  SORT_TYPE_RECENTLY_SOLD
} from "../constants/sort";
import { useTranslation } from 'react-i18next';

const Wrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

const Cell = styled.div`
  flex: 1;
  display: flex;
  align-items: center;

  ${p => p.center && `
    justify-content: center;
  `};

  ${p => p.right && `
    justify-content: flex-end;
  `};
`;

const SearchBar = styled.div`
  flex: 1;
  background: #FFFFFF;
  box-shadow: 0 7px 10px rgba(0, 0, 0, 0.05), 1px 0 10px rgba(0, 0, 0, 0.05);
  border-radius: 46px;
  position: relative;
  margin-left: 21px;

  input {
    width: 100%;
    font-size: 14px;
    line-height: 30px;
    background-color: transparent;
    outline: none;
    border: none;
    padding: 5px 15px;

    &:focus, &:not(&:invalid) {
      + .placeholder {
        opacity: 0;
      }
    }
  }

  .placeholder {
    pointer-events: none;
    user-select: none;
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    font-size: 14px;
    line-height: 30px;
    font-weight: 300;
    color: #0C33FF;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: opacity 0.1s linear;

    img {
      margin-right: 10px;
    }
  }
`;

const DropdownWrapper = styled(Cell)`
  gap: 16px;
`;

const SelectedFilterWrapper = styled.div`
  margin-top: 16px;
`;

const FilterSort = ({hideCategory, onSearch, onChangeFilter, onClickGridType, onChangeType, onChangeSort}) => {
  const [expand, setExpand] = useState(false);
  const [filter, setFilter] = useState({});
  const { t }  = useTranslation(['common']);

  useEffect(() => {
    onChangeFilter && onChangeFilter(filter);
  }, [filter, onChangeFilter]);

  const filterFlatten = useMemo(() => {
    const flatten = [];

    const types = Object.keys(filter);
    for (let type of types) {
      if (type === 'price' && filter.price.to) {
        flatten.push({
          key: 'price',
          value: `${filter.price.from} ~ ${filter.price.to}`
        });

        continue;
      }

      const entries = Object.entries(filter[type]);
      for (let [key, value] of entries) {
        if (value) {
          flatten.push({key, value});
        }
      }
    }

    return flatten;
  }, [filter]);


  const handleOpenFilter = useCallback(() => {
    setExpand(true);
  }, []);

  const handleCloseFilter = useCallback(() => {
    setExpand(false);
  }, []);

  const handleConfirmFilter = useCallback((filter) => {
    setFilter(filter);
    setExpand(false);
  }, []);

  const handleRemoveFilter = useCallback((deleteKey) => {
    if (!deleteKey) {
      setFilter({});
      return;
    }

    setFilter(produce(d => {
      if (deleteKey === 'price') {
        d.price.from = 0;
        d.price.to = 0;
      } else {
        for (let [type, items] of Object.entries(d)) {
          for (let key of Object.keys(d[type])) {
            if (key === deleteKey) {
              delete d[type][key];
              return;
            }
          }
        }
      }
    }));
  }, []);

  const itemTypes = useMemo(() => ([
    {value: 'all', label: '모든 NFTs'},
    {value: CREATE_TYPE_SINGLE, label: t('SINGLE_ITEM')},
    {value: CREATE_TYPE_BUNDLE, label: t('BUNDLE_ITEM')},
  ]), []);

  const sortTypes = useMemo(() => ([
    {value: SORT_TYPE_RECENTLY_LISTED, label: 'Recently Listed'},
    {value: SORT_TYPE_RECENTLY_CREATED, label: t('RECENTLY_CREATED')},
    {value: SORT_TYPE_RECENTLY_SOLD, label: t('RECENTLY_SOLD')},
    // {value: SORT_TYPE_PRICE_LOW_TO_HIGH, label: t('PRICE_LOW_TO_HIGH')},
    // {value: SORT_TYPE_PRICE_HIGH_TO_LOW, label: t('PRICE_HIGH_TO_LOW')},
    {value: SORT_TYPE_MOST_LIKED, label: t('MOST_LIKED')},
    // {value: SORT_TYPE_MOST_VIEWED, label: t('MOST_VIEWED')},
  ]), []);

  const handleChangeSearch = useCallback((e) => {
    onSearch && onSearch(e.target.value)
  }, [onSearch]);

  return (
    <Fragment>
      <Wrapper>
        <Cell>
          <FilterButton onClick={handleOpenFilter}/>
          <FilterOptions hideCategory={hideCategory} expand={expand} selectedFilter={filter} onClose={handleCloseFilter}
                         onConfirm={handleConfirmFilter}/>
          {
            onSearch && (
              <Cell>
                <SearchBar>
                  <input required onChange={handleChangeSearch}/>
                  <div className="placeholder">
                    <img src={"/img/ic_collection_search.svg"}/>
                    Search
                  </div>
                </SearchBar>
              </Cell>
            )
          }
        </Cell>
        {
          onClickGridType && (
            <GridType center onClick={onClickGridType}/>
          )
        }
        <DropdownWrapper right>
          {/*<RoundedDropdown items={itemTypes} onChange={onChangeType}/>*/}
          <RoundedDropdown items={sortTypes} defaultLabel={t('SORT')} onChange={onChangeSort}/>
        </DropdownWrapper>
      </Wrapper>
      <SelectedFilterWrapper>
        {
          filterFlatten.map((x, i) => (
            <SelectedFilter key={i} onClick={() => handleRemoveFilter(x.key)}>
              {x.key === 'price' ? x.value : labels[x.key] || x.key}
            </SelectedFilter>
          ))
        }
        {
          filterFlatten.length > 0 && (
            <SelectedFilter clearAll onClick={() => handleRemoveFilter()}>Clear all</SelectedFilter>
          )
        }
      </SelectedFilterWrapper>
    </Fragment>

  )
};

export default FilterSort;
