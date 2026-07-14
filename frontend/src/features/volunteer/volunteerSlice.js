import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import volunteerApi from "../../api/volunteerApi";
import { getErrorMessage } from "../../api/axiosInstance";
import { setVolunteerId } from "../../utils/storage";

const initialState = {
  dashboard: null,
  profileCreated: false,
  dashboardStatus: "idle",
  profileStatus: "idle",
  error: null
};

export const createVolunteerProfile = createAsyncThunk(
  "volunteer/createProfile",
  async (payload, { rejectWithValue }) => {
    try {
      const { data } = await volunteerApi.createProfile(payload);
      return data.volunteer;
    } catch (error) {
      return rejectWithValue(
        getErrorMessage(error, "Could not create volunteer profile")
      );
    }
  }
);

export const fetchVolunteerDashboard = createAsyncThunk(
  "volunteer/fetchDashboard",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await volunteerApi.getDashboard();
      return data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

const volunteerSlice = createSlice({
  name: "volunteer",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createVolunteerProfile.pending, (state) => {
        state.profileStatus = "loading";
      })
      .addCase(createVolunteerProfile.fulfilled, (state, action) => {
        state.profileStatus = "succeeded";
        state.profileCreated = true;
        if (action.payload?._id) {
          setVolunteerId(action.payload._id);
        }
      })
      .addCase(createVolunteerProfile.rejected, (state, action) => {
        state.profileStatus = "failed";
        state.error = action.payload;
      })
      .addCase(fetchVolunteerDashboard.pending, (state) => {
        state.dashboardStatus = "loading";
      })
      .addCase(fetchVolunteerDashboard.fulfilled, (state, action) => {
        state.dashboardStatus = "succeeded";
        state.dashboard = action.payload;
      })
      .addCase(fetchVolunteerDashboard.rejected, (state, action) => {
        state.dashboardStatus = "failed";
        state.error = action.payload;
      });
  }
});

export const selectVolunteerDashboard = (state) => state.volunteer.dashboard;
export const selectVolunteerDashboardStatus = (state) =>
  state.volunteer.dashboardStatus;
export const selectVolunteerProfileStatus = (state) =>
  state.volunteer.profileStatus;

export default volunteerSlice.reducer;
