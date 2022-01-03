import styled from "styled-components";
import PageWrapper from "../components/Layouts/PageWrapper";
import FlexBox from "../components/FlexBox";
import {useCallback, useEffect, useMemo, useState} from "react";
import produce from "immer";
import GradientTop from "../components/Layouts/GradientTop";
import PriceChart from "../components/Chart/PriceChart";
import GradientButton from "../components/Widgets/GradientButton";
import Tooltip from "../components/Widgets/Tooltip";
import Property from "../components/Detail/Property";
import Level from "../components/Detail/Level";
import TokenInfo from "../components/Detail/TokenInfo";
import {Link, useRouteMatch} from "react-router-dom";
import {getTokenInfo} from "../utils/nft";
import {fetchOrderByAddress, orderActions, orderState} from "../reducers/order";
import {useDispatch, useSelector} from "react-redux";
import useParseTokenInfo from "../components/Widgets/useParseTokenInfo";
import {fetchProfile} from "../reducers/user";
import useGetUsdPrice from "../hooks/useGetPrice";
import {fetchCollection} from "../reducers/collection";
import useDispatchUnmount from "../hooks/useDispatchUnmount";
import {commonCollection} from "../constants/contract";
import {isNull, isSameAddress} from "../utils";
import useOrderFavorite from "../hooks/useOrderFavorite";
import useProtocolFeeRatio from "../hooks/useProtocolFeeRatio";
import OrderProgress from "../components/Detail/OrderProgress";
import {ORDER_TYPE_CHECKOUT} from "../constants/sale";

const Header = styled(FlexBox)`
  display: flex;
  gap: 95px;
  padding-left: 72px;
  margin: 30px 0 95px;
`;

const ItemImage = styled.img`
  width: 509px;
  height: 509px;
  border-radius: 25px;
`;

const ItemSummary = styled.div`
  flex: 1;
`;

const CollectionName = styled.div`
  flex: 1;

  a {
    font-size: 24px;
    font-weight: 500;
    color: #535353;
  }
`;

const Counter = styled.div`
  font-size: 13px;
  font-weight: 600;
  color: #535353;
  display: flex;
  align-items: center;
  justify-content: center;

  ${p => p.pointer && `
    cursor: pointer;
  `};

  &:not(:last-child) {
    margin-right: 16px;
  }

  img {
    margin-right: 4px;
  }
`;

const Title = styled.div`
  font-size: 36px;
  font-weight: 800;
  color: #000000;
  margin: 30px 0;
`;

const SaleStatus = styled.div`
  background: #FAFAFA;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.04);
  border-radius: 25px;
  padding: 15px;
  margin-left: -22px;
  text-align: center;
  margin-bottom: 16px;
  color: #535353;
  font-size: 18px;
`;

const PriceAndOrder = styled.div`
  margin-left: -22px;
  padding: 24px;
  background-color: #FAFAFA;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.04);
  border-radius: 25px;

  .label {
    font-size: 14px;
    font-weight: 500;
    line-height: 17px;
    color: #808080;
  }

  .unit {
    font-size: 16px;
    font-weight: 500;
    line-height: 19px;
    color: #000000;
    margin-top: 14px;
    justify-content: flex-end;
    cursor: pointer;

    img {
      margin-left: 5px;
    }
  }

  .buttons {
    margin-top: 31px;
  }
`;

const PriceWrapper = styled(FlexBox)`
  border-bottom: 1px solid #AEAEB2;
  padding: 7px;
  justify-content: center;
  position: relative;

  .price {
    font-size: 28px;
    font-weight: 700;
    line-height: 33px;
    color: #000000;
    margin-left: 12px;
    margin-right: 4px;
  }

  .usd {
    font-size: 14px;
    line-height: 17px;
    color: #929292;
    text-align: center;
    margin-top: 8px;
  }

  .fee {
    display: flex;
    align-items: center;
    position: absolute;
    right: 0;
    color: #8E8E93;
    font-size: 14px;
    line-height: 17px;
    letter-spacing: -0.02em;

    .tooltip {
      position: relative;

      img {
        vertical-align: middle;
        margin-left: 5px;

        &:hover + div {
          display: initial !important;
        }
      }
    }
  }
`;

const PriceTooltip = styled(Tooltip)`
  bottom: calc(100% + 15px);
  left: calc(50% + 3px);
  transform: translateX(-50%);
  white-space: nowrap;
  color: #000000;
  font-size: 14px;
  line-height: 18px;
  padding: 12px 20px;
`;

const Button = styled(GradientButton)`
  flex: 1;
  color: #ffffff;
  font-size: 18px;
  line-height: 21px;
  font-weight: bold;
  text-align: center;
  border-radius: 36px;
  padding: 14px;
  cursor: pointer;

  ${p => !p.accent && `
    background: #9EADFF;
    font-weight: 400;
  `};

  &:not(:last-child) {
    margin-right: 10px;
  }
`;

