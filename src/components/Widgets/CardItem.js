import styled from "styled-components";
import {useCallback, useMemo, useState} from "react";
import {Link, useHistory} from "react-router-dom";
import useParseTokenInfo from "./useParseTokenInfo";
import {ethers} from "ethers";
import {useDispatch, useSelector} from "react-redux";
import {userState} from "../../reducers/user";
import useOrderFavorite from "../../hooks/useOrderFavorite";
import {isNull} from "../../utils";
import ContentPreview from "./ContentPreview";

export const CARD_WIDTH = '267px';
export const CARD_WIDTH_SMALL = '208px';

const Wrapper = styled.div`
  width: 100%;
  position: relative;
  background-color: #FAFAFA;
  border-radius: 10px;
  filter: drop-shadow(0px 2px 4px rgba(0, 0, 0, 0.04));
`;


const HeaderWrapper = styled.div`
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: space-between;
  padding: 16px 16px;

  > div {
    display: flex;
    align-items: center;
  }

  img.icon {
    width: 28px;
  }

  .like_count {
    margin-right: 6px;
    font-size: 12px;
    font-weight: 600;
    line-height: 20px;
    color: #929292;
  }
`;

const Status = styled.div`
  min-width: 79px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-image: radial-gradient(54.71% 75.06% at 67.06% 72%, #0C33FF 0%, #6F86FF 100%);
  border: 1px solid #ffffff;
  box-sizing: border-box;
  backdrop-filter: blur(88px);
  border-radius: 27px;
  font-size: 12px;
  line-height: 46px;
  padding: 0 13px;
  color: #ffffff;

  ${p => p.hasOffers && `
    color: #FF4C00;
    border: 1px solid #FF4C00;
    background-image: none;
    background-color: transparent;
  `};
`;

const ImageWrapper = styled.div`
  position: relative;
  width: calc(100% - 32px);
  margin: 0 16px 12px 16px;

  &::after {
    content: ' ';
    display: block;
    padding-top: 100%;
  }

  * {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    object-fit: cover !important;
    border-radius: 8px;
    background-color: #F2F2F7;
  }
`;

const InfoWrapper = styled.div`
  width: 100%;
  box-shadow: inset 0px 2px 0px 0px white;
  border-radius: 10px;
  color: #151515;
  padding: 20px 16px;

  > div {
    display: flex;

    &:not(:last-child) {
      margin-bottom: 5px;
    }

    .name {
      flex: 1;
      font-size: 14px;
      font-weight: 800;
      line-height: 20px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .price {
      flex: 1;
      font-size: 16px;
      font-weight: 800;
      line-height: 20px;
    }

    .label {
      font-size: 12px;
      font-weight: 500;
      line-height: 20px;
      text-align: right;
      color: #8E8E93;
      max-width: 100px;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }
`;

const CardItem = ({small, contract, collectionName, tokenId, metadata, order}) => {
  const history = useHistory();

  const [statusText, setStatusText] = useState('');

  const {idorders, name, image, type, price, unit} = useParseTokenInfo(metadata, order);
  const {isFavoriteOrder, onClickFavorite} = useOrderFavorite(idorders);

  const contentTypeIcon = useMemo(() => {
    if (type) {
      switch (type.split('/')[0]) {
        case 'video':
          return '/img/ic_card_video.svg';
        case 'audio':
          return '/img/ic_card_sound.svg';
        default:
          return '/img/ic_card_picture.svg';
      }
    } else {
      return '/img/ic_card_picture.svg';
    }
  }, [type]);

  const pathname = useMemo(() => {
    if (!contract || isNull(tokenId)) {
      return;
    }

    return "/marketplace/item/" + contract + '/' + ethers.BigNumber.from(tokenId).toNumber()
  }, [contract, tokenId]);

  const handleOpenStore = useCallback((e) => {
    e.preventDefault();

    history.push('/marketplace/collection/' + contract);
  }, [history, contract]);

  if (!pathname) {
    return null;
  }

  return (
    <Wrapper small={small}>
      <Link to={pathname}>
        <HeaderWrapper>
          <div>
            <img className="icon" src={contentTypeIcon}/>
          </div>
          {
            statusText && (
              <Status>
                {statusText}
              </Status>
            )
          }
          {
            idorders && (
              <div>
                <img className="icon" src={isFavoriteOrder ? "/img/ic_card_like_on.svg" : "/img/ic_card_like.svg"}
                     onClick={onClickFavorite}/>
              </div>
            )
          }
        </HeaderWrapper>
        <ImageWrapper>
          <ContentPreview type={type} src={image} />
        </ImageWrapper>
        <InfoWrapper>
          <div>
            <div className="name">{name}</div>
            <div className="label" onClick={handleOpenStore}>{collectionName}</div>
          </div>
          <div>
            <div className="price">{price}</div>
            <div className="label unit">{unit}</div>
          </div>
        </InfoWrapper>
      </Link>
    </Wrapper>
  )
};

export default CardItem;
