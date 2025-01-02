import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectUser } from '../../store/slices/authSlice';

const Settings = () => {
  const user = useSelector(selectUser);
  const dispatch = useDispatch();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-gray-800 rounded-lg shadow p-6">
        <h2 className="text-2xl font-bold text-white mb-6">Settings</h2>
        
        <div className="space-y-6">
          {/* Profile Section */}
          <div>
            <h3 className="text-lg font-medium text-white mb-4">Profile</h3>
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300">Name</label>
                <input
                  type="text"
                  className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white"
                  value={user?.name || ''}
                  readOnly
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300">Email</label>
                <input
                  type="email"
                  className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white"
                  value={user?.email || ''}
                  readOnly
                />
              </div>
            </div>
          </div>

          {/* Preferences Section */}
          <div>
            <h3 className="text-lg font-medium text-white mb-4">Preferences</h3>
            <div className="space-y-4">
              <div className="flex items-center">
                <input
                  id="emailNotifications"
                  type="checkbox"
                  className="h-4 w-4 rounded border-gray-600 text-blue-600 focus:ring-blue-500 bg-gray-700"
                />
                <label htmlFor="emailNotifications" className="ml-2 block text-sm text-gray-300">
                  Receive email notifications
                </label>
              </div>
              <div className="flex items-center">
                <input
                  id="publicTemplates"
                  type="checkbox"
                  className="h-4 w-4 rounded border-gray-600 text-blue-600 focus:ring-blue-500 bg-gray-700"
                />
                <label htmlFor="publicTemplates" className="ml-2 block text-sm text-gray-300">
                  Make my templates public by default
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
