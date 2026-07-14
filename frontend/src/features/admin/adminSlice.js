import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import adminApi from "../../api/adminApi";
import { getErrorMessage } from "../../api/axiosInstance";

const initialState = {
  dashboard: null,
  users: { list: [], total: 0 },
  ngos: [],
  volunteers: [],
  donations: [],
  deliveries: [],
  auditLogs: [],
  analytics: null,
  environment: null,
  status: {
    dashboard: "idle",
    users: "idle",
    ngos: "idle",
    volunteers: "idle",
    donations: "idle",
    deliveries: "idle",
    auditLogs: "idle",
    analytics: "idle",
    environment: "idle"
  },
  mutationStatus: "idle",
  error: null
};

export const fetchAdminDashboard = createAsyncThunk(
  "admin/fetchDashboard",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await adminApi.getDashboard();
      return data.dashboard;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const fetchAdminUsers = createAsyncThunk(
  "admin/fetchUsers",
  async (params, { rejectWithValue }) => {
    try {
      const { data } = await adminApi.getUsers(params);
      return data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const updateAdminUser = createAsyncThunk(
  "admin/updateUser",
  async ({ id, payload }, { rejectWithValue }) => {
    try {
      const { data } = await adminApi.updateUser(id, payload);
      return data.user;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error, "Could not update user"));
    }
  }
);

export const deleteAdminUser = createAsyncThunk(
  "admin/deleteUser",
  async (id, { rejectWithValue }) => {
    try {
      await adminApi.deleteUser(id);
      return id;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error, "Could not delete user"));
    }
  }
);

export const fetchAdminNGOs = createAsyncThunk(
  "admin/fetchNGOs",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await adminApi.getNGOs();
      return data.ngos || [];
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const approveAdminNGO = createAsyncThunk(
  "admin/approveNGO",
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await adminApi.approveNGO(id);
      return data.ngo;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error, "Could not approve NGO"));
    }
  }
);

export const rejectAdminNGO = createAsyncThunk(
  "admin/rejectNGO",
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await adminApi.rejectNGO(id);
      return data.ngo;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error, "Could not reject NGO"));
    }
  }
);

