import React, { useState } from 'react';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';
import ToolboxPanel from './ToolboxPanel';
import FormPreview from './FormPreview';
import PropertiesPanel from './PropertiesPanel';

const FormBuilder = ({ initialFields = [], onSave }) => {
  const [fields, setFields] = useState(initialFields);
  const [selectedField, setSelectedField] = useState(null);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      setFields((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const handleAddField = (fieldType) => {
    const newField = {
      id: `field-${Date.now()}`,
      type: fieldType,
      label: `New ${fieldType} field`,
      placeholder: '',
      required: false,
      options: fieldType === 'select' || fieldType === 'radio' || fieldType === 'checkbox' ? [] : undefined,
    };
    setFields([...fields, newField]);
    setSelectedField(newField);
  };

  const handleFieldUpdate = (fieldId, updates) => {
    setFields(fields.map(field => 
      field.id === fieldId ? { ...field, ...updates } : field
    ));
    if (selectedField?.id === fieldId) {
      setSelectedField({ ...selectedField, ...updates });
    }
  };

  const handleFieldDelete = (fieldId) => {
    setFields(fields.filter(field => field.id !== fieldId));
    if (selectedField?.id === fieldId) {
      setSelectedField(null);
    }
  };

  const handleSave = () => {
    if (onSave) {
      onSave(fields);
    }
  };

  return (
    <div className="flex h-full gap-4">
      {/* Панель инструментов */}
      <div className="w-64 bg-white shadow-md rounded-lg p-4">
        <ToolboxPanel onAddField={handleAddField} />
      </div>

      {/* Область конструктора */}
      <div className="flex-1 bg-white shadow-md rounded-lg p-4">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={fields.map(f => f.id)}
            strategy={verticalListSortingStrategy}
          >
            <FormPreview
              fields={fields}
              selectedFieldId={selectedField?.id}
              onFieldSelect={setSelectedField}
              onFieldDelete={handleFieldDelete}
            />
          </SortableContext>
        </DndContext>

        <div className="mt-4 flex justify-end">
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          >
            Save Form
          </button>
        </div>
      </div>

      {/* Панель свойств */}
      <div className="w-64 bg-white shadow-md rounded-lg p-4">
        <PropertiesPanel
          field={selectedField}
          onFieldUpdate={handleFieldUpdate}
        />
      </div>
    </div>
  );
};

export default FormBuilder;
