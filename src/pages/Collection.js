import PageWrapper from "../components/Layouts/PageWrapper";
import styled from "styled-components";
import FilterSort from "../components/FilterSort";
import CardList from "../components/Layouts/CardList";
import {useEffect, useMemo, useState} from "react";
import GradientButton from "../components/Widgets/GradientButton";
import PageTab from "../components/Widgets/PageTab";
import {useDispatch, useSelector} from "react-redux";
import {collectionActions, collectionState, fetchCollection} from "../reducers/collection";
import {useRouteMatch} from "react-router-dom";
import {isSameAddress} from "../utils";
import {commonCollection} from "../constants/contract";
import {getTokenInfo, getTokensOfCollection, getTotalSupplyOfCollection} from "../utils/nft";
import produce from "immer";
import numeral from 'numeral';
import {filterAndSortList} from "../utils/filter";
import useDispatchUnmount from "../hooks/useDispatchUnmount";

const TopCover = styled.div`
  width: 100%;
  min-width: 1162px;
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
  display: flex;
  flex-direction: column;
  align-items: center;
  background: rgba(250, 250, 250, 0.05);
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1), inset 0px 0px 68px rgba(255, 255, 255, 0.05), inset 0px 4px 4px rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(86px);
  border-radius: 20px;
  padding: 80px 49px 85px 49px;
  margin-top: -258px;
  position: relative;

  > .title {
    width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    font-size: 36px;
    font-weight: 700;
    line-height: 28px;
    letter-spacing: -0.01em;
    color: #000000;
    margin: 50px 0 28px 0;
    text-align: center;
  }

  &::before {
    position: absolute;
    left: 30px;
    top: 30px;
    content: ' ';
    width: 34px;
    height: 29px;
    background: url('/img/ic_collection_collection.svg');
    background-size: contain;
  }
`;

const CollectionImage = styled.div`
  width: 170px;
  height: 170px;
  background-color: #E5E5EA;
  border-radius: 50%;
  overflow: hidden;

  > img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const SummaryWrapper = styled.div`
  display: flex;
  align-items: center;

  > div {
    width: 91px;
    height: 57px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    > div:nth-of-type(1) {
      font-size: 16px;
      font-weight: 800;
      line-height: 19px;
      color: #151515;
      letter-spacing: -0.02em;
    }

    > div:nth-of-type(2) {
      font-size: 12px;
      line-height: 14px;
      color: #929292;
      letter-spacing: -0.02em;
      white-space: nowrap;
      margin-top: 4px;
    }
  }
`;

const FollowButton = styled(GradientButton)`
  width: 314px;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  font-weight: 800;
  line-height: 46px;
  border-radius: 33px;
  padding: 0;
  margin-top: 27px;
`;

const DescriptionWrapper = styled.div`
  flex: 1;
  color: #545454;
  padding: 48px 25px 24px 25px;
  font-size: 12px;
  line-height: 21px;
  letter-spacing: -0.005em;
`;

const SocialButtons = styled.div`
  height: 24px;
  display: flex;
  gap: 16px;
  margin-top: 25px;
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

const Collection = () => {
  const dispatch = useDispatch();
  const {params} = useRouteMatch();

  const {collection} = useSelector(collectionState);
  const contract = useMemo(() => params?.contract, [params]);

  const [list, setList] = useState([]);
  const [filteredList, setFilteredList] = useState([]);

  const [filter, setFilter] = useState({});
  const [sortType, setSortType] = useState(0);

  const [currentTab, setCurrentTab] = useState(0);
  const [searchText, setSearchText] = useState('');
  const [totalSupply, setTotalSupply] = useState(0);

  useDispatchUnmount(collectionActions.clearCollection);

  useEffect(() => {
    if (!contract) {
      return;
    }

    if (isSameAddress(contract, commonCollection.contract)) {
      dispatch(collectionActions.setCollection(commonCollection));
    } else {
      dispatch(fetchCollection({contractAddress: contract}));
    }
  }, [contract]);

  useEffect(() => {
    if (!collection.name) {
      return;
    }

    const contract = collection.contract;

    (async () => {
      const tokenIds = await getTokensOfCollection(contract);
      setList(tokenIds.map(x => ({
        contract: contract,
        tokenId: x,
      })));

      for (let i in tokenIds) {
        const tokenId = tokenIds[i]
        getTokenInfo(contract, tokenId).then(({metadata}) => {
          setList(produce(d => {
            d[i] = {
              ...d[i],
              metadata,
              collectionName: collection.name,
              order: null
            }
          }))
        })
      }
    })();

    (async () => {
      const totalSupply = await getTotalSupplyOfCollection(contract);
      setTotalSupply(totalSupply);
    })();
  }, [collection]);

  useEffect(() => {
    setFilteredList(filterAndSortList(list, filter, sortType, searchText));
  }, [list, filter, sortType, searchText]);

  return (
    <PageWrapper>
      <TopCover>
        {
          collection.banner && (
            <img src={collection.banner}/>
          )
        }
      </TopCover>
      <Header>
        <CollectionInfo>
          <CollectionImage>
            {
              collection.symbol_link && (
                <img src={collection.symbol_link}/>
              )
            }
          </CollectionImage>
          <div className="title">{collection.name}</div>
          <SummaryWrapper>
            <div>
              <div>{numeral(totalSupply).format('0a')}</div>
              <div>items</div>
            </div>
            <div>
              <div>-</div>
              <div>owners</div>
            </div>
            <div>
              <div>-</div>
              <div>floor price</div>
            </div>
            <div>
              <div>-</div>
              <div>volume traded</div>
            </div>
          </SummaryWrapper>
          {/*<FollowButton>팔로우</FollowButton>*/}
        </CollectionInfo>
        <DescriptionWrapper>
          {collection.description}
        </DescriptionWrapper>
        <SocialButtons>
          <div>
            <a href={collection.facebook}><img src={"/img/ic_facebook.svg"}/></a>
          </div>
          <div>
            <a href={collection.twitter}><img src={"/img/ic_twitter.svg"}/></a>
          </div>
          <div>
            <a href={collection.instagram}><img src={"/img/ic_instagram.svg"}/></a>
          </div>
        </SocialButtons>
      </Header>
      <PageTab items={['Items']} current={currentTab} onChange={setCurrentTab}/>
      <FullWidthDivider/>
      <Content>
        <FilterSort onSearch={setSearchText} onChangeFilter={setFilter} onChangeSort={setSortType}/>
        <CardList list={filteredList}/>
      </Content>
    </PageWrapper>
  )
};

export default Collection;
