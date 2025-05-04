import { createAsyncThunk } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";
const initialState={
    loggedInUser:null,
    error:null,
    status:"idle",
}
export const Register = createAsyncThunk(
    "user/create",
    async (UserDetails, { rejectWithValue }) => {
      try {
        const response = await axios.post(`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/auth/register`, UserDetails);
        return response.data;
      } catch (error) {
        if (error.response && error.response.data) {
          return rejectWithValue(error.response.data.message);
        } else {
          return rejectWithValue(error.message);
        }
      }
    }
  );
  
  export const Login = createAsyncThunk(
    "user/login",
    async (UserDetails, { rejectWithValue }) => {
      try {
        const response = await axios.post(`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/auth/login`, UserDetails);
        return response.data;
      } catch (error) {
        if (error.response && error.response.data) {
          return rejectWithValue(error.response.data.message);
        } else {
          return rejectWithValue(error.message);
        }
      }
    }
  );
  export const Logout = createAsyncThunk(
    "user/logout",
    async (_, { rejectWithValue }) => {
        try {
            return 1;
        } catch (error) {
            console.error("Logout error:", error);
            return rejectWithValue(error.message);
        }
    }
);

const authSlice=createSlice({
    name:"authSlice",
    initialState,
    reducers:{},
    extraReducers:(builder)=>{
        builder
        .addCase(Register.pending,(state)=>{
            state.status="loading";
        })
        .addCase(Register.fulfilled,(state)=>{
            state.status="signupfulfilled";
            toast.success("User Registered Successfully");
        })
        .addCase(Register.rejected, (state, action) => {
            state.status = "signuperror";
            state.error = action.payload || action.error.message;
            toast.error(action.payload || action.error.message);
          })
          
        .addCase(Login.pending,(state)=>{
            state.status="loading";

        })
        .addCase(Login.fulfilled,(state,action)=>{
            state.status="loginfulfilled";
            state.loggedInUser=action.payload;
            toast.success("Logged In Successfully");

        })
        .addCase(Login.rejected, (state, action) => {
            state.status = "loginerror";
            state.error = action.payload || action.error.message;
            toast.error(action.payload || action.error.message);
          })
        .addCase(Logout.pending,(state)=>{
            state.status="loading";
        })
        .addCase(Logout.fulfilled,(state)=>{
            state.status="fulfilled";
            state.loggedInUser=null;
        })
        .addCase(Logout.rejected,(state,action)=>{
            state.status="error";
            state.error=action.error;
        })
    }

})
export const selectLoggedinUser=(state)=>state.auth.loggedInUser;
export const selectStatus=(state)=>state.auth.status;

export default authSlice.reducer;