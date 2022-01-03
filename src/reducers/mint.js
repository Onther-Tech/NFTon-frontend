import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import NftAPI from "../api/v2/nft";

const namespace = 'mint';

const initialState = {
  loading: false,
};

export const mints = createAsyncThunk(
  namespace + '/mints',
  async (params) => {
    return await NftAPI.mints(params);
  }
)

export const mintSlice = createSlice({
  name: namespace,
  initialState: initialState,
  reducers: {
    setLoading: (state, {payload}) => {
      return {...state, loading: payload};
    }
  },
  extraReducers: (builder) => {

  }
});

export const mintState = (state) => state[mintSlice.name];
export const mintActions = mintSlice.actions;
