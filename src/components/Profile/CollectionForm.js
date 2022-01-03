import styled from 'styled-components';
import PageWrapper from "../Layouts/PageWrapper";
import PageHeader from "../Layouts/PageHeader";
import TextFieldLabel from "../Widgets/TextFieldLabel";
import TextField from "../Widgets/TextField";
import GradientButton from "../Widgets/GradientButton";
import {useCallback, useEffect, useMemo, useState} from "react";
import useWallet from "../../hooks/useWallet";
import {useDispatch, useSelector} from "react-redux";
import {readAsDataURL} from "../../utils";
import produce from "immer";
import SettingNavigation from "../Widgets/SettingNavigation";
import SocialLink from "../Profile/SocialLink";
import {createCollection} from "../../utils/nft";
import {useHistory} from "react-router-dom";
import {registerCollection, updateCollection} from "../../reducers/collection";
import {SIZE_BIG} from "../../constants/dropdown";
import CategoryDropdown from "../Widgets/CategoryDropdown";
import {categoryState, fetchCategories} from "../../reducers/category";
import {PHOTO_CHANGED, PHOTO_NO_CHANGE} from "../../constants/api";
import {useAlert} from "react-alert";
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

const InputDescription = styled.div`
  font-size: 12px;
  line-height: 24px;
  color: #292929;
  margin-top: 10px;
  margin-bottom: 10px;
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

const SmallCoverImage = styled(CoverImage)`
  width: 266px;
  height: 207px;
  border-radius: 5px;
  background-color: #E5E5EA;
  overflow: hidden;
  cursor: pointer;
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
  background-color: ${p => p.bgColor ? p.bgColor : '#E5E5EA'};
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

