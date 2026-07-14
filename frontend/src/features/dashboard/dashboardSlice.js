import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import dashboardApi from "../../api/dashboardApi";
import { getErrorMessage } from "../../api/axiosInstance";

const initialState = {
  ngoDashboard: null,
  platformAnalytics: null,
  ngoDashboardStatus: "idle",
  analyticsStatus: "idle",
  error: null
};

export const fetchNgoDashboard = createAsyncThunk(
  "dashboard/fetchNgoDashboard",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await dashboardApi.getNgoDashboard();
      return data.dashboard;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const fetchPlatformAnalytics = createAsyncThunk(
  "dashboard/fetchPlatformAnalytics",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await dashboardApi.getAnalytics();
      return data.analytics;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

const dashboardSlice = createSlice({
  name: "dashboard",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchNgoDashboard.pending, (state) => {
        state.ngoDashboardStatus = "loading";
      })
      .addCase(fetchNgoDashboard.fulfilled, (state, action) => {
        state.ngoDashboardStatus = "succeeded";
        state.ngoDashboard = action.payload;
      })
      .addCase(fetchNgoDashboard.rejected, (state, action) => {
        state.ngoDashboardStatus = "failed";
        state.error = action.payload;
      })
      .addCase(fetchPlatformAnalytics.pending, (state) => {
        state.analyticsStatus = "loading";
      })
      .addCase(fetchPlatformAnalytics.fulfilled, (state, action) => {
        state.analyticsStatus = "succeeded";
        state.platformAnalytics = action.payload;
      })
      .addCase(fetchPlatformAnalytics.rejected, (state, action) => {
        state.analyticsStatus = "failed";
        state.error = action.payload;
      });
  }
});

export const selectNgoDashboard = (state) => state.dashboard.ngoDashboard;
export const selectNgoDashboardStatus = (state) =>
  state.dashboard.ngoDashboardStatus;
export const selectPlatformAnalytics = (state) =>
  state.dashboard.platformAnalytics;

export default dashboardSlice.reducer;
