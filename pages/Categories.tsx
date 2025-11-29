import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { MockBackend } from '../services/mockData';
import { Tag, Hash, ArrowRight, Layers } from 'lucide-react';

interface CategoryStat {
  name: string;
  count: number;
}

export const Categories: React.FC = () => {
  const [categories, setCategories] = useState<CategoryStat[]>([]);

  useEffect(() => {
    // In a real app, this would be a dedicated API endpoint
    const { posts } = MockBackend.getPosts(1, 1000);
    const stats: Record<string, number> = {};

    posts.forEach(post => {
      post.tags.forEach(tag => {
        const key = tag; 
        stats[key] = (stats[key] || 0) + 1;
      });
    });

    const sorted = Object.entries(stats)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);
    
    setCategories(sorted);
  }, []);

  const gradients = [
    'from-blue-500 to-cyan-500',
    'from-purple-500 to-pink-500',
    'from-orange-500 to-red-500',
    'from-green-500 to-emerald-500',
    'from-indigo-500 to-violet-500',
    'from-yellow-400 to-orange-500',
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="text-center mb-16">
         <div className="inline-flex items-center justify-center p-3 bg-indigo-50 rounded-2xl mb-4">
            <Layers className="w-8 h-8 text-indigo-600" />
         </div>
         <h1 className="text-4xl font-bold text-gray-900 mb-4">Explore Topics</h1>
         <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Browse our extensive collection of articles by topic. From AI breakthroughs to future tech trends, find exactly what interests you.
         </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {categories.map((cat, idx) => {
           const gradient = gradients[idx % gradients.length];
           return (
             <Link 
               to={`/?category=${encodeURIComponent(cat.name)}`} 
               key={cat.name}
               className="group relative overflow-hidden rounded-2xl bg-white shadow-sm border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 p-6 flex flex-col justify-between h-48"
             >
                <div className={`absolute -top-6 -right-6 p-4 opacity-10 group-hover:opacity-20 transition-opacity bg-gradient-to-br ${gradient} bg-clip-text text-transparent`}>
                   <Hash className="w-32 h-32 transform rotate-12" />
                </div>
                
                <div className="relative z-10">
                   <div className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${gradient} text-white shadow-md mb-4 group-hover:scale-110 transition-transform`}>
                      <Tag className="w-5 h-5" />
                   </div>
                   <h3 className="text-xl font-bold text-gray-900 group-hover:text-indigo-600 transition-colors line-clamp-1" title={cat.name}>{cat.name}</h3>
                </div>
                
                <div className="relative z-10 flex items-center justify-between mt-auto border-t border-gray-50 pt-4">
                   <span className="text-sm font-semibold text-gray-500 group-hover:text-gray-700">{cat.count} Articles</span>
                   <div className="bg-gray-50 p-1.5 rounded-full group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
                      <ArrowRight className="w-4 h-4" />
                   </div>
                </div>
             </Link>
           );
        })}
        
        {categories.length === 0 && (
           <div className="col-span-full text-center py-12 text-gray-500">
              Loading categories...
           </div>
        )}
      </div>
    </div>
  );
};