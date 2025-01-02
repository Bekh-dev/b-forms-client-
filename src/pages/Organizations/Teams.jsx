import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import {
  getOrganization,
  selectCurrentOrganization,
  selectOrganizationLoading
} from '../../store/slices/organizationSlice';
import {
  getTeams,
  createTeam,
  updateTeam,
  deleteTeam,
  addTeamMember,
  removeTeamMember,
  selectTeams,
  selectTeamLoading
} from '../../store/slices/teamSlice';
import {
  UsersIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';

const Teams = () => {
  const dispatch = useDispatch();
  const { orgId } = useParams();
  
  const organization = useSelector(selectCurrentOrganization);
  const teams = useSelector(selectTeams);
  const orgLoading = useSelector(selectOrganizationLoading);
  const teamLoading = useSelector(selectTeamLoading);
  
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showMembersDialog, setShowMembersDialog] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: ''
  });

  useEffect(() => {
    if (orgId) {
      dispatch(getOrganization(orgId));
      dispatch(getTeams(orgId));
    }
  }, [dispatch, orgId]);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await dispatch(createTeam({ orgId, ...formData })).unwrap();
      setShowCreateDialog(false);
      setFormData({ name: '', description: '' });
    } catch (err) {
      console.error('Failed to create team:', err);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await dispatch(updateTeam({
        orgId,
        teamId: selectedTeam.id,
        ...formData
      })).unwrap();
      setShowEditDialog(false);
      setSelectedTeam(null);
      setFormData({ name: '', description: '' });
    } catch (err) {
      console.error('Failed to update team:', err);
    }
  };

  const handleDelete = async (teamId) => {
    if (window.confirm('Are you sure you want to delete this team?')) {
      try {
        await dispatch(deleteTeam({ orgId, teamId })).unwrap();
      } catch (err) {
        console.error('Failed to delete team:', err);
      }
    }
  };

  const handleAddMember = async (userId) => {
    try {
      await dispatch(addTeamMember({
        orgId,
        teamId: selectedTeam.id,
        userId
      })).unwrap();
    } catch (err) {
      console.error('Failed to add team member:', err);
    }
  };

  const handleRemoveMember = async (userId) => {
    if (window.confirm('Are you sure you want to remove this member from the team?')) {
      try {
        await dispatch(removeTeamMember({
          orgId,
          teamId: selectedTeam.id,
          userId
        })).unwrap();
      } catch (err) {
        console.error('Failed to remove team member:', err);
      }
    }
  };

  if (orgLoading || teamLoading) {
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
          <div>
            <h1 className="text-2xl font-bold text-white mb-2">
              Teams - {organization?.name}
            </h1>
            <p className="text-gray-400">
              {teams.length} teams in this organization
            </p>
          </div>

          <button
            onClick={() => setShowCreateDialog(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            Create Team
          </button>
        </div>

        {/* Teams Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {teams.map(team => (
            <div
              key={team.id}
              className="bg-gray-800 rounded-lg p-6 hover:bg-gray-750 transition-colors"
            >
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-medium text-white">{team.name}</h3>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => {
                      setSelectedTeam(team);
                      setFormData({
                        name: team.name,
                        description: team.description || ''
                      });
                      setShowEditDialog(true);
                    }}
                    className="p-2 text-gray-400 hover:text-white transition-colors"
                  >
                    <PencilIcon className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => handleDelete(team.id)}
                    className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <TrashIcon className="h-5 w-5" />
                  </button>
                </div>
              </div>

              <p className="text-gray-400 mb-6 line-clamp-2">
                {team.description || 'No description'}
              </p>

              <div className="flex items-center justify-between">
                <div className="flex items-center text-gray-400">
                  <UsersIcon className="h-5 w-5 mr-2" />
                  <span>{team.members?.length || 0} members</span>
                </div>
                <button
                  onClick={() => {
                    setSelectedTeam(team);
                    setShowMembersDialog(true);
                  }}
                  className="text-blue-500 hover:text-blue-400 font-medium"
                >
                  Manage Members
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Create Team Dialog */}
        {showCreateDialog && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-gray-800 rounded-lg p-6 max-w-md w-full">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-white">Create Team</h2>
                <button
                  onClick={() => {
                    setShowCreateDialog(false);
                    setFormData({ name: '', description: '' });
                  }}
                  className="text-gray-400 hover:text-white"
                >
                  <XMarkIcon className="h-5 w-5" />
                </button>
              </div>

              <form onSubmit={handleCreate} className="space-y-4">
                <div>
                  <label className="block text-white mb-2">Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:border-blue-500 outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-white mb-2">Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows="4"
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:border-blue-500 outline-none resize-none"
                  />
                </div>

                <div className="flex justify-end space-x-4 mt-6">
                  <button
                    type="button"
                    onClick={() => {
                      setShowCreateDialog(false);
                      setFormData({ name: '', description: '' });
                    }}
                    className="px-4 py-2 text-gray-400 hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Create
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Edit Team Dialog */}
        {showEditDialog && selectedTeam && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-gray-800 rounded-lg p-6 max-w-md w-full">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-white">Edit Team</h2>
                <button
                  onClick={() => {
                    setShowEditDialog(false);
                    setSelectedTeam(null);
                    setFormData({ name: '', description: '' });
                  }}
                  className="text-gray-400 hover:text-white"
                >
                  <XMarkIcon className="h-5 w-5" />
                </button>
              </div>

              <form onSubmit={handleUpdate} className="space-y-4">
                <div>
                  <label className="block text-white mb-2">Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:border-blue-500 outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-white mb-2">Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows="4"
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:border-blue-500 outline-none resize-none"
                  />
                </div>

                <div className="flex justify-end space-x-4 mt-6">
                  <button
                    type="button"
                    onClick={() => {
                      setShowEditDialog(false);
                      setSelectedTeam(null);
                      setFormData({ name: '', description: '' });
                    }}
                    className="px-4 py-2 text-gray-400 hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Manage Team Members Dialog */}
        {showMembersDialog && selectedTeam && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-gray-800 rounded-lg p-6 max-w-2xl w-full">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-white">
                  Manage Team Members - {selectedTeam.name}
                </h2>
                <button
                  onClick={() => {
                    setShowMembersDialog(false);
                    setSelectedTeam(null);
                  }}
                  className="text-gray-400 hover:text-white"
                >
                  <XMarkIcon className="h-5 w-5" />
                </button>
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-medium text-white mb-4">Add Member</h3>
                <div className="flex gap-4">
                  <select
                    className="flex-1 bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:border-blue-500 outline-none"
                  >
                    <option value="">Select a member</option>
                    {organization?.members
                      ?.filter(member => !selectedTeam.members?.find(m => m.id === member.id))
                      .map(member => (
                        <option key={member.id} value={member.id}>
                          {member.name || member.email}
                        </option>
                      ))}
                  </select>
                  <button
                    onClick={() => {
                      const select = document.querySelector('select');
                      if (select.value) {
                        handleAddMember(select.value);
                        select.value = '';
                      }
                    }}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Add
                  </button>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium text-white mb-4">Current Members</h3>
                <div className="space-y-4">
                  {selectedTeam.members?.map(member => (
                    <div
                      key={member.id}
                      className="flex items-center justify-between bg-gray-700 rounded-lg p-4"
                    >
                      <div>
                        <p className="text-white font-medium">
                          {member.name || member.email}
                        </p>
                        <p className="text-gray-400 text-sm">
                          {member.email}
                        </p>
                      </div>
                      <button
                        onClick={() => handleRemoveMember(member.id)}
                        className="text-red-500 hover:text-red-400"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Teams;
