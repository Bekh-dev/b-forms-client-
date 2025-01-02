import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import FormField from './FormField';

const SortableField = ({ field, isSelected, onSelect, onDelete }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: field.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`relative p-4 border rounded-lg mb-2 cursor-move ${
        isSelected ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
      }`}
      onClick={() => onSelect(field)}
      {...attributes}
      {...listeners}
    >
      <div className="absolute top-2 right-2 flex gap-2">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete(field.id);
          }}
          className="p-1 hover:bg-red-100 rounded"
        >
          <svg
            className="w-4 h-4 text-red-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
            />
          </svg>
        </button>
      </div>
      <FormField field={field} />
    </div>
  );
};

const FormPreview = ({ fields, selectedFieldId, onFieldSelect, onFieldDelete }) => {
  if (fields.length === 0) {
    return (
      <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-lg">
        <p className="text-gray-500">
          Drag and drop fields here or click on a field type from the toolbox
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {fields.map((field) => (
        <SortableField
          key={field.id}
          field={field}
          isSelected={field.id === selectedFieldId}
          onSelect={onFieldSelect}
          onDelete={onFieldDelete}
        />
      ))}
    </div>
  );
};

export default FormPreview;
