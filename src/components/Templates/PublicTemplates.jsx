import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPublicTemplates, selectPublicTemplates, selectTemplatesLoading } from '../../store/slices/templateSlice';
import TemplateCard from './TemplateCard';
import SearchBar from '../Common/SearchBar';

const PublicTemplates = () => {
  const dispatch = useDispatch();
  const templates = useSelector(selectPublicTemplates);
  const loading = useSelector(selectTemplatesLoading);
  const [filteredTemplates, setFilteredTemplates] = useState([]);

  useEffect(() => {
    dispatch(fetchPublicTemplates());
  }, [dispatch]);

  useEffect(() => {
    setFilteredTemplates(templates);
  }, [templates]);

  const handleSearch = (query) => {
    const filtered = templates.filter(template =>
      template.name.toLowerCase().includes(query.toLowerCase()) ||
      template.description?.toLowerCase().includes(query.toLowerCase()) ||
      template.tags?.some(tag => tag.toLowerCase().includes(query.toLowerCase()))
    );
    setFilteredTemplates(filtered);
  };

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
        <h1 className="text-2xl font-bold text-white">Public Templates</h1>
      </div>

      <div className="mb-6">
        <SearchBar onSearch={handleSearch} />
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredTemplates.map((template) => (
          <TemplateCard 
            key={template._id} 
            template={template}
            isPublic
          />
        ))}
        
        {filteredTemplates.length === 0 && (
          <div className="col-span-full text-center py-12">
            <p className="text-gray-400 text-lg">
              {templates.length === 0
                ? "No public templates available."
                : "No templates match your search."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PublicTemplates;
