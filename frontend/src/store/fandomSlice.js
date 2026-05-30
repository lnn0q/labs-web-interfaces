import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../services/api';

export const fetchFandoms = createAsyncThunk(
  'fandoms/fetchAll',
  async (category = '', { rejectWithValue }) => {
    try {
      const url = category ? `fandoms/?category=${category}` : 'fandoms/';
      const response = await api.get(url);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data);
    }
  }
);

export const fetchFandom = createAsyncThunk(
  'fandoms/fetchOne',
  async (slug, { rejectWithValue }) => {
    try {
      const response = await api.get(`fandoms/${slug}/`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data);
    }
  }
);

export const joinFandom = createAsyncThunk(
  'fandoms/join',
  async (slug, { rejectWithValue }) => {
    try {
      await api.post(`fandoms/${slug}/join/`);
      return slug;
    } catch (error) {
      return rejectWithValue(error.response?.data);
    }
  }
);

export const leaveFandom = createAsyncThunk(
  'fandoms/leave',
  async (slug, { rejectWithValue }) => {
    try {
      await api.post(`fandoms/${slug}/leave/`);
      return slug;
    } catch (error) {
      return rejectWithValue(error.response?.data);
    }
  }
);

const fandomSlice = createSlice({
  name: 'fandoms',
  initialState: {
    list: [],
    currentFandom: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchFandoms.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchFandoms.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchFandoms.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchFandom.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchFandom.fulfilled, (state, action) => {
        state.loading = false;
        state.currentFandom = action.payload;
      })
      .addCase(joinFandom.fulfilled, (state) => {
        if (state.currentFandom) {
          state.currentFandom.is_member = true;
          state.currentFandom.members_count += 1;
        }
      })
      .addCase(leaveFandom.fulfilled, (state) => {
        if (state.currentFandom) {
          state.currentFandom.is_member = false;
          state.currentFandom.members_count -= 1;
        }
      });
  },
});

export default fandomSlice.reducer;
