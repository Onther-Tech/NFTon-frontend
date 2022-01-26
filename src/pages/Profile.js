import PageWrapper from "../components/Layouts/PageWrapper";
import styled from "styled-components";
import FilterSort from "../components/FilterSort";
import CardList from "../components/Layouts/CardList";
import {useEffect, useMemo, useState} from "react";
import PageTab from "../components/Widgets/PageTab";
import SettingDropdown from "../components/Profile/SettingDropdown";
import useWalletRequired from "../hooks/useWalletRequired";
import {useDispatch, useSelector} from "react-redux";
import {fetchExchangeEvent, fetchFavoriteOrders, fetchProfile, userActions, userState} from "../reducers/user";
import {useRouteMatch} from "react-router-dom";
import {collectionState, fetchLinkedContracts, fetchMyCollections} from "../reducers/collection";
import {getOwnedTokensOfCollection, getTokenInfo} from "../utils/nft";
import {commonCollection} from "../constants/contract";
import {isNull, isSameAddress} from "../utils";
import useDispatchUnmount from "../hooks/useDispatchUnmount";
import EmptyView from "../components/Widgets/EmptyView";
import {filterAndSortList} from "../utils/filter";
import {useTranslation} from 'react-i18next';
import ProfileImage from "../components/Widgets/ProfileImage";

const TopCover = styled.div`
  width: 100%;
  min-width: 1140px;
  height: 368px;
  display: block;
  position: absolute;
  left: 0;
  top: 0;
  z-index: -1;
  background-color: #E5E5EA;

  > img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const Header = styled.div`
  display: flex;
  padding-top: 368px;
`;

const CollectionInfo = styled.div`
  width: 461px;
  height: 484px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: rgba(250, 250, 250, 0.05);
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1), inset 0px 0px 68px rgba(255, 255, 255, 0.05), inset 0px 4px 4px rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(86px);
  border-radius: 20px;
  padding: 10px;
  margin-top: -226px;

  > .title {
    width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    font-size: 36px;
    font-weight: 700;
    line-height: 28px;
    letter-spacing: -0.01em;
    color: #000000;
    margin: 56px 0 53px;
    text-align: center;
  }
`;

const CollectionImage = styled.div`
  width: 170px;
  height: 170px;
  border-radius: 50%;
  overflow: hidden;

  img {
    padding: 20px;
    background-color: transparent;
  }
`;

const FollowerWrapper = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 27px;
  font-size: 20px;
  font-weight: 800;

  > div {
    color: #8E8E93;

    &:not(:last-child) {
      margin-right: 16px;
    }

    > span {
      color: #3B5AFE;
    }
  }
`;

const DescriptionWrapper = styled.div`
  flex: 1;
  color: #545454;
  padding: 48px 25px 24px;
  font-size: 12px;
  line-height: 21px;
  letter-spacing: -0.005em;

  max-height: 240px;
  overflow: auto;
`;

const SocialButtons = styled.div`
  height: 24px;
  display: flex;
  gap: 16px;
  margin-top: 48px;
  margin-left: 10px;

  a {
    cursor: pointer;

    img {
      width: 24px;
      height: 24px;
    }
  }
`;

const FullWidthDivider = styled.div`
  margin-bottom: 2px;

  &::after {
    width: 100%;
    height: 2px;
    background-color: #EEEEEE;
    position: absolute;
    left: 0;
    content: ' ';
  }
`;

const Content = styled.div`
  padding: 24px 0;
`;

const TAB_OWNED = 0;
const TAB_FAVORITE = 1;
const TAB_CREATED = 2;
const TAB_IMPORTED = 3;

