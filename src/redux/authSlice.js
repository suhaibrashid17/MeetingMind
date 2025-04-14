import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../api/axios';

// auto-login from cookie
export const checkAuth = createAsyncThunk('auth/checkAuth', async (_, thunkAPI) => {
  try {
    const res = await axios.get('/auth/check');
    return res.data.user;
  } catch (err) {
    return thunkAPI.rejectWithValue('Not authenticated');
  }
});

export const loginUser = createAsyncThunk('auth/loginUser', async (credentials, thunkAPI) => {
  try {
    const res = await axios.post('/auth/login', credentials);
    return res.data.user;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data?.message || 'Login failed');
  }
});

export const logoutUser = createAsyncThunk('auth/logoutUser', async () => {
  await axios.post('/auth/logout');
});

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    isAuthenticated: false,
    loading: false,
    error: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(checkAuth.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(checkAuth.rejected, (state) => {
        state.user = null;
        state.isAuthenticated = false;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.isAuthenticated = false;
      });
  },
});

export const { clearError } = authSlice.actions;
export default authSlice.reducer;
