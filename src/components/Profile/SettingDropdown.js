import styled from 'styled-components';
import RoundedDropdown from "../Widgets/RoundedDropdown";
import {profileSettings} from "../../constants/dropdown";
import {useCallback} from "react";
import {useHistory} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {removeAccessToken} from "../../utils/user";
import {userActions, userState} from "../../reducers/user";
import {clearAuthorization} from "../../utils/axios";

const Dropdown = styled(RoundedDropdown)`
  width: 263px;
  margin-left: auto;
  margin-top: -57px;

  .dropdown-thumb {
    height: 57px;

    &:not(.expanded) {
      box-shadow: none;
      background-color: transparent;

      &::after {
        background-image: url('/img/ic_profile_setting.svg');
      }
    }

    .dropdown-label {
      display: none;
    }

    &::after {
      content: ' ';
      position: absolute;
      width: 18px;
      height: 18px;
      right: 20px;
      background-image: url('/img/ic_profile_setting_on.svg');
      background-size: contain;
    }

    img {
      display: none;
    }
  }

  .dropdown-list {
    top: 57px;

    .dropdown-item {
      height: 57px;
      font-size: 18px;
      line-height: 46px;
    }
  }

`;

const SettingDropdown = ({}) => {
  const history = useHistory();
  const dispatch = useDispatch();
  const user = useSelector(userState);

  const handleChange = useCallback((value) => {
    if (value === 'logout') {
      removeAccessToken(user.address);
      clearAuthorization();
      dispatch(userActions.clearUser());
      return;
    }

    history.push(value);
  }, [history, user]);

  return (
    <Dropdown items={profileSettings} onChange={handleChange}/>
  )
};

export default SettingDropdown;
