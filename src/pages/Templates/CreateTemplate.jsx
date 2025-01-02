import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  createTemplate,
  selectTemplatesLoading,
  selectTemplatesError,
  clearError
} from '../../store/slices/templateSlice';
import { selectIsAuthenticated } from '../../store/slices/authSlice';
import { PlusIcon, TrashIcon } from '@heroicons/react/24/outline';

const QUESTION_TYPES = [
  { value: 'text', label: 'Text' },
  { value: 'textarea', label: 'Long Text' },
  { value: 'number', label: 'Number' },
  { value: 'select', label: 'Select' },
  { value: 'radio', label: 'Radio' },
  { value: 'checkbox', label: 'Checkbox' }
];

const CreateTemplate = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const loading = useSelector(selectTemplatesLoading);
  const error = useSelector(selectTemplatesError);
  const isAuthenticated = useSelector(selectIsAuthenticated);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
    // Clear any existing errors when component mounts
    dispatch(clearError());
  }, [isAuthenticated, navigate, dispatch]);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    isPublic: false,
    questions: []
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const addQuestion = () => {
    setFormData(prev => ({
      ...prev,
      questions: [
        ...prev.questions,
        {
          id: Date.now().toString(),
          type: 'text',
          label: '',
          required: false,
          options: []
        }
      ]
    }));
  };

  const removeQuestion = (questionId) => {
    setFormData(prev => ({
      ...prev,
      questions: prev.questions.filter(q => q.id !== questionId)
    }));
  };

  const updateQuestion = (questionId, updates) => {
    setFormData(prev => ({
      ...prev,
      questions: prev.questions.map(q =>
        q.id === questionId ? { ...q, ...updates } : q
      )
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate questions
    if (formData.questions.length === 0) {
      alert('Please add at least one question');
      return;
    }

    const invalidQuestions = formData.questions.filter(q => !q.label.trim());
    if (invalidQuestions.length > 0) {
      alert('Please fill in all question labels');
      return;
    }

    // Validate options for select, radio, and checkbox questions
    const invalidOptions = formData.questions.filter(q => 
      (q.type === 'select' || q.type === 'radio' || q.type === 'checkbox') && 
      (!q.options || q.options.length === 0)
    );
    if (invalidOptions.length > 0) {
      alert('Please add options for all select, radio, and checkbox questions');
      return;
    }

    // Prepare data for submission
    const templateData = {
      ...formData,
      questions: formData.questions.map(({ id, ...rest }) => ({
        ...rest,
        options: rest.options.filter(Boolean) // Remove empty options
      }))
    };

    try {
      await dispatch(createTemplate(templateData)).unwrap();
      navigate('/templates/my');
    } catch (err) {
      console.error('Failed to create template:', err);
      // Error will be handled by the reducer and displayed in the UI
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
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-white mb-6">Create New Template</h1>

      {error && (
        <div className="mb-6 p-4 bg-red-900/50 border border-red-500 rounded-lg text-red-200">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-300 mb-2">
            Title
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:border-blue-500 outline-none"
            required
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-300 mb-2">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={4}
            className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:border-blue-500 outline-none"
          />
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            id="isPublic"
            name="isPublic"
            checked={formData.isPublic}
            onChange={handleChange}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label htmlFor="isPublic" className="ml-2 block text-sm text-gray-300">
            Make this template public
          </label>
        </div>

        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-medium text-white">Questions</h2>
            <button
              type="button"
              onClick={addQuestion}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <PlusIcon className="h-5 w-5 mr-2" />
              Add Question
            </button>
          </div>

          {formData.questions.map((question) => (
            <div key={question.id} className="bg-gray-800 rounded-lg p-4 space-y-4">
              <div className="flex justify-between">
                <select
                  value={question.type}
                  onChange={(e) => updateQuestion(question.id, { type: e.target.value })}
                  className="bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:border-blue-500 outline-none"
                >
                  {QUESTION_TYPES.map(type => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={() => removeQuestion(question.id)}
                  className="text-red-500 hover:text-red-400"
                >
                  <TrashIcon className="h-5 w-5" />
                </button>
              </div>

              <input
                type="text"
                value={question.label}
                onChange={(e) => updateQuestion(question.id, { label: e.target.value })}
                placeholder="Question text"
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:border-blue-500 outline-none"
                required
              />

              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={question.required}
                  onChange={(e) => updateQuestion(question.id, { required: e.target.checked })}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label className="ml-2 text-sm text-gray-300">Required</label>
              </div>

              {(question.type === 'select' || question.type === 'radio' || question.type === 'checkbox') && (
                <div>
                  <label className="block text-sm text-gray-300 mb-2">
                    Options (one per line)
                  </label>
                  <textarea
                    value={question.options.join('\n')}
                    onChange={(e) => updateQuestion(question.id, {
                      options: e.target.value.split('\n').filter(Boolean)
                    })}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:border-blue-500 outline-none"
                    rows={4}
                    placeholder="Enter options here&#10;One option per line"
                    required={question.type === 'select' || question.type === 'radio' || question.type === 'checkbox'}
                  />
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => navigate('/templates/my')}
            className="px-4 py-2 text-gray-300 hover:text-white"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Creating...' : 'Create Template'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateTemplate;
