import styled from "styled-components";
import {Link} from "react-router-dom";
import {COMMUNITY_LIST} from "../../constants/community";
import { useTranslation } from 'react-i18next';


const Wrapper = styled.div`
  width: 100%;
  min-width: 1162px;
  background-color: #E5E5EA;
  position: absolute;
  left: 0;
  margin-top: 135px;
`;

const Row = styled.div`
  width: 1162px;
  margin: 80px auto 0 auto;
  position: relative;
  left: 0;
  top: 0;
  border-bottom: 1px solid #FFFFFF;
  padding-bottom: 60px;

  ${p => p.flex && `
    display: flex;
    justify-content: space-between;
  `};

  &:last-child {
    border-bottom: none;
  }
`;


const FooterSectionTitle = styled.div`
  font-size: 19px;
  color: #151515;
  line-height: 24px;
  letter-spacing: -0.0043em;
  margin-bottom: 24px;
  font-weight: 600;
`;

const Subscribe = styled.div`
  > input {
    width: 461px;
    height: 40px;
    padding: 8px 16px;
    font-size: 12px;
    line-height: 24px;
    background-color: #F2F2F7;
    border-radius: 4px;
    border: none;

    &::placeholder {
      color: #8E8E93;
    }
  }

  > button {
    width: 97px;
    height: 40px;
    padding: 8px;
    font-size: 19px;
    line-height: 1;
    font-weight: 600;
    letter-spacing: -0.0043em;
    color: #FAFAFA;
    background-color: #8E8E93;
    border: none;
    border-radius: 4px;
    margin-left: 24px;
    vertical-align: middle;
  }
`;

const SocialLink = styled.div`
  a {
    &:not(:last-child) {
      margin-right: 14px;
    }
  }
`;

const Intro = styled.div`
  width: 267px;
  margin-right: 121px;

  > div {
    &:first-child {
      font-size: 16px;
      font-weight: 800;
      line-height: 24px;
      color: #151515;
    }

    &:last-child {
      font-size: 12px;
      color: #000000;
      line-height: 16px;
      margin-top: 12px;
    }
  }
`;

const Menu = styled.div`
  display: flex;
  flex: 1;
  justify-content: space-between;

  > .column {
    > .title {
      font-size: 14px;
      line-height: 21px;
      font-weight: 600;
      color: #000000;
    }
  }
`;

const MenuList = styled.ul`
  margin-top: 24px;
  margin-bottom: 0;
  padding: 0;

  ${p => !p.autoHeight && `
    height: 144px;
    margin-bottom: 40px;
  `};

  li {
    font-size: 12px;
    color: #000000;
    list-style: none;

    &:not(:last-child) {
      margin-bottom: 16px;
    }
  }
`;

const Copyright = styled.div`
  display: flex;
  align-items: center;
  margin-top: -20px;

  > div {
    flex: 1;
    font-size: 12px;

    &:last-child {
      text-align: right;
    }

    a {
      padding: 0 10px;
      font-size: 12px;

      &:not(:last-child) {
        border-right: 1px solid rgba(0, 0, 0, 0.5);
      }
    }
  }
`;


const Footer = () => {

  const { t }  = useTranslation(['common']);
  return (
    <Wrapper>
      <Row flex>
        {/*
        <Subscribe>
          <FooterSectionTitle>NFTon.의 가장 최신 소식을 받아보세요.</FooterSectionTitle>
          <input type="email" placeholder="Your email"/>
          <button>구독</button>
        </Subscribe>
        */}
        <SocialLink>
          <FooterSectionTitle>Join our community</FooterSectionTitle>
          {
            COMMUNITY_LIST.map((x, i) => (
              <a key={i} href={x.link}>
                <img src={x.image.replace('community', 'footer')}/>
              </a>
            ))
          }
        </SocialLink>
      </Row>
      <Row flex>
        <Intro>
          <div>NFTon</div>
          <div>© 2021 Onther PTE. LTD.</div>
        </Intro>
        <Menu>
          <div className="column">
            <div className="title">Marketplace</div>
            <MenuList>
              <li><Link to={'/marketplace/all'}>{t('ALL_NFT')}</Link></li>
              <li><Link to={'/marketplace/art'}>{t('ART')}</Link></li>
              <li><Link to={'/marketplace/sports'}>{t('SPORTS')}</Link></li>
              <li><Link to={'/marketplace/gaming'}>{t('GAMING')}</Link></li>
              <li><Link to={'/marketplace/music'}>{t('MUSIC')}</Link></li>
            </MenuList>
          </div>
          <div className="column">
            <div className="title">My Account</div>
            <MenuList>
              <li><Link to={'/profile'}>{t('MY_PROFILE')}</Link></li>
              <li><Link to={'/profile/favorite'}>Favorite</Link></li>
              <li><Link to={'/profile/collections'}>My Collections</Link></li>
              <li><Link to={'/profile/settings'}>{t('SETTING')}</Link></li>
            </MenuList>
            <div className="title">Community</div>
          </div>
          <div className="column">
            <div className="title">Create</div>
            <MenuList>
              <li><Link to={'/create/single'}>{t('SINGLE_NFT')}</Link></li>
              <li><Link to={'/create/bundle'}>{t('BUNDLE_NFT')}</Link></li>
            </MenuList>
            <div className="title">Stats</div>
            <MenuList autoHeight>
              <li><Link to={'/stats'}>{t('RANKING')}</Link></li>
            </MenuList>
          </div>
          <div className="column">
            <div className="title">Company</div>
            <MenuList>
              <li><Link to={'/'}>About</Link></li>
            </MenuList>
          </div>
        </Menu>
      </Row>
      <Row>
        <Copyright>
          <div>2021 NFTon. All Rights Reserved.</div>
          <div>
            <a>{t('CHECK_BUSSINESS_LICENSE')}</a>
            <a>{t('TERMS')}</a>
          </div>
        </Copyright>
      </Row>
    </Wrapper>
  )
};

export default Footer;
