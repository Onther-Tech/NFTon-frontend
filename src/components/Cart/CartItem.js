import styled from 'styled-components';
import {useCallback} from "react";
import {Link} from "react-router-dom";

const Wrapper = styled.div`
  display: flex;
  background: linear-gradient(178.04deg, #F9F9F9 9.17%, #FFFFFF 98.52%);
  border-radius: 25px;
  position: relative;
`;

const Image = styled.img`
  width: 460px;
  height: 460px;
  border-radius: 25px;
  position: relative;
`;

const PictureIcon = styled.img`
  position: absolute;
  width: 30px;
  height: 30px;
  left: 28px;
  top: 28px;
`;

const Content = styled.div`
  position: relative;
  flex: 1;
  display: flex;
  flex-direction: column;

`;

const Delete = styled.img`
  display: block;
  padding: 26px 22px;
  margin-left: auto;
  cursor: pointer;
`;

const InfoWrapper = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 48px 20px 20px 29px;

  .store {
    font-size: 14px;
    font-weight: 500;
    line-height: 17px;
    color: #8E8E93;
    margin-bottom: 15px;
  }

  .name {
    font-size: 18px;
    font-weight: 800;
    line-height: 21px;
    color: #151515;
    flex: 1;
  }
`;

const MoveToWishlist = styled.div`
  display: flex;
  align-items: center;
  color: #8E8E93;
  padding: 22px 0;
  border-bottom: 1px solid #E5E5EA;
  cursor: pointer;

  img {
    margin-right: 8px;
  }
`;

const PriceWrapper = styled.div`
  display: flex;
  align-items: center;
  font-size: 14px;
  color: #8E8E93;
  padding: 29px 0;

  > div {
    flex: 1;
    text-align: right;

    b {
      color: #000000;
      font-weight: 700;
      margin-right: 9px;
    }
  }
`;

const CartItem = ({item = {}, onDelete}) => {
  const handleDelete = useCallback(() => {
    onDelete && onDelete(item);
  }, [item, onDelete]);

  return (
    <Wrapper>
      <Link to={'/marketplace/item/' + item.id}>
        <Image src={item.imageUrl}/>
      </Link>
      <PictureIcon src={"/img/ic_cart_picture.svg"}/>
      <Content>
        <Delete src={"/img/ic_cart_delete.svg"} onClick={handleDelete}/>
        <InfoWrapper>
          <Link to={"/marketplace/store/" + item.storeId}>
            <div className="store">{item.storeName}</div>
          </Link>
          <div className="name">{item.name}</div>
          <MoveToWishlist>
            <img src={"/img/ic_cart_wishlist_off.svg"}/>
            move to wish list
          </MoveToWishlist>
          <PriceWrapper>
            <label>Price</label>
            <div>
              <b>{item.price} {item.unit}</b>
              ${item.usd}
            </div>
          </PriceWrapper>
        </InfoWrapper>
      </Content>
    </Wrapper>
  )
};

export default CartItem;
