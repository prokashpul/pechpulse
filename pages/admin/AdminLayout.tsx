import React, { useEffect, useState } from 'react';
import { Outlet, useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { UserRole } from '../../types';
import { LayoutDashboard, FileText, Users, LogOut, Search, Home, Menu, X } from 'lucide-react';

export const AdminLayout: React.FC = () => {
  const { user, logout, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (!loading && (!user || user.role !== UserRole.ADMIN)) {
      navigate('/login');
    }
  }, [user, loading, navigate]);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  if (loading) return <div className="p-10 dark:text-white">Checking permissions...</div>;
  if (!user || user.role !== UserRole.ADMIN) return null;

  const NavLink = ({ to, icon: Icon, label }: { to: string; icon: any; label: string }) => {
    const isActive = location.pathname.startsWith(to);
    return (
      <Link 
        to={to} 
        className={`flex items-center px-4 py-3 rounded-lg transition-colors mb-1 ${
          isActive 
            ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 font-medium' 
            : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-indigo-600 dark:hover:text-indigo-400'
        }`}
      >
        <Icon className={`w-5 h-5 mr-3 ${isActive ? 'text-indigo-600 dark:text-indigo-400' : 'text-gray-400'}`} /> 
        {label}
      </Link>
    );
  };

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-950 font-sans overflow-hidden transition-colors">
       
       {/* Mobile Overlay */}
       {isMobileMenuOpen && (
         <div 
           className="fixed inset-0 bg-black/50 z-20 md:hidden"
           onClick={() => setIsMobileMenuOpen(false)}
         />
       )}

       {/* Sidebar */}
       <aside className={`
         fixed md:relative z-30 w-64 h-full bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 flex flex-col transition-transform duration-300 ease-in-out
         ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
       `}>
         <div className="h-16 flex items-center justify-between px-6 border-b border-gray-100 dark:border-gray-800">
           <span className="text-xl font-bold text-indigo-600 dark:text-indigo-400 flex items-center">
             AdminPanel
           </span>
           <button onClick={() => setIsMobileMenuOpen(false)} className="md:hidden text-gray-500">
             <X className="w-6 h-6" />
           </button>
         </div>
         
         <nav className="flex-1 p-4 overflow-y-auto">
           <div className="space-y-1">
             <NavLink to="/admin/dashboard" icon={LayoutDashboard} label="Dashboard" />
             <NavLink to="/admin/posts" icon={FileText} label="Posts" />
             <NavLink to="/admin/users" icon={Users} label="User Roles" />
           </div>
           
           <div className="pt-6 mt-6 border-t border-gray-100 dark:border-gray-800">
             <p className="px-4 text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-2">System</p>
             <Link to="/" className="flex items-center px-4 py-3 text-gray-600 dark:text-gray-400 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-indigo-600 transition-colors">
               <Home className="w-5 h-5 mr-3 text-gray-400" /> Back to Website
             </Link>
           </div>
         </nav>
         
         <div className="p-4 border-t border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/50">
            <button onClick={logout} className="flex items-center w-full px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors font-medium">
               <LogOut className="w-4 h-4 mr-3" /> Logout
            </button>
         </div>
       </aside>

       {/* Main Content */}
       <div className="flex-1 flex flex-col min-w-0">
          {/* Header */}
          <header className="h-16 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between px-4 md:px-6 shadow-sm z-10 flex-shrink-0">
            <div className="flex items-center gap-3">
              <button 
                onClick={() => setIsMobileMenuOpen(true)}
                className="md:hidden text-gray-600 dark:text-gray-300 hover:text-gray-900 focus:outline-none bg-gray-100 dark:bg-gray-800 p-2 rounded-md"
              >
                <Menu className="w-5 h-5" />
              </button>
              
              <div className="relative hidden sm:block w-64 md:w-96">
                 <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                 <input 
                   className="w-full pl-10 pr-4 py-2 bg-gray-100 dark:bg-gray-800 border-none rounded-full text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 transition-shadow" 
                   placeholder="Search admin..." 
                 />
              </div>
            </div>

            <div className="flex items-center space-x-3 md:space-x-4">
               <div className="text-right hidden sm:block">
                  <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">{user.name}</p>
                  <p className="text-xs text-green-500 font-medium">Online</p>
               </div>
               <img src={user.avatar} className="w-8 h-8 md:w-10 md:h-10 rounded-full border-2 border-white dark:border-gray-700 shadow-sm object-cover" alt="Admin" />
            </div>
          </header>

          <main className="flex-1 overflow-y-auto p-4 md:p-6 scroll-smooth">
            <Outlet />
          </main>
       </div>
    </div>
  );
};