import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  getOrganizations,
  createOrganization,
  updateOrganization,
  deleteOrganization
} from '../../store/slices/organizationSlice';
import {
  BuildingOfficeIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  UsersIcon,
  XMarkIcon,
  CheckIcon
} from '@heroicons/react/24/outline';

const Organizations = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const organizations = useSelector(state => state.organization.organizations);
  const loading = useSelector(state => state.organization.loading);
  const error = useSelector(state => state.organization.error);

  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [selectedOrg, setSelectedOrg] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: ''
  });

  useEffect(() => {
    dispatch(getOrganizations());
  }, [dispatch]);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await dispatch(createOrganization(formData)).unwrap();
      setShowCreateDialog(false);
      setFormData({ name: '', description: '' });
    } catch (err) {
      console.error('Failed to create organization:', err);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await dispatch(updateOrganization({
        id: selectedOrg.id,
        ...formData
      })).unwrap();
      setShowEditDialog(false);
      setSelectedOrg(null);
      setFormData({ name: '', description: '' });
    } catch (err) {
      console.error('Failed to update organization:', err);
    }
  };

  const handleDelete = async (orgId) => {
    if (window.confirm('Are you sure you want to delete this organization?')) {
      try {
        await dispatch(deleteOrganization(orgId)).unwrap();
      } catch (err) {
        console.error('Failed to delete organization:', err);
      }
    }
  };

  const openEditDialog = (org) => {
    setSelectedOrg(org);
    setFormData({
      name: org.name,
      description: org.description || ''
    });
    setShowEditDialog(true);
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
            <BuildingOfficeIcon className="h-8 w-8 text-white mr-3" />
            <div>
              <h1 className="text-2xl font-bold text-white">Organizations</h1>
              <p className="text-gray-400">{organizations.length} organizations</p>
            </div>
          </div>

          <button
            onClick={() => setShowCreateDialog(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            Create Organization
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-8 p-4 bg-red-900/50 border border-red-500 rounded-lg text-red-200">
            {error}
          </div>
        )}

        {/* Organizations Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {organizations.map(org => (
            <div
              key={org.id}
              className="bg-gray-800 rounded-lg p-6 hover:bg-gray-750 transition-colors"
            >
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-medium text-white">{org.name}</h3>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => openEditDialog(org)}
                    className="p-2 text-gray-400 hover:text-white transition-colors"
                  >
                    <PencilIcon className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => handleDelete(org.id)}
                    className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <TrashIcon className="h-5 w-5" />
                  </button>
                </div>
              </div>

              <p className="text-gray-400 mb-6 line-clamp-2">
                {org.description || 'No description'}
              </p>

              <div className="flex items-center justify-between">
                <div className="flex items-center text-gray-400">
                  <UsersIcon className="h-5 w-5 mr-2" />
                  <span>{org.membersCount || 0} members</span>
                </div>
                <button
                  onClick={() => navigate(`/organizations/${org.id}/teams`)}
                  className="text-blue-500 hover:text-blue-400 font-medium"
                >
                  View Teams
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Create Organization Dialog */}
        {showCreateDialog && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-gray-800 rounded-lg p-6 max-w-md w-full">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-white">Create Organization</h2>
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

        {/* Edit Organization Dialog */}
        {showEditDialog && selectedOrg && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-gray-800 rounded-lg p-6 max-w-md w-full">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-white">Edit Organization</h2>
                <button
                  onClick={() => {
                    setShowEditDialog(false);
                    setSelectedOrg(null);
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
                      setSelectedOrg(null);
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
      </div>
    </div>
  );
};

export default Organizations;
