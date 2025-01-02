import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/axios';

const initialState = {
  templates: [],
  publicTemplates: [],
  currentTemplate: null,
  loading: false,
  error: null
};

export const createTemplate = createAsyncThunk(
  'templates/createTemplate',
  async (templateData, { rejectWithValue }) => {
    try {
      const response = await api.post('/api/templates', templateData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create template');
    }
  }
);

export const fetchMyTemplates = createAsyncThunk(
  'templates/fetchMyTemplates',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/api/templates/my');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch templates');
    }
  }
);

export const fetchPublicTemplates = createAsyncThunk(
  'templates/fetchPublicTemplates',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/api/templates/public');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch public templates');
    }
  }
);

export const fetchTemplateById = createAsyncThunk(
  'templates/fetchTemplateById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.get(`/api/templates/${id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch template');
    }
  }
);

export const updateTemplate = createAsyncThunk(
  'templates/updateTemplate',
  async ({ id, templateData }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/api/templates/${id}`, templateData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update template');
    }
  }
);

export const deleteTemplate = createAsyncThunk(
  'templates/deleteTemplate',
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/api/templates/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete template');
    }
  }
);

// Добавляем новые действия для шаринга
export const shareTemplate = createAsyncThunk(
  'templates/shareTemplate',
  async ({ templateId, email, accessType }, { rejectWithValue }) => {
    try {
      const response = await api.post(`/api/templates/${templateId}/share`, { email, accessType });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to share template');
    }
  }
);

export const generateShareableLink = createAsyncThunk(
  'templates/generateShareableLink',
  async (templateId, { rejectWithValue }) => {
    try {
      const response = await api.post(`/api/templates/${templateId}/shareable-link`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to generate link');
    }
  }
);

const templateSlice = createSlice({
  name: 'templates',
  initialState,
  reducers: {
    clearCurrentTemplate(state) {
      state.currentTemplate = null;
    },
    clearError(state) {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Create template
      .addCase(createTemplate.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createTemplate.fulfilled, (state, action) => {
        state.loading = false;
        state.templates.push(action.payload);
      })
      .addCase(createTemplate.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch my templates
      .addCase(fetchMyTemplates.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMyTemplates.fulfilled, (state, action) => {
        state.loading = false;
        state.templates = action.payload;
      })
      .addCase(fetchMyTemplates.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch public templates
      .addCase(fetchPublicTemplates.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPublicTemplates.fulfilled, (state, action) => {
        state.loading = false;
        state.publicTemplates = action.payload;
      })
      .addCase(fetchPublicTemplates.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch template by id
      .addCase(fetchTemplateById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTemplateById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentTemplate = action.payload;
      })
      .addCase(fetchTemplateById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update template
      .addCase(updateTemplate.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateTemplate.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.templates.findIndex(t => t._id === action.payload._id);
        if (index !== -1) {
          state.templates[index] = action.payload;
        }
      })
      .addCase(updateTemplate.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Delete template
      .addCase(deleteTemplate.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteTemplate.fulfilled, (state, action) => {
        state.loading = false;
        state.templates = state.templates.filter(t => t._id !== action.payload);
      })
      .addCase(deleteTemplate.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Share template
      .addCase(shareTemplate.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(shareTemplate.fulfilled, (state, action) => {
        state.loading = false;
        // Add logic to handle shared template
      })
      .addCase(shareTemplate.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Generate shareable link
      .addCase(generateShareableLink.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(generateShareableLink.fulfilled, (state, action) => {
        state.loading = false;
        // Add logic to handle generated link
      })
      .addCase(generateShareableLink.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { clearCurrentTemplate, clearError } = templateSlice.actions;

export const selectMyTemplates = (state) => state.templates.templates;
export const selectPublicTemplates = (state) => state.templates.publicTemplates;
export const selectCurrentTemplate = (state) => state.templates.currentTemplate;
export const selectTemplatesLoading = (state) => state.templates.loading;
export const selectTemplatesError = (state) => state.templates.error;
export const selectIsAuthenticated = (state) => !!state.auth?.token;

export default templateSlice.reducer;
