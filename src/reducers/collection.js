import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import IndexAPI from "../api/v2";

const namespace = 'collection';

const initialState = {
  loading: false,
  collections: [],
  linkedContracts: [],
  collection: {},
};

export const registerCollection = createAsyncThunk(
  namespace + '/registerCollection',
  async (params) => {
    return await IndexAPI.registerCollection(params);
  }
)

export const updateCollection = createAsyncThunk(
  namespace + '/updateCollection',
  async (params) => {
    return await IndexAPI.updateCollection(params);
  }
)

export const fetchMyCollections = createAsyncThunk(
  namespace + '/fetchMyCollections',
  async (params) => {
    return await IndexAPI.fetchMyCollections(params);
  }
)

export const fetchCollection = createAsyncThunk(
  namespace + '/fetchCollection',
  async (params) => {
    return await IndexAPI.fetchCollection(params);
  }
)

export const fetchLinkedContracts = createAsyncThunk(
  namespace + '/fetchLinkedContracts',
  async (params) => {
    return await IndexAPI.fetchLinkedContracts(params);
  }
)

export const linkContract = createAsyncThunk(
  namespace + '/linkContract',
  async (params) => {
    return await IndexAPI.linkContract(params);
  }
)

export const collectionSlice = createSlice({
  name: namespace,
  initialState: initialState,
  reducers: {
    setLoading: (state, {payload}) => {
      return {...state, loading: payload};
    },
    setCollection: (state, {payload}) => {
      return {...state, collection: payload};
    },
    clearCollection: (state) => {
      return {...state, collection: initialState.collection};
    }
  },
  extraReducers: {
    [fetchMyCollections.pending]: (state) => {
      state.loading = true;
    },
    [fetchMyCollections.fulfilled]: (state, {payload}) => {
      state.loading = false;
      state.collections = payload.data;
    },
    [fetchMyCollections.rejected]: (state) => {
      state.loading = false;
    },
    [fetchLinkedContracts.pending]: (state) => {
      state.loading = true;
    },
    [fetchLinkedContracts.fulfilled]: (state, {payload}) => {
      state.loading = false;
      state.linkedContracts = payload.data;
    },
    [fetchLinkedContracts.rejected]: (state) => {
      state.loading = false;
    },
    [fetchCollection.pending]: (state) => {
      state.loading = true;
    },
    [fetchCollection.fulfilled]: (state, {payload}) => {
      state.loading = false;

      if (Array.isArray(payload.data)) {
        state.collection = payload.data[0] || {};
      }
    },
    [fetchCollection.rejected]: (state) => {
      state.loading = false;
    },
  }
});

export const collectionState = (state) => state[collectionSlice.name];
export const collectionActions = collectionSlice.actions;
