import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import {
  fetchTemplateById,
  updateTemplate,
  selectCurrentTemplate,
  selectTemplatesLoading,
  selectTemplatesError
} from '../../store/slices/templateSlice';

const EditTemplate = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const template = useSelector(selectCurrentTemplate);
  const loading = useSelector(selectTemplatesLoading);
  const error = useSelector(selectTemplatesError);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    isPublic: false,
    questions: []
  });

  useEffect(() => {
    if (id) {
      dispatch(fetchTemplateById(id));
    }
  }, [dispatch, id]);

  useEffect(() => {
    if (template) {
      setFormData({
        title: template.title || '',
        description: template.description || '',
        isPublic: template.isPublic || false,
        questions: template.questions || []
      });
    }
  }, [template]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await dispatch(updateTemplate({ id, templateData: formData })).unwrap();
      navigate('/templates/my');
    } catch (error) {
      console.error('Failed to update template:', error);
    }
  };

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
          id: Date.now(),
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
            Back to My Templates
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-white mb-6">Edit Template</h1>

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
                  <option value="text">Text</option>
                  <option value="textarea">Long Text</option>
                  <option value="number">Number</option>
                  <option value="select">Select</option>
                  <option value="radio">Radio</option>
                  <option value="checkbox">Checkbox</option>
                </select>
                <button
                  type="button"
                  onClick={() => removeQuestion(question.id)}
                  className="text-red-500 hover:text-red-400"
                >
                  Delete
                </button>
              </div>

              <input
                type="text"
                value={question.label}
                onChange={(e) => updateQuestion(question.id, { label: e.target.value })}
                placeholder="Question text"
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:border-blue-500 outline-none"
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
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditTemplate;
