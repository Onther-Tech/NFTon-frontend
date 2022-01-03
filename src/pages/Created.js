import PageWrapper from "../components/Layouts/PageWrapper";
import PageHeader from "../components/Layouts/PageHeader";
import {Link, useHistory, useLocation} from "react-router-dom";
import {useEffect} from "react";
import styled from "styled-components";
import CardItem from "../components/Widgets/CardItem";

const Content = styled.div`
  margin-top: 50px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const CardWrapper = styled.div`
  width: 267px;
`;

const RevealButton = styled.div`
  background: #FAFAFA;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.04);
  border-radius: 46px;
  padding: 12px 50px;
  font-size: 19px;
  line-height: 30px;
  display: inline-block;
  color: #8E8E93;
  margin-top: 40px;
  cursor: pointer;
  user-select: none;

  &:hover {
    color: #151515;

  }
`;

const Created = () => {
  const history = useHistory();

  const {state} = useLocation();

  useEffect(() => {
    if (!state) {
      history.goBack();
    }
  }, [history, state]);

  return (
    <PageWrapper hasTopNav>
      <PageHeader title={"NFT 생성이 성공적으로\n완료되었습니다."} color={"#009B76"} description={" "}/>
      <Content>
        <CardWrapper>
          <CardItem
            contract={state.collection?.contract}
            tokenId={state.tokenId}
            metadata={state.metadata}
            order={state.order}
            collectionName={state.collection?.name}
          />
        </CardWrapper>
        <Link to={'/profile'}>
          <RevealButton>내 프로필에서 바로 확인하기</RevealButton>
        </Link>
      </Content>
    </PageWrapper>
  )
};

export default Created;
