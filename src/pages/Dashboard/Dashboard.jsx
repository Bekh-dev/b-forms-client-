import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import {
  fetchMyTemplates,
  selectMyTemplates,
  selectTemplatesLoading
} from '../../store/slices/templateSlice';
import {
  DocumentIcon,
  PlusIcon,
  ChartBarIcon,
  UsersIcon
} from '@heroicons/react/24/outline';

const StatCard = ({ title, value, icon: Icon, color }) => (
  <div className="bg-gray-800 rounded-lg p-6">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-gray-400 text-sm">{title}</p>
        <p className="text-2xl font-semibold text-white mt-2">{value}</p>
      </div>
      <div className={`p-3 rounded-full ${color}`}>
        <Icon className="w-6 h-6 text-white" />
      </div>
    </div>
  </div>
);

const Dashboard = () => {
  const dispatch = useDispatch();
  const templates = useSelector(selectMyTemplates);
  const loading = useSelector(selectTemplatesLoading);

  useEffect(() => {
    dispatch(fetchMyTemplates());
  }, [dispatch]);

  const stats = [
    {
      title: 'Total Templates',
      value: templates.length,
      icon: DocumentIcon,
      color: 'bg-blue-600'
    },
    {
      title: 'Public Templates',
      value: templates.filter(t => t.isPublic).length,
      icon: UsersIcon,
      color: 'bg-green-600'
    },
    {
      title: 'Total Responses',
      value: '0',
      icon: ChartBarIcon,
      color: 'bg-purple-600'
    }
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white mb-2">Dashboard</h1>
          <p className="text-gray-400">Welcome back! Here's your forms overview.</p>
        </div>

        <Link
          to="/templates/create"
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          Create Template
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {stats.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </div>

      {/* Recent Templates */}
      <div className="bg-gray-800 rounded-lg p-6">
        <h2 className="text-xl font-semibold text-white mb-4">Recent Templates</h2>
        {templates.length > 0 ? (
          <div className="space-y-4">
            {templates.slice(0, 5).map(template => (
              <Link
                key={template._id}
                to={`/templates/edit/${template._id}`}
                className="block p-4 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-white font-medium">{template.title}</h3>
                    <p className="text-gray-400 text-sm mt-1">
                      {template.isPublic ? 'Public' : 'Private'} • Created {new Date(template.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-gray-400">
                    <DocumentIcon className="h-5 w-5" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <p className="text-gray-400">No templates yet. Create your first one!</p>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
