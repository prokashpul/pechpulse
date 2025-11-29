import React, { useState } from 'react';
import { Menu, Zap, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types';
import { ThemeToggle } from './ThemeToggle';

export const MobileHeader: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuth();

  return (
    <div className="md:hidden sticky top-0 z-50">
      {/* Overlay Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 transition-opacity" 
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Header Bar */}
      <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between p-4 relative z-50 transition-colors">
        <Link to="/" className="flex items-center space-x-2">
          <div className="bg-indigo-600 p-1.5 rounded-lg">
            <Zap className="text-white w-5 h-5" />
          </div>
          <span className="text-lg font-bold text-gray-800 dark:text-white">TechPulse</span>
        </Link>
        <div className="flex items-center space-x-4">
          <ThemeToggle />
          <button onClick={() => setIsOpen(!isOpen)} className="text-gray-600 dark:text-gray-300 focus:outline-none">
            {isOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isOpen && (
        <div className="bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800 p-4 space-y-4 shadow-lg absolute w-full z-50 left-0 transition-colors">
          <Link to="/" className="block text-gray-700 dark:text-gray-200 font-medium py-2" onClick={() => setIsOpen(false)}>Home</Link>
          <Link to="/categories" className="block text-gray-700 dark:text-gray-200 font-medium py-2" onClick={() => setIsOpen(false)}>Categories</Link>
          <Link to="/features" className="block text-gray-700 dark:text-gray-200 font-medium py-2" onClick={() => setIsOpen(false)}>AI Tools</Link>
          
          {user?.role === UserRole.ADMIN && (
             <Link to="/admin/dashboard" className="block text-indigo-600 dark:text-indigo-400 font-medium py-2" onClick={() => setIsOpen(false)}>Admin Dashboard</Link>
          )}

          <div className="border-t border-gray-100 dark:border-gray-800 pt-4">
            {user ? (
              <div className="space-y-4">
                 <Link to="/profile" className="flex items-center space-x-3 p-2 bg-gray-50 dark:bg-gray-800 rounded-lg" onClick={() => setIsOpen(false)}>
                    <img src={user.avatar} className="w-8 h-8 rounded-full" alt="User" />
                    <div>
                       <p className="text-sm font-bold text-gray-800 dark:text-white">{user.name}</p>
                       <p className="text-xs text-gray-500 dark:text-gray-400">Edit Profile</p>
                    </div>
                 </Link>
                 <button onClick={() => { logout(); setIsOpen(false); }} className="text-red-500 font-medium w-full text-left">Sign Out</button>
              </div>
            ) : (
              <div className="flex flex-col space-y-2">
                 <Link to="/login" className="text-center bg-indigo-600 text-white py-2 rounded" onClick={() => setIsOpen(false)}>Login</Link>
                 <Link to="/register" className="text-center border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 py-2 rounded" onClick={() => setIsOpen(false)}>Register</Link>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};