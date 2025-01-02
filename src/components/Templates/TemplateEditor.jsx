import React, { useState } from 'react';
import { useForm } from 'react-hook-form';

const questionTypes = [
  { value: 'text', label: 'Text' },
  { value: 'number', label: 'Number' },
  { value: 'textarea', label: 'Long Text' },
  { value: 'select', label: 'Single Choice' },
  { value: 'multiselect', label: 'Multiple Choice' },
  { value: 'radio', label: 'Radio Buttons' },
  { value: 'checkbox', label: 'Checkboxes' },
  { value: 'date', label: 'Date' },
  { value: 'time', label: 'Time' },
  { value: 'file', label: 'File Upload' },
  { value: 'email', label: 'Email' },
  { value: 'phone', label: 'Phone' },
  { value: 'url', label: 'URL' }
];

const TemplateEditor = ({ initialData, onSubmit }) => {
  const [questions, setQuestions] = useState(initialData?.questions || []);
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: initialData || {}
  });

  const addQuestion = () => {
    setQuestions([
      ...questions,
      {
        title: '',
        description: '',
        type: 'text',
        validation: {
          required: false
        },
        options: [],
        order: questions.length
      }
    ]);
  };

  const removeQuestion = (index) => {
    setQuestions(questions.filter((_, i) => i !== index));
  };

  const updateQuestion = (index, field, value) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index] = {
      ...updatedQuestions[index],
      [field]: value
    };
    setQuestions(updatedQuestions);
  };

  const addOption = (questionIndex) => {
    const updatedQuestions = [...questions];
    if (!updatedQuestions[questionIndex].options) {
      updatedQuestions[questionIndex].options = [];
    }
    updatedQuestions[questionIndex].options.push({
      label: '',
      value: ''
    });
    setQuestions(updatedQuestions);
  };

  const removeOption = (questionIndex, optionIndex) => {
    const updatedQuestions = [...questions];
    updatedQuestions[questionIndex].options = updatedQuestions[questionIndex].options.filter(
      (_, i) => i !== optionIndex
    );
    setQuestions(updatedQuestions);
  };

  const updateOption = (questionIndex, optionIndex, field, value) => {
    const updatedQuestions = [...questions];
    updatedQuestions[questionIndex].options[optionIndex] = {
      ...updatedQuestions[questionIndex].options[optionIndex],
      [field]: value
    };
    setQuestions(updatedQuestions);
  };

  const handleFormSubmit = (data) => {
    onSubmit({
      ...data,
      questions
    });
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Title
          </label>
          <input
            type="text"
            {...register('title', { required: 'Title is required' })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
          {errors.title && (
            <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Description
          </label>
          <textarea
            {...register('description', { required: 'Description is required' })}
            rows={3}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
          {errors.description && (
            <p className="mt-1 text-sm text-red-600">
              {errors.description.message}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Topic
          </label>
          <select
            {...register('topic', { required: 'Topic is required' })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="">Select a topic</option>
            <option value="business">Business</option>
            <option value="education">Education</option>
            <option value="personal">Personal</option>
            <option value="other">Other</option>
          </select>
          {errors.topic && (
            <p className="mt-1 text-sm text-red-600">{errors.topic.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Tags (comma separated)
          </label>
          <input
            type="text"
            {...register('tags')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
            Questions
          </h3>
          <button
            type="button"
            onClick={addQuestion}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
          >
            Add Question
          </button>
        </div>

        {questions.map((question, questionIndex) => (
          <div
            key={questionIndex}
            className="p-4 border rounded-md space-y-4 bg-white dark:bg-gray-800"
          >
            <div className="flex justify-between items-start">
              <div className="flex-1 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Question Title
                  </label>
                  <input
                    type="text"
                    value={question.title}
                    onChange={(e) =>
                      updateQuestion(questionIndex, 'title', e.target.value)
                    }
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Question Type
                  </label>
                  <select
                    value={question.type}
                    onChange={(e) =>
                      updateQuestion(questionIndex, 'type', e.target.value)
                    }
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  >
                    {questionTypes.map((type) => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Description (optional)
                  </label>
                  <textarea
                    value={question.description}
                    onChange={(e) =>
                      updateQuestion(questionIndex, 'description', e.target.value)
                    }
                    rows={2}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={question.validation?.required}
                    onChange={(e) =>
                      updateQuestion(questionIndex, 'validation', {
                        ...question.validation,
                        required: e.target.checked
                      })
                    }
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label className="ml-2 block text-sm text-gray-900 dark:text-gray-300">
                    Required
                  </label>
                </div>

                {['select', 'multiselect', 'radio', 'checkbox'].includes(
                  question.type
                ) && (
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Options
                      </label>
                      <button
                        type="button"
                        onClick={() => addOption(questionIndex)}
                        className="px-2 py-1 text-sm text-blue-600 hover:text-blue-700"
                      >
                        Add Option
                      </button>
                    </div>
                    {question.options?.map((option, optionIndex) => (
                      <div key={optionIndex} className="flex space-x-2">
                        <input
                          type="text"
                          value={option.label}
                          onChange={(e) =>
                            updateOption(
                              questionIndex,
                              optionIndex,
                              'label',
                              e.target.value
                            )
                          }
                          placeholder="Option label"
                          className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        />
                        <button
                          type="button"
                          onClick={() =>
                            removeOption(questionIndex, optionIndex)
                          }
                          className="px-2 py-1 text-sm text-red-600 hover:text-red-700"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <button
                type="button"
                onClick={() => removeQuestion(questionIndex)}
                className="ml-4 text-red-600 hover:text-red-700"
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-end space-x-4">
        <button
          type="submit"
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Save Template
        </button>
      </div>
    </form>
  );
};

export default TemplateEditor;
