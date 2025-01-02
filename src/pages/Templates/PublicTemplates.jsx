import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  fetchPublicTemplates,
  selectPublicTemplates,
  selectTemplatesLoading,
  selectTemplatesError
} from '../../store/slices/templateSlice';

const PublicTemplates = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const templates = useSelector(selectPublicTemplates);
  const loading = useSelector(selectTemplatesLoading);
  const error = useSelector(selectTemplatesError);

  useEffect(() => {
    dispatch(fetchPublicTemplates());
  }, [dispatch]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-4">
        <div className="text-red-500 mb-4">{error}</div>
        <button
          onClick={() => dispatch(fetchPublicTemplates())}
          className="text-blue-500 hover:text-blue-700"
        >
          Try again
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-white">Public Templates</h1>
      </div>

      {templates.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-400">No public templates available</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {templates.map((template) => (
            <div
              key={template._id}
              className="bg-gray-800 rounded-lg shadow-lg overflow-hidden"
            >
              <div className="p-6">
                <h3 className="text-lg font-medium text-white mb-2">
                  {template.title}
                </h3>
                <p className="text-gray-400 mb-4">{template.description}</p>
                <div className="flex justify-between items-center">
                  <div className="space-x-2">
                    <button
                      onClick={() => navigate(`/templates/use/${template._id}`)}
                      className="text-green-500 hover:text-green-400"
                    >
                      Use Template
                    </button>
                  </div>
                  <span className="text-gray-400 text-sm">
                    By {template.createdBy?.name || 'Unknown'}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PublicTemplates;
