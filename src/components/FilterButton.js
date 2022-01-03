import styled from "styled-components";
import GradientButton from "./Widgets/GradientButton";

const Wrapper = styled(GradientButton)`
  width: 140px;
  height: 42px;
  padding: 6px 16px;
  position: relative;
  font-weight: 700;
  font-size: 14px;

  img {
    width: 16px;
    height: 16px;
    margin-left: 15px;
  }

  ${p => !p.active && `
    background-image: none;
    background-color: transparent;
    border: 1px solid #000000;
    color: #151515;
  `};
`;


const FilterButton = ({active, icon, ...p}) => {
  return (
    <Wrapper active={active} {...p} >
      Filters <img src={icon || `/img/ic_filter_open_${active ? 'w' : 'b'}.svg`}/>
    </Wrapper>
  )
};

export default FilterButton;
