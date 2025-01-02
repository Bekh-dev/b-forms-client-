import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import {
  fetchTemplateById,
  selectCurrentTemplate,
  selectTemplatesLoading,
  selectTemplatesError
} from '../../store/slices/templateSlice';
import { submitResponse } from '../../store/slices/responseSlice';

const UseTemplate = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const template = useSelector(selectCurrentTemplate);
  const loading = useSelector(selectTemplatesLoading);
  const error = useSelector(selectTemplatesError);

  const [formData, setFormData] = useState({});
  const [submitStatus, setSubmitStatus] = useState({ loading: false, error: null });

  useEffect(() => {
    if (id) {
      dispatch(fetchTemplateById(id))
        .unwrap()
        .catch((error) => {
          console.error('Failed to fetch template:', error);
        });
    }
  }, [dispatch, id]);

  useEffect(() => {
    if (template?.questions) {
      const initialData = {};
      template.questions.forEach((question, index) => {
        initialData[`question_${index}`] = question.type === 'checkbox' ? [] : '';
      });
      setFormData(initialData);
    }
  }, [template]);

  const handleChange = (questionIndex, value, type) => {
    setFormData(prev => ({
      ...prev,
      [`question_${questionIndex}`]: type === 'checkbox' 
        ? (prev[`question_${questionIndex}`].includes(value)
          ? prev[`question_${questionIndex}`].filter(v => v !== value)
          : [...prev[`question_${questionIndex}`], value])
        : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitStatus({ loading: true, error: null });

    try {
      await dispatch(submitResponse({ templateId: id, answers: formData })).unwrap();
      navigate(`/templates/responses/${id}`);
    } catch (error) {
      setSubmitStatus({ 
        loading: false, 
        error: error.message || 'Failed to submit response' 
      });
    }
  };

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

  if (!template || !template.questions) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center">
          <h2 className="text-xl text-gray-300 mb-4">Template not found</h2>
          <button
            onClick={() => navigate(-1)}
            className="text-blue-500 hover:text-blue-400"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white mb-2">{template.title}</h1>
        {template.description && (
          <p className="text-gray-400">{template.description}</p>
        )}
      </div>

      {submitStatus.error && (
        <div className="mb-6 bg-red-900/50 border border-red-500 text-red-200 p-4 rounded-lg">
          {submitStatus.error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {template.questions.map((question, index) => (
          <div key={index} className="bg-gray-800 rounded-lg p-6">
            <label className="block text-white font-medium mb-2">
              {question.label}
              {question.required && <span className="text-red-500 ml-1">*</span>}
            </label>

            {question.type === 'text' && (
              <input
                type="text"
                value={formData[`question_${index}`] || ''}
                onChange={(e) => handleChange(index, e.target.value)}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:border-blue-500 outline-none"
                required={question.required}
              />
            )}

            {question.type === 'textarea' && (
              <textarea
                value={formData[`question_${index}`] || ''}
                onChange={(e) => handleChange(index, e.target.value)}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:border-blue-500 outline-none"
                rows={4}
                required={question.required}
              />
            )}

            {question.type === 'number' && (
              <input
                type="number"
                value={formData[`question_${index}`] || ''}
                onChange={(e) => handleChange(index, e.target.value)}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:border-blue-500 outline-none"
                required={question.required}
              />
            )}

            {question.type === 'select' && (
              <select
                value={formData[`question_${index}`] || ''}
                onChange={(e) => handleChange(index, e.target.value)}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:border-blue-500 outline-none"
                required={question.required}
              >
                <option value="">Select an option</option>
                {question.options.map((option, optionIndex) => (
                  <option key={optionIndex} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            )}

            {question.type === 'radio' && (
              <div className="space-y-2">
                {question.options.map((option, optionIndex) => (
                  <label key={optionIndex} className="flex items-center space-x-2">
                    <input
                      type="radio"
                      name={`question_${index}`}
                      value={option}
                      checked={formData[`question_${index}`] === option}
                      onChange={(e) => handleChange(index, e.target.value)}
                      className="text-blue-600 focus:ring-blue-500 h-4 w-4 border-gray-600 bg-gray-700"
                      required={question.required}
                    />
                    <span className="text-gray-300">{option}</span>
                  </label>
                ))}
              </div>
            )}

            {question.type === 'checkbox' && (
              <div className="space-y-2">
                {question.options.map((option, optionIndex) => (
                  <label key={optionIndex} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      value={option}
                      checked={(formData[`question_${index}`] || []).includes(option)}
                      onChange={(e) => handleChange(index, e.target.value, 'checkbox')}
                      className="text-blue-600 focus:ring-blue-500 h-4 w-4 rounded border-gray-600 bg-gray-700"
                    />
                    <span className="text-gray-300">{option}</span>
                  </label>
                ))}
              </div>
            )}
          </div>
        ))}

        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="px-4 py-2 text-gray-300 hover:text-white"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={submitStatus.loading}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
          >
            {submitStatus.loading ? 'Submitting...' : 'Submit'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default UseTemplate;
