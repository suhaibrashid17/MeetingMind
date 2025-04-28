import {combineReducers,configureStore} from "@reduxjs/toolkit";
import authReducer from "../Auth/AuthSlice";
import storage from "redux-persist/lib/storage";

const configStore={
    key:"root",
    version:1,
    storage
}
const reducers=combineReducers({
    auth:authReducer,
});

export const store=configureStore({
    reducer:reducers,
})