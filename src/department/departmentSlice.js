import { createAsyncThunk } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";
const initialState = {
  departments: [],
  department: null,
};
export const CreateDepartment = createAsyncThunk(
  "dept/createdept",
  async (Details, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        "http://localhost:5000/api/department",
        Details
      );
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

export const GetDepartmentById = createAsyncThunk(
  "dept/getdept",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/department/" + id
      );
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

export const AddEmployee = createAsyncThunk(
  "dept/addemployee",
  async (Details, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        "http://localhost:5000/api/addemployee/" + Details.id,
        Details.object
      );
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

export const AssignHead = createAsyncThunk(
  "dept/assignhead",
  async (Details, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        "http://localhost:5000/api/assignadmin/" + Details.id,
        Details.object
      );
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

export const RemoveEmployee = createAsyncThunk(
  "dept/removeemployee",
  async (Details, { rejectWithValue }) => {
    try {
      const response = await axios.delete(
        "http://localhost:5000/api/departments/" + Details.deptId +"/employees/"+Details.employeeId);
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

export const RemoveHead = createAsyncThunk(
  "dept/removehead",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.delete(
        "http://localhost:5000/api/removehead/" + id);
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

const deptSlice = createSlice({
  name: "deptSlice",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(CreateDepartment.pending, (state) => {
        state.status = "loading";
      })
      .addCase(CreateDepartment.fulfilled, (state) => {
        state.status = "fulfilled";
        toast.success("Department created successfully");
      })
      .addCase(CreateDepartment.rejected, (state, action) => {
        state.status = "error";
        state.error = action.payload || action.error.message;
        toast.error(action.payload || action.error.message);
      })
      .addCase(GetDepartmentById.pending, (state) => {
        state.status = "loading";
      })
      .addCase(GetDepartmentById.fulfilled, (state, action) => {
        state.status = "fulfilled";
        state.department = action.payload;
      })
      .addCase(GetDepartmentById.rejected, (state, action) => {
        state.status = "error";
        state.error = action.payload || action.error.message;
        toast.error(action.payload || action.error.message);
      })

      .addCase(AddEmployee.pending, (state) => {
        state.status = "loading";
      })
      .addCase(AddEmployee.fulfilled, (state) => {
        state.status = "fulfilled";
        toast.success("Employee Added Successfully");
      })
      .addCase(AddEmployee.rejected, (state, action) => {
        state.status = "error";
        state.error = action.payload || action.error.message;
        toast.error(action.payload || action.error.message);
      })
      .addCase(AssignHead.pending, (state) => {
        state.status = "loading";
      })
      .addCase(AssignHead.fulfilled, (state) => {
        state.status = "fulfilled";
        toast.success("Head Assigned Successfully");
      })
      .addCase(AssignHead.rejected, (state, action) => {
        state.status = "error";
        state.error = action.payload || action.error.message;
        toast.error(action.payload || action.error.message);
      })
      .addCase(RemoveEmployee.pending, (state) => {
        state.status = "loading";
      })
      .addCase(RemoveEmployee.fulfilled, (state) => {
        state.status = "fulfilled";
        toast.success("Employee Removed Successfully");
      })
      .addCase(RemoveEmployee.rejected, (state, action) => {
        state.status = "error";
        state.error = action.payload || action.error.message;
        toast.error(action.payload || action.error.message);
      })
      .addCase(RemoveHead.pending, (state) => {
        state.status = "loading";
      })
      .addCase(RemoveHead.fulfilled, (state) => {
        state.status = "fulfilled";
        toast.success("Head Removed Successfully");
      })
      .addCase(RemoveHead.rejected, (state, action) => {
        state.status = "error";
        state.error = action.payload || action.error.message;
        toast.error(action.payload || action.error.message);
      });
  },
});
export const selectDepartments = (state) => state.dept.departments;
export const selectDepartment = (state) => state.dept.department;

export default deptSlice.reducer;
