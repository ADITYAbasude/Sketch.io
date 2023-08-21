import thunk from "redux-thunk";
import { composeWithDevTools } from "redux-devtools-extension";
import { reducers } from "./CombineReducers";
import { legacy_createStore, applyMiddleware } from "redux";

export const store = legacy_createStore(
  reducers,
  {},
  composeWithDevTools(applyMiddleware(thunk))
);