const Profile = () => {
  const {t} = useTranslation(['common']);
  const dispatch = useDispatch();
  const match = useRouteMatch();

  const {address, profile, items, favorites, exchangeEvents} = useSelector(userState);
  const {collections, linkedContracts} = useSelector(collectionState);

  const [filter, setFilter] = useState({});
  const [sortType, setSortType] = useState(0);

  const [loggedCollections, setLoggedCollections] = useState([]);
  const [filteredList, setFilteredList] = useState([]);
  const [currentTab, setCurrentTab] = useState(0);
  const [searchText, setSearchText] = useState('');

  const profileAddress = useMemo(() => {
    if (match.params?.address) {
      return match.params?.address;
    } else {
      return address;
    }
  }, [match, address]);

  const isMyProfile = useMemo(() => {
    return address === profile.account;
  }, [address, profile])

  useWalletRequired(!profileAddress);
  useDispatchUnmount(userActions.clearItems);

  useEffect(() => {
    if (profileAddress) {
      dispatch(fetchProfile({address: profileAddress}));
      dispatch(fetchMyCollections({address: profileAddress}));
      dispatch(fetchLinkedContracts({address: profileAddress}));
      dispatch(fetchExchangeEvent({account: profileAddress}));
    }
  }, [profileAddress]);

  useEffect(() => {
    if (currentTab === TAB_FAVORITE) {
      dispatch(fetchFavoriteOrders({idprofiles: profile.idprofiles}));
    }
  }, [currentTab]);

  useEffect(() => {
    let arr = [];

    if (currentTab === TAB_OWNED) {
      arr = items;
    } else if (currentTab === TAB_FAVORITE) {
      arr = favorites.map(x => ({
        contract: x.makeInfo?.contractAddress,
        tokenId: x.makeInfo?.tokenId,
        metadata: null,
        order: x,
        collectionName: x.makeInfo?.collectionName
      }));
    } else if (currentTab === TAB_CREATED) {
      arr = items.filter(x => isSameAddress(x.metadata?.creator, profileAddress));
    } else if (currentTab === TAB_IMPORTED) {
      arr = items.filter(x => linkedContracts.findIndex(y => isSameAddress(x.contract, y.contract)) !== -1);
    }

    setFilteredList(filterAndSortList(arr, filter, sortType, searchText));
  }, [favorites, linkedContracts, currentTab, items, filter, sortType, searchText]);

  useEffect(() => {
    if (profileAddress) {
      const arr = [];

      (async () => {
        let targetCollections = [
          commonCollection,
          ...collections.map(x => ({contract: x.contract, name: x.name})), // my brand collections,
          ...linkedContracts.map(x => ({contract: x.contract, name: x.name})), // imported collections,
          ...loggedCollections.map(x => ({contract: x.contract, name: x.contractName})), // collections from exchange events
        ];

        targetCollections = targetCollections.filter((x, i) => targetCollections.findIndex(y => y.contract === x.contract) === i);

        for (let collection of targetCollections) {
          const tokenIds = await getOwnedTokensOfCollection(collection.contract, profileAddress);
          for (let tokenId of tokenIds) {
            arr.push({
              contract: collection.contract,
              tokenId: tokenId
            });
          }
        }

        dispatch(userActions.setItems(arr));

        for (let i in arr) {
          const {contract, tokenId} = arr[i];

          getTokenInfo(contract, tokenId).then(({metadata, collection}) => {
            dispatch(userActions.updateItem({
              index: i,
              item: {
                contract: contract,
                tokenId: tokenId,
                metadata,
                order: null,
                collectionName: collection.name
              }
            }));
          });
        }
      })();
    }
  }, [collections, profileAddress, loggedCollections]);

  useEffect(() => {
    if (Array.isArray(exchangeEvents)) {
      const contracts = exchangeEvents.filter(x => !isNull(x.contract));
      setLoggedCollections([...new Set(contracts)]); // remove duplicate
    }
  }, [exchangeEvents]);


  return (
    <PageWrapper>
      <TopCover>
        {
          profile.cover?(
            <img src={profile.cover}/>
          ):<img src={'img/ic_profile_background.png'}/>
        }
      </TopCover>
      <Header>
        <CollectionInfo>
          <CollectionImage>
            <ProfileImage src={profile.photo} />
          </CollectionImage>
          <div className="title">{profile.user_name || profileAddress}</div>
          {/*
          <FollowerWrapper>
            <div>
              <span>10</span> followers
            </div>
            <div>
              <span>10</span> following
            </div>
          </FollowerWrapper>
          */}
        </CollectionInfo>
        <DescriptionWrapper>{profile.bio}</DescriptionWrapper>
        <SocialButtons>
          <div>
            <a href={profile.facebook}><img src={"/img/ic_facebook.svg"}/></a>
          </div>
          <div>
            <a href={profile.twitter}><img src={"/img/ic_twitter.svg"}/></a>
          </div>
          <div>
            <a href={profile.instagram}><img src={"/img/ic_instagram.svg"}/></a>
          </div>
        </SocialButtons>
      </Header>
      <PageTab items={['Owned', 'Favorited', 'Created', 'Imported']} current={currentTab} onChange={setCurrentTab}/>
      {
        isMyProfile && (
          <SettingDropdown/>
        )
      }
      <FullWidthDivider/>
      <Content>
        <FilterSort onSearch={setSearchText} onChangeFilter={setFilter} onChangeSort={setSortType}/>
        <CardList list={filteredList}/>
        {
          filteredList.length === 0 && (
            <EmptyView>{t('NO_ITEM')}</EmptyView>
          )
        }
      </Content>
    </PageWrapper>
  )
};

export default Profile;