export const fetchAdminVolunteers = createAsyncThunk(
  "admin/fetchVolunteers",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await adminApi.getVolunteers();
      return data.volunteers || [];
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const fetchAdminDonations = createAsyncThunk(
  "admin/fetchDonations",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await adminApi.getDonations();
      return data.donations || [];
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const deleteAdminDonation = createAsyncThunk(
  "admin/deleteDonation",
  async (id, { rejectWithValue }) => {
    try {
      await adminApi.deleteDonation(id);
      return id;
    } catch (error) {
      return rejectWithValue(
        getErrorMessage(error, "Could not delete donation")
      );
    }
  }
);

export const fetchAdminDeliveries = createAsyncThunk(
  "admin/fetchDeliveries",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await adminApi.getDeliveries();
      return data.deliveries || [];
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const fetchAdminAuditLogs = createAsyncThunk(
  "admin/fetchAuditLogs",
  async (filters = {}, { rejectWithValue }) => {
    try {
      const { data } = await adminApi.getAuditLogs(filters);
      return data.logs || [];
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const fetchAdminAnalytics = createAsyncThunk(
  "admin/fetchAnalytics",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await adminApi.getAnalytics();
      return data.analytics;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const fetchAdminEnvironment = createAsyncThunk(
  "admin/fetchEnvironment",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await adminApi.getEnvironmentalImpact();
      return data.impact;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

const adminSlice = createSlice({
  name: "admin",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAdminDashboard.pending, (state) => {
        state.status.dashboard = "loading";
      })
      .addCase(fetchAdminDashboard.fulfilled, (state, action) => {
        state.status.dashboard = "succeeded";
        state.dashboard = action.payload;
      })
      .addCase(fetchAdminDashboard.rejected, (state, action) => {
        state.status.dashboard = "failed";
        state.error = action.payload;
      })

      .addCase(fetchAdminUsers.pending, (state) => {
        state.status.users = "loading";
      })
      .addCase(fetchAdminUsers.fulfilled, (state, action) => {
        state.status.users = "succeeded";
        state.users = { list: action.payload.users, total: action.payload.total };
      })
      .addCase(fetchAdminUsers.rejected, (state, action) => {
        state.status.users = "failed";
        state.error = action.payload;
      })
      .addCase(updateAdminUser.fulfilled, (state, action) => {
        state.users.list = state.users.list.map((u) =>
          u._id === action.payload._id ? action.payload : u
        );
      })
      .addCase(deleteAdminUser.fulfilled, (state, action) => {
        state.users.list = state.users.list.filter(
          (u) => u._id !== action.payload
        );
        state.users.total = Math.max(0, state.users.total - 1);
      })

      .addCase(fetchAdminNGOs.pending, (state) => {
        state.status.ngos = "loading";
      })
      .addCase(fetchAdminNGOs.fulfilled, (state, action) => {
        state.status.ngos = "succeeded";
        state.ngos = action.payload;
      })
      .addCase(fetchAdminNGOs.rejected, (state, action) => {
        state.status.ngos = "failed";
        state.error = action.payload;
      })
      .addCase(approveAdminNGO.fulfilled, (state, action) => {
        state.ngos = state.ngos.map((n) =>
          n._id === action.payload._id ? action.payload : n
        );
      })
      .addCase(rejectAdminNGO.fulfilled, (state, action) => {
        state.ngos = state.ngos.map((n) =>
          n._id === action.payload._id ? action.payload : n
        );
      })

      .addCase(fetchAdminVolunteers.pending, (state) => {
        state.status.volunteers = "loading";
      })
      .addCase(fetchAdminVolunteers.fulfilled, (state, action) => {
        state.status.volunteers = "succeeded";
        state.volunteers = action.payload;
      })
      .addCase(fetchAdminVolunteers.rejected, (state, action) => {
        state.status.volunteers = "failed";
        state.error = action.payload;
      })

      .addCase(fetchAdminDonations.pending, (state) => {
        state.status.donations = "loading";
      })
      .addCase(fetchAdminDonations.fulfilled, (state, action) => {
        state.status.donations = "succeeded";
        state.donations = action.payload;
      })
      .addCase(fetchAdminDonations.rejected, (state, action) => {
        state.status.donations = "failed";
        state.error = action.payload;
      })
      .addCase(deleteAdminDonation.fulfilled, (state, action) => {
        state.donations = state.donations.filter(
          (d) => d._id !== action.payload
        );
      })

      .addCase(fetchAdminDeliveries.pending, (state) => {
        state.status.deliveries = "loading";
      })
      .addCase(fetchAdminDeliveries.fulfilled, (state, action) => {
        state.status.deliveries = "succeeded";
        state.deliveries = action.payload;
      })
      .addCase(fetchAdminDeliveries.rejected, (state, action) => {
        state.status.deliveries = "failed";
        state.error = action.payload;
      })

      .addCase(fetchAdminAuditLogs.pending, (state) => {
        state.status.auditLogs = "loading";
      })
      .addCase(fetchAdminAuditLogs.fulfilled, (state, action) => {
        state.status.auditLogs = "succeeded";
        state.auditLogs = action.payload;
      })
      .addCase(fetchAdminAuditLogs.rejected, (state, action) => {
        state.status.auditLogs = "failed";
        state.error = action.payload;
      })

      .addCase(fetchAdminAnalytics.pending, (state) => {
        state.status.analytics = "loading";
      })
      .addCase(fetchAdminAnalytics.fulfilled, (state, action) => {
        state.status.analytics = "succeeded";
        state.analytics = action.payload;
      })
      .addCase(fetchAdminAnalytics.rejected, (state, action) => {
        state.status.analytics = "failed";
        state.error = action.payload;
      })

      .addCase(fetchAdminEnvironment.pending, (state) => {
        state.status.environment = "loading";
      })
      .addCase(fetchAdminEnvironment.fulfilled, (state, action) => {
        state.status.environment = "succeeded";
        state.environment = action.payload;
      })
      .addCase(fetchAdminEnvironment.rejected, (state, action) => {
        state.status.environment = "failed";
        state.error = action.payload;
      });
  }
});

export const selectAdminDashboard = (state) => state.admin.dashboard;
export const selectAdminUsers = (state) => state.admin.users;
export const selectAdminNGOs = (state) => state.admin.ngos;
export const selectAdminVolunteers = (state) => state.admin.volunteers;
export const selectAdminDonations = (state) => state.admin.donations;
export const selectAdminDeliveries = (state) => state.admin.deliveries;
export const selectAdminAuditLogs = (state) => state.admin.auditLogs;
export const selectAdminAnalytics = (state) => state.admin.analytics;
export const selectAdminEnvironment = (state) => state.admin.environment;
export const selectAdminStatus = (state) => state.admin.status;

export default adminSlice.reducer;