const OwnerWrapper = styled(FlexBox)`
  font-size: 14px;
  font-weight: 500;
  line-height: 17px;
  cursor: pointer;
  margin-top: 16px;

  label {
    font-size: 12px;
    line-height: 14px;
    color: #808080;
    margin-right: 16px;
  }

  a {
    display: flex;
    align-items: center;
    color: #0C33FF;

    img {
      width: 25px;
      height: 25px;
      object-fit: cover;
      margin-left: 6px;
      border-radius: 50%;
      overflow: hidden;
    }
  }

`;

const Content = styled(FlexBox)`
  align-items: flex-start;
  gap: 24px;

  > div {
    flex: 1;
  }
`;

const ExpandableItem = styled.div`
  margin-bottom: 8px;

  > div {
    &:nth-child(1) {
      display: flex;
      align-items: center;
      font-size: 16px;
      font-weight: 600;
      padding: 13px 20px;
      border-bottom: 1px solid #CBCBCB;
      position: relative;
      cursor: pointer;
      user-select: none;

      ${p => p.expanded && ` 
        border-bottom: 1px solid #CED6FF;
      `};

      ${p => p.expanded && !p.rightSide && `
        background-color: #FAFAFA;
      `};

      &::after {
        position: absolute;
        right: 12px;
        width: 16px;
        height: 9px;
        content: ' ';
        background-image: url('/img/ic_detail_content_arrowdown.svg');
        background-size: contain;
        background-repeat: no-repeat;

        ${p => p.expanded && `
          transform: rotate(180deg);
        `};
      }
    }

    &:nth-child(2) {
      ${p => !p.expanded && `
        display: none;
      `};
      padding: 15px 20px;
      font-size: 12px;
      line-height: 18px;
      color: #000000;
      background-color: #FAFAFA;
      margin-bottom: 10px;
    }
  }
`;

const PropertiesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(167px, 1fr));
  grid-auto-rows: auto;
  grid-gap: 8px;
