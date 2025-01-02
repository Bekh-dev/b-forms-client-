import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  updateProfile,
  updatePassword,
  updateNotificationSettings
} from '../../store/slices/authSlice';
import {
  UserCircleIcon,
  KeyIcon,
  BellIcon,
  PaintBrushIcon,
  CheckCircleIcon,
  XCircleIcon
} from '@heroicons/react/24/outline';

const TABS = {
  PROFILE: 'profile',
  SECURITY: 'security',
  NOTIFICATIONS: 'notifications',
  APPEARANCE: 'appearance'
};

const UserSettings = () => {
  const dispatch = useDispatch();
  const user = useSelector(state => state.auth.user);
  const [activeTab, setActiveTab] = useState(TABS.PROFILE);
  const [successMessage, setSuccessMessage] = useState('');
  const [error, setError] = useState('');

  // Profile Form State
  const [profileForm, setProfileForm] = useState({
    name: user.name || '',
    email: user.email || '',
    avatar: user.avatar || '',
    bio: user.bio || ''
  });

  // Password Form State
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  // Notification Settings State
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: user.settings?.emailNotifications ?? true,
    formSubmissions: user.settings?.formSubmissions ?? true,
    teamUpdates: user.settings?.teamUpdates ?? true,
    marketing: user.settings?.marketing ?? false
  });

  // Appearance Settings State
  const [appearanceSettings, setAppearanceSettings] = useState({
    theme: user.settings?.theme || 'dark',
    fontSize: user.settings?.fontSize || 'medium',
    compactMode: user.settings?.compactMode ?? false
  });

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    try {
      await dispatch(updateProfile(profileForm)).unwrap();
      showSuccess('Profile updated successfully');
    } catch (err) {
      setError(err.message);
    }
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setError('New passwords do not match');
      return;
    }
    try {
      await dispatch(updatePassword({
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword
      })).unwrap();
      setPasswordForm({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      showSuccess('Password updated successfully');
    } catch (err) {
      setError(err.message);
    }
  };

  const handleNotificationUpdate = async (setting, value) => {
    const newSettings = { ...notificationSettings, [setting]: value };
    setNotificationSettings(newSettings);
    try {
      await dispatch(updateNotificationSettings(newSettings)).unwrap();
      showSuccess('Notification settings updated');
    } catch (err) {
      setError(err.message);
      // Revert the change on error
      setNotificationSettings({ ...notificationSettings });
    }
  };

  const showSuccess = (message) => {
    setSuccessMessage(message);
    setError('');
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  const renderProfileTab = () => (
    <form onSubmit={handleProfileUpdate} className="space-y-6">
      <div className="flex items-center space-x-6">
        <div className="relative">
          <div className="h-24 w-24 rounded-full bg-gray-700 flex items-center justify-center text-white text-3xl">
            {profileForm.avatar ? (
              <img
                src={profileForm.avatar}
                alt="Profile"
                className="h-full w-full rounded-full object-cover"
              />
            ) : (
              profileForm.name?.[0]?.toUpperCase() || user.email[0].toUpperCase()
            )}
          </div>
          <button
            type="button"
            className="absolute bottom-0 right-0 bg-blue-600 rounded-full p-2 text-white hover:bg-blue-700"
          >
            <PaintBrushIcon className="h-4 w-4" />
          </button>
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-medium text-white">Profile Picture</h3>
          <p className="text-gray-400 text-sm">
            Upload a new profile picture or remove the current one
          </p>
        </div>
      </div>

      <div>
        <label className="block text-white mb-2">Full Name</label>
        <input
          type="text"
          value={profileForm.name}
          onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
          className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:border-blue-500 outline-none"
        />
      </div>

      <div>
        <label className="block text-white mb-2">Email Address</label>
        <input
          type="email"
          value={profileForm.email}
          onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
          className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:border-blue-500 outline-none"
        />
      </div>

      <div>
        <label className="block text-white mb-2">Bio</label>
        <textarea
          value={profileForm.bio}
          onChange={(e) => setProfileForm({ ...profileForm, bio: e.target.value })}
          rows="4"
          className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:border-blue-500 outline-none resize-none"
        />
      </div>

      <button
        type="submit"
        className="w-full bg-blue-600 text-white rounded-lg px-4 py-2 hover:bg-blue-700 transition-colors"
      >
        Save Changes
      </button>
    </form>
  );

  const renderSecurityTab = () => (
    <form onSubmit={handlePasswordUpdate} className="space-y-6">
      <div>
        <label className="block text-white mb-2">Current Password</label>
        <input
          type="password"
          value={passwordForm.currentPassword}
          onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
          className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:border-blue-500 outline-none"
        />
      </div>

      <div>
        <label className="block text-white mb-2">New Password</label>
        <input
          type="password"
          value={passwordForm.newPassword}
          onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
          className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:border-blue-500 outline-none"
        />
      </div>

      <div>
        <label className="block text-white mb-2">Confirm New Password</label>
        <input
          type="password"
          value={passwordForm.confirmPassword}
          onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
          className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:border-blue-500 outline-none"
        />
      </div>

      <button
        type="submit"
        className="w-full bg-blue-600 text-white rounded-lg px-4 py-2 hover:bg-blue-700 transition-colors"
      >
        Update Password
      </button>
    </form>
  );

  const renderNotificationsTab = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-white font-medium">Email Notifications</h3>
          <p className="text-gray-400 text-sm">Receive email notifications</p>
        </div>
        <button
          onClick={() => handleNotificationUpdate('emailNotifications', !notificationSettings.emailNotifications)}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
            notificationSettings.emailNotifications ? 'bg-blue-600' : 'bg-gray-600'
          }`}
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
              notificationSettings.emailNotifications ? 'translate-x-6' : 'translate-x-1'
            }`}
          />
        </button>
      </div>

      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-white font-medium">Form Submissions</h3>
          <p className="text-gray-400 text-sm">Get notified when someone submits a form</p>
        </div>
        <button
          onClick={() => handleNotificationUpdate('formSubmissions', !notificationSettings.formSubmissions)}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
            notificationSettings.formSubmissions ? 'bg-blue-600' : 'bg-gray-600'
          }`}
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
              notificationSettings.formSubmissions ? 'translate-x-6' : 'translate-x-1'
            }`}
          />
        </button>
      </div>

      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-white font-medium">Team Updates</h3>
          <p className="text-gray-400 text-sm">Get notified about team changes</p>
        </div>
        <button
          onClick={() => handleNotificationUpdate('teamUpdates', !notificationSettings.teamUpdates)}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
            notificationSettings.teamUpdates ? 'bg-blue-600' : 'bg-gray-600'
          }`}
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
              notificationSettings.teamUpdates ? 'translate-x-6' : 'translate-x-1'
            }`}
          />
        </button>
      </div>

      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-white font-medium">Marketing Updates</h3>
          <p className="text-gray-400 text-sm">Receive marketing and promotion emails</p>
        </div>
        <button
          onClick={() => handleNotificationUpdate('marketing', !notificationSettings.marketing)}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
            notificationSettings.marketing ? 'bg-blue-600' : 'bg-gray-600'
          }`}
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
              notificationSettings.marketing ? 'translate-x-6' : 'translate-x-1'
            }`}
          />
        </button>
      </div>
    </div>
  );

  const renderAppearanceTab = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-white mb-2">Theme</label>
        <div className="grid grid-cols-2 gap-4">
          <button
            type="button"
            onClick={() => setAppearanceSettings({ ...appearanceSettings, theme: 'dark' })}
            className={`p-4 rounded-lg border ${
              appearanceSettings.theme === 'dark'
                ? 'border-blue-500 bg-gray-700'
                : 'border-gray-600 bg-gray-800'
            }`}
          >
            <div className="h-20 bg-gray-900 rounded mb-2"></div>
            <div className="text-white text-center">Dark</div>
          </button>
          <button
            type="button"
            onClick={() => setAppearanceSettings({ ...appearanceSettings, theme: 'light' })}
            className={`p-4 rounded-lg border ${
              appearanceSettings.theme === 'light'
                ? 'border-blue-500 bg-gray-700'
                : 'border-gray-600 bg-gray-800'
            }`}
          >
            <div className="h-20 bg-white rounded mb-2"></div>
            <div className="text-white text-center">Light</div>
          </button>
        </div>
      </div>

      <div>
        <label className="block text-white mb-2">Font Size</label>
        <select
          value={appearanceSettings.fontSize}
          onChange={(e) => setAppearanceSettings({ ...appearanceSettings, fontSize: e.target.value })}
          className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:border-blue-500 outline-none"
        >
          <option value="small">Small</option>
          <option value="medium">Medium</option>
          <option value="large">Large</option>
        </select>
      </div>

      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-white font-medium">Compact Mode</h3>
          <p className="text-gray-400 text-sm">Use compact layout for denser information display</p>
        </div>
        <button
          onClick={() => setAppearanceSettings({
            ...appearanceSettings,
            compactMode: !appearanceSettings.compactMode
          })}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
            appearanceSettings.compactMode ? 'bg-blue-600' : 'bg-gray-600'
          }`}
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
              appearanceSettings.compactMode ? 'translate-x-6' : 'translate-x-1'
            }`}
          />
        </button>
      </div>
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold text-white mb-8">Settings</h1>

        {/* Success Message */}
        {successMessage && (
          <div className="mb-4 p-4 bg-green-900/50 border border-green-500 rounded-lg flex items-center text-green-200">
            <CheckCircleIcon className="h-5 w-5 mr-2" />
            {successMessage}
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-4 bg-red-900/50 border border-red-500 rounded-lg flex items-center text-red-200">
            <XCircleIcon className="h-5 w-5 mr-2" />
            {error}
          </div>
        )}

        <div className="bg-gray-800 rounded-lg overflow-hidden">
          <div className="flex border-b border-gray-700">
            <button
              onClick={() => setActiveTab(TABS.PROFILE)}
              className={`flex items-center px-6 py-4 text-sm font-medium ${
                activeTab === TABS.PROFILE
                  ? 'text-white border-b-2 border-blue-500'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <UserCircleIcon className="h-5 w-5 mr-2" />
              Profile
            </button>
            <button
              onClick={() => setActiveTab(TABS.SECURITY)}
              className={`flex items-center px-6 py-4 text-sm font-medium ${
                activeTab === TABS.SECURITY
                  ? 'text-white border-b-2 border-blue-500'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <KeyIcon className="h-5 w-5 mr-2" />
              Security
            </button>
            <button
              onClick={() => setActiveTab(TABS.NOTIFICATIONS)}
              className={`flex items-center px-6 py-4 text-sm font-medium ${
                activeTab === TABS.NOTIFICATIONS
                  ? 'text-white border-b-2 border-blue-500'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <BellIcon className="h-5 w-5 mr-2" />
              Notifications
            </button>
            <button
              onClick={() => setActiveTab(TABS.APPEARANCE)}
              className={`flex items-center px-6 py-4 text-sm font-medium ${
                activeTab === TABS.APPEARANCE
                  ? 'text-white border-b-2 border-blue-500'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <PaintBrushIcon className="h-5 w-5 mr-2" />
              Appearance
            </button>
          </div>

          <div className="p-6">
            {activeTab === TABS.PROFILE && renderProfileTab()}
            {activeTab === TABS.SECURITY && renderSecurityTab()}
            {activeTab === TABS.NOTIFICATIONS && renderNotificationsTab()}
            {activeTab === TABS.APPEARANCE && renderAppearanceTab()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserSettings;
