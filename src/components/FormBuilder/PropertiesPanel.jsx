import React from 'react';

const PropertiesPanel = ({ field, onFieldUpdate }) => {
  if (!field) {
    return (
      <div className="text-center py-4 text-gray-500">
        Select a field to edit its properties
      </div>
    );
  }

  const handleChange = (key, value) => {
    onFieldUpdate(field.id, { [key]: value });
  };

  const handleOptionChange = (index, key, value) => {
    const newOptions = [...(field.options || [])];
    newOptions[index] = { ...newOptions[index], [key]: value };
    onFieldUpdate(field.id, { options: newOptions });
  };

  const addOption = () => {
    const newOptions = [...(field.options || []), { label: '', value: '' }];
    onFieldUpdate(field.id, { options: newOptions });
  };

  const removeOption = (index) => {
    const newOptions = field.options.filter((_, i) => i !== index);
    onFieldUpdate(field.id, { options: newOptions });
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold mb-4">Field Properties</h3>

      <div className="space-y-4">
        {/* Label */}
        <div>
          <label className="block text-sm font-medium mb-1">Label</label>
          <input
            type="text"
            value={field.label || ''}
            onChange={(e) => handleChange('label', e.target.value)}
            className="w-full px-3 py-2 border rounded-md"
          />
        </div>

        {/* Placeholder */}
        {['text', 'number', 'textarea', 'email', 'phone', 'url'].includes(field.type) && (
          <div>
            <label className="block text-sm font-medium mb-1">Placeholder</label>
            <input
              type="text"
              value={field.placeholder || ''}
              onChange={(e) => handleChange('placeholder', e.target.value)}
              className="w-full px-3 py-2 border rounded-md"
            />
          </div>
        )}

        {/* Required */}
        <div>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={field.required || false}
              onChange={(e) => handleChange('required', e.target.checked)}
            />
            <span className="text-sm font-medium">Required field</span>
          </label>
        </div>

        {/* Options for select, radio, and checkbox */}
        {['select', 'radio', 'checkbox'].includes(field.type) && (
          <div className="space-y-2">
            <label className="block text-sm font-medium mb-1">Options</label>
            {field.options?.map((option, index) => (
              <div key={index} className="flex gap-2">
                <input
                  type="text"
                  value={option.label}
                  onChange={(e) => handleOptionChange(index, 'label', e.target.value)}
                  placeholder="Label"
                  className="flex-1 px-3 py-1 border rounded-md"
                />
                <input
                  type="text"
                  value={option.value}
                  onChange={(e) => handleOptionChange(index, 'value', e.target.value)}
                  placeholder="Value"
                  className="flex-1 px-3 py-1 border rounded-md"
                />
                <button
                  onClick={() => removeOption(index)}
                  className="p-1 text-red-500 hover:bg-red-100 rounded"
                >
                  ✕
                </button>
              </div>
            ))}
            <button
              onClick={addOption}
              className="w-full py-1 text-blue-500 hover:bg-blue-50 rounded border border-dashed border-blue-500"
            >
              + Add Option
            </button>
          </div>
        )}

        {/* Validation */}
        {['text', 'textarea'].includes(field.type) && (
          <div className="space-y-2">
            <label className="block text-sm font-medium mb-1">Validation</label>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs mb-1">Min Length</label>
                <input
                  type="number"
                  value={field.minLength || ''}
                  onChange={(e) => handleChange('minLength', e.target.value)}
                  className="w-full px-3 py-1 border rounded-md"
                />
              </div>
              <div>
                <label className="block text-xs mb-1">Max Length</label>
                <input
                  type="number"
                  value={field.maxLength || ''}
                  onChange={(e) => handleChange('maxLength', e.target.value)}
                  className="w-full px-3 py-1 border rounded-md"
                />
              </div>
            </div>
          </div>
        )}

        {field.type === 'number' && (
          <div className="space-y-2">
            <label className="block text-sm font-medium mb-1">Range</label>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs mb-1">Min Value</label>
                <input
                  type="number"
                  value={field.min || ''}
                  onChange={(e) => handleChange('min', e.target.value)}
                  className="w-full px-3 py-1 border rounded-md"
                />
              </div>
              <div>
                <label className="block text-xs mb-1">Max Value</label>
                <input
                  type="number"
                  value={field.max || ''}
                  onChange={(e) => handleChange('max', e.target.value)}
                  className="w-full px-3 py-1 border rounded-md"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PropertiesPanel;
