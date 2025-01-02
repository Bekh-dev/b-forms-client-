import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { shareTemplate, generateShareableLink } from '../../store/slices/templateSlice';

const ShareTemplate = ({ template, onClose }) => {
  const dispatch = useDispatch();
  const [email, setEmail] = useState('');
  const [accessType, setAccessType] = useState('respond');
  const [shareableLink, setShareableLink] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleShare = async (e) => {
    e.preventDefault();
    try {
      await dispatch(shareTemplate({ 
        templateId: template._id, 
        email, 
        accessType 
      })).unwrap();
      setSuccess(`Template shared with ${email}`);
      setEmail('');
      setError('');
    } catch (err) {
      setError(err.message || 'Failed to share template');
    }
  };

  const handleGenerateLink = async () => {
    try {
      const response = await dispatch(generateShareableLink(template._id)).unwrap();
      setShareableLink(response.shareableLink);
      setError('');
    } catch (err) {
      setError(err.message || 'Failed to generate link');
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareableLink);
    setSuccess('Link copied to clipboard!');
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
      <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-gray-800">
        <div className="mt-3">
          <h3 className="text-lg leading-6 font-medium text-white mb-4">
            Share Template
          </h3>
          
          {error && (
            <div className="mb-4 p-2 bg-red-500 text-white rounded">
              {error}
            </div>
          )}
          
          {success && (
            <div className="mb-4 p-2 bg-green-500 text-white rounded">
              {success}
            </div>
          )}

          <form onSubmit={handleShare} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300">
                Email address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white"
                placeholder="Enter email"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300">
                Access Type
              </label>
              <select
                value={accessType}
                onChange={(e) => setAccessType(e.target.value)}
                className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white"
              >
                <option value="respond">Can Respond</option>
                <option value="view">Can View</option>
              </select>
            </div>

            <button
              type="submit"
              className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Share
            </button>
          </form>

          <div className="mt-4">
            <button
              onClick={handleGenerateLink}
              className="w-full px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
            >
              Generate Shareable Link
            </button>

            {shareableLink && (
              <div className="mt-4">
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={shareableLink}
                    readOnly
                    className="flex-1 rounded-md bg-gray-700 border-gray-600 text-white"
                  />
                  <button
                    onClick={copyToClipboard}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    Copy
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="mt-4">
            <button
              onClick={onClose}
              className="w-full px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShareTemplate;
