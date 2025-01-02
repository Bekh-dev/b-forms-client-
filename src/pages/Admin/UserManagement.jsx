import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  getUsers,
  updateUserRole,
  deleteUser,
  inviteUser
} from '../../store/slices/userSlice';
import {
  UserGroupIcon,
  UserPlusIcon,
  PencilIcon,
  TrashIcon,
  XMarkIcon,
  CheckIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  EnvelopeIcon
} from '@heroicons/react/24/outline';

const ROLES = {
  ADMIN: 'admin',
  EDITOR: 'editor',
  VIEWER: 'viewer'
};

const ROLE_BADGES = {
  [ROLES.ADMIN]: 'bg-red-500',
  [ROLES.EDITOR]: 'bg-blue-500',
  [ROLES.VIEWER]: 'bg-green-500'
};

const UserManagement = () => {
  const dispatch = useDispatch();
  const users = useSelector(state => state.user.users);
  const loading = useSelector(state => state.user.loading);
  const currentUser = useSelector(state => state.auth.user);

  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [showInviteDialog, setShowInviteDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [inviteForm, setInviteForm] = useState({
    email: '',
    role: ROLES.VIEWER
  });

  useEffect(() => {
    dispatch(getUsers());
  }, [dispatch]);

  // Filter users based on search term and role
  const filteredUsers = users.filter(user => {
    const matchesSearch = user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.name?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = !roleFilter || user.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const handleInviteUser = async (e) => {
    e.preventDefault();
    try {
      await dispatch(inviteUser(inviteForm)).unwrap();
      setShowInviteDialog(false);
      setInviteForm({ email: '', role: ROLES.VIEWER });
    } catch (error) {
      console.error('Failed to invite user:', error);
    }
  };

  const handleUpdateRole = async (userId, newRole) => {
    try {
      await dispatch(updateUserRole({ userId, role: newRole })).unwrap();
      setShowEditDialog(false);
      setSelectedUser(null);
    } catch (error) {
      console.error('Failed to update user role:', error);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await dispatch(deleteUser(userId)).unwrap();
      } catch (error) {
        console.error('Failed to delete user:', error);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center">
            <UserGroupIcon className="h-8 w-8 text-white mr-3" />
            <div>
              <h1 className="text-2xl font-bold text-white">User Management</h1>
              <p className="text-gray-400">{users.length} users</p>
            </div>
          </div>

          <button
            onClick={() => setShowInviteDialog(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
          >
            <UserPlusIcon className="h-5 w-5 mr-2" />
            Invite User
          </button>
        </div>

        {/* Search and Filter Bar */}
        <div className="bg-gray-800 rounded-lg p-4 mb-8 flex items-center space-x-4">
          <div className="flex-1 relative">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search users..."
              className="w-full bg-gray-700 border border-gray-600 rounded-lg pl-10 pr-4 py-2 text-white placeholder-gray-400 focus:border-blue-500 outline-none"
            />
            <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
          </div>
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:border-blue-500 outline-none"
          >
            <option value="">All Roles</option>
            {Object.values(ROLES).map(role => (
              <option key={role} value={role}>
                {role.charAt(0).toUpperCase() + role.slice(1)}
              </option>
            ))}
          </select>
        </div>

        {/* Users Table */}
        <div className="bg-gray-800 rounded-lg overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-700">
                <th className="py-3 px-4 text-left text-white font-medium">User</th>
                <th className="py-3 px-4 text-left text-white font-medium">Role</th>
                <th className="py-3 px-4 text-left text-white font-medium">Status</th>
                <th className="py-3 px-4 text-left text-white font-medium">Joined</th>
                <th className="py-3 px-4 text-right text-white font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user.id} className="border-t border-gray-700">
                  <td className="py-3 px-4">
                    <div className="flex items-center">
                      <div className="h-10 w-10 rounded-full bg-gray-700 flex items-center justify-center text-white font-medium">
                        {user.name ? user.name[0].toUpperCase() : user.email[0].toUpperCase()}
                      </div>
                      <div className="ml-3">
                        <div className="text-white font-medium">{user.name || 'No name'}</div>
                        <div className="text-gray-400 text-sm">{user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${ROLE_BADGES[user.role]} text-white`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      user.isActive ? 'bg-green-500' : 'bg-gray-500'
                    } text-white`}>
                      {user.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-gray-400">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end space-x-2">
                      <button
                        onClick={() => {
                          setSelectedUser(user);
                          setShowEditDialog(true);
                        }}
                        className="p-2 text-gray-400 hover:text-white transition-colors"
                        disabled={user.id === currentUser.id}
                      >
                        <PencilIcon className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleDeleteUser(user.id)}
                        className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                        disabled={user.id === currentUser.id}
                      >
                        <TrashIcon className="h-5 w-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Invite User Dialog */}
        {showInviteDialog && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-gray-800 rounded-lg p-6 max-w-md w-full">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-white">Invite User</h2>
                <button
                  onClick={() => setShowInviteDialog(false)}
                  className="text-gray-400 hover:text-white"
                >
                  <XMarkIcon className="h-5 w-5" />
                </button>
              </div>

              <form onSubmit={handleInviteUser} className="space-y-4">
                <div>
                  <label className="block text-white mb-2">Email</label>
                  <input
                    type="email"
                    value={inviteForm.email}
                    onChange={(e) => setInviteForm({ ...inviteForm, email: e.target.value })}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:border-blue-500 outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-white mb-2">Role</label>
                  <select
                    value={inviteForm.role}
                    onChange={(e) => setInviteForm({ ...inviteForm, role: e.target.value })}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:border-blue-500 outline-none"
                  >
                    {Object.values(ROLES).map(role => (
                      <option key={role} value={role}>
                        {role.charAt(0).toUpperCase() + role.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex justify-end space-x-4 mt-6">
                  <button
                    type="button"
                    onClick={() => setShowInviteDialog(false)}
                    className="px-4 py-2 text-gray-400 hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Send Invitation
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Edit User Dialog */}
        {showEditDialog && selectedUser && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-gray-800 rounded-lg p-6 max-w-md w-full">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-white">Edit User</h2>
                <button
                  onClick={() => {
                    setShowEditDialog(false);
                    setSelectedUser(null);
                  }}
                  className="text-gray-400 hover:text-white"
                >
                  <XMarkIcon className="h-5 w-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-white mb-2">Email</label>
                  <input
                    type="email"
                    value={selectedUser.email}
                    disabled
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-gray-400"
                  />
                </div>
                <div>
                  <label className="block text-white mb-2">Role</label>
                  <select
                    value={selectedUser.role}
                    onChange={(e) => handleUpdateRole(selectedUser.id, e.target.value)}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:border-blue-500 outline-none"
                  >
                    {Object.values(ROLES).map(role => (
                      <option key={role} value={role}>
                        {role.charAt(0).toUpperCase() + role.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex justify-end space-x-4 mt-6">
                <button
                  onClick={() => {
                    setShowEditDialog(false);
                    setSelectedUser(null);
                  }}
                  className="px-4 py-2 text-gray-400 hover:text-white"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserManagement;
