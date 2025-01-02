import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  getTemplate,
  selectCurrentTemplate,
  selectTemplateLoading,
  selectTemplateError
} from '../../store/slices/templateSlice';
import { 
  ExclamationCircleIcon,
  CheckCircleIcon,
  ArrowLeftIcon,
  DocumentDuplicateIcon,
  ShareIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';

const ViewForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const template = useSelector(selectCurrentTemplate);
  const loading = useSelector(selectTemplateLoading);
  const error = useSelector(selectTemplateError);

  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [showShareDialog, setShowShareDialog] = useState(false);

  useEffect(() => {
    const fetchTemplate = async () => {
      try {
        await dispatch(getTemplate(id)).unwrap();
        // Initialize form data with empty values
        const initialData = {};
        template?.fields?.forEach(field => {
          initialData[field.id] = field.type === 'checkbox' ? [] : '';
        });
        setFormData(initialData);
      } catch (err) {
        console.error('Failed to load form:', err);
      }
    };

    fetchTemplate();
  }, [dispatch, id, template]);

  const validateField = (field, value) => {
    if (field.required && !value) {
      return 'This field is required';
    }

    switch (field.type) {
      case 'email':
        if (value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          return 'Please enter a valid email address';
        }
        break;
      case 'number':
        if (value && isNaN(value)) {
          return 'Please enter a valid number';
        }
        break;
      case 'checkbox':
        if (field.required && (!Array.isArray(value) || value.length === 0)) {
          return 'Please select at least one option';
        }
        break;
    }

    return '';
  };

  const handleChange = (field, value) => {
    const newFormData = { ...formData };
    newFormData[field.id] = value;
    setFormData(newFormData);

    // Clear error when user starts typing
    const newErrors = { ...errors };
    delete newErrors[field.id];
    setErrors(newErrors);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate all fields
    const newErrors = {};
    let hasErrors = false;

    template.fields.forEach(field => {
      const error = validateField(field, formData[field.id]);
      if (error) {
        newErrors[field.id] = error;
        hasErrors = true;
      }
    });

    if (hasErrors) {
      setErrors(newErrors);
      // Scroll to first error
      const firstErrorId = Object.keys(newErrors)[0];
      document.getElementById(firstErrorId)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    try {
      // TODO: Implement form submission
      console.log('Form data:', formData);
      setSubmitted(true);
      // Reset form after successful submission
      const initialData = {};
      template.fields.forEach(field => {
        initialData[field.id] = field.type === 'checkbox' ? [] : '';
      });
      setFormData(initialData);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      console.error('Failed to submit form:', err);
    }
  };

  const copyFormLink = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    // TODO: Show success message
  };

  const renderField = (field) => {
    const error = errors[field.id];
    const value = formData[field.id] || '';

    const baseInputClasses = `w-full bg-gray-700 border rounded-lg px-3 py-2 text-white outline-none transition-colors ${
      error 
        ? 'border-red-500 focus:border-red-500' 
        : 'border-gray-600 focus:border-blue-500'
    }`;

    switch (field.type) {
      case 'textarea':
        return (
          <textarea
            id={field.id}
            value={value}
            onChange={(e) => handleChange(field, e.target.value)}
            placeholder={field.placeholder}
            className={`${baseInputClasses} resize-none`}
            rows="4"
          />
        );

      case 'select':
        return (
          <select
            id={field.id}
            value={value}
            onChange={(e) => handleChange(field, e.target.value)}
            className={baseInputClasses}
          >
            <option value="">Select an option</option>
            {field.options?.map((option, i) => (
              <option key={i} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );

      case 'radio':
        return (
          <div className="space-y-2">
            {field.options?.map((option, i) => (
              <label key={i} className="flex items-center space-x-2 text-white">
                <input
                  type="radio"
                  name={field.id}
                  value={option.value}
                  checked={value === option.value}
                  onChange={(e) => handleChange(field, e.target.value)}
                  className="form-radio h-4 w-4 text-blue-500"
                />
                <span>{option.label}</span>
              </label>
            ))}
          </div>
        );

      case 'checkbox':
        return (
          <div className="space-y-2">
            {field.options?.map((option, i) => (
              <label key={i} className="flex items-center space-x-2 text-white">
                <input
                  type="checkbox"
                  value={option.value}
                  checked={Array.isArray(value) && value.includes(option.value)}
                  onChange={(e) => {
                    const newValue = Array.isArray(value) ? [...value] : [];
                    if (e.target.checked) {
                      newValue.push(option.value);
                    } else {
                      const index = newValue.indexOf(option.value);
                      if (index > -1) {
                        newValue.splice(index, 1);
                      }
                    }
                    handleChange(field, newValue);
                  }}
                  className="form-checkbox h-4 w-4 text-blue-500"
                />
                <span>{option.label}</span>
              </label>
            ))}
          </div>
        );

      default:
        return (
          <input
            id={field.id}
            type={field.type}
            value={value}
            onChange={(e) => handleChange(field, e.target.value)}
            placeholder={field.placeholder}
            className={baseInputClasses}
          />
        );
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
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="bg-red-900/50 border border-red-500 text-red-200 px-4 py-3 rounded-lg flex items-center">
            <ExclamationCircleIcon className="h-5 w-5 mr-2" />
            <span>{error}</span>
          </div>
        </div>
      </div>
    );
  }

  if (!template) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeftIcon className="h-5 w-5 mr-2" />
            Back
          </button>
          <div className="flex items-center space-x-4">
            <button
              onClick={copyFormLink}
              className="flex items-center px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
            >
              <DocumentDuplicateIcon className="h-5 w-5 mr-2" />
              Copy Link
            </button>
            <button
              onClick={() => setShowShareDialog(true)}
              className="flex items-center px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
            >
              <ShareIcon className="h-5 w-5 mr-2" />
              Share
            </button>
          </div>
        </div>

        {/* Form Title and Description */}
        <div className="bg-gray-800 rounded-lg p-6 shadow-lg mb-8">
          <h1 className="text-3xl font-bold text-white mb-4">{template.title}</h1>
          {template.description && (
            <p className="text-gray-300 whitespace-pre-wrap">{template.description}</p>
          )}
        </div>

        {/* Success Message */}
        {submitted && (
          <div className="bg-green-900/50 border border-green-500 text-green-200 px-4 py-3 rounded-lg flex items-center mb-8">
            <CheckCircleIcon className="h-5 w-5 mr-2" />
            <span>Form submitted successfully!</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-8">
          {template.fields?.map((field) => (
            <div key={field.id} className="bg-gray-800 rounded-lg p-6 shadow-lg">
              <label className="block text-white mb-2">
                {field.label}
                {field.required && <span className="text-red-500 ml-1">*</span>}
              </label>
              {renderField(field)}
              {errors[field.id] && (
                <div className="flex items-center text-red-500 text-sm mt-1">
                  <ExclamationCircleIcon className="h-4 w-4 mr-1" />
                  {errors[field.id]}
                </div>
              )}
            </div>
          ))}

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors text-lg font-medium"
          >
            Submit
          </button>
        </form>

        {/* Share Dialog */}
        {showShareDialog && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
            <div className="bg-gray-800 rounded-lg p-6 shadow-lg max-w-md w-full">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-white">Share Form</h2>
                <button
                  onClick={() => setShowShareDialog(false)}
                  className="text-gray-400 hover:text-white"
                >
                  <XMarkIcon className="h-5 w-5" />
                </button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-white mb-2">Form Link</label>
                  <div className="flex">
                    <input
                      type="text"
                      value={window.location.href}
                      readOnly
                      className="flex-1 bg-gray-700 border border-gray-600 rounded-l-lg px-3 py-2 text-white"
                    />
                    <button
                      onClick={copyFormLink}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 rounded-r-lg"
                    >
                      Copy
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-white mb-2">Share via</label>
                  <div className="grid grid-cols-2 gap-4">
                    <button className="flex items-center justify-center space-x-2 bg-[#25D366] hover:bg-[#128C7E] text-white px-4 py-2 rounded-lg">
                      <span>WhatsApp</span>
                    </button>
                    <button className="flex items-center justify-center space-x-2 bg-[#1DA1F2] hover:bg-[#1A91DA] text-white px-4 py-2 rounded-lg">
                      <span>Twitter</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewForm;
