import React from 'react';
import { 
  ExclamationCircleIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';

const FormPreview = ({ fields = [], onFieldValidation = () => {} }) => {
  const [formData, setFormData] = React.useState({});
  const [errors, setErrors] = React.useState({});
  const [submitted, setSubmitted] = React.useState(false);

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
      case 'date':
        if (value && isNaN(new Date(value).getTime())) {
          return 'Please enter a valid date';
        }
        break;
    }

    return '';
  };

  const handleChange = (field, value) => {
    const newFormData = { ...formData, [field.label]: value };
    setFormData(newFormData);

    const error = validateField(field, value);
    const newErrors = { ...errors, [field.label]: error };
    setErrors(newErrors);

    onFieldValidation(field.label, !error);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate all fields
    const newErrors = {};
    let hasErrors = false;

    fields.forEach(field => {
      const error = validateField(field, formData[field.label]);
      if (error) {
        newErrors[field.label] = error;
        hasErrors = true;
      }
    });

    setErrors(newErrors);

    if (!hasErrors) {
      setSubmitted(true);
      setTimeout(() => setSubmitted(false), 3000);
    }
  };

  const renderField = (field) => {
    const error = errors[field.label];
    const value = formData[field.label] || '';

    const baseInputClasses = `w-full bg-gray-700 border rounded-lg px-3 py-2 text-white outline-none transition-colors ${
      error 
        ? 'border-red-500 focus:border-red-500' 
        : 'border-gray-600 focus:border-blue-500'
    }`;

    switch (field.type) {
      case 'textarea':
        return (
          <textarea
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
                  name={field.label}
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
            type={field.type}
            value={value}
            onChange={(e) => handleChange(field, e.target.value)}
            placeholder={field.placeholder}
            className={baseInputClasses}
          />
        );
    }
  };

  return (
    <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
      <form onSubmit={handleSubmit} className="space-y-6">
        {fields.map((field, index) => (
          <div key={index} className="space-y-2">
            <label className="block text-white">
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </label>
            {renderField(field)}
            {errors[field.label] && (
              <div className="flex items-center text-red-500 text-sm mt-1">
                <ExclamationCircleIcon className="h-4 w-4 mr-1" />
                {errors[field.label]}
              </div>
            )}
          </div>
        ))}

        {submitted && (
          <div className="flex items-center text-green-500 bg-green-500/10 p-3 rounded-lg">
            <CheckCircleIcon className="h-5 w-5 mr-2" />
            Form submitted successfully!
          </div>
        )}

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default FormPreview;
