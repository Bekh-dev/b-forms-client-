import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  HomeIcon,
  DocumentDuplicateIcon,
  DocumentTextIcon,
} from '@heroicons/react/24/outline';

const navItems = [
  { name: 'Dashboard', path: '/', icon: HomeIcon },
  { name: 'My Templates', path: '/templates/my', icon: DocumentDuplicateIcon },
  { name: 'Public Templates', path: '/templates/public', icon: DocumentTextIcon },
];

const Sidebar = () => {
  return (
    <aside className="w-64 bg-gray-800 min-h-screen">
      <nav className="mt-5 px-2">
        <div className="space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors ${
                  isActive
                    ? 'bg-gray-900 text-white'
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                }`
              }
            >
              <item.icon
                className="mr-3 h-6 w-6 flex-shrink-0"
                aria-hidden="true"
              />
              {item.name}
            </NavLink>
          ))}
        </div>
      </nav>
    </aside>
  );
};

export default Sidebar;
