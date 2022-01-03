import styled from "styled-components";
import {useCallback} from "react";

const Wrapper = styled.div`
  width: 46px;
  height: 24px;
  position: relative;
  border-radius: 49px;
  background-color: #AEAEB2;
  cursor: pointer;
  transition: transform 0.1s ease-in-out;
  
  ${p => p.checked && `
    background-color: #6D84FF;
    
    .switch-thumb {
      transform: translateX(calc(100% + 2px));
    }
  `};
`;

const Thumb = styled.div`
  position: absolute;
  top: 2px;
  left: 2px;
  width: 20px;
  height: 20px;
  background: #FFFFFF;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15), 0 1px 1px rgba(0, 0, 0, 0.08);
  border-radius: 50%;
  transform: translateX(0);
  transition: transform 0.1s ease-in-out;
`;

const Switch = ({checked, onChange}) => {
  const handleChange = useCallback(() => {
    onChange && onChange(!checked)
  }, [checked, onChange]);

  return (
    <Wrapper checked={checked} onClick={handleChange}>
      <Thumb className="switch-thumb"/>
    </Wrapper>
  )
};

export default Switch;
