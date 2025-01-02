import React from 'react';

const FormField = ({ field }) => {
  const { type, label, placeholder, required, options } = field;

  const renderField = () => {
    switch (type) {
      case 'text':
      case 'email':
      case 'url':
      case 'phone':
        return (
          <input
            type={type}
            placeholder={placeholder}
            className="w-full px-3 py-2 border rounded-md"
            required={required}
          />
        );

      case 'number':
        return (
          <input
            type="number"
            placeholder={placeholder}
            className="w-full px-3 py-2 border rounded-md"
            required={required}
          />
        );

      case 'textarea':
        return (
          <textarea
            placeholder={placeholder}
            className="w-full px-3 py-2 border rounded-md"
            required={required}
            rows={3}
          />
        );

      case 'select':
        return (
          <select
            className="w-full px-3 py-2 border rounded-md"
            required={required}
          >
            <option value="">Select an option</option>
            {options?.map((option, index) => (
              <option key={index} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );

      case 'radio':
        return (
          <div className="space-y-2">
            {options?.map((option, index) => (
              <label key={index} className="flex items-center gap-2">
                <input
                  type="radio"
                  name={field.id}
                  value={option.value}
                  required={required}
                />
                <span>{option.label}</span>
              </label>
            ))}
          </div>
        );

      case 'checkbox':
        return (
          <div className="space-y-2">
            {options?.map((option, index) => (
              <label key={index} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name={field.id}
                  value={option.value}
                />
                <span>{option.label}</span>
              </label>
            ))}
          </div>
        );

      case 'date':
        return (
          <input
            type="date"
            className="w-full px-3 py-2 border rounded-md"
            required={required}
          />
        );

      case 'time':
        return (
          <input
            type="time"
            className="w-full px-3 py-2 border rounded-md"
            required={required}
          />
        );

      case 'file':
        return (
          <input
            type="file"
            className="w-full"
            required={required}
          />
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-1">
      <label className="block text-sm font-medium">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      {renderField()}
    </div>
  );
};

export default FormField;
