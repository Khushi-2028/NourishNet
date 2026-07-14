import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import donationsApi from "../../api/donationsApi";
import { getErrorMessage } from "../../api/axiosInstance";

const initialState = {
  list: [],
  total: 0,
  page: 1,
  pages: 1,
  filters: {
    search: "",
    foodType: "",
    status: "",
    city: "",
    sort: ""
  },
  current: null,
  stats: null,
  listStatus: "idle",
  detailStatus: "idle",
  mutationStatus: "idle",
  error: null
};

export const fetchDonations = createAsyncThunk(
  "donations/fetchAll",
  async (params = {}, { rejectWithValue }) => {
    try {
      const { data } = await donationsApi.getAll(params);
      return data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const fetchDonationById = createAsyncThunk(
  "donations/fetchById",
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await donationsApi.getById(id);
      return data.donation;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const fetchDonationStats = createAsyncThunk(
  "donations/fetchStats",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await donationsApi.getStats();
      return data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const createDonation = createAsyncThunk(
  "donations/create",
  async (formData, { rejectWithValue }) => {
    try {
      const { data } = await donationsApi.create(formData);
      return data.donation;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error, "Could not create donation"));
    }
  }
);

export const updateDonation = createAsyncThunk(
  "donations/update",
  async ({ id, payload }, { rejectWithValue }) => {
    try {
      const { data } = await donationsApi.update(id, payload);
      return data.donation;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error, "Could not update donation"));
    }
  }
);

export const deleteDonation = createAsyncThunk(
  "donations/delete",
  async (id, { rejectWithValue }) => {
    try {
      await donationsApi.remove(id);
      return id;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error, "Could not delete donation"));
    }
  }
);

export const updateDonationStatus = createAsyncThunk(
  "donations/updateStatus",
  async ({ id, status }, { rejectWithValue }) => {
    try {
      const { data } = await donationsApi.updateStatus(id, status);
      return data.donation;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error, "Could not update status"));
    }
  }
);

const donationsSlice = createSlice({
  name: "donations",
  initialState,
  reducers: {
    setDonationFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    resetDonationFilters: (state) => {
      state.filters = initialState.filters;
    },
    clearCurrentDonation: (state) => {
      state.current = null;
    },
    prependDonation: (state, action) => {
      // Used when the "new_donation" socket event fires live.
      const exists = state.list.some((d) => d._id === action.payload._id);
      if (!exists) {
        state.list = [action.payload, ...state.list];
        state.total += 1;
      }
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDonations.pending, (state) => {
        state.listStatus = "loading";
      })
      .addCase(fetchDonations.fulfilled, (state, action) => {
        state.listStatus = "succeeded";
        state.list = action.payload.donations || [];
        state.total = action.payload.total || 0;
        state.page = action.payload.page || 1;
        state.pages = action.payload.pages || 1;
      })
      .addCase(fetchDonations.rejected, (state, action) => {
        state.listStatus = "failed";
        state.error = action.payload;
      })
      .addCase(fetchDonationById.pending, (state) => {
        state.detailStatus = "loading";
      })
      .addCase(fetchDonationById.fulfilled, (state, action) => {
        state.detailStatus = "succeeded";
        state.current = action.payload;
      })
      .addCase(fetchDonationById.rejected, (state, action) => {
        state.detailStatus = "failed";
        state.error = action.payload;
      })
      .addCase(fetchDonationStats.fulfilled, (state, action) => {
        state.stats = action.payload;
      })
      .addCase(createDonation.pending, (state) => {
        state.mutationStatus = "loading";
      })
      .addCase(createDonation.fulfilled, (state, action) => {
        state.mutationStatus = "succeeded";
        state.list = [action.payload, ...state.list];
      })
      .addCase(createDonation.rejected, (state, action) => {
        state.mutationStatus = "failed";
        state.error = action.payload;
      })
      .addCase(updateDonation.fulfilled, (state, action) => {
        state.list = state.list.map((d) =>
          d._id === action.payload._id ? action.payload : d
        );
        if (state.current?._id === action.payload._id) {
          state.current = action.payload;
        }
      })
      .addCase(deleteDonation.fulfilled, (state, action) => {
        state.list = state.list.filter((d) => d._id !== action.payload);
        state.total = Math.max(0, state.total - 1);
      })
      .addCase(updateDonationStatus.fulfilled, (state, action) => {
        state.list = state.list.map((d) =>
          d._id === action.payload._id ? action.payload : d
        );
        if (state.current?._id === action.payload._id) {
          state.current = action.payload;
        }
      });
  }
});

export const {
  setDonationFilters,
  resetDonationFilters,
  clearCurrentDonation,
  prependDonation
} = donationsSlice.actions;

export const selectDonationsList = (state) => state.donations.list;
export const selectDonationsMeta = (state) => ({
  total: state.donations.total,
  page: state.donations.page,
  pages: state.donations.pages
});
export const selectDonationFilters = (state) => state.donations.filters;
export const selectCurrentDonation = (state) => state.donations.current;
export const selectDonationStats = (state) => state.donations.stats;
export const selectDonationsListStatus = (state) => state.donations.listStatus;
export const selectDonationsMutationStatus = (state) =>
  state.donations.mutationStatus;

export default donationsSlice.reducer;
