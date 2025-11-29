import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { User, UserRole } from '../types';
import { Camera, Save, User as UserIcon, Mail, Shield, AlertCircle, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const Profile: React.FC = () => {
  const { user, updateProfile } = useAuth();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState<Partial<User>>({});
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    setFormData({
      name: user.name,
      email: user.email,
      avatar: user.avatar,
      bio: user.bio || ''
    });
  }, [user, navigate]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, avatar: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setIsSaving(true);
    setMessage(null);

    try {
      // Simulate network delay
      setTimeout(() => {
        const updatedUser: User = {
          ...user,
          name: formData.name || user.name,
          email: formData.email || user.email,
          avatar: formData.avatar || user.avatar,
          bio: formData.bio
        };

        updateProfile(updatedUser);
        setMessage({ type: 'success', text: 'Profile updated successfully!' });
        setIsSaving(false);
      }, 800);
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to update profile.' });
      setIsSaving(false);
    }
  };

  if (!user) return null;

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Account Settings</h1>
        <p className="text-gray-500 mt-1">Manage your profile information and preferences.</p>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        
        {/* Sidebar / User Card */}
        <div className="w-full md:w-1/3 space-y-6">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 flex flex-col items-center text-center">
            <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
              <img 
                src={formData.avatar || user.avatar} 
                alt={user.name} 
                className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-md group-hover:opacity-75 transition"
              />
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                 <Camera className="w-8 h-8 text-white drop-shadow-lg" />
              </div>
              <input type="file" ref={fileInputRef} onChange={handleImageUpload} className="hidden" accept="image/*" />
            </div>
            
            <h2 className="text-xl font-bold text-gray-900 mt-4">{formData.name || user.name}</h2>
            <p className="text-sm text-gray-500 mb-4">{user.email}</p>
            
            <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${user.role === UserRole.ADMIN ? 'bg-purple-100 text-purple-700' : 'bg-green-100 text-green-700'}`}>
               <Shield className="w-3 h-3 mr-1" />
               {user.role}
            </div>
          </div>
        </div>

        {/* Edit Form */}
        <div className="w-full md:w-2/3">
           <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-6 border-b border-gray-100 bg-gray-50/50">
                 <h3 className="font-bold text-gray-900">Profile Details</h3>
              </div>
              
              <div className="p-6 space-y-6">
                 {message && (
                   <div className={`p-4 rounded-lg flex items-center ${message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                      {message.type === 'success' ? <CheckCircle className="w-5 h-5 mr-2" /> : <AlertCircle className="w-5 h-5 mr-2" />}
                      {message.text}
                   </div>
                 )}

                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                       <label className="text-sm font-medium text-gray-700 flex items-center">
                          <UserIcon className="w-4 h-4 mr-1 text-gray-400" /> Full Name
                       </label>
                       <input 
                         type="text" 
                         value={formData.name || ''}
                         onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                         className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 outline-none"
                       />
                    </div>
                    
                    <div className="space-y-2">
                       <label className="text-sm font-medium text-gray-700 flex items-center">
                          <Mail className="w-4 h-4 mr-1 text-gray-400" /> Email Address
                       </label>
                       <input 
                         type="email" 
                         value={formData.email || ''}
                         onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                         className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 outline-none"
                       />
                    </div>
                 </div>

                 <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Bio</label>
                    <textarea 
                       value={formData.bio || ''}
                       onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                       rows={4}
                       placeholder="Tell us a little about yourself..."
                       className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 outline-none resize-none"
                    />
                 </div>
              </div>

              <div className="p-6 bg-gray-50 flex items-center justify-end">
                 <button 
                   type="submit" 
                   disabled={isSaving}
                   className={`flex items-center px-6 py-2.5 bg-indigo-600 text-white rounded-lg font-medium shadow-sm hover:bg-indigo-700 transition ${isSaving ? 'opacity-70 cursor-not-allowed' : ''}`}
                 >
                   <Save className="w-4 h-4 mr-2" />
                   {isSaving ? 'Saving...' : 'Save Changes'}
                 </button>
              </div>
           </form>
        </div>

      </div>
    </div>
  );
};