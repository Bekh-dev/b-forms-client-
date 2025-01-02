import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../config/axios';

const initialState = {
  organizations: [],
  currentOrganization: null,
  loading: false,
  error: null,
};

export const getOrganizations = createAsyncThunk(
  'organization/getOrganizations',
  async () => {
    const response = await api.get('/api/organizations');
    return response.data;
  }
);

export const getOrganization = createAsyncThunk(
  'organization/getOrganization',
  async (orgId) => {
    const response = await api.get(`/api/organizations/${orgId}`);
    return response.data;
  }
);

export const createOrganization = createAsyncThunk(
  'organization/createOrganization',
  async ({ name, description }) => {
    const response = await api.post('/api/organizations', { name, description });
    return response.data;
  }
);

export const updateOrganization = createAsyncThunk(
  'organization/updateOrganization',
  async ({ id, name, description }) => {
    const response = await api.patch(`/api/organizations/${id}`, { name, description });
    return response.data;
  }
);

export const deleteOrganization = createAsyncThunk(
  'organization/deleteOrganization',
  async (orgId) => {
    await api.delete(`/api/organizations/${orgId}`);
    return orgId;
  }
);

export const inviteMember = createAsyncThunk(
  'organization/inviteMember',
  async ({ orgId, email, role }) => {
    const response = await api.post(`/api/organizations/${orgId}/members/invite`, {
      email,
      role
    });
    return response.data;
  }
);

export const removeMember = createAsyncThunk(
  'organization/removeMember',
  async ({ orgId, userId }) => {
    await api.delete(`/api/organizations/${orgId}/members/${userId}`);
    return { orgId, userId };
  }
);

export const updateMemberRole = createAsyncThunk(
  'organization/updateMemberRole',
  async ({ orgId, userId, role }) => {
    const response = await api.patch(`/api/organizations/${orgId}/members/${userId}/role`, {
      role
    });
    return response.data;
  }
);

const organizationSlice = createSlice({
  name: 'organization',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setCurrentOrganization: (state, action) => {
      state.currentOrganization = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Get Organizations
      .addCase(getOrganizations.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getOrganizations.fulfilled, (state, action) => {
        state.loading = false;
        state.organizations = action.payload;
      })
      .addCase(getOrganizations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // Get Organization
      .addCase(getOrganization.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getOrganization.fulfilled, (state, action) => {
        state.loading = false;
        state.currentOrganization = action.payload;
      })
      .addCase(getOrganization.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // Create Organization
      .addCase(createOrganization.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createOrganization.fulfilled, (state, action) => {
        state.loading = false;
        state.organizations.push(action.payload);
      })
      .addCase(createOrganization.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // Update Organization
      .addCase(updateOrganization.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateOrganization.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.organizations.findIndex(org => org.id === action.payload.id);
        if (index !== -1) {
          state.organizations[index] = action.payload;
        }
        if (state.currentOrganization?.id === action.payload.id) {
          state.currentOrganization = action.payload;
        }
      })
      .addCase(updateOrganization.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // Delete Organization
      .addCase(deleteOrganization.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteOrganization.fulfilled, (state, action) => {
        state.loading = false;
        state.organizations = state.organizations.filter(org => org.id !== action.payload);
        if (state.currentOrganization?.id === action.payload) {
          state.currentOrganization = null;
        }
      })
      .addCase(deleteOrganization.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // Invite Member
      .addCase(inviteMember.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(inviteMember.fulfilled, (state, action) => {
        state.loading = false;
        if (state.currentOrganization) {
          state.currentOrganization.members.push(action.payload);
        }
      })
      .addCase(inviteMember.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // Remove Member
      .addCase(removeMember.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeMember.fulfilled, (state, action) => {
        state.loading = false;
        if (state.currentOrganization) {
          state.currentOrganization.members = state.currentOrganization.members
            .filter(member => member.id !== action.payload.userId);
        }
      })
      .addCase(removeMember.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // Update Member Role
      .addCase(updateMemberRole.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateMemberRole.fulfilled, (state, action) => {
        state.loading = false;
        if (state.currentOrganization) {
          const index = state.currentOrganization.members
            .findIndex(member => member.id === action.payload.userId);
          if (index !== -1) {
            state.currentOrganization.members[index] = action.payload;
          }
        }
      })
      .addCase(updateMemberRole.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const { clearError, setCurrentOrganization } = organizationSlice.actions;

export const selectOrganizations = (state) => state.organization.organizations;
export const selectCurrentOrganization = (state) => state.organization.currentOrganization;
export const selectOrganizationLoading = (state) => state.organization.loading;
export const selectOrganizationError = (state) => state.organization.error;

export default organizationSlice.reducer;
