import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { BlogPost } from '../types';
import { Calendar, Eye, Share2, Check } from 'lucide-react';

interface PostCardProps {
  post: BlogPost;
  featured?: boolean;
}

export const PostCard: React.FC<PostCardProps> = ({ post, featured = false }) => {
  const [copied, setCopied] = useState(false);

  const handleShare = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const url = `${window.location.origin}/#/post/${post.id}`;

    // 1. Try Native Share (Mobile/Supported Browsers)
    if (navigator.share) {
      try {
        await navigator.share({
          title: post.title,
          text: post.excerpt,
          url: url,
        });
        return;
      } catch (err) {
        // User cancelled or share failed, continue to clipboard fallback if needed
        console.debug('Native share cancelled or failed', err);
      }
    }

    // 2. Fallback to Clipboard
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy link', err);
      alert('Could not copy link to clipboard.');
    }
  };

  if (featured) {
    return (
      <article className="relative bg-white dark:bg-gray-900 rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 h-full border border-gray-100 dark:border-gray-800 flex flex-col md:flex-row">
        <div className="md:w-1/2 h-64 md:h-auto relative overflow-hidden group">
          <img 
            src={post.coverImage} 
            alt={post.title} 
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent md:bg-gradient-to-r" />
          <div className="absolute top-4 left-4">
             <span className="bg-indigo-600 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide shadow-sm">
               Featured
             </span>
          </div>
        </div>
        <div className="p-8 md:w-1/2 flex flex-col justify-center">
          <div className="flex items-center space-x-2 mb-4 text-xs font-medium text-gray-500 dark:text-gray-400">
             <span className="text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/30 px-2 py-1 rounded">{post.tags[0]}</span>
             <span>•</span>
             <span>{new Date(post.createdAt).toLocaleDateString()}</span>
          </div>
          <Link to={`/post/${post.id}`} className="group">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-4 leading-tight group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
              {post.title}
            </h2>
          </Link>
          <p className="text-gray-600 dark:text-gray-300 mb-6 line-clamp-3 leading-relaxed">
            {post.excerpt}
          </p>
          <div className="flex items-center justify-between mt-auto">
             <div className="flex items-center space-x-3">
               <img src={`https://ui-avatars.com/api/?name=${post.authorName}&background=random`} alt={post.authorName} className="w-10 h-10 rounded-full border-2 border-white dark:border-gray-700 shadow-sm" />
               <div>
                 <p className="text-sm font-bold text-gray-900 dark:text-white leading-tight">{post.authorName}</p>
                 <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">Author</p>
               </div>
             </div>
             
             <div className="flex items-center gap-3">
                <button 
                  onClick={handleShare}
                  className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400 dark:text-gray-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition"
                  title="Share Post"
                >
                  {copied ? <Check className="w-5 h-5 text-green-600 dark:text-green-400" /> : <Share2 className="w-5 h-5" />}
                </button>
                <Link to={`/post/${post.id}`} className="text-sm font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 transition">
                  Read Article →
                </Link>
             </div>
          </div>
        </div>
      </article>
    );
  }

  return (
    <article className="flex flex-col bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-300 h-full">
      <Link to={`/post/${post.id}`} className="block h-56 overflow-hidden relative group">
        <img 
          src={post.coverImage} 
          alt={post.title} 
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
        <div className="absolute top-4 right-4 bg-white/90 dark:bg-black/70 backdrop-blur-sm px-2 py-1 rounded-lg text-xs font-bold text-gray-800 dark:text-gray-200 shadow-sm">
           {post.tags[0]}
        </div>
      </Link>
      
      <div className="p-6 flex-1 flex flex-col">
        <div className="flex items-center text-xs text-gray-400 dark:text-gray-500 mb-3 space-x-3">
           <span className="flex items-center"><Calendar className="w-3 h-3 mr-1" /> {new Date(post.createdAt).toLocaleDateString()}</span>
           <span className="flex items-center"><Eye className="w-3 h-3 mr-1" /> {post.views}</span>
        </div>

        <Link to={`/post/${post.id}`}>
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3 leading-snug hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors line-clamp-2">
            {post.title}
          </h2>
        </Link>
        
        <p className="text-gray-500 dark:text-gray-400 text-sm mb-5 line-clamp-3 leading-relaxed">
          {post.excerpt}
        </p>
        
        <div className="mt-auto pt-4 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <img src={`https://ui-avatars.com/api/?name=${post.authorName}&background=random`} className="w-8 h-8 rounded-full border border-gray-200 dark:border-gray-700" alt="" />
            <div>
              <p className="text-sm font-semibold text-gray-800 dark:text-gray-200 leading-none">{post.authorName}</p>
            </div>
          </div>
          <div className="flex space-x-3 text-gray-400 dark:text-gray-500">
             <button 
               onClick={handleShare}
               className="hover:text-indigo-600 dark:hover:text-indigo-400 cursor-pointer transition p-1 rounded-full hover:bg-gray-50 dark:hover:bg-gray-800"
               title="Share Post"
             >
               {copied ? <Check className="w-4 h-4 text-green-600 dark:text-green-400" /> : <Share2 className="w-4 h-4" />}
             </button>
          </div>
        </div>
      </div>
    </article>
  );
};