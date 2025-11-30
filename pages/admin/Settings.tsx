import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Key, Save, CheckCircle, AlertCircle, Shield, Zap } from 'lucide-react';

export const AdminSettings: React.FC = () => {
  const { user, updateProfile, hasApiKey } = useAuth();
  const [apiKey, setApiKey] = useState('');
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  useEffect(() => {
    if (user?.apiKey) {
      setApiKey(user.apiKey);
    }
  }, [user]);

  const handleSave = () => {
    if (!user) return;
    
    // Basic validation
    if (apiKey.trim().length > 0 && !apiKey.startsWith('AI')) {
       setMessage({ type: 'error', text: 'Invalid API Key format. It usually starts with "AI".' });
       return;
    }

    try {
      updateProfile({ ...user, apiKey });
      setMessage({ type: 'success', text: 'System configuration updated. AI services are now active.' });
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to update settings.' });
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">System Settings</h1>
        <p className="text-gray-500 dark:text-gray-400">Manage global configurations and API integrations.</p>
      </div>

      {/* API Configuration Card */}
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 overflow-hidden">
        <div className="p-6 border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/50 flex items-center gap-3">
          <div className="bg-indigo-100 dark:bg-indigo-900/30 p-2 rounded-lg">
             <Zap className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">Gemini AI Integration</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">Configure the AI engine for content generation and image editing.</p>
          </div>
        </div>

        <div className="p-8 space-y-6">
          {message && (
            <div className={`p-4 rounded-lg flex items-center ${message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
              {message.type === 'success' ? <CheckCircle className="w-5 h-5 mr-2" /> : <AlertCircle className="w-5 h-5 mr-2" />}
              {message.text}
            </div>
          )}

          <div className="space-y-4">
            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300">
              Google AI Studio API Key
            </label>
            
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Key className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text" // Showing text so they can verify paste, or password if preferred
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="Paste your API Key here (starts with AIza...)"
                className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white transition-colors"
              />
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                 {hasApiKey && apiKey === user?.apiKey && (
                    <span className="flex items-center text-green-600 text-xs font-bold bg-green-50 px-2 py-1 rounded-full">
                       <CheckCircle className="w-3 h-3 mr-1" /> Active
                    </span>
                 )}
              </div>
            </div>
            
            <p className="text-sm text-gray-500 dark:text-gray-400">
              This key enables the <strong>Gemini 2.5 Flash</strong> and <strong>Nano Banana</strong> models for the entire admin panel. 
              <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noreferrer" className="text-indigo-600 hover:underline ml-1">Get an API Key</a>
            </p>
          </div>

          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-100 dark:border-blue-800">
             <h3 className="text-sm font-bold text-blue-800 dark:text-blue-300 mb-2 flex items-center">
               <Shield className="w-4 h-4 mr-1.5" /> Security Note
             </h3>
             <p className="text-xs text-blue-700 dark:text-blue-400 leading-relaxed">
               Your API key is stored locally in your browser session and simulated backend. In a production environment, this should be handled via secure environment variables on the server.
             </p>
          </div>

          <div className="pt-4 flex justify-end">
            <button
              onClick={handleSave}
              className="flex items-center px-6 py-3 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700 transition shadow-md"
            >
              <Save className="w-5 h-5 mr-2" />
              Save Configuration
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};