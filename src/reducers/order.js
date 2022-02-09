import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import IndexAPI from "../api/v2";

const namespace = 'order';

const initialState = {
  loading: false,
  order: {},
  priceHistory: [],
};

export const registerOrder = createAsyncThunk(
  namespace + '/registerOrder',
  async (params) => {
    return await IndexAPI.registerOrder(params);
  }
)

export const cancelOrder = createAsyncThunk(
  namespace + '/cancelOrder',
  async (params) => {
    return await IndexAPI.cancelOrder(params);
  }
)

export const modifyOrder = createAsyncThunk(
  namespace + '/modifyOrder',
  async (params) => {
    return await IndexAPI.modifyOrder(params);
  }
)

export const fetchOrder = createAsyncThunk(
  namespace + '/fetchOrder',
  async (params) => {
    return await IndexAPI.fetchOrder(params);
  }
)

export const registerOrderBuy = createAsyncThunk(
  namespace + '/registerOrderBuy',
  async (params) => {
    return await IndexAPI.registerOrderBuy(params);
  }
)

export const fetchOrderByAddress = createAsyncThunk(
  namespace + '/fetchOrderByAddress',
  async (params) => {
    return await IndexAPI.fetchOrderByAddress(params);
  }
)

export const favoriteOrder = createAsyncThunk(
  namespace + '/favoriteOrder',
  async (params) => {
    return await IndexAPI.favoriteOrder(params);
  }
)

export const cancelFavoriteOrder = createAsyncThunk(
  namespace + '/cancelFavoriteOrder',
  async (params) => {
    return await IndexAPI.cancelFavoriteOrder(params);
  }
)


export const orderSlice = createSlice({
  name: namespace,
  initialState: initialState,
  reducers: {
    setLoading: (state, {payload}) => {
      return {...state, loading: payload};
    },
    clearOrder: (state) => {
      return {...state, order: initialState.order, priceHistory: initialState.priceHistory}
    }
  },
  extraReducers: {
    [fetchOrder.pending](state) {
      state.loading = true;
    },
    [fetchOrder.fulfilled](state, {payload}) {
      state.loading = false;

      if (Array.isArray(payload.data))
        state.order = payload.data[payload.data.length - 1] || {};

      if (Array.isArray(payload.priceHistory))
        state.priceHistory = payload.priceHistory;

    },
    [fetchOrder.rejected](state) {
      state.loading = false;
    },
    [fetchOrderByAddress.pending](state) {
      state.loading = true;
    },
    [fetchOrderByAddress.fulfilled](state, {payload}) {
      state.loading = false;

      if (Array.isArray(payload.data))
        state.order = payload.data[payload.data.length - 1] || {};

      if (Array.isArray(payload.priceHistory))
        state.priceHistory = payload.priceHistory;
    },
    [fetchOrderByAddress.rejected](state) {
      state.loading = false;
    },
  }
});

export const orderState = (state) => state[orderSlice.name];
export const orderActions = orderSlice.actions;
