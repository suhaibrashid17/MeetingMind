import { createAsyncThunk } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";

const initialState = {
  meeting: null,
  organizedmeetings: [],
  attendedmeetings: [],
};

export const CreateMeeting = createAsyncThunk(
  "meeting/createmeeting",
  async (Details, { rejectWithValue }) => {
    console.log(Details);
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/meeting`,
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


export const DeleteMeeting = createAsyncThunk(
  "meeting/deletemeeting",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.delete(
        `${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/meeting/`+id);
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


export const GetAttendedMeetings = createAsyncThunk(
  "meeting/attendedmeeting",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/getattendedmeetings/` + id
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

export const GetMeeting = createAsyncThunk(
  "meeting/getmeeting",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/meeting/` + id
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

export const GetOrganizedMeetings = createAsyncThunk(
  "meeting/organizedmeeting",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/getorganizedmeetings/` + id
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

export const ChangeMeetingStatus = createAsyncThunk(
  "meeting/changestatus",
  async ({ id, status }, { rejectWithValue }) => {
    try {
      const response = await axios.patch(
        `${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/meeting/${id}/status`,
        { status }
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

const meetingSlice = createSlice({
  name: "meetingSlice",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(CreateMeeting.pending, (state) => {
        state.status = "loading";
      })
      .addCase(CreateMeeting.fulfilled, (state) => {
        state.status = "fulfilled";
        toast.success("Meeting created successfully");
      })
      .addCase(CreateMeeting.rejected, (state, action) => {
        state.status = "error";
        state.error = action.payload || action.error.message;
        toast.error(action.payload || action.error.message);
      })
      .addCase(DeleteMeeting.pending, (state) => {
        state.status = "loading";
      })
      .addCase(DeleteMeeting.fulfilled, (state) => {
        state.status = "fulfilled";
        toast.success("Meeting deleted successfully");
      })
      .addCase(DeleteMeeting.rejected, (state, action) => {
        state.status = "error";
        state.error = action.payload || action.error.message;
        toast.error(action.payload || action.error.message);
      })
      .addCase(GetAttendedMeetings.pending, (state) => {
        state.status = "loading";
      })
      .addCase(GetAttendedMeetings.fulfilled, (state, action) => {
        state.status = "fulfilled";
        state.attendedmeetings = [];
        console.log(action.payload);
        action.payload.meetings.forEach((element) => {
          state.attendedmeetings.push(element);
        });
      })
      .addCase(GetAttendedMeetings.rejected, (state, action) => {
        state.status = "error";
        state.error = action.payload || action.error.message;
        toast.error(action.payload || action.error.message);
      })
      .addCase(GetOrganizedMeetings.pending, (state) => {
        state.status = "loading";
      })
      .addCase(GetOrganizedMeetings.fulfilled, (state, action) => {
        state.status = "fulfilled";
        state.organizedmeetings = [];
        console.log(action.payload);
        action.payload.meetings.forEach((element) => {
          state.organizedmeetings.push(element);
        });
      })
      .addCase(GetOrganizedMeetings.rejected, (state, action) => {
        state.status = "error";
        state.error = action.payload || action.error.message;
        toast.error(action.payload || action.error.message);
      })
      .addCase(GetMeeting.pending, (state) => {
        state.status = "loading";
      })
      .addCase(GetMeeting.fulfilled, (state, action) => {
        state.status = "fulfilled";
        state.meeting = action.payload;
      })
      .addCase(GetMeeting.rejected, (state, action) => {
        state.status = "error";
        state.error = action.payload || action.error.message;
        toast.error(action.payload || action.error.message);
      })
      .addCase(ChangeMeetingStatus.pending, (state) => {
        state.status = "loading";
      })
      .addCase(ChangeMeetingStatus.fulfilled, (state, action) => {
        state.status = "fulfilled";
        if (state.meeting && state.meeting._id === action.payload.meeting._id) {
          state.meeting.status = action.payload.meeting.status;
        }
        toast.success("Meeting status updated successfully");
      })
      .addCase(ChangeMeetingStatus.rejected, (state, action) => {
        state.status = "error";
        state.error = action.payload || action.error.message;
        toast.error(action.payload || action.error.message);
      });
  },
});

export const selectOrganizedMeetings = (state) => state.meeting.organizedmeetings;
export const selectAttendedMeetings = (state) => state.meeting.attendedmeetings;
export const selectMeeting = (state) => state.meeting.meeting;

export default meetingSlice.reducer;