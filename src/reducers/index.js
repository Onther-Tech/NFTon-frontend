import {combineReducers} from "redux";
import {userSlice} from './user';
import {homeSlice} from './home';
import {marketplaceSlice} from './marketplace'
import {mintSlice} from "./mint";
import {orderSlice} from "./order";
import {collectionSlice} from "./collection";
import {categorySlice} from "./category";

export default combineReducers({
  [userSlice.name]: userSlice.reducer,
  [homeSlice.name]: homeSlice.reducer,
  [marketplaceSlice.name]: marketplaceSlice.reducer,
  [mintSlice.name]: mintSlice.reducer,
  [orderSlice.name]: orderSlice.reducer,
  [collectionSlice.name]: collectionSlice.reducer,
  [categorySlice.name]: categorySlice.reducer
});
