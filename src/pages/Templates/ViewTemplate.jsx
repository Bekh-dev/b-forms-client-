import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import {
  fetchTemplateById,
  selectCurrentTemplate,
  selectTemplatesLoading,
  selectTemplatesError,
  selectIsAuthenticated
} from '../../store/slices/templateSlice';
import ShareTemplate from '../../components/ShareTemplate/ShareTemplate';

const ViewTemplate = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const template = useSelector(selectCurrentTemplate);
  const loading = useSelector(selectTemplatesLoading);
  const error = useSelector(selectTemplatesError);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const [showShareModal, setShowShareModal] = useState(false);

  useEffect(() => {
    if (id) {
      dispatch(fetchTemplateById(id));
    }
  }, [dispatch, id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-red-900/50 border border-red-500 text-red-200 p-4 rounded-lg">
          {error}
        </div>
      </div>
    );
  }

  if (!template) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center">
          <h2 className="text-xl text-gray-300 mb-4">Template not found</h2>
          <button
            onClick={() => navigate('/templates/my')}
            className="text-blue-500 hover:text-blue-400"
          >
            Back to Templates
          </button>
        </div>
      </div>
    );
  }

  const isOwner = isAuthenticated && template.creator._id === localStorage.getItem('userId');

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-white">{template.title}</h1>
        {isOwner && (
          <div className="flex space-x-4">
            <button
              onClick={() => setShowShareModal(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Share Template
            </button>
            <button
              onClick={() => navigate(`/templates/${id}/edit`)}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
            >
              Edit Template
            </button>
            <button
              onClick={() => navigate(`/templates/${id}/responses`)}
              className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
            >
              View Responses
            </button>
          </div>
        )}
      </div>

      {template.description && (
        <div className="mb-8">
          <p className="text-gray-300">{template.description}</p>
        </div>
      )}

      <div className="space-y-6">
        {template.questions.map((question, index) => (
          <div key={index} className="bg-gray-800 p-6 rounded-lg">
            <h3 className="text-lg font-medium text-white mb-2">
              {question.label}
              {question.required && <span className="text-red-500 ml-1">*</span>}
            </h3>

            {question.type === 'text' && (
              <input
                type="text"
                className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white"
                placeholder="Your answer"
                readOnly
              />
            )}

            {question.type === 'textarea' && (
              <textarea
                className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white"
                rows="3"
                placeholder="Your answer"
                readOnly
              />
            )}

            {question.type === 'select' && (
              <select
                className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white"
                disabled
              >
                <option value="">Select an option</option>
                {question.options.map((option, optIndex) => (
                  <option key={optIndex} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            )}

            {(question.type === 'radio' || question.type === 'checkbox') && (
              <div className="mt-2 space-y-2">
                {question.options.map((option, optIndex) => (
                  <div key={optIndex} className="flex items-center">
                    <input
                      type={question.type}
                      className="h-4 w-4 text-blue-600 bg-gray-700 border-gray-600"
                      disabled
                    />
                    <label className="ml-2 text-gray-300">{option}</label>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {showShareModal && (
        <ShareTemplate
          template={template}
          onClose={() => setShowShareModal(false)}
        />
      )}
    </div>
  );
};

export default ViewTemplate;
