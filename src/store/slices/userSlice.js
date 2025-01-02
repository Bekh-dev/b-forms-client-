import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../config/axios';

const initialState = {
  users: [],
  loading: false,
  error: null,
};

export const getUsers = createAsyncThunk(
  'user/getUsers',
  async () => {
    const response = await api.get('/api/users');
    return response.data;
  }
);

export const inviteUser = createAsyncThunk(
  'user/inviteUser',
  async ({ email, role }) => {
    const response = await api.post('/api/users/invite', { email, role });
    return response.data;
  }
);

export const updateUserRole = createAsyncThunk(
  'user/updateRole',
  async ({ userId, role }) => {
    const response = await api.patch(`/api/users/${userId}/role`, { role });
    return response.data;
  }
);

export const deleteUser = createAsyncThunk(
  'user/deleteUser',
  async (userId) => {
    await api.delete(`/api/users/${userId}`);
    return userId;
  }
);

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Get Users
      .addCase(getUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
      })
      .addCase(getUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // Invite User
      .addCase(inviteUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(inviteUser.fulfilled, (state, action) => {
        state.loading = false;
        state.users.push(action.payload);
      })
      .addCase(inviteUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // Update User Role
      .addCase(updateUserRole.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUserRole.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.users.findIndex(user => user.id === action.payload.id);
        if (index !== -1) {
          state.users[index] = action.payload;
        }
      })
      .addCase(updateUserRole.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // Delete User
      .addCase(deleteUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.loading = false;
        state.users = state.users.filter(user => user.id !== action.payload);
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const { clearError } = userSlice.actions;

export const selectUsers = (state) => state.user.users;
export const selectUserLoading = (state) => state.user.loading;
export const selectUserError = (state) => state.user.error;

export default userSlice.reducer;
