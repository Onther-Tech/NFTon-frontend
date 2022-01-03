import styled from "styled-components";
import {useCallback} from "react";
import {Link} from "react-router-dom";
import moment from "moment";
import { useTranslation } from 'react-i18next';

const Table = styled.div`
`;

const Head = styled.div`
  * {
    font-size: 13px;
    line-height: 46px;
    color: #535353;
    font-weight: 400 !important;
  }

  > div {
    padding-top: 13px;
    padding-bottom: 0;
  }
`;

const FullWidthDivider = styled.div`
  margin-bottom: 2px;

  &::after {
    width: 100%;
    height: 2px;
    box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.04);
    position: absolute;
    left: 0;
    content: ' ';
  }

`

const Body = styled.div`
  * {
    font-size: 16px;
  }
`;

const Row = styled.div`
  display: flex;
  align-items: center;
  height: 100px;

  &:hover {
    background: #FFFFFF;
    box-shadow: inset 0 0 0 2px #CED6FF;
    border-radius: 25px;
  }
`;

const Cell = styled.div`
  flex: ${p => p.hasOwnProperty('flex') ? p.flex : 1};
  line-height: 40px;
  color: #000000;

  text-align: ${p => p.align || 'center'};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  ${p => p.bold && `
    font-weight: 700;
  `};


  a {
    line-height: 40px;
    color: #3B5AFE;
    font-weight: 500;

    img {
      margin-left: 4px;
      vertical-align: middle;
    }
  }
`;

const TypeCell = styled(Cell)`
  width: 100px;
  font-weight: 700;
  flex: initial;
`;

const NameCell = styled(Cell)`
  flex: 1.5;
  font-weight: 700;
  text-align: left;

  img {
    width: 40px;
    height: 40px;
    background-color: #C4C4C4;
    border-radius: ${p => p.menu === 'ranking' ? '50%' : '8px'};
    margin-right: 8px;
    overflow: hidden;
    vertical-align: middle;
  }
`;

const PriceCell = styled(Cell)`
  font-weight: 700;

  img {
    margin-right: 8px;
    vertical-align: middle;
  }
`;

const PercentageCell = styled(Cell)`
  font-weight: 600;

  ${p => p.percent > 0 ? `
    color: #FF5A5A;
  ` : `
    color: #6D84FF;
  `};
`;

const StatTable = ({hideHead, menu, rows = []}) => {

  const { t }  = useTranslation(['common']);
  
  const typeString = useCallback((type) => {
    switch (type) {
      case 'sale':
        return 'Sale';
      case 'listing':
      case 'list':
        return 'List';
      case 'bid':
        return 'Bid';
      case 'offer':
        return 'Offer';
      case 'minted':
        return 'Minted';
      case 'buy':
        return 'Buy';
      case 'Transfer':
        return 'transfer';
    }
  }, []);

  return (
    <Table>
      {
        !hideHead && (
          <Head>
            {
              menu === 'ranking' && (
                <Row>
                  <TypeCell/>
                  <NameCell>Collection</NameCell>
                  <Cell>{t('Volume')}</Cell>
                  <Cell>24h %</Cell>
                  <Cell>7d %</Cell>
                  <Cell flex={0.6}>{t('FLOOR_PRICE')}</Cell>
                  <Cell flex={0.6}>{t('Owner')}</Cell>
                  <Cell flex={0.6}>{t('Asset')}</Cell>
                </Row>
              )
            }
            {
              menu === 'activity' && (
                <Row>
                  <TypeCell/>
                  <NameCell>{t('ITEM')}</NameCell>
                  <Cell>{t('PRICE')}</Cell>
                  <Cell flex={0.6}>{t('Quantity')}</Cell>
                  <Cell>from</Cell>
                  <Cell>to</Cell>
                  <Cell>{t('TIME')}</Cell>
                </Row>
              )
            }
          </Head>
        )
      }
      <FullWidthDivider/>
      <Body>
        {
          menu === 'ranking' && rows.map((x, i) => (
            <Row key={i}>
              <TypeCell>{x.rank}</TypeCell>
              <NameCell menu={menu}>
                <img src={x.imageUrl}/>
                {x.name}
              </NameCell>
              <PriceCell>
                <img src={"/img/ic_ethereum.svg"}/>
                {x.volume}
              </PriceCell>
              <PercentageCell percent={x.p24h}>{x.p24h}%</PercentageCell>
              <PercentageCell percent={x.p7d}>{x.p7d}%</PercentageCell>
              <Cell flex={0.6}>{x.price}</Cell>
              <Cell flex={0.6}>{x.owners}</Cell>
              <Cell flex={0.6}>{x.assets}</Cell>
            </Row>
          ))
        }
        {
          menu === 'activity' && rows.map((x, i) => (
            <Row key={i}>
              <TypeCell>{typeString(x.type)}</TypeCell>
              <NameCell menu={menu}>
                <img src={x.imageUrl}/>
                {x.item}
              </NameCell>
              <PriceCell>
                <img src={"/img/ic_ethereum.svg"}/>
                {x.price}
              </PriceCell>
              <Cell flex={0.6}>{x.qty}</Cell>
              <Cell><Link to={'/profile/' + x.from?.userId}>{x.from?.name}</Link></Cell>
              <Cell><Link to={'/profile/' + x.to?.userId}>{x.to?.name}</Link></Cell>
              <Cell><Link to={'#'}>{moment(x.date).fromNow()}<img src={"/img/ic_stats_link.svg"}/></Link></Cell>
            </Row>
          ))
        }
      </Body>
    </Table>
  )
};

export default StatTable;
