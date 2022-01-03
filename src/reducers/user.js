import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import UserAPI from "../api/v2/user";
import NftAPI from "../api/v2/nft";
import IndexAPI from "../api/v2";
import produce from "immer";

const namespace = 'user';

const initialState = {
  address: null,
  loading: false,
  idprofiles: null,
  me: {},
  profile: {},
  items: [],
  favorites: [],
};

export const accessToken = createAsyncThunk(
  namespace + '/accessToken',
  async (params, thunkAPI) => {
    return await UserAPI.accessToken(params);
  }
);

export const fetchAccessToken = createAsyncThunk(
  namespace + '/fetchAccessToken',
  async (params) => {
    return await UserAPI.fetchAccessToken(params);
  }
)

export const fetchMyProfile = createAsyncThunk(
  namespace + '/fetchMyProfile',
  async (params, thunkAPI) => {
    const address = thunkAPI.getState()[namespace].address;
    return await UserAPI.fetchProfile({address});
  }
)

export const fetchProfile = createAsyncThunk(
  namespace + '/fetchProfile',
  async (params) => {
    return await UserAPI.fetchProfile(params);
  }
)

export const updateProfile = createAsyncThunk(
  namespace + '/updateProfile',
  async (params) => {
    return await UserAPI.updateProfile(params);
  }
)

export const fetchAssets = createAsyncThunk(
  namespace + "/fetchAssets",
  async (params) => {
    return await NftAPI.assets(params);
  }
)

export const fetchFavoriteOrders = createAsyncThunk(
  namespace + '/fetchFavoriteOrders',
  async (params) => {
    return await IndexAPI.fetchFavoriteOrders(params);
  }
)

export const userSlice = createSlice({
  name: 'user',
  initialState: initialState,
  reducers: {
    setAddress(state, {payload}) {
      return {...state, address: payload}
    },
    clearAddress(state) {
      return {...state, address: initialState.address}
    },
    setProfile(state, {payload}) {
      return {...state, profile: {...state.profile, ...payload}};
    },
    setItems(state, {payload}) {
      return {...state, items: payload};
    },
    updateItem(state, {payload}) {
      return produce(state, d => {
        d.items[payload.index] = payload.item;
      });
    },
    clearItems(state) {
      return {...state, items: initialState.items};
    }
  },
  extraReducers: {
    [accessToken.pending]: (state, action) => {
      state.loading = true;
    },
    [accessToken.fulfilled]: (state, action) => {
      state.loading = false;
    },
    [accessToken.rejected]: (state, action) => {
      state.loading = false;
    },

    [fetchAccessToken.pending]: (state, action) => {
      state.loading = true;
    },
    [fetchAccessToken.fulfilled]: (state, action) => {
      state.loading = false;
      state.idprofiles = action.payload.idprofiles
    },
    [fetchAccessToken.rejected]: (state, action) => {
      state.loading = false;
    },

    [fetchMyProfile.pending]: (state, action) => {
      state.loading = true;
    },
    [fetchMyProfile.fulfilled]: (state, action) => {
      state.loading = false;

      if (action.payload.data.length > 0) {
        const profile = action.payload.data[0];
        state.me = profile;
      }
    },
    [fetchMyProfile.rejected]: (state, action) => {
      state.loading = false;
    },

    [fetchProfile.pending]: (state, action) => {
      state.loading = true;
    },
    [fetchProfile.fulfilled]: (state, action) => {
      state.loading = false;

      if (action.payload.data.length > 0) {
        const profile = action.payload.data[0];
        state.profile = profile;
      }
    },
    [fetchProfile.rejected]: (state, action) => {
      state.loading = false;
    },
    [updateProfile.pending]: (state, action) => {
      state.loading = true;
    },
    [updateProfile.fulfilled]: (state, action) => {
      state.loading = false;
      state.me = {...state.me, ...action.payload.data};
    },
    [updateProfile.rejected]: (state, action) => {
      state.loading = false;
    },
    [fetchAssets.pending]: (state, action) => {
      state.loading = true;
    },
    [fetchAssets.fulfilled]: (state, action) => {
      state.loading = false;
      state.items = action.payload?.data
    },
    [fetchAssets.rejected]: (state, action) => {
      state.loading = false;
    },
    [fetchFavoriteOrders.pending]: (state, action) => {
      state.loading = true;
    },
    [fetchFavoriteOrders.fulfilled]: (state, action) => {
      state.loading = false;
      state.favorites = action.payload?.data
    },
    [fetchFavoriteOrders.rejected]: (state, action) => {
      state.loading = false;
    }
  }
});

export const userState = (state) => state[userSlice.name];
export const userActions = userSlice.actions;
