import styled from "styled-components";

const Wrapper = styled.div`
  background: #F2F2F7;
  height: 100px;
  border: 1px solid #E5E5EA;
  box-sizing: border-box;
  border-radius: 25px;
  padding: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
`;

const TypeText = styled.div`
  font-size: 14px;
  line-height: 18px;
  color: #8E8E93;
  margin-bottom: 4px;
`;

const ValueText = styled.div`
  font-size: 18px;
  line-height: 23px;
  font-weight: 600;
  color: #000000;
`;

const Property = ({type, value, ...p}) => {
  return (
    <Wrapper {...p}>
      <TypeText>{type}</TypeText>
      <ValueText>{value}</ValueText>
    </Wrapper>
  )
};

export default Property;
