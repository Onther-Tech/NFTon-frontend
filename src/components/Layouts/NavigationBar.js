import styled from "styled-components";
import {Link, useLocation, Image} from "react-router-dom";
import { useTranslation } from 'react-i18next';

export const HEIGHT = '70px';

const Wrapper = styled.nav`
  width: 100%;
  min-width: 1140px;
  height: ${HEIGHT};
  backdrop-filter: blur(86px);
  position: absolute;
  left: 0;
  top: 0;
  z-index: 10;
  background: rgba(255, 255, 255, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;

  &::before {
    content: ' ';
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    mix-blend-mode: soft-light;
  }
`;

const Content = styled.div`
  width: 1140px;
  margin: 0 auto;
  padding-left: 20px;
  display: flex;
  align-items: center;
`;

const Title = styled.div`
  font-size: 16px;
  font-weight: 800;
  line-height: 24px;
  text-shadow: 0px 1px 3px rgba(0, 0, 0, 0.35);
  color: #ffffff;
`;

const SearchBar = styled.div`
  width: 382px;
  padding: 0 19px;
  display: flex;
  align-items: center;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 25px;
  margin-left: 44px;
  margin-top: 16px;
  margin-bottom: 16px;

  input {
    width: 100%;
    height: 100%;
    border: none;
    outline: none;
    padding: 7px 0;
    font-size: 14px;
    line-height: 24px;
    font-weight: 300;
    background-color: transparent;
    margin-left: 13px;
    color: #ffffff;

    &::placeholder {
      color: rgba(255, 255, 255, 0.7);
    }
  }
`;

const SearchBarIcon = styled.img`
  display: inline-block;
  width: 18px;
  height: 18px;
  margin: 10px 0;
`;

const Menu = styled.div`
  flex: 1;
  list-style: none;
  display: flex;
  justify-content: flex-end;
  user-select: none;

  .flag {
    width: 30px;
    cursor: pointer;
  }

  a {
    padding: 0 15px;
    color: #ffffff;
    font-size: 16px;
    font-weight: 500;
    line-height: 19px;
    display: flex;
    align-items: center;
    cursor: pointer;


    img {
      width: 29px;
      height: 29px;
    }
  }
`;

const StyledLink = styled(Link)`
  position: relative;

  ${p => p.selected && `
    text-shadow: 0 1px 3px #00000059;
  `};

  &::before {
    content: ' ';
    position: absolute;
    left: calc(50% - 30px);
    top: calc(50% - 10px);
    width: 60px;
    height: 20px;
    border: 2px solid #45FF79;
    border-radius: 50%;
    transform: matrix(0.95, -0.21, 0.31, 0.97, 0, 0);
    opacity: ${p => p.selected ? 1 : 0};
    z-index: -1;
  }
`;


const NavigationBar = () => {
  const {pathname} = useLocation();
  const { i18n } = useTranslation();

  const changeLanguage = () => {
    if (i18n.language === 'ko') {
      i18n.changeLanguage("en");
    } else {
      i18n.changeLanguage("ko");
    }
  }

  return (
    <Wrapper>
      <Content>
        <Link to={"/"}>
          <Title>NFTon.</Title>
        </Link>
        {/*
        <SearchBar>
          <SearchBarIcon src={"/img/ic_nav_search.svg"}/>
          <input placeholder={"Collection, item or user"}/>
        </SearchBar>
        */}
        <Menu>
          <StyledLink to={"/marketplace"} selected={pathname.startsWith('/marketplace')}>Marketplace</StyledLink>
          {/*<StyledLink to={"/stats"} selected={pathname.startsWith('/stats')}>Stats</StyledLink>*/}
          <StyledLink to={"/community"} selected={pathname.startsWith('/community')}>Community</StyledLink>
          <StyledLink to={"/create"} selected={pathname.startsWith('/create')}>Create</StyledLink>
          {/*<Link to={"/cart"} ><img src={`/img/ic_nav_cart${pathname.startsWith('/cart') ? '_on' : ''}.png`}/></Link>*/}
          <Link to={"/profile"}>
            <img src={`/img/ic_nav_user${pathname.startsWith('/profile') ? '_on' : ''}.png`} />
          </Link>
          <img className="flag" onClick={changeLanguage} src={`/img/ic_nav_flag_${i18n.language}.png`}/>

        </Menu>
      </Content>
    </Wrapper>
  )
};

export default NavigationBar;
