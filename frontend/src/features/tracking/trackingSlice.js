import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import trackingApi from "../../api/trackingApi";
import { getErrorMessage } from "../../api/axiosInstance";

const initialState = {
  // Keyed by deliveryId
  historyByDelivery: {},
  etaByDelivery: {},
  liveLocationByDelivery: {},
  status: "idle",
  error: null
};

export const updateLiveLocation = createAsyncThunk(
  "tracking/updateLocation",
  async ({ deliveryId, latitude, longitude }, { rejectWithValue }) => {
    try {
      const { data } = await trackingApi.updateLocation(
        deliveryId,
        latitude,
        longitude
      );
      return { deliveryId, ...data };
    } catch (error) {
      return rejectWithValue(
        getErrorMessage(error, "Could not update location")
      );
    }
  }
);

export const fetchTrackingHistory = createAsyncThunk(
  "tracking/fetchHistory",
  async (deliveryId, { rejectWithValue }) => {
    try {
      const { data } = await trackingApi.getHistory(deliveryId);
      return { deliveryId, history: data.history || [] };
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const fetchCurrentETA = createAsyncThunk(
  "tracking/fetchETA",
  async (deliveryId, { rejectWithValue }) => {
    try {
      const { data } = await trackingApi.getETA(deliveryId);
      console.log("ETA API Response:", data);
      return { deliveryId, distance: data.distance, eta: data.eta };
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

const trackingSlice = createSlice({
  name: "tracking",
  initialState,
  reducers: {
   setLiveLocationFromSocket: (state, action) => {

    const {
        deliveryId,
        latitude,
        longitude,
        currentLocation,
        route
    } = action.payload;

    state.liveLocationByDelivery[deliveryId] = {
    latitude,
    longitude,
    currentLocation,
    route
};

    if (!state.historyByDelivery[deliveryId]) {
        state.historyByDelivery[deliveryId] = [];
    }

    state.historyByDelivery[deliveryId].unshift({
        latitude,
        longitude,
        timestamp: Date.now()
    });

},
    clearTrackingForDelivery: (state, action) => {
      delete state.historyByDelivery[action.payload];
      delete state.etaByDelivery[action.payload];
      delete state.liveLocationByDelivery[action.payload];
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(updateLiveLocation.fulfilled, (state, action) => {
        const { deliveryId, currentLocation, route } = action.payload;
        state.liveLocationByDelivery[deliveryId] = {
          currentLocation,
          route,
          latitude: currentLocation?.coordinates?.[1],
          longitude: currentLocation?.coordinates?.[0]
        };
      })
      .addCase(fetchTrackingHistory.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchTrackingHistory.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.historyByDelivery[action.payload.deliveryId] =
          action.payload.history;
      })
      .addCase(fetchTrackingHistory.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(fetchCurrentETA.fulfilled, (state, action) => {
        state.etaByDelivery[action.payload.deliveryId] = {
          distance: action.payload.distance,
          eta: action.payload.eta
        };
      });
  }
});

export const { setLiveLocationFromSocket, clearTrackingForDelivery } =
  trackingSlice.actions;

export const selectTrackingHistory = (deliveryId) => (state) =>
  state.tracking.historyByDelivery[deliveryId] || [];
export const selectTrackingETA = (deliveryId) => (state) =>
  state.tracking.etaByDelivery[deliveryId] || null;
export const selectLiveLocation = (deliveryId) => (state) =>
  state.tracking.liveLocationByDelivery[deliveryId] || null;

export default trackingSlice.reducer;
