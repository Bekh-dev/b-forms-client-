import React from 'react';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import {
  fetchTemplateById,
  selectCurrentTemplate,
  selectTemplatesLoading,
  selectTemplatesError
} from '../../store/slices/templateSlice';
import {
  fetchResponses,
  selectResponses,
  selectResponsesLoading,
  selectResponsesError
} from '../../store/slices/responseSlice';
import ErrorBoundary from '../../components/ErrorBoundary';

// Компонент для отображения статистики по одному вопросу
const QuestionStats = React.memo(({ question, responses }) => {
  if (!question || !responses?.length) return null;

  const answers = responses
    .map(r => r.answers?.[question.id])
    .filter(Boolean);

  if (!answers.length) return null;

  if (question.type === 'checkbox' || question.type === 'radio' || question.type === 'select') {
    const stats = {};
    question.options.forEach(option => {
      stats[option] = answers.filter(answer => 
        question.type === 'checkbox' 
          ? Array.isArray(answer) && answer.includes(option)
          : answer === option
      ).length;
    });

    return (
      <div className="bg-gray-800 rounded-lg p-6">
        <h3 className="text-lg font-medium text-white mb-4">{question.label}</h3>
        <div className="space-y-2">
          {Object.entries(stats).map(([option, count]) => (
            <div key={option} className="flex items-center">
              <div className="flex-1">
                <div className="flex justify-between mb-1">
                  <span className="text-gray-300">{option}</span>
                  <span className="text-gray-400">
                    {count} ({Math.round((count / answers.length) * 100)}%)
                  </span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-blue-500 h-2 rounded-full"
                    style={{ width: `${(count / answers.length) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-800 rounded-lg p-6">
      <h3 className="text-lg font-medium text-white mb-4">{question.label}</h3>
      <div className="space-y-2">
        <p className="text-gray-400 mb-2">Latest responses:</p>
        {answers.slice(-5).map((answer, index) => (
          <div key={index} className="bg-gray-700 p-2 rounded">
            <p className="text-gray-300">{answer}</p>
          </div>
        ))}
      </div>
    </div>
  );
});

// Модальное окно для просмотра ответа
const ResponseModal = React.memo(({ response, template, onClose }) => {
  if (!response || !template) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-gray-800 rounded-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-white">Response Details</h3>
            <button onClick={onClose} className="text-gray-400 hover:text-white">✕</button>
          </div>
          <div className="space-y-4">
            {template.questions.map(question => (
              <div key={question.id} className="border-b border-gray-700 pb-4">
                <p className="text-gray-400 mb-2">{question.label}</p>
                <p className="text-white">
                  {Array.isArray(response.answers?.[question.id])
                    ? response.answers[question.id].join(', ')
                    : response.answers?.[question.id] || 'No answer'}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
});

// Основной компонент
const ViewResponses = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [selectedResponse, setSelectedResponse] = useState(null);

  // Получаем данные из Redux
  const template = useSelector(selectCurrentTemplate);
  const responses = useSelector(selectResponses);
  const isLoading = useSelector(selectTemplatesLoading) || useSelector(selectResponsesLoading);
  const error = useSelector(selectTemplatesError) || useSelector(selectResponsesError);

  // Загружаем данные при монтировании
  useEffect(() => {
    if (id) {
      dispatch(fetchTemplateById(id));
      dispatch(fetchResponses(id));
    }
  }, [dispatch, id]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-red-900/50 border border-red-500 text-red-200 p-4 rounded-lg">
          {error}
        </div>
      </div>
    );
  }

  if (!template) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center">
          <h2 className="text-xl text-gray-300 mb-4">Template not found</h2>
          <button
            onClick={() => navigate('/templates/my')}
            className="text-blue-500 hover:text-blue-400"
          >
            Back to Templates
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white mb-2">
          {template.title} - Responses
        </h1>
        <p className="text-gray-400">
          {responses?.length || 0} responses received
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Questions and Stats */}
        <div className="lg:col-span-2 space-y-6">
          {template.questions.map(question => (
            <ErrorBoundary key={question.id}>
              <QuestionStats
                question={question}
                responses={responses || []}
              />
            </ErrorBoundary>
          ))}
        </div>

        {/* Individual Responses */}
        <div className="bg-gray-800 rounded-lg p-6">
          <h2 className="text-lg font-medium text-white mb-4">
            Individual Responses
          </h2>
          <div className="space-y-4">
            {(responses || []).map((response, index) => (
              <button
                key={response._id}
                onClick={() => setSelectedResponse(response)}
                className={`w-full text-left p-4 rounded-lg transition-colors ${
                  selectedResponse?._id === response._id
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                <div className="flex justify-between items-center">
                  <span>Response #{index + 1}</span>
                  <span className="text-sm opacity-75">
                    {new Date(response.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Modal */}
      {selectedResponse && (
        <ErrorBoundary>
          <ResponseModal
            response={selectedResponse}
            template={template}
            onClose={() => setSelectedResponse(null)}
          />
        </ErrorBoundary>
      )}
    </div>
  );
};

export default ViewResponses;
