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
      console.log('Creating template with data:', templateData);
      const response = await api.post('/api/templates', templateData);
      console.log('Template created:', response.data);
      return response.data;
    } catch (error) {
      console.error('Failed to create template:', error.response?.data);
      return rejectWithValue(error.response?.data?.message || 'Failed to create template');
    }
  }
);

export const fetchMyTemplates = createAsyncThunk(
  'templates/fetchMyTemplates',
  async (_, { rejectWithValue }) => {
    try {
      console.log('Fetching my templates');
      const response = await api.get('/api/templates/my');
      console.log('My templates fetched:', response.data);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch my templates:', error.response?.data);
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch templates');
    }
  }
);

export const fetchPublicTemplates = createAsyncThunk(
  'templates/fetchPublicTemplates',
  async (_, { rejectWithValue }) => {
    try {
      console.log('Fetching public templates');
      const response = await api.get('/api/templates/public');
      console.log('Public templates fetched:', response.data);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch public templates:', error.response?.data);
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch public templates');
    }
  }
);

export const fetchTemplateById = createAsyncThunk(
  'templates/fetchTemplateById',
  async (id, { rejectWithValue }) => {
    try {
      console.log('Fetching template by ID:', id);
      const response = await api.get(`/api/templates/${id}`);
      console.log('Template fetched:', response.data);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch template:', error.response?.data);
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch template');
    }
  }
);

export const deleteTemplate = createAsyncThunk(
  'templates/deleteTemplate',
  async (id, { rejectWithValue }) => {
    try {
      console.log('Deleting template:', id);
      await api.delete(`/api/templates/${id}`);
      console.log('Template deleted successfully');
      return id;
    } catch (error) {
      console.error('Failed to delete template:', error.response?.data);
      return rejectWithValue(error.response?.data?.message || 'Failed to delete template');
    }
  }
);

export const updateTemplate = createAsyncThunk(
  'templates/updateTemplate',
  async ({ id, templateData }, { rejectWithValue }) => {
    try {
      console.log('Updating template:', id, templateData);
      const response = await api.put(`/api/templates/${id}`, templateData);
      console.log('Template updated successfully:', response.data);
      return response.data;
    } catch (error) {
      console.error('Failed to update template:', error.response?.data);
      return rejectWithValue(error.response?.data?.message || 'Failed to update template');
    }
  }
);

export const shareTemplate = createAsyncThunk(
  'templates/shareTemplate',
  async ({ templateId, email, accessType }, { rejectWithValue }) => {
    try {
      console.log('Sharing template:', templateId, email, accessType);
      const response = await api.post(`/api/templates/${templateId}/share`, { email, accessType });
      console.log('Template shared successfully:', response.data);
      return response.data;
    } catch (error) {
      console.error('Failed to share template:', error.response?.data);
      return rejectWithValue(error.response?.data?.message || 'Failed to share template');
    }
  }
);

export const generateShareableLink = createAsyncThunk(
  'templates/generateShareableLink',
  async (templateId, { rejectWithValue }) => {
    try {
      console.log('Generating shareable link for template:', templateId);
      const response = await api.post(`/api/templates/${templateId}/shareable-link`);
      console.log('Shareable link generated:', response.data);
      return response.data;
    } catch (error) {
      console.error('Failed to generate link:', error.response?.data);
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
      state.error = null;
    },
    clearError(state) {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    // Create Template
    builder
      .addCase(createTemplate.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createTemplate.fulfilled, (state, action) => {
        state.loading = false;
        state.templates = [...state.templates, action.payload];
        state.currentTemplate = action.payload;
        state.error = null;
      })
      .addCase(createTemplate.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to create template';
      })

    // Fetch My Templates
      .addCase(fetchMyTemplates.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMyTemplates.fulfilled, (state, action) => {
        state.loading = false;
        state.templates = action.payload;
        state.error = null;
      })
      .addCase(fetchMyTemplates.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch templates';
      })

    // Fetch Public Templates
      .addCase(fetchPublicTemplates.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPublicTemplates.fulfilled, (state, action) => {
        state.loading = false;
        state.publicTemplates = action.payload;
        state.error = null;
      })
      .addCase(fetchPublicTemplates.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch public templates';
      })

    // Fetch Template by ID
      .addCase(fetchTemplateById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTemplateById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentTemplate = action.payload;
        state.error = null;
      })
      .addCase(fetchTemplateById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch template';
      })

    // Delete Template
      .addCase(deleteTemplate.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteTemplate.fulfilled, (state, action) => {
        state.loading = false;
        state.templates = state.templates.filter(template => template._id !== action.payload);
        state.error = null;
      })
      .addCase(deleteTemplate.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to delete template';
      })

    // Update Template
      .addCase(updateTemplate.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateTemplate.fulfilled, (state, action) => {
        state.loading = false;
        state.currentTemplate = action.payload;
        state.templates = state.templates.map(template => 
          template._id === action.payload._id ? action.payload : template
        );
        state.error = null;
      })
      .addCase(updateTemplate.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to update template';
      })

    // Share Template
      .addCase(shareTemplate.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(shareTemplate.fulfilled, (state, action) => {
        state.loading = false;
        if (state.currentTemplate && state.currentTemplate._id === action.payload._id) {
          state.currentTemplate = action.payload;
        }
        state.templates = state.templates.map(template => 
          template._id === action.payload._id ? action.payload : template
        );
        state.error = null;
      })
      .addCase(shareTemplate.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to share template';
      })

    // Generate Shareable Link
      .addCase(generateShareableLink.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(generateShareableLink.fulfilled, (state, action) => {
        state.loading = false;
        if (state.currentTemplate) {
          state.currentTemplate.shareableLink = action.payload.shareableLink;
        }
        state.error = null;
      })
      .addCase(generateShareableLink.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to generate link';
      });
  }
});

export const { clearCurrentTemplate, clearError } = templateSlice.actions;

export const selectMyTemplates = state => state.templates.templates;
export const selectPublicTemplates = state => state.templates.publicTemplates;
export const selectCurrentTemplate = state => state.templates.currentTemplate;
export const selectTemplatesLoading = state => state.templates.loading;
export const selectTemplatesError = state => state.templates.error;
export const selectIsAuthenticated = state => state.auth.isAuthenticated;

export default templateSlice.reducer;
