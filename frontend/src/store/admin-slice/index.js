import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = `${process.env.VITE_API_URL}/api/admin`;

const initialState = {
  events: [],
  clubs: [],
  registrations: [],
  isLoading: false,
  error: null,
};

// Events Thunks
export const fetchAdminEvents = createAsyncThunk(
  "admin/fetchAdminEvents",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/events`, {
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch events."
      );
    }
  }
);

export const addAdminEvent = createAsyncThunk(
  "admin/addAdminEvent",
  async (eventData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/events`, eventData, {
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to create event."
      );
    }
  }
);

export const deleteAdminEvent = createAsyncThunk(
  "admin/deleteAdminEvent",
  async (eventId, { rejectWithValue }) => {
    try {
      await axios.delete(`${API_URL}/events/${eventId}`, {
        withCredentials: true,
      });
      return eventId;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete event."
      );
    }
  }
);

export const updateAdminEvent = createAsyncThunk(
  "admin/updateAdminEvent",
  async ({ id, ...eventData }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`${API_URL}/events/${id}`, eventData, {
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update event."
      );
    }
  }
);

// Clubs Thunks
export const fetchAdminClubs = createAsyncThunk(
  "admin/fetchAdminClubs",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/clubs`, {
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch clubs."
      );
    }
  }
);

export const addAdminClub = createAsyncThunk(
  "admin/addAdminClub",
  async (clubData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/clubs`, clubData, {
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to register club."
      );
    }
  }
);

// Registrations Thunks
export const fetchAdminRegistrations = createAsyncThunk(
  "admin/fetchAdminRegistrations",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/registrations`, {
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch registrations."
      );
    }
  }
);

export const updateRegistrationStatus = createAsyncThunk(
  "admin/updateRegistrationStatus",
  async ({ id, status }, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        `${API_URL}/registrations/${id}/status`,
        { status },
        { withCredentials: true }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update status."
      );
    }
  }
);

const adminSlice = createSlice({
  name: "admin",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Events
      .addCase(fetchAdminEvents.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchAdminEvents.fulfilled, (state, action) => {
        state.isLoading = false;
        state.events = action.payload?.events || [];
      })
      .addCase(fetchAdminEvents.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(addAdminEvent.fulfilled, (state, action) => {
        if (action.payload?.event) {
          state.events.unshift(action.payload.event);
        }
      })
      .addCase(updateAdminEvent.fulfilled, (state, action) => {
        const updated = action.payload?.event;
        if (updated) {
          const idx = state.events.findIndex((e) => e._id === updated._id);
          if (idx !== -1) state.events[idx] = updated;
        }
      })
      .addCase(deleteAdminEvent.fulfilled, (state, action) => {
        state.events = state.events.filter((e) => e._id !== action.payload);
      })
      // Clubs
      .addCase(fetchAdminClubs.fulfilled, (state, action) => {
        state.clubs = action.payload?.clubs || [];
      })
      .addCase(addAdminClub.fulfilled, (state, action) => {
        if (action.payload?.club) {
          state.clubs.unshift(action.payload.club);
        }
      })
      // Registrations
      .addCase(fetchAdminRegistrations.fulfilled, (state, action) => {
        state.registrations = action.payload?.registrations || [];
      })
      .addCase(updateRegistrationStatus.fulfilled, (state, action) => {
        const updated = action.payload?.registration;
        if (updated) {
          const idx = state.registrations.findIndex((r) => r._id === updated._id);
          if (idx !== -1) {
            state.registrations[idx] = updated;
          }
        }
      });
  },
});

export default adminSlice.reducer;
