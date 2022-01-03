import styled from "styled-components";
import PageWrapper from "../components/Layouts/PageWrapper";
import {useCallback, useEffect, useMemo, useState} from "react";
import {marketplaceList} from "../dummy/marketplace";
import CardList from "../components/Layouts/CardList";
import PageHeader from "../components/Layouts/PageHeader";
import {useHistory} from "react-router-dom";
import RoundedDropdown from "../components/Widgets/RoundedDropdown";
import PageTab from "../components/Widgets/PageTab";
import queryString from 'query-string';
import CollectionDropdown from "../components/Widgets/CollectionDropdown";
import {SIZE_BIG, SIZE_SMALL} from "../constants/dropdown";
import RankingItem from "../components/Stats/StatTable";
import StatTable from "../components/Stats/StatTable";
import {activityList, rankingList} from "../dummy/stats";

const DropdownWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 24px;
  margin-bottom: 30px;
`;

const StyledPageTab = styled(PageTab)`
  margin-top: -10px;
  margin-bottom: 30px;
`;

const Stats = () => {
  const history = useHistory();
  const q = queryString.parse(history.location.search);

  const menu = useMemo(() => q?.menu, [q]);

  const [rows, setRows] = useState([]);

  useEffect(() => {
    if (!q?.menu) {
      history.replace(history.location.pathname + '?menu=ranking');
    }
  }, [q]);

  useEffect(() => {
    if(menu === 'ranking') {
      setRows(rankingList);
    } else {
      setRows(activityList);
    }
  }, [menu]);

  const saleType = useMemo(() => [
    {value: 'sell', label: '판매'},
    {value: 'listing', label: '리스팅'},
    {value: 'bid', label: '비드'},
    {value: 'offer', label: '오퍼'},
  ], []);

  const chainType = useMemo(() => [
    {value: 'all', label: "모든 체인"},
    {value: 'ethereum', label: '이더리움'},
    {value: 'polygon', label: '폴리곤'},
    {value: 'klaytn', label: '클레이튼'}
  ], []);

  const handleChangeTab = useCallback((i) => {
    history.push(history.location.pathname + (i === 0 ? '?menu=ranking' : '?menu=activity'));
  }, [history]);

  return (
    <PageWrapper hasTopNav>
      <PageHeader color={"#F1883C"} title={"NFTs 랭킹"} description={"NFTs Ranking"}/>
      <StyledPageTab items={['Ranking', 'Activity']} current={menu === 'ranking' ? 0 : 1} onChange={handleChangeTab}/>
      <DropdownWrapper>
        <RoundedDropdown size={SIZE_BIG} defaultLabel={"판매타입"} items={saleType}/>
        {
          menu === 'ranking' ? (
            <RoundedDropdown style={{width: '187px'}} size={SIZE_BIG} defaultLabel={"모든 카테고리"} items={saleType}/>
          ) : (
            <CollectionDropdown
              size={SIZE_SMALL}
              items={[{label: 'Crypto punks', value: 1, image: '/'}]}
              defaultLabel={"컬렉션"}
            />
          )
        }
        <RoundedDropdown size={SIZE_BIG} items={chainType}/>
      </DropdownWrapper>
      <StatTable menu={menu} rows={rows}/>
    </PageWrapper>
  )
};

export default Stats;
