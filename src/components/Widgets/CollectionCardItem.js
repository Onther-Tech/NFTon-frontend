import styled from "styled-components";
import {useCallback, useMemo} from "react";
import {Link, useHistory} from "react-router-dom";
import {useDispatch} from "react-redux";

export const CARD_WIDTH = '267px';
export const CARD_WIDTH_SMALL = '213px';

const Wrapper = styled.div`
  width: 100%;
  position: relative;
  background-color: #FAFAFA;
  border-radius: 10px;
  filter: drop-shadow(0px 2px 4px rgba(0, 0, 0, 0.04));
  padding: 16px;
`;

const ImageWrapper = styled.div`
  position: relative;
  width: 100%;
  z-index: -1;

  &::after {
    content: ' ';
    display: block;
    padding-top: 100%;
  }

  img {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 8px;
    background-color: #F2F2F7;
  }
`;

const InfoWrapper = styled.div`
  width: 100%;
  color: #151515;
  margin-top: -60px;
  padding-bottom: 18px;

  .image {
    width: 121px;
    height: 121px;
    background-color: #F2F2F7;
    border-radius: 50%;
    overflow: hidden;
    margin: 0 auto;

    > img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  .name {
    font-weight: bold;
    font-size: 22px;
    line-height: 28px;
    text-align: center;
    color: #000000;
    margin-top: 14px;
    margin-bottom: 4px;
  }

  .owner {
    width: 100%;
    font-size: 14px;
    line-height: 18px;
    color: #000000;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    text-align: center;

    span {
      color: #3B5AFE;
    }
  }
`;

const CollectionCardItem = ({small, contract, name, owner, banner, image}) => {
  const history = useHistory();
  const dispatch = useDispatch()

  const ownerName = useMemo(() => {
    if (!owner) {
      return 'Someone';
    }

    return owner.substr(2, 8).toUpperCase();
  }, [owner]);

  const handleProfile = useCallback(() => {
    history.push('/profile/' + owner);
  }, [owner]);

  const pathname = useMemo(() => {
    if (!contract) {
      return;
    }

    return "/marketplace/collection/" + contract;
  }, [contract]);

  if (!pathname) {
    return null;
  }

  return (
    <Wrapper small={small}>
      <Link to={pathname}>
        <ImageWrapper>
          <img src={banner || ''} onError={(e) => e.target.src = '/img/ic_card_nopicture.svg'}/>
        </ImageWrapper>
        <InfoWrapper>
          <div className="image">
            <img src={image || ''} onError={(e) => e.target.src = '/img/ic_card_nopicture.svg'}/>
          </div>
          <div className="name">{name}</div>
          <div className="owner">By <span onClick={handleProfile}>{ownerName}</span></div>
        </InfoWrapper>
      </Link>
    </Wrapper>
  )
};

export default CollectionCardItem;
