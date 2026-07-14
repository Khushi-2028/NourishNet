import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import ngoApi from "../../api/ngoApi";
import pickupApi from "../../api/pickupApi";
import { getErrorMessage } from "../../api/axiosInstance";
import { setNgoId } from "../../utils/storage";

const initialState = {
  availableDonations: [],
  pickupRequests: [],
  stats: null,
  profileCreated: false,

  listStatus: "idle",
  mutationStatus: "idle",
  pickupStatus: "idle",
  profileStatus: "idle",

  error: null
};

/*
====================================================
NGO PROFILE
====================================================
*/

export const createNgoProfile = createAsyncThunk(
  "ngo/createProfile",
  async (payload, { rejectWithValue }) => {
    try {
      const { data } = await ngoApi.createProfile(payload);
      return data.ngo;
    } catch (error) {
      return rejectWithValue(
        getErrorMessage(error, "Could not create NGO profile")
      );
    }
  }
);

/*
====================================================
AVAILABLE DONATIONS
====================================================
*/

export const fetchAvailableDonations = createAsyncThunk(
  "ngo/fetchAvailableDonations",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await ngoApi.getAvailableDonations();
      return data.donations|| [];
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

/*
====================================================
OLD ACCEPT / REJECT
(KEEP TEMPORARILY)
====================================================
*/

export const acceptDonation = createAsyncThunk(
  "ngo/acceptDonation",
  async (donationId, { rejectWithValue }) => {
    try {
      const { data } = await ngoApi.acceptDonation(donationId);
      return data.donation;
    } catch (error) {
      return rejectWithValue(
        getErrorMessage(error, "Could not accept donation")
      );
    }
  }
);

export const rejectDonation = createAsyncThunk(
  "ngo/rejectDonation",
  async (donationId, { rejectWithValue }) => {
    try {
      await ngoApi.rejectDonation(donationId);
      return donationId;
    } catch (error) {
      return rejectWithValue(
        getErrorMessage(error, "Could not reject donation")
      );
    }
  }
);

/*
====================================================
NEW PICKUP REQUEST
====================================================
*/

export const createPickupRequest = createAsyncThunk(
  "ngo/createPickupRequest",
  async ({ donationId, requestData }, { rejectWithValue }) => {
    try {
      const { data } = await pickupApi.createRequest(
        donationId,
        requestData
      );

      return data.request;
    } catch (error) {
      return rejectWithValue(
        getErrorMessage(error, "Could not create pickup request")
      );
    }
  }
);

export const fetchPickupRequests = createAsyncThunk(
  "ngo/fetchPickupRequests",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await pickupApi.getMyRequests();

      return data.pickupRequests || [];
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

/*
====================================================
NGO STATS
====================================================
*/

export const fetchNgoStats = createAsyncThunk(
  "ngo/fetchStats",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await ngoApi.getStats();
      return data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

const ngoSlice = createSlice({
  name: "ngo",

  initialState,

  reducers: {},

  extraReducers: (builder) => {
    builder

      /*
      PROFILE
      */

      .addCase(createNgoProfile.pending, (state) => {
        state.profileStatus = "loading";
      })

      .addCase(createNgoProfile.fulfilled, (state, action) => {
        state.profileStatus = "succeeded";
        state.profileCreated = true;

        if (action.payload?._id) {
          setNgoId(action.payload._id);
        }
      })

      .addCase(createNgoProfile.rejected, (state, action) => {
        state.profileStatus = "failed";
        state.error = action.payload;
      })

      /*
      DONATIONS
      */

      .addCase(fetchAvailableDonations.pending, (state) => {
        state.listStatus = "loading";
      })

      .addCase(fetchAvailableDonations.fulfilled, (state, action) => {
        state.listStatus = "succeeded";
        state.availableDonations = action.payload;
      })

      .addCase(fetchAvailableDonations.rejected, (state, action) => {
        state.listStatus = "failed";
        state.error = action.payload;
      })

      /*
      OLD ACCEPT
      */

      .addCase(acceptDonation.pending, (state) => {
        state.mutationStatus = "loading";
      })

      .addCase(acceptDonation.fulfilled, (state, action) => {
        state.mutationStatus = "succeeded";

        state.availableDonations =
          state.availableDonations.filter(
            (d) => d._id !== action.payload._id
          );
      })

      .addCase(acceptDonation.rejected, (state, action) => {
        state.mutationStatus = "failed";
        state.error = action.payload;
      })

      /*
      OLD REJECT
      */

      .addCase(rejectDonation.fulfilled, (state, action) => {
        state.availableDonations =
          state.availableDonations.filter(
            (d) => d._id !== action.payload
          );
      })

      /*
      NEW PICKUP REQUEST
      */

      .addCase(createPickupRequest.pending, (state) => {
        state.pickupStatus = "loading";
      })

      .addCase(createPickupRequest.fulfilled, (state, action) => {
        state.pickupStatus = "succeeded";

        state.pickupRequests.unshift(
          action.payload
        );
      })

      .addCase(createPickupRequest.rejected, (state, action) => {
        state.pickupStatus = "failed";
        state.error = action.payload;
      })

      /*
      FETCH PICKUP REQUESTS
      */
.addCase(fetchPickupRequests.pending, (state) => {
  state.pickupStatus = "loading";
})

.addCase(fetchPickupRequests.fulfilled, (state, action) => {
  state.pickupStatus = "succeeded";
  state.pickupRequests = action.payload;
})

.addCase(fetchPickupRequests.rejected, (state, action) => {
  state.pickupStatus = "failed";
  state.error = action.payload;
})
      

      /*
      STATS
      */

      .addCase(fetchNgoStats.fulfilled, (state, action) => {
        state.stats = action.payload;
      });
  }
});

/*
====================================================
SELECTORS
====================================================
*/

export const selectAvailableDonations = (state) =>
  state.ngo.availableDonations;

export const selectPickupRequests = (state) =>
  state.ngo.pickupRequests;

export const selectNgoStats = (state) =>
  state.ngo.stats;

export const selectNgoListStatus = (state) =>
  state.ngo.listStatus;

export const selectNgoMutationStatus = (state) =>
  state.ngo.mutationStatus;

export const selectPickupStatus = (state) =>
  state.ngo.pickupStatus;

export const selectNgoProfileStatus = (state) =>
  state.ngo.profileStatus;

export default ngoSlice.reducer;