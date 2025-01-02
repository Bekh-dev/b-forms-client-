import React from 'react';

const FIELD_TYPES = [
  {
    type: 'text',
    label: 'Text Input',
    icon: '📝',
  },
  {
    type: 'number',
    label: 'Number',
    icon: '🔢',
  },
  {
    type: 'textarea',
    label: 'Text Area',
    icon: '📄',
  },
  {
    type: 'select',
    label: 'Dropdown',
    icon: '▼',
  },
  {
    type: 'radio',
    label: 'Radio Group',
    icon: '⭕',
  },
  {
    type: 'checkbox',
    label: 'Checkbox Group',
    icon: '☑️',
  },
  {
    type: 'date',
    label: 'Date',
    icon: '📅',
  },
  {
    type: 'time',
    label: 'Time',
    icon: '⏰',
  },
  {
    type: 'file',
    label: 'File Upload',
    icon: '📎',
  },
  {
    type: 'email',
    label: 'Email',
    icon: '📧',
  },
  {
    type: 'phone',
    label: 'Phone',
    icon: '📱',
  },
  {
    type: 'url',
    label: 'URL',
    icon: '🔗',
  }
];

const ToolboxPanel = ({ onAddField }) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold mb-4">Form Fields</h3>
      <div className="space-y-2">
        {FIELD_TYPES.map(({ type, label, icon }) => (
          <button
            key={type}
            onClick={() => onAddField(type)}
            className="w-full flex items-center gap-2 p-2 hover:bg-gray-100 rounded transition-colors text-left"
          >
            <span className="text-xl">{icon}</span>
            <span>{label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default ToolboxPanel;
