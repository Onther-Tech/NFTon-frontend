import styled from "styled-components";
import {Link, useLocation} from "react-router-dom";
import { useTranslation } from 'react-i18next';

export const CREATE_TYPE_SINGLE = 'single';
export const CREATE_TYPE_BUNDLE = 'bundle';

const Wrapper = styled.div`
  display: flex;
  gap: 120px;
  align-items: center;
  justify-content: center;
`;

const Item = styled(Link)`
  img {
    width: 267px;
    height: 424px;
  }
`;

const Label = styled.div`
  background: #FAFAFA;
  border-radius: 40px;
  padding: 15px 30px;
  font-size: 24px;
  line-height: 28px;
  color: #151515;
  margin-top: 60px;
  text-align: center;
`;

const ChooseType = () => {
  const { t }  = useTranslation(['common']);
  const {pathname} = useLocation();

  return (
    <Wrapper>
      <Item to={{pathname: pathname + '/' + CREATE_TYPE_SINGLE}}>
        <img src={"/img/create_single.png"}/>
        <Label>{t('CREATE_SINGLE_NFT')}</Label>
      </Item>
      {/*
      <Item to={{pathname: pathname + '/' + CREATE_TYPE_BUNDLE}}>
        <img src={"/img/create_bundle.png"}/>
        <Label>{t('CREATE_BUNDLE_NFT')}</Label>
      </Item>
      */}
    </Wrapper>
  )
};

export default ChooseType;
