import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectIsAuthenticated } from './store/slices/authSlice';
import Layout from './components/layout/Layout';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import Dashboard from './pages/Dashboard/Dashboard';
import Settings from './pages/Settings/Settings';
import MyTemplates from './pages/Templates/MyTemplates';
import PublicTemplates from './pages/Templates/PublicTemplates';
import CreateTemplate from './pages/Templates/CreateTemplate';
import EditTemplate from './pages/Templates/EditTemplate';
import UseTemplate from './pages/Templates/UseTemplate';
import ViewResponses from './pages/Templates/ViewResponses';

const PrivateRoute = ({ children }) => {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  return isAuthenticated ? children : <Navigate to="/login" />;
};

const PublicRoute = ({ children }) => {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  return !isAuthenticated ? children : <Navigate to="/dashboard" />;
};

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        } />
        <Route path="/register" element={
          <PublicRoute>
            <Register />
          </PublicRoute>
        } />

        {/* Protected Routes */}
        <Route
          path="/"
          element={
            <PrivateRoute>
              <Layout />
            </PrivateRoute>
          }
        >
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="settings" element={<Settings />} />
          <Route path="templates/my" element={<MyTemplates />} />
          <Route path="templates/public" element={<PublicTemplates />} />
          <Route path="templates/create" element={<CreateTemplate />} />
          <Route path="templates/edit/:id" element={<EditTemplate />} />
          <Route path="templates/use/:id" element={<UseTemplate />} />
          <Route path="templates/responses/:id" element={<ViewResponses />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
