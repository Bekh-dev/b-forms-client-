import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logout } from '../../store/slices/authSlice';
import Logo from './logo.svg';
import {
  UserCircleIcon,
  ChevronDownIcon,
} from '@heroicons/react/24/outline';

const Header = () => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <header className="bg-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <img src={Logo} alt="Logo" className="h-8 w-auto" />
          </Link>

          {/* Navigation */}
          <div className="flex items-center space-x-4">
            <Link
              to="/dashboard"
              className="text-gray-300 hover:text-white px-3 py-2 text-sm font-medium"
            >
              Dashboard
            </Link>
            <Link
              to="/templates/my"
              className="text-gray-300 hover:text-white px-3 py-2 text-sm font-medium"
            >
              My Templates
            </Link>
            <Link
              to="/templates/public"
              className="text-gray-300 hover:text-white px-3 py-2 text-sm font-medium"
            >
              Public Templates
            </Link>
          </div>

          {/* Profile Dropdown */}
          <div className="flex items-center">
            <div className="relative">
              <button
                className="flex items-center space-x-2 text-gray-300 hover:text-white"
                onClick={() => setIsProfileOpen(!isProfileOpen)}
              >
                <UserCircleIcon className="h-8 w-8" />
                <ChevronDownIcon className="h-4 w-4" />
              </button>

              {isProfileOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-lg shadow-lg border border-gray-700">
                  <div className="py-1">
                    <Link
                      to="/settings"
                      className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white"
                      onClick={() => setIsProfileOpen(false)}
                    >
                      Settings
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white"
                    >
                      Sign out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;