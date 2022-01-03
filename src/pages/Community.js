import styled from 'styled-components';
import PageWrapper from "../components/Layouts/PageWrapper";
import PageHeader from "../components/Layouts/PageHeader";
import {COMMUNITY_LIST} from "../constants/community";

const Content = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 30px 0 10px;
`;

const Item = styled.div`
  text-align: center;
  padding: 0 20px;
  > img {
    width: 60px;
    height: 60px;
    margin-bottom: 16px;
  }
  
  > div {
    width: 100px;
    font-weight: 500;
    font-size: 22px;
    line-height: 26px;
    text-align: center;
    color: #8E8E93;
  }
`;


const Community = () => {
  return (
    <PageWrapper hasTopNav>
      <PageHeader title={"Community"} description={" "} color={"#E73535"}/>
      <Content>
        {
          COMMUNITY_LIST.map(x => (
            <a key={x.link} href={x.link} target="_blank">
              <Item>
                <img src={x.image}/>
                <div>{x.name}</div>
              </Item>
            </a>
          ))
        }
      </Content>
    </PageWrapper>
  )
};

export default Community;
