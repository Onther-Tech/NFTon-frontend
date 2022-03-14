import PageWrapper from "../components/Layouts/PageWrapper";
import {useEffect, useMemo, useState} from "react";
import FilterSort from "../components/FilterSort";
import CardList from "../components/Layouts/CardList";
import PageHeader from "../components/Layouts/PageHeader";
import {useLocation, useRouteMatch} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {fetchOrders, marketplaceActions, marketplaceState} from "../reducers/marketplace";
import useInfiniteScroll from "react-infinite-scroll-hook";
import styled from "styled-components";
import {parseErc721AssetData} from "../utils/nft";
import {fetchFavoriteOrders, userState} from "../reducers/user";
import {categoryState} from "../reducers/category";
import qs from 'query-string';
import EmptyView from "../components/Widgets/EmptyView";
import {filterAndSortList} from "../utils/filter";
import { useTranslation } from 'react-i18next';

const Loading = styled.div`
  padding: 20px;
  text-align: center;
`;

const Marketplace = () => {
  const { t }  = useTranslation(['common']);
  const dispatch = useDispatch();
  const {pathname, search} = useLocation();
  const {params} = useRouteMatch();

  const {idprofiles} = useSelector(userState);
  const {orders, loading} = useSelector(marketplaceState);
  const {categories} = useSelector(categoryState);

  const [filter, setFilter] = useState({});
  const [sortType, setSortType] = useState(0);

  const [list, setList] = useState([]);
  const [filteredList, setFilteredList] = useState([]);

  const {idcategories} = useMemo(() => qs.parse(search), [search]);
  const categoryTabs = useMemo(() => {
    const searchObj = qs.parse(search);

    return [
      {
        search: qs.stringify({...searchObj, idcategories: undefined}),
        label: 'All NFTs'
      },
      ...categories.map(x => ({
        idcategories: x.idcategories,
        search: qs.stringify({...searchObj, idcategories: x.idcategories}),
        label: x.name
      }))
    ]
  }, [categories, search]);
  const categoryName = useMemo(() => {
    return categories.find(x => x.idcategories == idcategories)?.name;
  }, [categories, idcategories]);

  useEffect(() => {
    dispatch(fetchOrders({
      chainId: process.env.REACT_APP_CHAIN_ID,
      platform: process.env.REACT_APP_CHAIN_PLATFORM,
      includeCategoryName: 1,
    }));

    return () => {
      if (!window.location.pathname.startsWith('/marketplace')) {
        dispatch(marketplaceActions.clearItems());
      }
    }
  }, []);

  useEffect(() => {
    setList(orders.map(x => ({
      contract: x.makeInfo?.contractAddress,
      tokenId: parseErc721AssetData(x.makeAsset?.assetType?.data)[1],
      metadata: null,
      order: x,
      collectionName: x.makeInfo?.collectionName
    })));
  }, [orders]);

  useEffect(() => {
    const newFilter = {...filter};

    if (categoryName) {
      newFilter.categories = {[categoryName]: true};
    }

    setFilteredList(filterAndSortList(list, newFilter, sortType));
  }, [list, categoryName, sortType, filter]);

  useEffect(() => {
    if (idprofiles) {
      dispatch(fetchFavoriteOrders({idprofiles}));
    }
  }, [idprofiles]);

  // const [infiniteRef] = useInfiniteScroll({
  //   loading: loading,
  //   hasNextPage: false,
  //   onLoadMore: () => {
  //   },
  // });

  return (
    <PageWrapper hasTopNav>
      <PageHeader tabItems={categoryTabs} color={"#929292"} activeKey={"idcategories"}/>
      <FilterSort hideCategory onChangeFilter={setFilter} onChangeSort={setSortType}/>
      <CardList list={filteredList}/>
      {
        filteredList.length === 0 && (
          <EmptyView>{t('NO_ITEM')}</EmptyView>
        )
      }
      {/*
        hasNextPage && (
          <Loading ref={infiniteRef}>Loading...</Loading>
        )
      */}
    </PageWrapper>
  )
};

export default Marketplace;
