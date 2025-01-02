import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getFormResponses } from '../../store/slices/formSlice';
import { getTemplate, selectCurrentTemplate, selectTemplateLoading, selectTemplateError } from '../../store/slices/templateSlice';
import {
  ArrowLeftIcon,
  ChartBarIcon,
  TableCellsIcon,
  DocumentArrowDownIcon,
  FunnelIcon,
  MagnifyingGlassIcon,
  XMarkIcon,
  CheckIcon
} from '@heroicons/react/24/outline';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from 'chart.js';
import { Pie, Bar } from 'react-chartjs-2';
import { format } from 'date-fns';

// Register ChartJS components
ChartJS.register(ArcElement, CategoryScale, LinearScale, BarElement, Tooltip, Legend);

const VIEWS = {
  TABLE: 'table',
  ANALYTICS: 'analytics'
};

const CHART_COLORS = [
  'rgba(59, 130, 246, 0.8)', // Blue
  'rgba(16, 185, 129, 0.8)', // Green
  'rgba(239, 68, 68, 0.8)',  // Red
  'rgba(245, 158, 11, 0.8)', // Yellow
  'rgba(139, 92, 246, 0.8)', // Purple
  'rgba(236, 72, 153, 0.8)', // Pink
];

const FormResponses = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const template = useSelector(selectCurrentTemplate);
  const loading = useSelector(selectTemplateLoading);
  const error = useSelector(selectTemplateError);
  const [currentView, setCurrentView] = useState(VIEWS.TABLE);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({});
  const [selectedResponses, setSelectedResponses] = useState([]);
  const [showFilterDialog, setShowFilterDialog] = useState(false);

  // Load template and responses
  useEffect(() => {
    const loadData = async () => {
      try {
        await dispatch(getTemplate(id)).unwrap();
        await dispatch(getFormResponses(id)).unwrap();
      } catch (err) {
        console.error('Failed to load data:', err);
      }
    };
    loadData();
  }, [dispatch, id]);

  const responses = useSelector(state => state.form.responses);

  // Filter and search responses
  const filteredResponses = responses.filter(response => {
    // Apply search
    if (searchTerm) {
      const searchString = JSON.stringify(response.data).toLowerCase();
      if (!searchString.includes(searchTerm.toLowerCase())) {
        return false;
      }
    }

    // Apply filters
    for (const [fieldId, value] of Object.entries(filters)) {
      if (value && response.data[fieldId] !== value) {
        return false;
      }
    }

    return true;
  });

  const generateChartData = (field) => {
    const data = {
      labels: [],
      datasets: [{
        data: [],
        backgroundColor: CHART_COLORS,
        borderWidth: 1
      }]
    };

    if (field.type === 'select' || field.type === 'radio') {
      // Count occurrences of each option
      const counts = {};
      responses.forEach(response => {
        const value = response.data[field.id];
        counts[value] = (counts[value] || 0) + 1;
      });

      // Sort by count descending
      const sortedEntries = Object.entries(counts)
        .sort(([, a], [, b]) => b - a);

      data.labels = sortedEntries.map(([label]) => label);
      data.datasets[0].data = sortedEntries.map(([, count]) => count);
    }
    else if (field.type === 'checkbox') {
      // Count selections for each option
      const counts = {};
      field.options.forEach(option => {
        counts[option.label] = 0;
      });

      responses.forEach(response => {
        const values = response.data[field.id] || [];
        values.forEach(value => {
          counts[value] = (counts[value] || 0) + 1;
        });
      });

      data.labels = Object.keys(counts);
      data.datasets[0].data = Object.values(counts);
    }

    return data;
  };

  const handleExport = () => {
    // Convert responses to CSV
    const fields = template.fields;
    const csvContent = [
      // Header row
      ['Submission Date', ...fields.map(f => f.label)].join(','),
      // Data rows
      ...filteredResponses.map(response => [
        format(new Date(response.submittedAt), 'yyyy-MM-dd HH:mm:ss'),
        ...fields.map(field => {
          const value = response.data[field.id];
          if (Array.isArray(value)) {
            return `"${value.join(', ')}"`;
          }
          return `"${value || ''}"`;
        })
      ].join(','))
    ].join('\n');

    // Create and download file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${template.title} - Responses.csv`;
    link.click();
  };

  if (loading || !template) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-red-900/50 border border-red-500 rounded-lg p-4 text-red-200">
            {error}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center">
            <button
              onClick={() => navigate(-1)}
              className="mr-4 text-gray-400 hover:text-white transition-colors"
            >
              <ArrowLeftIcon className="h-6 w-6" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-white">{template.title}</h1>
              <p className="text-gray-400">
                {filteredResponses.length} responses
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <button
              onClick={() => setCurrentView(VIEWS.TABLE)}
              className={`px-4 py-2 rounded-lg flex items-center ${
                currentView === VIEWS.TABLE
                  ? 'bg-gray-700 text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <TableCellsIcon className="h-5 w-5 mr-2" />
              Table
            </button>
            <button
              onClick={() => setCurrentView(VIEWS.ANALYTICS)}
              className={`px-4 py-2 rounded-lg flex items-center ${
                currentView === VIEWS.ANALYTICS
                  ? 'bg-gray-700 text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <ChartBarIcon className="h-5 w-5 mr-2" />
              Analytics
            </button>
            <button
              onClick={handleExport}
              className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors flex items-center"
            >
              <DocumentArrowDownIcon className="h-5 w-5 mr-2" />
              Export
            </button>
          </div>
        </div>

        {/* Search and Filter Bar */}
        <div className="bg-gray-800 rounded-lg p-4 mb-8 flex items-center space-x-4">
          <div className="flex-1 relative">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search responses..."
              className="w-full bg-gray-700 border border-gray-600 rounded-lg pl-10 pr-4 py-2 text-white placeholder-gray-400 focus:border-blue-500 outline-none"
            />
            <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
          </div>
          <button
            onClick={() => setShowFilterDialog(true)}
            className={`px-4 py-2 rounded-lg flex items-center ${
              Object.keys(filters).length > 0
                ? 'bg-blue-600 text-white'
                : 'bg-gray-700 text-white hover:bg-gray-600'
            }`}
          >
            <FunnelIcon className="h-5 w-5 mr-2" />
            Filter
            {Object.keys(filters).length > 0 && (
              <span className="ml-2 bg-blue-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {Object.keys(filters).length}
              </span>
            )}
          </button>
        </div>

        {/* Content */}
        {currentView === VIEWS.TABLE ? (
          <div className="bg-gray-800 rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-700">
                    <th className="py-3 px-4 text-left text-white font-medium">
                      Date
                    </th>
                    {template.fields.map(field => (
                      <th
                        key={field.id}
                        className="py-3 px-4 text-left text-white font-medium"
                      >
                        {field.label}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredResponses.map((response, index) => (
                    <tr
                      key={response.id}
                      className={`border-t border-gray-700 ${
                        index % 2 === 0 ? 'bg-gray-800' : 'bg-gray-750'
                      }`}
                    >
                      <td className="py-3 px-4 text-gray-300">
                        {format(new Date(response.submittedAt), 'MMM d, yyyy HH:mm')}
                      </td>
                      {template.fields.map(field => (
                        <td key={field.id} className="py-3 px-4 text-gray-300">
                          {Array.isArray(response.data[field.id])
                            ? response.data[field.id].join(', ')
                            : response.data[field.id]}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {template.fields
              .filter(field => ['select', 'radio', 'checkbox'].includes(field.type))
              .map(field => (
                <div key={field.id} className="bg-gray-800 rounded-lg p-6">
                  <h3 className="text-lg font-medium text-white mb-4">
                    {field.label}
                  </h3>
                  <div className="aspect-square">
                    {field.type === 'checkbox' ? (
                      <Bar
                        data={generateChartData(field)}
                        options={{
                          responsive: true,
                          maintainAspectRatio: false,
                          scales: {
                            y: {
                              beginAtZero: true,
                              ticks: { color: '#9CA3AF' }
                            },
                            x: {
                              ticks: { color: '#9CA3AF' }
                            }
                          },
                          plugins: {
                            legend: {
                              display: false
                            }
                          }
                        }}
                      />
                    ) : (
                      <Pie
                        data={generateChartData(field)}
                        options={{
                          responsive: true,
                          maintainAspectRatio: false,
                          plugins: {
                            legend: {
                              position: 'bottom',
                              labels: {
                                color: '#9CA3AF'
                              }
                            }
                          }
                        }}
                      />
                    )}
                  </div>
                </div>
              ))}
          </div>
        )}

        {/* Filter Dialog */}
        {showFilterDialog && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-gray-800 rounded-lg p-6 max-w-md w-full">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-white">Filter Responses</h2>
                <button
                  onClick={() => setShowFilterDialog(false)}
                  className="text-gray-400 hover:text-white"
                >
                  <XMarkIcon className="h-5 w-5" />
                </button>
              </div>

              <div className="space-y-4">
                {template.fields.map(field => (
                  <div key={field.id}>
                    <label className="block text-white mb-2">{field.label}</label>
                    {field.type === 'select' || field.type === 'radio' ? (
                      <select
                        value={filters[field.id] || ''}
                        onChange={(e) => {
                          const newFilters = { ...filters };
                          if (e.target.value) {
                            newFilters[field.id] = e.target.value;
                          } else {
                            delete newFilters[field.id];
                          }
                          setFilters(newFilters);
                        }}
                        className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:border-blue-500 outline-none"
                      >
                        <option value="">Any</option>
                        {field.options.map(option => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    ) : null}
                  </div>
                ))}
              </div>

              <div className="flex justify-end space-x-4 mt-6">
                <button
                  onClick={() => {
                    setFilters({});
                    setShowFilterDialog(false);
                  }}
                  className="px-4 py-2 text-gray-400 hover:text-white"
                >
                  Clear All
                </button>
                <button
                  onClick={() => setShowFilterDialog(false)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Apply Filters
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FormResponses;
