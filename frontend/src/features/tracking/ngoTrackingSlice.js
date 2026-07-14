import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import trackingApi from "../../api/trackingApi";
import { getErrorMessage } from "../../api/axiosInstance";

export const fetchTrackingData = createAsyncThunk(
  "ngoTracking/fetchTrackingData",
  async (deliveryId, { rejectWithValue }) => {
    try {
      const [deliveryRes, etaRes] = await Promise.all([
        trackingApi.getDeliveryTracking(deliveryId),
        trackingApi.getETA(deliveryId),
      ]);

      return {
        delivery: deliveryRes.data.delivery,
        eta: etaRes.data.eta,
        distanceKm: etaRes.data.distance,
      };
    } catch (error) {
      return rejectWithValue(
        getErrorMessage(error, "Failed to load tracking data")
      );
    }
  }
);

const initialState = {
  activeDelivery: null,
  volunteerLocation: null,
  route: [],
  eta: null,
  distanceKm: null,

  locationHistory: [],

  connected: false,
  loading: false,
  error: null,
};

const ngoTrackingSlice = createSlice({
  name: "ngoTracking",

  initialState,

  reducers: {
    setTrackingConnection(state, action) {
      state.connected = action.payload;
    },

    clearActiveDelivery(state) {
      state.activeDelivery = null;
      state.volunteerLocation = null;
      state.route = [];
      state.eta = null;
      state.distanceKm = null;
    },

    updateVolunteerLocation(state, action) {
      const payload = action.payload;

      if (payload.currentLocation) {

    state.volunteerLocation = payload.currentLocation;

    if (state.activeDelivery) {

        state.activeDelivery.currentLocation =
            payload.currentLocation;

    }

    state.history.unshift({

        latitude:
            payload.currentLocation.coordinates?.[1],

        longitude:
            payload.currentLocation.coordinates?.[0],

        timestamp: new Date().toISOString()

    });

}

      if (payload.route) {
        state.route =
          payload.route.geometry || [];

        state.eta =
          payload.route.eta || state.eta;

        state.distanceKm =
          payload.route.distanceKm || state.distanceKm;
      }
    },
  },

  extraReducers: (builder) => {
    builder

      .addCase(fetchTrackingData.pending, (state) => {
        state.loading = true;
      })

      .addCase(fetchTrackingData.fulfilled, (state, action) => {
        state.loading = false;

        state.activeDelivery = action.payload.delivery;

        state.volunteerLocation =
          action.payload.delivery.currentLocation;
          state.locationHistory.unshift({
  latitude: payload.currentLocation?.coordinates?.[1],
  longitude: payload.currentLocation?.coordinates?.[0],
  timestamp: Date.now(),
});

        state.eta = action.payload.eta;

        state.distanceKm =
          action.payload.distanceKm;
      })

      .addCase(fetchTrackingData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const {
  setTrackingConnection,
  clearActiveDelivery,
  updateVolunteerLocation,
} = ngoTrackingSlice.actions;

export default ngoTrackingSlice.reducer;

export const selectTrackingDelivery = (state) =>
  state.ngoTracking.activeDelivery;

export const selectTrackingRoute = (state) =>
  state.ngoTracking.route;

export const selectTrackingETA = (state) =>
  state.ngoTracking.eta;

export const selectTrackingDistance = (state) =>
  state.ngoTracking.distanceKm;

export const selectTrackingLoading = (state) =>
  state.ngoTracking.loading;

export const selectTrackingConnection = (state) =>
  state.ngoTracking.connected;
export const selectTrackingHistory = (state) =>
    state.ngoTracking.history;
export const selectLocationHistory = (state) =>
  state.ngoTracking.locationHistory;