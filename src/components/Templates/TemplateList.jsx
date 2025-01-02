import React, { useState } from 'react';
import TemplateCard from './TemplateCard';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { deleteTemplate, publishTemplate } from '../../store/slices/templateSlice';

const TemplateList = ({ templates = [], isPublic = false }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const dispatch = useDispatch();

  // Убедимся, что templates является массивом
  const templateArray = Array.isArray(templates) ? templates : [];

  const filteredTemplates = templateArray.filter(template => 
    template.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    template.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    template.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this template?')) {
      dispatch(deleteTemplate(id));
    }
  };

  const handlePublish = (id) => {
    dispatch(publishTemplate(id));
  };

  if (!templateArray.length) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600 dark:text-gray-400">
          {isPublic 
            ? "No public templates available yet." 
            : "You haven't created any templates yet."}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="relative">
        <input
          type="text"
          placeholder="Search templates..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        />
        <div className="absolute inset-y-0 right-0 flex items-center pr-3">
          <svg
            className="h-5 w-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filteredTemplates.map((template) => (
          <div
            key={template._id}
            className="bg-gray-800 rounded-lg shadow-lg overflow-hidden"
          >
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-semibold text-white">{template.title}</h3>
                {template.isPublished && (
                  <span className="px-2 py-1 text-xs font-medium text-green-400 bg-green-400/10 rounded-full">
                    Published
                  </span>
                )}
              </div>
              <p className="text-gray-400 mb-4">{template.description}</p>
              <div className="flex flex-wrap gap-2 mb-4">
                {template.tags?.map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-1 text-xs font-medium text-blue-400 bg-blue-400/10 rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <div className="flex justify-between items-center">
                <div className="space-x-2">
                  <Link
                    to={`/templates/${template._id}/edit`}
                    className="text-blue-500 hover:text-blue-400 font-medium"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(template._id)}
                    className="text-red-500 hover:text-red-400 font-medium"
                  >
                    Delete
                  </button>
                </div>
                <button
                  onClick={() => handlePublish(template._id)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  {template.isPublished ? 'Unpublish' : 'Publish'}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TemplateList;
