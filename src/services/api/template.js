import api from './axios';

export const templateAPI = {
  // Получить шаблоны текущего пользователя
  getUserTemplates: () => api.get('/templates/my'),
  
  // Получить опубликованные шаблоны
  getPublicTemplates: () => api.get('/templates/published'),
  
  // Получить шаблон по ID
  getTemplate: (id) => api.get(`/templates/${id}`),
  
  // Создать новый шаблон
  createTemplate: (templateData) => api.post('/templates', templateData),
  
  // Обновить существующий шаблон
  updateTemplate: (id, templateData) => api.put(`/templates/${id}`, templateData),
  
  // Удалить шаблон
  deleteTemplate: (id) => api.delete(`/templates/${id}`),
  
  // Опубликовать шаблон
  publishTemplate: (id) => api.patch(`/templates/${id}/publish`),
  
  // Архивировать шаблон
  archiveTemplate: (id) => api.patch(`/templates/${id}/archive`),
};
