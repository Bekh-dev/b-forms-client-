import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import templateReducer from './slices/templateSlice';
import responseReducer from './slices/responseSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    templates: templateReducer,
    responses: responseReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [
          'templates/createTemplate/rejected',
          'templates/updateTemplate/rejected',
          'templates/deleteTemplate/rejected',
          'templates/fetchMyTemplates/rejected',
          'templates/fetchPublicTemplates/rejected',
          'templates/fetchTemplateById/rejected',
          'responses/submitResponse/rejected',
          'responses/fetchResponses/rejected'
        ]
      }
    })
});

export default store;