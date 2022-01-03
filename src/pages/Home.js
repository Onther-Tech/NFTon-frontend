import PageWrapper from "../components/Layouts/PageWrapper";
import {useCallback, useEffect, useMemo, useState} from "react";
import CardList from "../components/Layouts/CardList";
import PageHeader from "../components/Layouts/PageHeader";
import {useHistory, useLocation} from "react-router-dom";
import GridType from "../components/Widgets/GridType";
import {useAlert} from "react-alert";
import qs from "query-string";
import {
  HOME_TAB_HOT_COLLECTIONS,
  HOME_TAB_LIVE_AUCTION,
  HOME_TAB_NEW_NFTS,
  HOME_TAB_TRENDING,
  homeTabs
} from "../constants/tab";
import {useDispatch, useSelector} from "react-redux";
import {fetchHotCollections, fetchNew, fetchTrendOrders, homeState} from "../reducers/home";

const Home = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const alert = useAlert();
  const {pathname, search} = useLocation();

  const [smallGrid, setSmallGrid] = useState(false);

  const {items, collections} = useSelector(homeState);
  const [filteredList, setFilteredList] = useState([]);

  const {tab} = useMemo(() => qs.parse(search), [search]);
  const tabItems = useMemo(() => {
    const searchObj = qs.parse(search);

    return homeTabs.map(x => ({
      tab: x.tab,
      label: x.label,
      search: qs.stringify({...searchObj, tab: x.tab})
    }))
  }, [search]);
  const currentCategory = useMemo(() => tabItems.find(x => x.tab === tab), [tabItems, tab]);

  // 카테고리 쿼리스트링이 없는 경우 첫번째 카테고리로 리다이렉트
  useEffect(() => {
    if (!currentCategory) {
      const searchObj = qs.parse(search);

      history.replace({pathname, search: qs.stringify({...searchObj, tab: tabItems[0].tab})})
    }
  }, [tabItems, currentCategory, search]);

  useEffect(() => {
    if (tab === HOME_TAB_NEW_NFTS) {
      dispatch(fetchNew());
    } else if (tab === HOME_TAB_TRENDING) {
      dispatch(fetchTrendOrders());
    } else if (tab === HOME_TAB_LIVE_AUCTION) {

    } else if (tab === HOME_TAB_HOT_COLLECTIONS) {
      dispatch(fetchHotCollections());
    }
  }, [tab]);

  useEffect(() => {
    if(tab !== HOME_TAB_HOT_COLLECTIONS) {
      setFilteredList(items.map(x => {
        return {
          contract: x.makeInfo.contractAddress,
          tokenId: x.makeInfo.tokenId,
          metadata: null,
          order: x,
          collectionName: x.makeInfo.collectionName
        }
      }));
    }
  }, [items, tab]);

  const handleGridType = useCallback((small) => {
    setSmallGrid(small);
  }, []);

  return (
    <PageWrapper hasTopNav>
      <PageHeader tabItems={tabItems} color={"#0C33FF"} activeKey={'tab'}/>
      <GridType center small={smallGrid} onClick={handleGridType}/>
      {
        tab === HOME_TAB_HOT_COLLECTIONS ? (
          <CardList list={collections} small={smallGrid} collection />
        ) : (
          <CardList list={filteredList} small={smallGrid} />
        )
      }
    </PageWrapper>
  )
};

export default Home;
