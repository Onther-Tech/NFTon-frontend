import styled from 'styled-components';
import PageWrapper from "../components/Layouts/PageWrapper";
import PageHeader from "../components/Layouts/PageHeader";
import TextFieldLabel from "../components/Widgets/TextFieldLabel";
import TextField from "../components/Widgets/TextField";
import GradientButton from "../components/Widgets/GradientButton";
import {useCallback, useEffect, useState} from "react";
import useWallet from "../hooks/useWallet";
import {useDispatch, useSelector} from "react-redux";
import {updateProfile, userState} from "../reducers/user";
import {isNull, readAsDataURL} from "../utils";
import produce from "immer";
import SettingNavigation from "../components/Widgets/SettingNavigation";
import SocialLink from "../components/Profile/SocialLink";
import {useHistory} from "react-router-dom";
import {PHOTO_CHANGED} from "../constants/api";
import { useTranslation } from 'react-i18next';


const Content = styled.div`
  display: flex;
  position: relative;
  gap: 24px;

  > div {
    flex: 1;
  }
`;

const Row = styled.div`
  margin-bottom: 50px;
`;


const ConfirmButton = styled(GradientButton)`
  margin-left: auto;
  font-weight: 400;
  font-size: 19px;
  line-height: 30px;
`;

const CoverImage = styled.div`
  width: 100%;
  height: 358px;
  background-color: #E5E5EA;
  background-image: url('${p => p.src}');
  background-size: cover;
  position: relative;

  &:not(:hover) {
    > .hover {
      display: none;
    }
  }

  &:hover {
    &::before {
      position: absolute;
      content: ' ';
      width: 100%;
      height: 100%;
      top: 0;
      left: 0;
      background-color: rgba(0, 0, 0, 0.5);
      z-index: 0;
    }
  }

  > .hover {
    position: relative;
    display: flex;
    padding: 19px;
    cursor: pointer;
    z-index: 1;

    div {
      color: #FFFFFF;
      font-size: 12px;
      line-height: 24px;
      margin-left: 7px;
    }
  }
`;

const ProfileBox = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 315px;
  background: rgba(250, 250, 250, 0.05);
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1), inset 0px 0px 68px rgba(255, 255, 255, 0.05), inset 0px 4px 4px rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(86px);
  border-radius: 20px;
  margin: -181px auto 0 auto;
  padding: 80px 0;
`;

const ProfileImage = styled.div`
  width: 170px;
  height: 170px;
  border-radius: 50%;
  overflow: hidden;
  background-color: #F2F2F7;
  position: relative;
  cursor: pointer;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;

    &.empty {
      object-fit: initial;
      padding: 31px;
    }
  }

  &:not(:hover) {
    > .hover {
      display: none;
    }
  }

  > .hover {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;

    img {
      width: 18px;
      height: 18px;
    }

    div {
      color: #FFFFFF;
      font-size: 12px;
      line-height: 24px;
      margin-top: 7px;
    }

    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
  }
`;

const ProfileSettings = ({}) => {
  const { t }  = useTranslation(['common']);
  const history = useHistory();
  const dispatch = useDispatch();

  const {me} = useSelector(userState);

  const [params, setParams] = useState({});

  const [profilePreview, setProfilePreview] = useState('');
  const [coverPreview, setCoverPreview] = useState('');

  useWallet(true);

  useEffect(() => {
    if (me.photo) {
      setProfilePreview(me.photo);
    }

    if (me.cover) {
      setCoverPreview(me.cover);
    }
  }, [me]);

  const handleClickCoverChange = useCallback(() => {
    const input = document.createElement('input');
    input.type = 'file';
    input.click();
    input.onchange = (e) => {
      const file = e.target.files[0];

      readAsDataURL(file).then(setCoverPreview);
      setParams(params => ({...params, cover: file, cover_change: PHOTO_CHANGED}));
    }
  }, []);

  const handleClickImageChange = useCallback(() => {
    const input = document.createElement('input');
    input.type = 'file';
    input.click();
    input.onchange = (e) => {
      const file = e.target.files[0];

      readAsDataURL(file).then(setProfilePreview);
      setParams(params => ({...params, attachment: file, photo_change: PHOTO_CHANGED}));
    }
  }, []);

  const handleChange = useCallback((e) => {
    const key = e.target.name;
    const value = e.target.value;

    setParams(produce(d => {
      d[key] = value;
    }))
  }, []);

  const handleConfirm = useCallback(() => {
    const merged = {...me, ...params};

    for (let key in merged) {
      if (isNull(merged[key]))
        merged[key] = '';
    }

    dispatch(updateProfile(merged)).then((res) => {
      history.replace('/profile');
    });
  }, [me, params]);

  return (
    <PageWrapper hasTopNav leftMargin={'200px'}>
      <SettingNavigation/>
      <PageHeader title={t('PROFILE_SETTING')} color={"#AF86D9"}/>
      <Content>
        <div>
          <Row>
            <TextField label={t('NICKNAME')} name="user_name" defaultValue={me.user_name} onChange={handleChange}/>
          </Row>
          <Row>
            <TextField label={t('BIO')} multiLine rows={1} name="bio" defaultValue={me.bio} onChange={handleChange}/>
          </Row>
          <Row>
            <TextField label={t('EMAIL')} type={"email"} name="email" defaultValue={me.email} onChange={handleChange}/>
          </Row>
          <Row>
            <TextField label={t('EXTERNAL_LINK')} type={"url"} name="website" defaultValue={me.website} onChange={handleChange}/>
          </Row>
          <Row>
            <TextFieldLabel>{t('SOCIAL_LINK')}</TextFieldLabel>
            <SocialLink icon={'/img/ic_facebook.svg'} name="facebook" defaultValue={me.facebook}
                        onChange={handleChange}/>
            <SocialLink icon={'/img/ic_twitter.svg'} name="twitter" defaultValue={me.twitter}
                        onChange={handleChange}/>
            <SocialLink icon={'/img/ic_instagram.svg'} name="instagram" defaultValue={me.instagram}
                        onChange={handleChange}/>
          </Row>
          <ConfirmButton onClick={handleConfirm}>{t('CONFIRM')}</ConfirmButton>
        </div>
        <div>
          <TextFieldLabel>{t('PREVIEW')}</TextFieldLabel>
          <CoverImage src={coverPreview}>
            <div className="hover" onClick={handleClickCoverChange}>
              <img src={"/img/ic_profile_edit.svg"}/>
              <div>{t('CHANGE_BACKGROUND')}</div>
            </div>
          </CoverImage>
          <ProfileBox>
            <ProfileImage>
              <img className={!profilePreview ? 'empty' : ''}
                   src={profilePreview ? profilePreview : "/img/ic_profile_big.svg"}/>
              <div className="hover" onClick={handleClickImageChange}>
                <img src={"/img/ic_profile_edit.svg"}/>
                <div>{t('CHANGE_PROFILE_IMAGE')}</div>
              </div>
            </ProfileImage>
          </ProfileBox>
        </div>
      </Content>
    </PageWrapper>
  )
};

export default ProfileSettings;
