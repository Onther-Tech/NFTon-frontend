import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import IndexAPI from "../api/v2";

const namespace = 'marketplace';

const initialState = {
  loading: true,
  orders: []
};

export const fetchOrders = createAsyncThunk(
  namespace + '/fetchOrders',
  async (params, thunkAPI) => {
    return await IndexAPI.fetchOrders(params);
  }
);

export const marketplaceSlice = createSlice({
  name: namespace,
  initialState: initialState,
  reducers: {
    clearItems: (state) => {
      return {
        ...state,
        loading: initialState.loading,
        orders: initialState.orders,
      }
    }
  },
  extraReducers: (builder) => {
    builder.addCase(fetchOrders.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(fetchOrders.fulfilled, (state, action) => {
      state.loading = false;
      state.orders = action.payload?.data
    });
    builder.addCase(fetchOrders.rejected, (state, action) => {
      state.loading = false;
    });
  }
});

export const marketplaceState = (state) => state[marketplaceSlice.name];
export const marketplaceActions = marketplaceSlice.actions;
