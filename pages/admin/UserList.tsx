import React, { useState } from 'react';
import { MockBackend } from '../../services/mockData';
import { User, UserRole } from '../../types';
import { Trash2, ShieldCheck, Edit, X, Save } from 'lucide-react';

export const UserList: React.FC = () => {
  const [users, setUsers] = useState<User[]>(MockBackend.getUsers());
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [formData, setFormData] = useState({ name: '', email: '', role: UserRole.USER });

  const handleDelete = (id: string) => {
    if (confirm("Delete this user?")) {
       MockBackend.deleteUser(id);
       setUsers(users.filter(u => u.id !== id));
    }
  };

  const handleEditClick = (user: User) => {
    setEditingUser(user);
    setFormData({ name: user.name, email: user.email, role: user.role });
  };

  const handleSave = () => {
    if (!editingUser) return;
    
    const updatedUser: User = { 
      ...editingUser, 
      name: formData.name,
      email: formData.email,
      role: formData.role 
    };

    MockBackend.updateUser(updatedUser);
    
    // Update local state
    setUsers(users.map(u => u.id === updatedUser.id ? updatedUser : u));
    setEditingUser(null);
  };

  return (
    <div className="space-y-6 relative">
      <h1 className="text-2xl font-bold text-gray-800">User Management</h1>
      
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.map(user => (
                <tr 
                  key={user.id} 
                  className={`hover:bg-gray-50 transition-colors ${user.role === UserRole.ADMIN ? 'bg-purple-50/40' : ''}`}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                     <div className="flex items-center">
                        <img className="h-8 w-8 rounded-full mr-3 border border-gray-200" src={user.avatar} alt="" />
                        <div className="text-sm font-medium text-gray-900">{user.name}</div>
                     </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 inline-flex items-center text-xs leading-5 font-semibold rounded-full border ${
                      user.role === UserRole.ADMIN 
                        ? 'bg-purple-100 text-purple-800 border-purple-200' 
                        : 'bg-green-100 text-green-800 border-green-200'
                    }`}>
                      {user.role === UserRole.ADMIN && <ShieldCheck className="w-3 h-3 mr-1" />}
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                       <button onClick={() => handleEditClick(user)} className="text-indigo-600 hover:text-indigo-900 p-1 hover:bg-indigo-50 rounded">
                         <Edit className="w-4 h-4" />
                       </button>
                       {/* Prevent deleting yourself in this simple demo if needed, but allowing for now */}
                       <button onClick={() => handleDelete(user.id)} className="text-red-600 hover:text-red-900 p-1 hover:bg-red-50 rounded">
                         <Trash2 className="w-4 h-4" />
                       </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Modal */}
      {editingUser && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
             <div className="flex justify-between items-center p-6 border-b border-gray-100 bg-gray-50">
                <h3 className="text-lg font-bold text-gray-900">Edit User</h3>
                <button onClick={() => setEditingUser(null)} className="text-gray-400 hover:text-gray-600">
                  <X className="w-5 h-5" />
                </button>
             </div>
             
             <div className="p-6 space-y-4">
                <div>
                   <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                   <input 
                     type="text" 
                     value={formData.name}
                     onChange={(e) => setFormData({...formData, name: e.target.value})}
                     className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                   />
                </div>
                <div>
                   <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                   <input 
                     type="email" 
                     value={formData.email}
                     onChange={(e) => setFormData({...formData, email: e.target.value})}
                     className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                   />
                </div>
                <div>
                   <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                   <select 
                     value={formData.role}
                     onChange={(e) => setFormData({...formData, role: e.target.value as UserRole})}
                     className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none bg-white"
                   >
                     <option value={UserRole.USER}>User</option>
                     <option value={UserRole.ADMIN}>Admin</option>
                     <option value={UserRole.GUEST}>Guest</option>
                   </select>
                </div>
             </div>
             
             <div className="p-6 pt-0 flex justify-end gap-3">
                <button 
                  onClick={() => setEditingUser(null)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleSave}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 flex items-center shadow-sm"
                >
                  <Save className="w-4 h-4 mr-2" /> Save Changes
                </button>
             </div>
          </div>
        </div>
      )}
    </div>
  );
};