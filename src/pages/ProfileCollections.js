import styled from 'styled-components';
import PageWrapper from "../components/Layouts/PageWrapper";
import PageHeader from "../components/Layouts/PageHeader";
import SettingNavigation from "../components/Widgets/SettingNavigation";
import {Link, useHistory} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {collectionState, fetchMyCollections} from "../reducers/collection";
import {useEffect} from "react";
import useWalletRequired from "../hooks/useWalletRequired";
import {userState} from "../reducers/user";
import {breakLine} from "../utils";
import { useTranslation } from 'react-i18next';


const CollectionList = styled.div`
  margin-bottom: 27px;

  > *:not(:last-child) {
    margin-bottom: 27px;
  }
`;

const CollectionItem = styled.div`
  display: flex;
  flex-direction: column;
  height: 267px;
  background: linear-gradient(178.04deg, #F9F9F9 9.17%, #FFFFFF 98.52%);
  border-radius: 25px;
  padding: 44px 27px 44px calc(267px + 27px);
  position: relative;
`;

const CollectionImage = styled.div`
  position: absolute;
  left: 0;
  top: 0;
  width: 267px;
  height: 267px;
  border-radius: 25px;
  object-fit: cover;
  overflow: hidden;
  background-color: #E5E5EA;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const CollectionName = styled.div`
  display: flex;

  > span {
    flex: 1;
    font-size: 33px;
    line-height: 28px;
    font-weight: 700;
    color: #000000;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  > .buttons {
    display: flex;
    align-items: center;
    justify-content: center;

    > a {
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;

      img {
        margin-right: 4px;
      }

      &:not(:last-child) {
        margin-right: 27px;
      }
    }
  }
`;

const CollectionDesc = styled.div`
  font-size: 18px;
  line-height: 28px;
  color: #535353;
  flex: 1;
  margin-top: 20px;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const AddCollectionButton = styled.div`
  padding: 30px;
  font-size: 22px;
  line-height: 28px;
  color: #3B5AFE;
  border-radius: 25px;
  border: 2px solid #CED6FF;
  display: flex;
  align-items: center;
  justify-content: center;

  img {
    margin-right: 20px;
  }
`;


const ProfileCollections = ({}) => {
  const history = useHistory();
  const dispatch = useDispatch();

  const {address} = useSelector(userState);
  const {collections} = useSelector(collectionState);
  const { t }  = useTranslation(['common']);

  useWalletRequired(true);
  useEffect(() =>{
    if(address) {
      dispatch(fetchMyCollections({address}));
    }
  }, [address]);

  return (
    <PageWrapper hasTopNav leftMargin={'200px'}>
      <SettingNavigation/>
      <PageHeader title={t('MY_COLLECTION')} color={"#AF86D9"}/>
      <CollectionList>
        {
          collections.map(x => (
            <CollectionItem key={x.idcollections}>
              <CollectionImage>
                {
                  x.symbol_link && (
                    <img src={x.symbol_link} />
                  )
                }
              </CollectionImage>
              <CollectionName>
                <span>{x.name}</span>
                <div className={"buttons"}>
                  <Link to={{pathname: "/profile/collections/modify/" + x.idcollections, state: {collection: x}}}>
                    <img src={"/img/ic_collection_edit.svg"}/>
                    {t('EDIT')}
                  </Link>
                  <Link to={"/marketplace/collection/" + x.contract}>
                    <img src={"/img/ic_collection_visit.svg"}/>
                    {t('VISIT')}
                  </Link>
                </div>
              </CollectionName>
              <CollectionDesc>{breakLine(x.description)}</CollectionDesc>
            </CollectionItem>
          ))
        }
      </CollectionList>
      <Link to={"/profile/collections/create"}>
        <AddCollectionButton>
          <img src={"/img/ic_collections_add.svg"}/>
          {t('CREATE_NEW_COLLECTION')}
        </AddCollectionButton>
      </Link>
    </PageWrapper>
  )
};

export default ProfileCollections;