`;

const Detail = () => {
  const dispatch = useDispatch();
  const match = useRouteMatch();

  const {contract, tokenId} = useMemo(() => match.params, [match]);
  const [metadata, setMetadata] = useState(null);
  const [owner, setOwner] = useState(null);
  const {order, priceHistory} = useSelector(orderState);

  const feeRatio = useProtocolFeeRatio();

  const [collection, setCollection] = useState({});
  const [orderType, setOrderType] = useState(null);
  const [ownerProfile, setOwnerProfile] = useState(null);

  const [fetch, setFetch] = useState(true);

  useDispatchUnmount(orderActions.clearOrder);

  const {
    idorders,
    name,
    image,
    description,
    attributes,
    viewCount,
    favoriteCount,
    price,
    unit,
    maker
  } = useParseTokenInfo(metadata, order);
  const usdPrice = useGetUsdPrice(price, unit);

  const isMakerOwned = useMemo(() => isSameAddress(owner, maker), [owner, maker]);

  const {isFavoriteOrder, onClickFavorite} = useOrderFavorite(idorders, () => {
    dispatch(fetchOrderByAddress({contractAddress: contract, tokenId: tokenId}));
  });

  const ownedBy = useMemo(() => {
    const value = {name: null, address: null, photo: null};

    if (owner) {
      if (ownerProfile) {
        value.name = ownerProfile.name;
        value.photo = ownerProfile.photo;
        value.address = ownerProfile.address;
      } else {
        value.name = owner.substr(2, 10).toUpperCase();
        value.address = owner;
      }
    }

    return value;
  }, [owner, ownerProfile]);

  // Init collection info & order info
  useEffect(() => {
    if (!fetch) {
      return;
    } else if (!contract || isNull(tokenId)) {
      return;
    }

    getTokenInfo(contract, tokenId).then(({metadata, owner}) => {
      setMetadata(metadata);
      setOwner(owner);
    });

    if (isSameAddress(contract, commonCollection.contract)) {
      setCollection(commonCollection);
    } else {
      dispatch(fetchCollection({contractAddress: contract})).then(({payload, error}) => {
        if (payload && Array.isArray(payload.data)) {
          setCollection(payload.data[0]);
        }
      });
    }

    dispatch(fetchOrderByAddress({contractAddress: contract, tokenId: tokenId}));
  }, [contract, tokenId, fetch]);

  const {properties, levels} = useMemo(() => {
    const result = {
      properties: [],
      levels: []
    };

    if (attributes && attributes.length > 0) {
      const entries = Object.entries(attributes[0]);

      for (let [k, v] of entries) {
        if (k === 'level' && Array.isArray(v)) {
          for (let level of v) {
            for (let key in level) {
              result.levels.push({
                name: key,
                level: level[key][0],
                max: level[key][1]
              });
            }
          }
        } else {
          result.properties.push({key: k, value: v});
        }
      }
    }

    return result;
  }, [attributes]);

  const [expandedItems, setExpandedItems] = useState({
    properties: true,
    level: true,
    details: true,
    priceHistory: true,
    description: true,
    about: true
  });

  const handleExpandItem = useCallback((key) => {
    setExpandedItems(produce(d => {
      d[key] = !d[key];
    }));
  }, []);


  useEffect(() => {
    if (owner) {
      dispatch(fetchProfile({address: owner})).then(({payload, error}) => {
        if (payload) {
          const profile = payload.data[0];

          setOwnerProfile({
            name: profile?.user_name,
            photo: profile?.photo,
            address: owner
          });
        }
      });
    }
  }, [owner]);

  const handleBuy = useCallback(() => {
    setOrderType(ORDER_TYPE_CHECKOUT);
  }, []);

  const handleRefresh = useCallback(() => {
    setFetch(true);
  }, []);

  const cancelOrderProgress = () => {
    setOrderType(null);
  }

  return (
    <PageWrapper hasTopNav>
      <GradientTop color={"#929292"}/>
      <Header>
        <ItemImage src={image}/>
        <ItemSummary>
          <FlexBox>
            <CollectionName>
              <Link to={"/marketplace/collection/" + contract}>
                {collection?.name}
              </Link>
            </CollectionName>
            {
              idorders && <>
                <Counter onClick={onClickFavorite} pointer>
                  <img src={isFavoriteOrder ? "/img/ic_detail_like_on.svg" : "/img/ic_detail_like.svg"}/>
                  {favoriteCount || 0}
                </Counter>
                <Counter>
                  <img src={"/img/ic_detail_view.svg"}/>
                  {viewCount || 0}
                </Counter>
              </>
            }
          </FlexBox>
          <Title>
            {name}
          </Title>
          {
            order.type >= 2 && (
              <SaleStatus>Sale ends December 1,2021 at 1:00 am</SaleStatus>
            )
          }
          {
            price && (
              <PriceAndOrder>
                <div className="label">Current price</div>
                <PriceWrapper>
                  {/*<img src={"/img/symbol_ton.svg"}/>*/}
                  <div className="price">{price}</div>
                  <div className="usd">${usdPrice}</div>
                  <div className="fee">
                    + {feeRatio * 100}%
                    <div className={"tooltip"}>
                      <img src={"/img/ic_detail_fee_info.svg"}/>
                      <PriceTooltip>Description of the fee</PriceTooltip>
                    </div>
                  </div>
                </PriceWrapper>
                <FlexBox className="unit">
                  {unit}
                  {/*<img src={"/img/ic_detail_unit_arrowdown.svg"}/>*/}
                </FlexBox>
                {
                  isMakerOwned && (
                    <FlexBox className="buttons">
                      <Button accent onClick={handleBuy}>Buy Now</Button>
                      {/*<Button>Make offer</Button>*/}
                      {/*<Button>Add to bag</Button>*/}
                    </FlexBox>
                  )
                }
              </PriceAndOrder>
            )
          }
          {
            owner && (
              <OwnerWrapper>
                <label>Owned by</label>
                <Link to={"/profile/" + ownedBy?.address}>
                  {ownedBy?.name}
                  <img src={ownedBy?.photo}/>
                </Link>
              </OwnerWrapper>
            )
          }
        </ItemSummary>
      </Header>
      <Content>
        <div>
          <ExpandableItem expanded={expandedItems.properties}>
            <div onClick={() => handleExpandItem('properties')}>Properties</div>
            <PropertiesGrid>
              {
                properties.map((x, i) => (
                  <Property key={i} type={x.key}
                            name={typeof x.value === 'string' ? x.value : JSON.stringify(x.value)}/>
                ))
              }
            </PropertiesGrid>
          </ExpandableItem>
          <ExpandableItem expanded={expandedItems.level}>
            <div onClick={() => handleExpandItem('level')}>Level</div>
            <div>
              {
                levels.map((x, i) => (
                  <Level key={i} name={x.name} level={x.level} max={x.max}/>
                ))
              }
            </div>
          </ExpandableItem>
          <ExpandableItem expanded={expandedItems.details}>
            <div onClick={() => handleExpandItem('details')}>Details</div>
            <TokenInfo tokenId={tokenId} blockchain={process.env.REACT_APP_CHAIN_PLATFORM} contractAddress={contract}
                       tokenStandard={'ERC721'}/>
          </ExpandableItem>
          <ExpandableItem expanded={expandedItems.priceHistory}>
            <div onClick={() => handleExpandItem('priceHistory')}>Price History</div>
            <PriceChart data={priceHistory}/>
          </ExpandableItem>
        </div>
        <div>
          <ExpandableItem rightSide expanded={expandedItems.description}>
            <div onClick={() => handleExpandItem('description')}>Description</div>
            <div>
              {description}
            </div>
          </ExpandableItem>
          {
            collection?.description && (
              <ExpandableItem rightSide expanded={expandedItems.about}>
                <div onClick={() => handleExpandItem('about')}>About the Collection</div>
                <div>
                  {collection?.description}
                </div>
              </ExpandableItem>
            )
          }
        </div>
      </Content>
      {/*
      <ExpandableItem expanded={expandedItems.activity}>
        <div onClick={() => handleExpandItem('activity')}>Item Activity</div>
        <Activity/>
      </ExpandableItem>
      */}
      {
        orderType && (
          <OrderProgress order={order} feeRatio={feeRatio} orderType={orderType} onRefresh={handleRefresh}
                         onCancel={cancelOrderProgress}/>
        )
      }
    </PageWrapper>
  )
};

export default Detail;
