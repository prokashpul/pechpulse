import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Zap, Image as ImageIcon, LayoutDashboard, LogIn, LogOut, UserPlus, Layers } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types';
import { ThemeToggle } from './ThemeToggle';

export const Sidebar: React.FC = () => {
  const { user, logout } = useAuth();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;
  const linkClass = (path: string) => `flex items-center space-x-3 px-6 py-3 transition-colors ${
    isActive(path) 
      ? 'bg-indigo-50 text-indigo-600 border-r-4 border-indigo-600 dark:bg-indigo-900/20 dark:text-indigo-400' 
      : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
  }`;

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 flex flex-col z-50 shadow-sm hidden md:flex transition-colors duration-200">
      {/* Brand */}
      <div className="p-6 flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2">
          <div className="bg-indigo-600 p-2 rounded-lg">
            <Zap className="text-white w-6 h-6" />
          </div>
          <span className="text-xl font-bold text-gray-800 dark:text-white tracking-tight">TechPulse</span>
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto mt-4">
        <ul className="space-y-1">
          <li>
            <Link to="/" className={linkClass('/')}>
              <Home className="w-5 h-5" />
              <span className="font-medium">Home</span>
            </Link>
          </li>
          <li>
            <Link to="/categories" className={linkClass('/categories')}>
              <Layers className="w-5 h-5" />
              <span className="font-medium">Categories</span>
            </Link>
          </li>
          <li>
            <Link to="/features" className={linkClass('/features')}>
              <ImageIcon className="w-5 h-5" />
              <span className="font-medium">AI Tools</span>
            </Link>
          </li>
          
          {user?.role === UserRole.ADMIN && (
            <div className="pt-6 pb-2">
              <p className="px-6 text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-2">Admin</p>
              <li>
                <Link to="/admin/dashboard" className={linkClass('/admin/dashboard')}>
                  <LayoutDashboard className="w-5 h-5" />
                  <span className="font-medium">Dashboard</span>
                </Link>
              </li>
            </div>
          )}
        </ul>
      </nav>

      {/* Footer / Auth */}
      <div className="p-6 border-t border-gray-100 dark:border-gray-800">
        <div className="mb-6 flex justify-between items-center px-2">
           <span className="text-xs font-semibold text-gray-400 uppercase">Theme</span>
           <ThemeToggle />
        </div>

        {user ? (
          <div className="flex flex-col space-y-4">
            <Link to="/profile" className="flex items-center space-x-3 group hover:bg-gray-50 dark:hover:bg-gray-800 p-2 rounded-lg -mx-2 transition">
              <img src={user.avatar} alt="User" className="w-8 h-8 rounded-full border border-gray-200 dark:border-gray-700" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-800 dark:text-gray-200 truncate group-hover:text-indigo-600 transition-colors">{user.name}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{user.email}</p>
              </div>
            </Link>
            <button onClick={logout} className="flex items-center space-x-2 text-red-500 hover:text-red-700 dark:hover:text-red-400 text-sm font-medium pl-1">
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            <Link to="/login" className="flex items-center justify-center w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700 transition shadow-sm font-medium text-sm">
              <LogIn className="w-4 h-4 mr-2" /> Login
            </Link>
            <Link to="/register" className="flex items-center justify-center w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-200 py-2 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition font-medium text-sm">
              <UserPlus className="w-4 h-4 mr-2" /> Register
            </Link>
          </div>
        )}
      </div>
    </aside>
  );
};