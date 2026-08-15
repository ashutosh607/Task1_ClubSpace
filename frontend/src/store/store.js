import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./auth-slice";
import adminReducer from "./admin-slice";
import userReducer from "./user-slice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    admin: adminReducer,
    user: userReducer,
  },
});

export default store;