const CollectionForm = ({collection}) => {
  const history = useHistory();
  const dispatch = useDispatch();
  const alert = useAlert();
  const { t }  = useTranslation(['common','alert']);

  const {categoriesForDropdown} = useSelector(categoryState);

  const [params, setParams] = useState({
    platform: process.env.REACT_APP_CHAIN_PLATFORM,
    chainId: process.env.REACT_APP_CHAIN_ID,
    type: 'created',
    feature: 1,
  });

  const isCreate = useMemo(() => !collection, [collection]);

  const [profilePreview, setProfilePreview] = useState('');
  const [coverPreview, setCoverPreview] = useState('');
  const [disabled, setDisabled] = useState(false);

  useWallet();

  useEffect(() => {
    if (collection) {
      setParams({
        idcollections: collection.idcollections,
        name: collection.name,
        symbol: collection.symbol,
        description: collection.description,
        facebook: collection.facebook,
        twitter: collection.twitter,
        instagram: collection.instagram,
        symbolLink_change: PHOTO_NO_CHANGE,
        banner_change: PHOTO_NO_CHANGE,
        preview_change: PHOTO_NO_CHANGE,
        categoryIdcategories: collection.categoryIdcategories,
      });

      if (collection.symbol_link) {
        setProfilePreview(collection.symbol_link);
      }

      if (collection.banner) {
        setCoverPreview(collection.banner);
      }
    }
  }, [collection]);

  const handleClickCoverChange = useCallback(() => {
    const input = document.createElement('input');
    input.type = 'file';
    input.click();
    input.onchange = (e) => {
      const file = e.target.files[0];

      readAsDataURL(file).then(setCoverPreview);
      setParams(params => ({...params, banner: file}));
    }
  }, []);

  const handleClickImageChange = useCallback(() => {
    const input = document.createElement('input');
    input.type = 'file';
    input.click();
    input.onchange = (e) => {
      const file = e.target.files[0];

      readAsDataURL(file).then(setProfilePreview);
      setParams(params => ({...params, symbolLink: file, symbolLink_change: PHOTO_CHANGED}));
    }
  }, []);

  const handleChange = useCallback((e) => {
    const key = e.target.name;
    let value = e.target.value;

    if (key === 'symbol') {
      value = value.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
    }

    setParams(produce(d => {
      d[key] = value;
    }))
  }, []);

  const handleChangeCategory = useCallback((value) => {
    setParams(produce(d => {
      d.categoryIdcategories = value
    }));
  }, []);

  const handleConfirm = useCallback(() => {
    if (!params.name) {
      return alert.error(t('COLLECTION_NAME_NEEDED'));
    }
    if (params.name < 4) {
      return alert.error(t('COLLECTION_NAME_MORE_4'));
    }
    if (!params.symbol) {
      return alert.error(t('SYMBOL_NEEDED'));
    }
    if (!params.description) {
      return alert.error(t('COLLECTION_DESCRIPTION_NEEDED'));
    }
    if (!params.categoryIdcategories) {
      return alert.error(t('SELECT_CATEGORY'));
    }

    const loadingAlert = alert.show({
      title: "Please wait a bit...",
      loading: true,
      disableBackdropClick: true
    });

    setDisabled(true);

    if (isCreate) {
      createCollection(params.name, params.symbol)
        .then(async (contractAddress) => {
          return dispatch(registerCollection({
            ...params,
            contract: contractAddress
          }));
        })
        .then(({payload, error}) => {
          if (error) {
            throw error;
          }

          alert.show(t('COLLECTION_ADDED'));
          history.replace('/profile/collections');
        })
        .finally(() => {
          setDisabled(false);
          loadingAlert.close();
        });
    } else {
      dispatch(updateCollection(params))
        .then(({payload, error}) => {
          if (error) {
            throw error;
          }

          alert.show(t('COLLECTION_EDITED'));
          history.replace('/profile/collections');
        })
        .finally(() => {
          setDisabled(false);
          loadingAlert.close();
        });
    }
  }, [params]);

  return (
    <PageWrapper hasTopNav leftMargin={'200px'}>
      <SettingNavigation hideMenu={!isCreate}/>
      <PageHeader title={isCreate ? t('CREATE_MY_COLLECTION') : t('EDIT_COLLECTION')} color={"#AF86D9"}/>
      <Content>
        <div>
          <Row>
            <TextFieldLabel tooltip={"This image will also be used for navigation.\n350x350 recommended."}>
              {t('LOGO_IMAGE')}
            </TextFieldLabel>
            <ProfileImage>
              <img className={!profilePreview ? 'empty' : ''}
                   src={profilePreview ? profilePreview : "/img/ic_profile_big.svg"}/>
              <div className="hover" onClick={handleClickImageChange}>
                <img src={"/img/ic_profile_edit.svg"}/>
                <div>{t('CHANGE_PROFILE_IMAGE')}</div>
              </div>
            </ProfileImage>
          </Row>
          <Row>
            <TextFieldLabel
              tooltip={"This image will appear at the top of your collection page. Avoid including too much text in this banner image, as the dimensions change on different devices. 1400 x 400 recommended."}>
                {t('BANNER_IMAGE')}
              </TextFieldLabel>
            <InputDescription>{t('DESCRIPTION_OF_FILE_TYPE')}</InputDescription>
            <SmallCoverImage src={coverPreview} onClick={handleClickCoverChange}>
              <div className="hover">
                <img src={"/img/ic_profile_edit.svg"}/>
                <div>{t('CHANGE_BACKGROUND')}</div>
              </div>
            </SmallCoverImage>
          </Row>
          <Row>
            <TextField label={t('COLLECTION_NAME')} name="name" value={params.name || ''} disabled={!isCreate}
                       onChange={handleChange}/>
          </Row>
          <Row>
            <TextField label={t('SYMBOL')} name="symbol" value={params.symbol || ''} disabled={!isCreate}
                       onChange={handleChange}/>
          </Row>
          <Row>
            <TextField label="URL" multiLine rows={1} name="url" value={params.url || ''} onChange={handleChange}/>
          </Row>
          <Row>
            <TextField label={t('COLLECTION_DESCRIPTION')} name="description" value={params.description || ''} onChange={handleChange}/>
          </Row>
          <Row>
            <TextFieldLabel>{t('CATEGORY')}</TextFieldLabel>
            <CategoryDropdown
              size={SIZE_BIG}
              items={categoriesForDropdown}
              defaultLabel={"Add category"}
              value={params.categoryIdcategories}
              disabled={!isCreate}
              onChange={handleChangeCategory}
            />
          </Row>
          <Row>
            <TextFieldLabel>{t('SOCIAL_LINK')}</TextFieldLabel>
            <SocialLink icon={'/img/ic_facebook.svg'} name="facebook" value={params.facebook || ''}
                        onChange={handleChange}/>
            <SocialLink icon={'/img/ic_twitter.svg'} name="twitter" value={params.twitter || ''}
                        onChange={handleChange}/>
            <SocialLink icon={'/img/ic_instagram.svg'} name="instagram" value={params.instagram || ''}
                        onChange={handleChange}/>
          </Row>
          <ConfirmButton disabled={disabled} onClick={handleConfirm}>{isCreate ? t('CREATE') : t('DONE')}</ConfirmButton>
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

export default CollectionForm;
