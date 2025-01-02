import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/axios';

const initialState = {
  responses: [],
  loading: false,
  error: null
};

export const submitResponse = createAsyncThunk(
  'responses/submitResponse',
  async ({ templateId, answers }, { rejectWithValue }) => {
    try {
      const response = await api.post(`/api/templates/${templateId}/responses`, { answers });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to submit response');
    }
  }
);

export const fetchResponses = createAsyncThunk(
  'responses/fetchResponses',
  async (templateId, { rejectWithValue }) => {
    try {
      const response = await api.get(`/api/templates/${templateId}/responses`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch responses');
    }
  }
);

const responseSlice = createSlice({
  name: 'responses',
  initialState,
  reducers: {
    clearResponses: (state) => {
      state.responses = [];
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Submit response
      .addCase(submitResponse.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(submitResponse.fulfilled, (state, action) => {
        state.loading = false;
        state.responses.push(action.payload);
      })
      .addCase(submitResponse.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch responses
      .addCase(fetchResponses.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchResponses.fulfilled, (state, action) => {
        state.loading = false;
        state.responses = action.payload;
      })
      .addCase(fetchResponses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { clearResponses } = responseSlice.actions;

export const selectResponses = (state) => state.responses.responses;
export const selectResponsesLoading = (state) => state.responses.loading;
export const selectResponsesError = (state) => state.responses.error;

export default responseSlice.reducer;
