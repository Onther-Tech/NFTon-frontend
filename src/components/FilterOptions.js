import styled from "styled-components";
import FilterButton from "./FilterButton";
import {useCallback, useEffect, useMemo, useState} from "react";
import produce from "immer";
import GradientButton from "./Widgets/GradientButton";
import {useSelector} from "react-redux";
import {categoryState} from "../reducers/category";

const Wrapper = styled.div`
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  background: rgba(255, 255, 255, 0.85);
  border: 2px solid #E5E5EA;
  backdrop-filter: blur(80px);
  border-radius: 21px;
  opacity: 0;
  transition: opacity 0.2s ease-in-out;
  transform: scale(0);
  padding: 84px 70px 10px;
  z-index: 1;

  ${p => p.expand && `
    opacity: 1;
    transform: scale(1);
  `};
`;

const CloseButton = styled(FilterButton)`
  background: transparent !important;
  color: #000000 !important;
  position: absolute;
  left: -2px;
  top: -2px;
  border: none;
`;

const ConfirmButton = styled(GradientButton)`
  position: absolute;
  right: 70px;
  bottom: 30px;
`;

const Row = styled.div`
  display: flex;
  align-items: center;
  font-size: 14px;
  line-height: 30px;
  margin-bottom: 20px;

  label {
    width: 92px;
    color: #545454;
    user-select: none;
  }

  input {
    width: 100px;
    height: 30px;
    padding: 0 10px;
    background: #FFFFFF;
    border-radius: 5px;
    border: none;
    outline: none;
  }

  .to {
    margin: 0 15px;
    color: #B0B0B0;
    user-select: none;
  }
`;

const Item = styled.div`
  margin-right: 20px;
  cursor: pointer;
  color: #000000;
  user-select: none;

  ${p => p.selected && `
    color: #0C33FF;
    text-decoration: underline;
  `};
`;

export const labels = {
  categories: 'Categories',
  fileTypes: 'File Types',
  saleTypes: 'Sale Types',
  unit: 'On Sale In',
  price: 'Price',
  image: 'Image',
  video: 'Video',
  audio: 'Audio',
  fixedPrice: 'Fixed Price',
  auction: 'Auction',
  ethereum: 'Ethereum',
  polygon: 'Polygon',
  klaytn: 'Klaytn'
};

const FilterOptions = ({hideCategory, expand, selectedFilter, onClose, onConfirm}) => {
  const {categories} = useSelector(categoryState);

  const [filter, setFilter] = useState({});

  useEffect(() => {
    setFilter(selectedFilter);
  }, [expand, selectedFilter]);

  const options = useMemo(() => {
    let arr = [
      {
        type: 'fileTypes',
        items: [
          'image',
          'video',
          'audio',
        ]
      },
      {
        type: 'saleTypes',
        items: [
          'fixedPrice',
        ]
      },
      {
        type: 'unit',
        items: [
          'TON',
          'ETH',
          'TOS',
          'DOC'
        ]
      }
    ];

    if (!hideCategory) {
      arr.unshift({
        type: 'categories',
        items: categories.map(x => x.name)
      });
    }

    return arr;
  }, [hideCategory, categories]);

  const handleClickItem = useCallback((type, key) => {
    setFilter(produce(d => {
      if (!d[type]) {
        d[type] = {};
      }

      if (!d[type][key]) {
        d[type][key] = true;
      } else {
        delete d[type][key];
      }
    }));
  }, []);

  const handleChangeFrom = useCallback((e) => {
    setFilter(produce(d => {
      if (!d.price) {
        d.price = {
          from: 0,
          to: 0
        };
      }

      d.price.from = e.target.value;
    }));
  }, []);

  const handleChangeTo = useCallback((e) => {
    setFilter(produce(d => {
      if (!d.price) {
        d.price = {
          from: 0,
          to: 0
        };
      }

      d.price.to = e.target.value;
    }));
  }, []);

  const handleConfirm = useCallback(() => {
    onConfirm && onConfirm(filter);
  }, [filter, onConfirm]);

  return (
    <Wrapper expand={expand}>
      <CloseButton icon={"/img/ic_filter_open_b.svg"} onClick={onClose}/>
      {
        options.map((option, i) => (
          <Row key={i}>
            <label>{labels[option.type]}</label>
            {
              option.items.map((item, i) => {
                const selected = filter[option.type] ? filter[option.type][item] : false;
                return (
                  <Item key={i} selected={selected} onClick={() => handleClickItem(option.type, item)}>
                    {labels[item] || item}
                  </Item>
                )
              })
            }
          </Row>
        ))
      }
      <Row>
        <label>Price</label>
        <input type="number" placeholder={"Min"} value={filter.price?.from || ''} onChange={handleChangeFrom}/>
        <span className="to">to</span>
        <input type="number" placeholder={"Max"} value={filter.price?.to || ''} onChange={handleChangeTo}/>
      </Row>
      <ConfirmButton onClick={handleConfirm}>OK</ConfirmButton>
    </Wrapper>
  )
};

export default FilterOptions
