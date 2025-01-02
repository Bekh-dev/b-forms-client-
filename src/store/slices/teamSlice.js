import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../config/axios';

const initialState = {
  teams: [],
  currentTeam: null,
  loading: false,
  error: null,
};

export const getTeams = createAsyncThunk(
  'team/getTeams',
  async (orgId) => {
    const response = await api.get(`/api/organizations/${orgId}/teams`);
    return response.data;
  }
);

export const getTeam = createAsyncThunk(
  'team/getTeam',
  async ({ orgId, teamId }) => {
    const response = await api.get(`/api/organizations/${orgId}/teams/${teamId}`);
    return response.data;
  }
);

export const createTeam = createAsyncThunk(
  'team/createTeam',
  async ({ orgId, name, description }) => {
    const response = await api.post(`/api/organizations/${orgId}/teams`, {
      name,
      description
    });
    return response.data;
  }
);

export const updateTeam = createAsyncThunk(
  'team/updateTeam',
  async ({ orgId, teamId, name, description }) => {
    const response = await api.patch(`/api/organizations/${orgId}/teams/${teamId}`, {
      name,
      description
    });
    return response.data;
  }
);

export const deleteTeam = createAsyncThunk(
  'team/deleteTeam',
  async ({ orgId, teamId }) => {
    await api.delete(`/api/organizations/${orgId}/teams/${teamId}`);
    return teamId;
  }
);

export const addTeamMember = createAsyncThunk(
  'team/addMember',
  async ({ orgId, teamId, userId }) => {
    const response = await api.post(`/api/organizations/${orgId}/teams/${teamId}/members`, {
      userId
    });
    return response.data;
  }
);

export const removeTeamMember = createAsyncThunk(
  'team/removeMember',
  async ({ orgId, teamId, userId }) => {
    await api.delete(`/api/organizations/${orgId}/teams/${teamId}/members/${userId}`);
    return { teamId, userId };
  }
);

const teamSlice = createSlice({
  name: 'team',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setCurrentTeam: (state, action) => {
      state.currentTeam = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Get Teams
      .addCase(getTeams.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getTeams.fulfilled, (state, action) => {
        state.loading = false;
        state.teams = action.payload;
      })
      .addCase(getTeams.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // Get Team
      .addCase(getTeam.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getTeam.fulfilled, (state, action) => {
        state.loading = false;
        state.currentTeam = action.payload;
      })
      .addCase(getTeam.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // Create Team
      .addCase(createTeam.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createTeam.fulfilled, (state, action) => {
        state.loading = false;
        state.teams.push(action.payload);
      })
      .addCase(createTeam.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // Update Team
      .addCase(updateTeam.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateTeam.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.teams.findIndex(team => team.id === action.payload.id);
        if (index !== -1) {
          state.teams[index] = action.payload;
        }
        if (state.currentTeam?.id === action.payload.id) {
          state.currentTeam = action.payload;
        }
      })
      .addCase(updateTeam.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // Delete Team
      .addCase(deleteTeam.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteTeam.fulfilled, (state, action) => {
        state.loading = false;
        state.teams = state.teams.filter(team => team.id !== action.payload);
        if (state.currentTeam?.id === action.payload) {
          state.currentTeam = null;
        }
      })
      .addCase(deleteTeam.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // Add Team Member
      .addCase(addTeamMember.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addTeamMember.fulfilled, (state, action) => {
        state.loading = false;
        const team = state.teams.find(t => t.id === action.payload.teamId);
        if (team) {
          team.members = team.members || [];
          team.members.push(action.payload.member);
        }
        if (state.currentTeam?.id === action.payload.teamId) {
          state.currentTeam.members = state.currentTeam.members || [];
          state.currentTeam.members.push(action.payload.member);
        }
      })
      .addCase(addTeamMember.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // Remove Team Member
      .addCase(removeTeamMember.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeTeamMember.fulfilled, (state, action) => {
        state.loading = false;
        const team = state.teams.find(t => t.id === action.payload.teamId);
        if (team && team.members) {
          team.members = team.members.filter(member => member.id !== action.payload.userId);
        }
        if (state.currentTeam?.id === action.payload.teamId) {
          state.currentTeam.members = state.currentTeam.members.filter(
            member => member.id !== action.payload.userId
          );
        }
      })
      .addCase(removeTeamMember.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const { clearError, setCurrentTeam } = teamSlice.actions;

export const selectTeams = (state) => state.team.teams;
export const selectCurrentTeam = (state) => state.team.currentTeam;
export const selectTeamLoading = (state) => state.team.loading;
export const selectTeamError = (state) => state.team.error;

export default teamSlice.reducer;
