import styled from "styled-components";
import {Link, useHistory, useLocation} from "react-router-dom";
import {useCallback} from "react";
import { useTranslation } from 'react-i18next';

const Wrapper = styled.div`
  position: absolute;
  margin-left: -200px;
  top: 149px;
  height: calc(100% - 300px);
  border-right: 1px solid white;

  > * {
    width: 134px;
  }

  ul {
    margin-top: 118px;
    padding-left: 0;
    
    > *:not(:last-child) {
      display: block;
      margin-bottom: 24px;
    }
  }
`;

const Back = styled.div`
  padding-left: 28px;
  font-size: 14px;
  line-height: 24px;
  font-weight: 400;
  color: #535353;
  position: relative;
  cursor: pointer;

  &::before {
    position: absolute;
    content: ' ';
    left: 0;
    top: 0;
    width: 24px;
    height: 24px;
    background-image: url('/img/ic_setting_back.svg');
    background-size: contain;
  }
`;

const ListItem = styled.li`
  list-style: none;
  font-size: 14px;
  line-height: 21px;
  letter-spacing: -0.01em;
  
  ${p => p.selected && `
    color: #3B5AFE;
    font-weight: 700;
  `};

`;

const menus = [
  {
    path: '/profile/settings',
    label: 'PROFILE_SETTING'
  },
  {
    path: '/profile/collections',
    label: 'MY_COLLECTION'
  },
  {
    path: '/profile/import',
    label: 'Import'
  },
]

const SettingNavigation = ({hideMenu, ...p}) => {
  const history = useHistory();
  const {pathname} = useLocation();
  const { t }  = useTranslation(['common']);

  const handleBack = useCallback(() => {
    history.goBack();
  }, [history]);

  return (
    <Wrapper {...p}>
      <Back onClick={handleBack}>{t('BACK')}</Back>
      <ul>
        {
          !hideMenu && menus.map(x => (
            <Link key={x.path} to={x.path}>
              <ListItem key={x.path} selected={pathname === x.path}>{t(x.label)}</ListItem>
            </Link>
          ))
        }
      </ul>
    </Wrapper>
  )
};

export default SettingNavigation;
