import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import NftAPI from "../api/v2/nft";
import IndexAPI from "../api/v2";

const namespace = 'category';

const initialState = {
  loading: false,
  categories: [],
  categoriesForDropdown: [],
};

export const fetchCategories = createAsyncThunk(
  namespace + '/fetchCategories',
  async () => {
    return await IndexAPI.fetchCategories({});
  }
)

export const categorySlice = createSlice({
  name: namespace,
  initialState: initialState,
  reducers: {
    setLoading: (state, {payload}) => {
      return {...state, loading: payload};
    }
  },
  extraReducers: {
    [fetchCategories.pending]: (state) => {
      state.loading = true;
    },
    [fetchCategories.fulfilled]: (state, {payload}) => {
      state.loading = false;

      if(Array.isArray(payload.data)) {
        state.categories = payload.data;
        state.categoriesForDropdown = payload.data.map(x => ({
          value: x.idcategories,
          label: x.name
        }));
      }
    },
    [fetchCategories.rejected]: (state) => {
      state.loading = false;
    },
  }
});

export const categoryState = (state) => state[categorySlice.name];
export const categoryActions = categorySlice.actions;
