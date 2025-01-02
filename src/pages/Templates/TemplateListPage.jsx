import React from 'react';
import { Outlet } from 'react-router-dom';
import { Link, useLocation } from 'react-router-dom';

const TemplateListPage = () => {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Навигация */}
      <div className="border-b border-gray-700">
        <nav className="container mx-auto px-4">
          <div className="-mb-px flex space-x-8">
            <Link
              to="/templates/my"
              className={`py-4 px-1 border-b-2 font-medium transition-colors ${
                location.pathname === '/templates/my'
                  ? 'border-blue-500 text-blue-400'
                  : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-600'
              }`}
            >
              My Templates
            </Link>
            <Link
              to="/templates/public"
              className={`py-4 px-1 border-b-2 font-medium transition-colors ${
                location.pathname === '/templates/public'
                  ? 'border-blue-500 text-blue-400'
                  : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-600'
              }`}
            >
              Public Templates
            </Link>
          </div>
        </nav>
      </div>

      {/* Содержимое (MyTemplates или PublicTemplates) */}
      <div className="container mx-auto px-4">
        <Outlet />
      </div>
    </div>
  );
};

export default TemplateListPage;
