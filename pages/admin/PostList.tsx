import React, { useState } from 'react';
import { MockBackend } from '../../services/mockData';
import { BlogPost } from '../../types';
import { Edit, Trash2, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';

export const PostList: React.FC = () => {
  const [posts, setPosts] = useState<BlogPost[]>(MockBackend.getPosts(1, 100).posts);

  const handleDelete = (id: string) => {
    if (confirm("Are you sure?")) {
      MockBackend.deletePost(id);
      setPosts(posts.filter(p => p.id !== id));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold text-gray-800">Manage Posts</h1>
        <Link to="/admin/posts/new" className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 flex items-center text-sm font-medium w-full sm:w-auto justify-center shadow-sm transition-colors">
          <Plus className="w-4 h-4 mr-2" /> Create New
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Author</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {posts.map(post => (
                <tr key={post.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                     <div className="flex items-center">
                        <img className="h-10 w-10 rounded object-cover mr-3 border border-gray-200" src={post.coverImage} alt="" />
                        <div className="text-sm font-medium text-gray-900 truncate max-w-xs">{post.title}</div>
                     </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{post.authorName}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(post.createdAt).toLocaleDateString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-3">
                      <Link to={`/admin/posts/edit/${post.id}`} className="text-indigo-600 hover:text-indigo-900 p-1 hover:bg-indigo-50 rounded"><Edit className="w-4 h-4" /></Link>
                      <button onClick={() => handleDelete(post.id)} className="text-red-600 hover:text-red-900 p-1 hover:bg-red-50 rounded"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {posts.length === 0 && (
          <div className="p-8 text-center text-gray-500">
            No posts found. Create one to get started.
          </div>
        )}
      </div>
    </div>
  );
};