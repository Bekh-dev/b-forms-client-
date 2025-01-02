import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { updateTemplate, deleteTemplate } from '../../store/slices/templateSlice';
import { 
  PencilIcon, 
  TrashIcon, 
  ArchiveBoxIcon, 
  GlobeAltIcon,
  DocumentDuplicateIcon,
  ExclamationTriangleIcon,
  ClockIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';

const TemplateCard = ({ 
  template = {}, 
  isPublic = false,
  isSelected = false,
  onSelect = () => {},
}) => {
  const dispatch = useDispatch();
  const [isDeleting, setIsDeleting] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await dispatch(deleteTemplate(template._id)).unwrap();
    } catch (error) {
      console.error('Failed to delete template:', error);
    } finally {
      setIsDeleting(false);
      setShowConfirmDelete(false);
    }
  };

  const handleStatusUpdate = async (updates) => {
    setIsUpdating(true);
    try {
      await dispatch(updateTemplate({ 
        id: template._id, 
        templateData: { ...template, ...updates }
      })).unwrap();
    } catch (error) {
      console.error('Failed to update template:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(date);
  };

  const getStatusColor = () => {
    if (template.isArchived) return 'text-gray-400 bg-gray-400/10';
    if (template.isPublished) return 'text-green-400 bg-green-400/10';
    return 'text-yellow-400 bg-yellow-400/10';
  };

  const getStatusText = () => {
    if (template.isArchived) return 'Archived';
    if (template.isPublished) return 'Published';
    return 'Draft';
  };

  const getStatusIcon = () => {
    if (template.isArchived) return ArchiveBoxIcon;
    if (template.isPublished) return GlobeAltIcon;
    return DocumentDuplicateIcon;
  };

  const StatusIcon = getStatusIcon();

  return (
    <div 
      className={`group bg-gray-800 rounded-lg shadow-lg overflow-hidden transition-all duration-200 ${
        isSelected ? 'ring-2 ring-blue-500' : 'hover:shadow-xl'
      }`}
    >
      {/* Selection Overlay */}
      {!isPublic && (
        <div 
          className={`absolute top-4 left-4 z-10`}
        >
          <button
            onClick={(e) => {
              e.stopPropagation();
              onSelect(template._id);
            }}
            className={`w-6 h-6 rounded-full border-2 transition-colors duration-200 flex items-center justify-center ${
              isSelected ? 'border-blue-500 bg-blue-500' : 'border-gray-400 hover:border-blue-400'
            }`}
          >
            {isSelected && <CheckCircleIcon className="w-4 h-4 text-white" />}
          </button>
        </div>
      )}

      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-xl font-semibold text-white group-hover:text-blue-400 transition-colors">
            {template.title || 'Untitled Template'}
          </h3>
          <span className={`px-2 py-1 text-xs font-medium rounded-full flex items-center ${getStatusColor()}`}>
            <StatusIcon className="w-3 h-3 mr-1" />
            {getStatusText()}
          </span>
        </div>
        
        <p className="text-gray-400 mb-4 line-clamp-2">
          {template.description || 'No description'}
        </p>
        
        <div className="flex flex-wrap gap-2 mb-4">
          {(template.tags || []).map((tag, index) => (
            <span
              key={index}
              className="px-2 py-1 text-xs font-medium text-blue-400 bg-blue-400/10 rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>

        <div className="flex items-center text-sm text-gray-500 mb-4">
          <ClockIcon className="w-4 h-4 mr-1" />
          <span>
            {template.updatedAt !== template.createdAt
              ? `Updated ${formatDate(template.updatedAt)}`
              : `Created ${formatDate(template.createdAt)}`}
          </span>
        </div>
        
        <div className="flex justify-between items-center">
          {!isPublic ? (
            <>
              <div className="space-x-2">
                <Link
                  to={`/templates/${template._id}/edit`}
                  className="inline-flex items-center px-3 py-1 text-sm rounded-md bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 transition-colors"
                >
                  <PencilIcon className="w-4 h-4 mr-1" />
                  Edit
                </Link>
                <button
                  onClick={() => setShowConfirmDelete(true)}
                  disabled={isDeleting}
                  className="inline-flex items-center px-3 py-1 text-sm rounded-md bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isDeleting ? (
                    <>
                      <div className="w-4 h-4 mr-1 border-2 border-red-400 border-t-transparent rounded-full animate-spin" />
                      Deleting...
                    </>
                  ) : (
                    <>
                      <TrashIcon className="w-4 h-4 mr-1" />
                      Delete
                    </>
                  )}
                </button>
              </div>
              <div className="space-x-2">
                <button
                  onClick={() => handleStatusUpdate({ isArchived: !template.isArchived })}
                  disabled={isUpdating}
                  className="inline-flex items-center px-3 py-1 text-sm rounded-md bg-gray-700 text-gray-300 hover:bg-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ArchiveBoxIcon className="w-4 h-4 mr-1" />
                  {template.isArchived ? 'Unarchive' : 'Archive'}
                </button>
                <button
                  onClick={() => handleStatusUpdate({ isPublished: !template.isPublished })}
                  disabled={isUpdating}
                  className="inline-flex items-center px-3 py-1 text-sm rounded-md bg-gray-700 text-gray-300 hover:bg-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <GlobeAltIcon className="w-4 h-4 mr-1" />
                  {template.isPublished ? 'Unpublish' : 'Publish'}
                </button>
              </div>
            </>
          ) : (
            <div className="w-full">
              <Link
                to={`/templates/${template._id}`}
                className="block w-full text-center bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors inline-flex items-center justify-center"
              >
                <DocumentDuplicateIcon className="w-5 h-5 mr-2" />
                Use Template
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showConfirmDelete && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-gray-800 p-6 rounded-lg max-w-md w-full mx-4">
            <div className="flex items-center text-red-500 mb-4">
              <ExclamationTriangleIcon className="w-6 h-6 mr-2" />
              <h3 className="text-lg font-medium">Delete Template</h3>
            </div>
            <p className="text-gray-300 mb-6">
              Are you sure you want to delete this template? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowConfirmDelete(false)}
                className="px-4 py-2 text-gray-300 hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isDeleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TemplateCard;
