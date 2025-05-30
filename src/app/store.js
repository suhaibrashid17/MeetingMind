import { combineReducers, configureStore } from "@reduxjs/toolkit";
import authReducer from "../auth/authSlice";
import orgReducer from "../organization/organizationSlice";
import deptReducer from "../department/departmentSlice"
import meetingReducer from "../meeting/meetingSlice"
import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";

const configStore = {
    key: "root",
    version: 1,
    storage,
    whitelist: ["auth"], 
};

const reducers = combineReducers({
    auth: authReducer,
    org: orgReducer,
    dept:deptReducer,
    meeting: meetingReducer,
});

const persistedReducer = persistReducer(configStore, reducers);

export const store = configureStore({
    reducer: persistedReducer,
});