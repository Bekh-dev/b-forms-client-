import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getMyTemplates, selectMyTemplates, selectTemplateLoading } from '../../store/slices/templateSlice';

const MyTemplates = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const dispatch = useDispatch();
  const templates = useSelector(selectMyTemplates);
  const loading = useSelector(selectTemplateLoading);

  useEffect(() => {
    dispatch(getMyTemplates());
  }, [dispatch]);

  const filteredTemplates = templates.filter(template =>
    template.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-white">My Templates</h1>
        <Link
          to="/templates/create"
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
        >
          Create Template
        </Link>
      </div>

      <div className="mb-6">
        <div className="relative">
          <input
            type="text"
            placeholder="Search templates..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2 bg-gray-800 text-white rounded-lg border border-gray-700 focus:outline-none focus:border-blue-500"
          />
          <svg
            className="absolute right-3 top-2.5 h-5 w-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredTemplates.map((template) => (
          <div
            key={template._id}
            className="bg-gray-800 rounded-lg shadow-lg overflow-hidden"
          >
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-semibold text-white">{template.name}</h3>
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

export default MyTemplates;
