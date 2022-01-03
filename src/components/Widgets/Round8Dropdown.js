import styled from "styled-components";
import RoundedDropdown from "./RoundedDropdown";
import {chartPeriods} from "../../constants/dropdown";
import {useCallback} from "react";

const Dropdown = styled(RoundedDropdown)`

  .dropdown-thumb {
    height: auto;
    padding: 0 9px;
    background-color: #FFFFFF;
    border-radius: 8px;
    box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.04);

    &.expanded {
      border-radius: 8px 8px 0 0;
    }

    .dropdown-label {
      color: #151515;
      font-size: 18px;
      line-height: 46px;
    }
  }

  .dropdown-item {
    background-color: #FFFFFF;
    border-radius: 0;
    color: #535353;
    font-size: 18px;
    line-height: 46px;

    &:last-child {
      border-radius: 0 0 8px 8px;
    }
  }
`;


const Round8Dropdown = ({value, ...p}) => {
  const handleChange = useCallback(() => {

  }, []);

  return (
    <Dropdown items={chartPeriods} value={value} onChange={handleChange} {...p}/>
  )
};

export default Round8Dropdown
