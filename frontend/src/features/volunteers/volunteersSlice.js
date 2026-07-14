import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import volunteerApi from "../../api/volunteerApi";
import { getErrorMessage } from "../../api/axiosInstance";

const initialState = {
  availableVolunteers: [],
  status: "idle",
  error: null,
};

export const fetchAvailableVolunteers = createAsyncThunk(
  "volunteers/fetchAvailable",
  async (_, { rejectWithValue }) => {
    try {
      const response = await volunteerApi.getAvailable();

console.log("Thunk Response");

console.log(response);

const data = response.data;
      console.log(data);

      return data.volunteers;
    } catch (error) {
      return rejectWithValue(
        getErrorMessage(error, "Failed to load volunteers")
      );
    }
  }
);

const volunteersSlice = createSlice({
  name: "volunteers",
  initialState,
  reducers: {},

  extraReducers: (builder) => {
    builder

      .addCase(fetchAvailableVolunteers.pending, (state) => {
        state.status = "loading";
      })

      .addCase(fetchAvailableVolunteers.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.availableVolunteers = action.payload;
      })

      .addCase(fetchAvailableVolunteers.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export const selectAvailableVolunteers = (state) =>
  state.volunteers.availableVolunteers;

export const selectVolunteersStatus = (state) =>
  state.volunteers.status;

export default volunteersSlice.reducer;