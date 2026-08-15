import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = "http://localhost:5000/api/user";

const initialState = {
  clubs: [],
  events: [],
  myRegistrations: [],
  isLoading: false,
  isRegistering: false,
  error: null,
};

// Fetch public active clubs
export const fetchPublicClubs = createAsyncThunk(
  "user/fetchPublicClubs",
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

// Fetch public active events
export const fetchPublicEvents = createAsyncThunk(
  "user/fetchPublicEvents",
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

// Register user for event
export const registerUserForEvent = createAsyncThunk(
  "user/registerUserForEvent",
  async (registrationData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/register`, registrationData, {
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to register for event."
      );
    }
  }
);

// Fetch user's registered events history
export const fetchUserRegistrations = createAsyncThunk(
  "user/fetchUserRegistrations",
  async (email, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/my-registrations`, {
        params: { email },
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch registration history."
      );
    }
  }
);

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Clubs
      .addCase(fetchPublicClubs.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchPublicClubs.fulfilled, (state, action) => {
        state.isLoading = false;
        state.clubs = action.payload?.clubs || [];
      })
      .addCase(fetchPublicClubs.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Events
      .addCase(fetchPublicEvents.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchPublicEvents.fulfilled, (state, action) => {
        state.isLoading = false;
        state.events = action.payload?.events || [];
      })
      .addCase(fetchPublicEvents.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Event Registration
      .addCase(registerUserForEvent.pending, (state) => {
        state.isRegistering = true;
      })
      .addCase(registerUserForEvent.fulfilled, (state, action) => {
        state.isRegistering = false;
        if (action.payload?.registration) {
          state.myRegistrations.unshift(action.payload.registration);
        }
      })
      .addCase(registerUserForEvent.rejected, (state, action) => {
        state.isRegistering = false;
        state.error = action.payload;
      })
      // My Registrations History
      .addCase(fetchUserRegistrations.fulfilled, (state, action) => {
        state.myRegistrations = action.payload?.registrations || [];
      });
  },
});

export default userSlice.reducer;
