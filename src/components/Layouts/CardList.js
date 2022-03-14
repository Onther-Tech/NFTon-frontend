import CardItem, {CARD_WIDTH, CARD_WIDTH_SMALL} from "../Widgets/CardItem";
import styled from "styled-components";
import {forwardRef} from "react";
import CollectionCardItem from "../Widgets/CollectionCardItem";
import InfiniteScroll from 'react-infinite-scroll-component';
import { useState, useEffect } from "react";

const ItemCount = styled.div`
  text-align: right;
  font-size: 12px;
  line-height: 22px;
  color: #929292;
  margin-top: 9px;
  letter-spacing: -0.02em;
`;

const GridList = styled.div`
  display: grid;
  grid-gap: 24px;
  grid-template-columns: repeat(auto-fit, ${p => p.small ? CARD_WIDTH_SMALL : CARD_WIDTH});
  padding: 25px 0;
`;


const CardList = forwardRef(({list, small, collection, lastListElementRef}, ref) => {
  const [item, setItem] = useState([]);
  const [pageNum, setpageNum] = useState(0);

  // console.log(list.from({length: 20}))
  // useEffect(() => {
  //   const setting = () => {
  //     setItem()
  //   }
  // }, [])
  // setItem(list.slice(0, (pageNum + 1)*12))
  const fetchMoreData = () => {
    // a fake async api call like which sends
    // 20 more records in 1.5 secs
    setTimeout(() => {
      setItem(list.slice(0, (pageNum + 1) * 12))
      setpageNum(pageNum + 1)
    }, 1500);
  };
  return (
    <div ref={lastListElementRef}>
      <InfiniteScroll
          dataLength={list.length}
          next={fetchMoreData()}
          hasMore={true}
          loader={<h4>Loading...</h4>}
        >
          <GridList small={small}>
            {
              item.map((x, i) => (
                !collection ? (
                  <CardItem
                    key={x.contract + x.tokenId}
                    contract={x.contract}
                    tokenId={x.tokenId}
                    metadata={x.metadata}
                    order={x.order}
                    collectionName={x.collectionName}
                  />
                ) : (
                  <CollectionCardItem
                    key={x.contract + i}
                    contract={x.contract}
                    name={x.name}
                    owner={x.owner}
                    image={x.symbol_link}
                    banner={x.banner}
                  />
                )
              ))
            }       
          </GridList>
      </InfiniteScroll>
    </div>
  )
});

export default CardList;
