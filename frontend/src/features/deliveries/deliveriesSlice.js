import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import deliveriesApi from "../../api/deliveriesApi";
import dashboardApi from "../../api/dashboardApi";
import trackingApi from "../../api/trackingApi";
import { getErrorMessage } from "../../api/axiosInstance";

const initialState = {
  // NGO's view of active deliveries (GET /api/dashboard/active-deliveries)
  ngoActiveDeliveries: [],
  // Volunteer's view of their own active deliveries (GET /api/tracking/active)
  volunteerActiveDeliveries: [],
  mutationStatus: "idle",
  listStatus: "idle",
  error: null
};

export const assignVolunteerToPickup = createAsyncThunk(
  "deliveries/assignVolunteer",
  async ({ pickupId, volunteerId }, { rejectWithValue }) => {
    try {
      const { data } = await deliveriesApi.assignVolunteer(
        pickupId,
        volunteerId
      );
      return data.delivery;
    } catch (error) {
      return rejectWithValue(
        getErrorMessage(error, "Could not assign volunteer")
      );
    }
  }
);

export const fetchNgoActiveDeliveries = createAsyncThunk(
  "deliveries/fetchNgoActive",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await dashboardApi.getActiveDeliveries();
      return data.deliveries || [];
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const fetchVolunteerActiveDeliveries = createAsyncThunk(
  "deliveries/fetchVolunteerActive",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await trackingApi.getActiveDeliveries();
      return data.deliveries || [];
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const acceptDeliveryTask = createAsyncThunk(
  "deliveries/acceptTask",
  async (deliveryId, { rejectWithValue }) => {
    try {
      await deliveriesApi.acceptTask(deliveryId);
      return deliveryId;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error, "Could not accept task"));
    }
  }
);

export const pickupDeliveryFood = createAsyncThunk(
  "deliveries/pickupFood",
  async (deliveryId, { rejectWithValue }) => {
    try {
      await deliveriesApi.pickupFood(deliveryId);
      return deliveryId;
    } catch (error) {
      return rejectWithValue(
        getErrorMessage(error, "Could not mark food as picked up")
      );
    }
  }
);

export const startDeliveryTransit = createAsyncThunk(
  "deliveries/startTransit",
  async (deliveryId, { rejectWithValue }) => {
    try {
      await deliveriesApi.startTransit(deliveryId);
      return deliveryId;
    } catch (error) {
      return rejectWithValue(
        getErrorMessage(error, "Could not start transit")
      );
    }
  }
);

export const completeDeliveryTask = createAsyncThunk(
  "deliveries/complete",
  async (deliveryId, { rejectWithValue }) => {
    try {
      await deliveriesApi.completeDelivery(deliveryId);
      return deliveryId;
    } catch (error) {
      return rejectWithValue(
        getErrorMessage(error, "Could not complete delivery")
      );
    }
  }
);
export const confirmDelivery = createAsyncThunk(
  "deliveries/confirmDelivery",
  async (deliveryId, { rejectWithValue }) => {

    try {

      const { data } =
        await deliveriesApi.confirmDelivery(deliveryId);

      return data.delivery;

    } catch (error) {

      return rejectWithValue(
        getErrorMessage(error)
      );

    }

  }
);
export const uploadProof = createAsyncThunk(
  "deliveries/uploadProof",
  async ({ deliveryId, formData }, { rejectWithValue }) => {
    try {
      const { data } = await deliveriesApi.uploadProof(
        deliveryId,
        formData
      );

      return data;
    } catch (error) {
      return rejectWithValue(
        getErrorMessage(error)
      );
    }
  }
);
const updateLocalStatus = (state, deliveryId, status) => {
  const update = (list) =>
    list.map((d) => (d._id === deliveryId ? { ...d, status } : d));
  state.ngoActiveDeliveries = update(state.ngoActiveDeliveries);
  state.volunteerActiveDeliveries = update(state.volunteerActiveDeliveries);
};

const deliveriesSlice = createSlice({
  name: "deliveries",
  initialState,
  reducers: {
    removeCompletedDelivery: (state, action) => {
      state.volunteerActiveDeliveries = state.volunteerActiveDeliveries.filter(
        (d) => d._id !== action.payload
      );
      state.ngoActiveDeliveries = state.ngoActiveDeliveries.filter(
        (d) => d._id !== action.payload
      );
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(assignVolunteerToPickup.pending, (state) => {
        state.mutationStatus = "loading"; })

      .addCase(assignVolunteerToPickup.fulfilled, (state) => {
        state.mutationStatus = "succeeded";})

      .addCase(assignVolunteerToPickup.rejected, (state, action) => {
        state.mutationStatus = "failed";
        state.error = action.payload;})

      .addCase(fetchNgoActiveDeliveries.pending, (state) => {
        state.listStatus = "loading";})

      .addCase(fetchNgoActiveDeliveries.fulfilled, (state, action) => {
        state.listStatus = "succeeded";
        state.ngoActiveDeliveries = action.payload; })

      .addCase(fetchNgoActiveDeliveries.rejected, (state, action) => {
        state.listStatus = "failed";})

      .addCase(fetchVolunteerActiveDeliveries.pending, (state) => {
        state.listStatus = "loading";})

      .addCase(fetchVolunteerActiveDeliveries.fulfilled, (state, action) => {
        state.listStatus = "succeeded";
        state.volunteerActiveDeliveries = action.payload;})

      .addCase(fetchVolunteerActiveDeliveries.rejected, (state, action) => {
        state.listStatus = "failed";state.error = action.payload;})

      .addCase(acceptDeliveryTask.fulfilled, (state, action) => {
        updateLocalStatus(state, action.payload, "accepted_by_volunteer"); })

      .addCase(pickupDeliveryFood.fulfilled, (state, action) => {
        updateLocalStatus(state, action.payload, "picked_up");})

      .addCase(startDeliveryTransit.fulfilled, (state, action) => {
        updateLocalStatus(state, action.payload, "in_transit");})
.addCase(completeDeliveryTask.fulfilled, (state, action) => {

    state.volunteerActiveDeliveries =
        state.volunteerActiveDeliveries.map(d =>

            d._id === action.payload
                ? {
                      ...d,
                      status: "awaiting_confirmation"
                  }
                : d
        );

})
      .addCase(confirmDelivery.fulfilled, (state, action) => {
    state.ngoActiveDeliveries =state.ngoActiveDeliveries.filter(
   d => d._id !== action.payload._id );})

   .addCase(uploadProof.pending, (state) => {
    state.mutationStatus = "loading";})

.addCase(uploadProof.fulfilled, (state) => {
    state.mutationStatus = "succeeded";})

.addCase(uploadProof.rejected, (state, action) => {
    state.mutationStatus = "failed";
    state.error = action.payload;});}});

export const { removeCompletedDelivery } = deliveriesSlice.actions;

export const selectNgoActiveDeliveries = (state) =>
  state.deliveries.ngoActiveDeliveries;
export const selectVolunteerActiveDeliveries = (state) =>
  state.deliveries.volunteerActiveDeliveries;
export const selectDeliveriesListStatus = (state) =>
  state.deliveries.listStatus;
export const selectDeliveriesMutationStatus = (state) =>
  state.deliveries.mutationStatus;


export default deliveriesSlice.reducer;
