import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Users, FileText, Eye, TrendingUp, Key, Zap, ArrowRight } from 'lucide-react';
import { MockBackend } from '../../services/mockData';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';

export const Dashboard: React.FC = () => {
  const posts = MockBackend.getPosts(1, 100).posts;
  const users = MockBackend.getUsers();
  const totalViews = posts.reduce((acc, curr) => acc + curr.views, 0);
  const { user, hasApiKey } = useAuth();

  const data = posts.slice(0, 7).map(p => ({
    name: p.title.substring(0, 10) + '...',
    views: p.views
  }));

  // Display user's key status
  const apiKey = user?.apiKey;
  const displayKey = apiKey 
    ? `${apiKey.substring(0, 4)}••••••••${apiKey.substring(apiKey.length - 4)}`
    : 'Not Configured';

  return (
    <div className="space-y-6">
      
      {/* Missing Key Banner */}
      {!hasApiKey && (
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl p-6 md:p-8 text-white shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-4 animate-in fade-in slide-in-from-top-4 duration-500">
           <div className="flex items-start space-x-4">
             <div className="bg-white/20 p-3 rounded-lg backdrop-blur-sm">
                <Zap className="w-8 h-8 text-yellow-300" />
             </div>
             <div>
               <h2 className="text-xl md:text-2xl font-bold mb-1">Supercharge Admin with Gemini AI</h2>
               <p className="text-indigo-100 max-w-xl">
                 Connect your Google Gemini API Key to unlock automated content generation, smart image editing, and SEO tools directly in your dashboard.
               </p>
             </div>
           </div>
           <Link 
             to="/admin/settings" 
             className="bg-white text-indigo-700 px-6 py-3 rounded-lg font-bold hover:bg-indigo-50 transition shadow-md flex items-center whitespace-nowrap"
           >
             Add API Key <ArrowRight className="w-4 h-4 ml-2" />
           </Link>
        </div>
      )}

      <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Overview</h1>
      
      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Total Users */}
        <div className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 flex items-center">
          <div className="p-3 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 mr-4">
             <Users className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Total Users</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{users.length}</p>
          </div>
        </div>

        {/* Total Posts */}
        <div className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 flex items-center">
          <div className="p-3 rounded-full bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 mr-4">
             <FileText className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Total Posts</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{posts.length}</p>
          </div>
        </div>

        {/* Total Views */}
        <div className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 flex items-center">
          <div className="p-3 rounded-full bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400 mr-4">
             <Eye className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Total Views</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{totalViews.toLocaleString()}</p>
          </div>
        </div>

        {/* API Status */}
        <div className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 flex items-center">
          <div className="p-3 rounded-full bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 mr-4">
             <Key className="w-6 h-6" />
          </div>
          <div className="min-w-0">
            <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Gemini API</p>
            <div className="flex items-center space-x-2">
               <span className={`h-2 w-2 rounded-full ${hasApiKey ? 'bg-green-500' : 'bg-red-500'}`}></span>
               <p className="text-sm font-bold text-gray-900 dark:text-white truncate">
                  {hasApiKey ? 'Active' : 'Missing'}
               </p>
            </div>
            <p className="text-xs text-gray-400 font-mono truncate mt-0.5" title="User API Key">
               {displayKey}
            </p>
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 h-96">
        <h2 className="text-lg font-bold text-gray-800 dark:text-white mb-6">Traffic Statistics</h2>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <XAxis dataKey="name" stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} />
            <YAxis stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} />
            <Tooltip 
              cursor={{fill: 'rgba(156, 163, 175, 0.1)'}}
              contentStyle={{ 
                borderRadius: '8px', 
                border: 'none', 
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                backgroundColor: '#1f2937',
                color: '#fff'
              }}
              itemStyle={{ color: '#fff' }}
              labelStyle={{ color: '#9ca3af' }}
            />
            <Bar dataKey="views" fill="#4f46e5" radius={[4, 4, 0, 0]} barSize={40} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};