import CardItem, {CARD_WIDTH, CARD_WIDTH_SMALL} from "../Widgets/CardItem";
import styled from "styled-components";
import {forwardRef} from "react";
import CollectionCardItem from "../Widgets/CollectionCardItem";

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


const CardList = forwardRef(({list, small, collection}, ref) => {
  return (
    <div ref={ref}>
      <GridList small={small}>
        {
          list.map((x, i) => (
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
    </div>
  )
});

export default CardList;
