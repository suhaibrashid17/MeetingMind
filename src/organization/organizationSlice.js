import { createAsyncThunk } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";
const initialState={
    O:[],
    H:[],
    E:[],
    organization : null,
}
export const GetOwned = createAsyncThunk(
    "org/getowned",
    async (id, { rejectWithValue }) => {
      try {
        const response = await axios.get("http://localhost:5000/api/getownedorganizations", {
           
            params: {
                userId:id,
            },
        });
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
  
  export const GetHeaded = createAsyncThunk(
    "org/getheaded",
    async (id, { rejectWithValue }) => {
      try {
        const response = await axios.get("http://localhost:5000/api/getheadeddepartments", {
           
          params: {
              userId:id,
          },
      });
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
  export const GetEmployed = createAsyncThunk(
    "org/getemployed",
    async (id, { rejectWithValue }) => {
      try {
        const response = await axios.get("http://localhost:5000/api/getemployeeroles", {
           
          params: {
              userId:id,
          },
      });
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
  export const CreateOrganization = createAsyncThunk(
    "org/create",
    async (OrgDetails, { rejectWithValue }) => {
      try {
        const response = await axios.post("http://localhost:5000/api/organization", OrgDetails);
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
  export const GetOrganizationById = createAsyncThunk(
    "org/get",
    async (ID, { rejectWithValue }) => {
      try {
        const response = await axios.get("http://localhost:5000/api/organization/"+ID);
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
  export const GetDeptByOrgId = createAsyncThunk(
    "org/getdept",
    async (ID, { rejectWithValue }) => {
      try {
        const response = await axios.get("http://localhost:5000/api/organization/"+ID);
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

const orgSlice=createSlice({
    name:"orgSlice",
    initialState,
    reducers:{},
    extraReducers:(builder)=>{
        builder
        .addCase(GetOwned.pending,(state)=>{
            state.status="loading";
        })
        .addCase(GetOwned.fulfilled,(state, action)=>{
            state.status="fulfilled";
            state.O = []
            action.payload.forEach(element => {
                
                state.O.push(element)
            });
            
        })
        .addCase(GetOwned.rejected, (state, action) => {
            state.status = "error";
            state.error = action.payload || action.error.message;
            toast.error(action.payload || action.error.message);
          })
          
        .addCase(GetHeaded.pending,(state)=>{
            state.status="loading";

        })
        .addCase(GetHeaded.fulfilled,(state,action)=>{
            state.status="fulfilled";
            state.H = []
            action.payload.forEach(element => {
                
              state.H.push(element)
          });
        })
        .addCase(GetHeaded.rejected, (state, action) => {
            state.status = "error";
            state.error = action.payload || action.error.message;
            toast.error(action.payload || action.error.message);
          })
          .addCase(GetEmployed.pending,(state)=>{
            state.status="loading";

        })
        .addCase(GetEmployed.fulfilled,(state,action)=>{
            state.status="fulfilled";
            state.E = []

            action.payload.forEach(element => {
                
              state.E.push(element)
          });
        })
        .addCase(GetEmployed.rejected, (state, action) => {
            state.status = "error";
            state.error = action.payload || action.error.message;
            toast.error(action.payload || action.error.message);
          })
          .addCase(CreateOrganization.pending,(state)=>{
            state.status="loading";

        })
        .addCase(CreateOrganization.fulfilled,(state)=>{
            state.status="fulfilled";
            toast.success("Organization Created Successfully!")
        })
        .addCase(CreateOrganization.rejected, (state, action) => {
            state.status = "error";
            state.error = action.payload || action.error.message;
            toast.error(action.payload || action.error.message);
          })
          .addCase(GetOrganizationById.pending,(state)=>{
            state.status="loading";

        })
        .addCase(GetOrganizationById.fulfilled,(state, action)=>{
            state.status="fulfilled";
            state.organization = action.payload;
        })
        .addCase(GetOrganizationById.rejected, (state, action) => {
            state.status = "error";
            state.error = action.payload || action.error.message;
            toast.error(action.payload || action.error.message);
          })
    }

})
export const selectOwned=(state)=>state.org.O;
export const selectHeaded=(state)=>state.org.H;
export const selectEmployed=(state)=>state.org.E;
export const selectOrganization=(state)=>state.org.organization;
export default orgSlice.reducer;