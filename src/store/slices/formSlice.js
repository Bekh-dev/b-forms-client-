import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../config/axios';

const initialState = {
  responses: [],
  loading: false,
  error: null,
};

export const submitFormResponse = createAsyncThunk(
  'form/submitResponse',
  async ({ templateId, data }) => {
    const response = await api.post(`/api/forms/${templateId}/submit`, data);
    return response.data;
  }
);

export const getFormResponses = createAsyncThunk(
  'form/getResponses',
  async (templateId) => {
    const response = await api.get(`/api/forms/${templateId}/responses`);
    return response.data;
  }
);

const formSlice = createSlice({
  name: 'form',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Submit Response
      .addCase(submitFormResponse.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(submitFormResponse.fulfilled, (state, action) => {
        state.loading = false;
        state.responses.push(action.payload);
      })
      .addCase(submitFormResponse.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // Get Responses
      .addCase(getFormResponses.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getFormResponses.fulfilled, (state, action) => {
        state.loading = false;
        state.responses = action.payload;
      })
      .addCase(getFormResponses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const { clearError } = formSlice.actions;

export const selectFormResponses = (state) => state.form.responses;
export const selectFormLoading = (state) => state.form.loading;
export const selectFormError = (state) => state.form.error;

export default formSlice.reducer;
