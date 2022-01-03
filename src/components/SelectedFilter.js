import styled from "styled-components";

const Wrapper = styled.div`
  display: inline-flex;
  background: #FFFFFF;
  border: 1px solid #C4C4C4;
  border-radius: 32px;
  padding: 4px 13px;
  font-size: 12px;
  line-height: 22px;
  color: #545454;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  
  &:not(:last-child) {
    margin-right: 10px;
  }
  
  img {
    width: 12px;
    height: 12px;
    margin-left: 4px;
  }
`;

const SelectedFilter = ({children, clearAll, onClick}) => {
  return (
    <Wrapper onClick={onClick}>
      {children}
      {
        !clearAll && (
          <img src={"/img/ic_filter_delete.svg"} />
        )
      }
    </Wrapper>
  )
};

export default SelectedFilter;
