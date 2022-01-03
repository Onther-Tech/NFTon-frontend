import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import IndexAPI from "../api/v2";

const namespace = 'home';

const initialState = {
  loading: false,
  items: [],
  collections: [],
};

export const fetchNew = createAsyncThunk(
  namespace + '/fetchNew',
  async () => {
    return await IndexAPI.fetchOrders({});
  }
)

export const fetchTrendOrders = createAsyncThunk(
  namespace + '/fetchTrendOrders',
  async (params) => {
    return await IndexAPI.fetchTrendOrders(params);
  }
)

export const fetchHotCollections = createAsyncThunk(
  namespace + '/fetchHotCollections',
  async (params) => {
    return await IndexAPI.fetchHotCollections(params);
  }
)

export const homeSlice = createSlice({
  name: namespace,
  initialState: initialState,
  reducers: {
    setLoading: (state, {payload}) => {
      return {...state, loading: payload};
    },
    clearItems: (state) => {
      return {...state, items: initialState.items};
    }
  },
  extraReducers: {
    [fetchNew.pending]: (state) => {
      state.loading = true;
    },
    [fetchNew.fulfilled]: (state, {payload}) => {
      state.loading = false;

      if (Array.isArray(payload.data))
        state.items = payload.data;
    },
    [fetchNew.rejected]: (state) => {
      state.loading = false;
    },
    [fetchTrendOrders.pending]: (state) => {
      state.loading = true;
    },
    [fetchTrendOrders.fulfilled]: (state, {payload}) => {
      state.loading = false;

      if (Array.isArray(payload.data))
        state.items = payload.data;
    },
    [fetchTrendOrders.rejected]: (state) => {
      state.loading = false;
    },
    [fetchHotCollections.pending]: (state) => {
      state.loading = true;
    },
    [fetchHotCollections.fulfilled]: (state, {payload}) => {
      state.loading = false;

      if (Array.isArray(payload.data))
        state.collections = payload.data;
    },
    [fetchHotCollections.rejected]: (state) => {
      state.loading = false;
    },
  }
});

export const homeState = (state) => state[homeSlice.name];
export const homeActions = homeSlice.actions;
