import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { BlogPost, Comment } from '../types';
import { MockBackend } from '../services/mockData';
import ReactMarkdown from 'react-markdown';
import { Calendar, User, Eye, MessageCircle, Share2, Search, Facebook, Twitter, Linkedin, Send, Check } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const SinglePost: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [recentPosts, setRecentPosts] = useState<BlogPost[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [categories, setCategories] = useState<{ name: string; count: number }[]>([]);
  const [popularTags, setPopularTags] = useState<string[]>([]);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    if (id) {
      const foundPost = MockBackend.getPostById(id);
      if (foundPost) {
        setPost(foundPost);
        // Get generic recent posts for sidebar
        setRecentPosts(MockBackend.getPosts(1, 5).posts);
        setComments(MockBackend.getComments(id));
      }
    }

    // Fetch dynamic categories and tags from all posts
    const { posts: allPosts } = MockBackend.getPosts(1, 1000);
    const catStats: Record<string, number> = {};
    const tagSet = new Set<string>();

    allPosts.forEach(p => {
      p.tags.forEach(t => {
        catStats[t] = (catStats[t] || 0) + 1;
        tagSet.add(t);
      });
    });

    const sortedCats = Object.entries(catStats)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5); // Top 5 categories
    
    setCategories(sortedCats);
    setPopularTags(Array.from(tagSet).slice(0, 8)); // Top 8 random tags
  }, [id]);

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !id) return;

    const added = MockBackend.addComment({
      postId: id,
      userId: user?.id || 'guest',
      userName: user?.name || 'Guest User',
      content: newComment
    });

    setComments([...comments, added]);
    setNewComment('');
  };

  const handleShare = async () => {
    const url = window.location.href;
    // 1. Try Native Share
    if (navigator.share) {
      try {
        await navigator.share({
          title: post?.title,
          text: post?.excerpt,
          url: url,
        });
        return;
      } catch (err) {
        // User cancelled or not supported
      }
    }

    // 2. Clipboard Fallback
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy', err);
    }
  };

  const shareToSocial = (platform: string) => {
    if (!post) return;
    const url = encodeURIComponent(window.location.href);
    const text = encodeURIComponent(post.title);
    let link = '';
    
    switch (platform) {
      case 'facebook': link = `https://www.facebook.com/sharer/sharer.php?u=${url}`; break;
      case 'twitter': link = `https://twitter.com/intent/tweet?url=${url}&text=${text}`; break;
      case 'linkedin': link = `https://www.linkedin.com/sharing/share-offsite/?url=${url}`; break;
    }
    
    if (link) {
      window.open(link, '_blank', 'width=600,height=400');
    }
  };

  if (!post) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50 dark:bg-gray-950">
        <div className="animate-pulse text-indigo-600 font-semibold">Loading content...</div>
      </div>
    );
  }

  // Helper to detect HTML vs Markdown
  const isHtml = (text: string) => /<\/?[a-z][\s\S]*>/i.test(text);

  return (
    <div className="bg-gray-50 dark:bg-gray-950 min-h-screen py-10 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Main Content Column */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* Blog Post Card */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden">
              
              {/* Cover Image */}
              <div className="relative h-64 md:h-96 w-full">
                <img src={post.coverImage} alt={post.title} className="w-full h-full object-cover" />
                <Link 
                  to={`/?category=${encodeURIComponent(post.tags[0])}`}
                  className="absolute top-4 left-4 bg-indigo-600 text-white text-xs font-bold px-3 py-1 rounded uppercase hover:bg-indigo-700 transition"
                >
                   {post.tags[0]}
                </Link>
              </div>

              <div className="p-6 md:p-10">
                {/* Meta Header */}
                <div className="flex flex-wrap items-center text-sm text-gray-500 dark:text-gray-400 mb-6 gap-4 md:gap-6">
                  <div className="flex items-center space-x-2">
                     <img src={`https://ui-avatars.com/api/?name=${post.authorName}&background=random`} className="w-8 h-8 rounded-full" alt="Author" />
                     <span className="font-medium text-gray-800 dark:text-gray-200">{post.authorName}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Calendar className="w-4 h-4" />
                    <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <MessageCircle className="w-4 h-4" />
                    <span>{comments.length} Comments</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Eye className="w-4 h-4" />
                    <span>{post.views} Views</span>
                  </div>
                </div>

                {/* Title */}
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-8 leading-tight">
                  {post.title}
                </h1>

                {/* Content */}
                <article className="prose prose-lg prose-indigo dark:prose-invert max-w-none text-gray-700 dark:text-gray-300 leading-relaxed mb-10">
                  {isHtml(post.content) ? (
                    <div dangerouslySetInnerHTML={{ __html: post.content }} />
                  ) : (
                    <ReactMarkdown>{post.content}</ReactMarkdown>
                  )}
                </article>

                {/* Divider */}
                <hr className="border-gray-100 dark:border-gray-800 my-8" />

                {/* Footer Actions */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-center flex-wrap gap-2">
                    <span className="text-gray-900 dark:text-white font-semibold mr-2">Tags:</span>
                    {post.tags.map(tag => (
                      <Link 
                        key={tag} 
                        to={`/?category=${encodeURIComponent(tag)}`}
                        className="px-3 py-1 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 text-xs rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition cursor-pointer"
                      >
                        {tag}
                      </Link>
                    ))}
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <span className="text-gray-900 dark:text-white font-semibold mr-1">Share:</span>
                    
                    {/* Generic Share / Copy Link */}
                    <button 
                      onClick={handleShare}
                      className="p-2 bg-gray-100 dark:bg-gray-800 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 transition relative group"
                      title="Share or Copy Link"
                    >
                      {copied ? <Check className="w-4 h-4 text-green-600 dark:text-green-400" /> : <Share2 className="w-4 h-4" />}
                      {copied && <span className="absolute -top-8 left-1/2 -translate-x-1/2 text-xs bg-gray-800 text-white px-2 py-1 rounded shadow-lg whitespace-nowrap">Copied!</span>}
                    </button>

                    {/* Social Buttons */}
                    <button onClick={() => shareToSocial('facebook')} className="p-2 bg-gray-100 dark:bg-gray-800 rounded-full hover:bg-[#3b5998] hover:text-white transition text-gray-600 dark:text-gray-400"><Facebook className="w-4 h-4" /></button>
                    <button onClick={() => shareToSocial('twitter')} className="p-2 bg-gray-100 dark:bg-gray-800 rounded-full hover:bg-[#1DA1F2] hover:text-white transition text-gray-600 dark:text-gray-400"><Twitter className="w-4 h-4" /></button>
                    <button onClick={() => shareToSocial('linkedin')} className="p-2 bg-gray-100 dark:bg-gray-800 rounded-full hover:bg-[#0077b5] hover:text-white transition text-gray-600 dark:text-gray-400"><Linkedin className="w-4 h-4" /></button>
                  </div>
                </div>
              </div>
            </div>

            {/* Author Card */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 p-8 flex flex-col md:flex-row items-center md:items-start text-center md:text-left gap-6">
               <img src={`https://ui-avatars.com/api/?name=${post.authorName}&background=random`} className="w-20 h-20 rounded-full" alt="Author" />
               <div>
                 <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">About {post.authorName}</h3>
                 <p className="text-gray-600 dark:text-gray-300 mb-4">
                   Senior Tech Editor & AI Specialist. Passionate about how technology shapes our future. Writing about LLMs, Neural Networks, and Web Development.
                 </p>
                 <Link to="/" className="text-indigo-600 dark:text-indigo-400 font-medium hover:text-indigo-800 dark:hover:text-indigo-300 uppercase text-sm tracking-wide">View All Posts</Link>
               </div>
            </div>

            {/* Comments Section */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 p-8">
               <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">{comments.length} Comments</h3>
               
               {/* List */}
               <div className="space-y-8 mb-10">
                 {comments.map((comment) => (
                   <div key={comment.id} className="flex gap-4">
                     <div className="flex-shrink-0">
                       <img className="h-12 w-12 rounded-full bg-gray-100 dark:bg-gray-800" src={`https://ui-avatars.com/api/?name=${comment.userName}&background=random`} alt="" />
                     </div>
                     <div className="flex-1">
                       <div className="flex items-center justify-between mb-2">
                         <h4 className="font-bold text-gray-900 dark:text-white">{comment.userName}</h4>
                         <span className="text-xs text-gray-500 dark:text-gray-400">{new Date(comment.createdAt).toLocaleDateString()}</span>
                       </div>
                       <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">{comment.content}</p>
                       <button className="text-indigo-600 dark:text-indigo-400 text-xs font-semibold mt-2 hover:underline">Reply</button>
                     </div>
                   </div>
                 ))}
               </div>

               {/* Form */}
               <div>
                 <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Leave a Reply</h4>
                 <form onSubmit={handleCommentSubmit} className="space-y-4">
                    <textarea 
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      placeholder="Write your comment here..."
                      className="w-full border border-gray-200 dark:border-gray-700 rounded-xl p-4 h-32 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none resize-none bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white"
                      required
                    ></textarea>
                    <button type="submit" className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-indigo-700 transition flex items-center shadow-md">
                      <Send className="w-4 h-4 mr-2" /> Post Comment
                    </button>
                 </form>
               </div>
            </div>

          </div>

          {/* Sidebar Column */}
          <aside className="lg:col-span-4 space-y-8">
            
            {/* Search */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 p-6">
               <h4 className="font-bold text-gray-900 dark:text-white mb-4">Search</h4>
               <div className="relative">
                 <input type="text" placeholder="Type to search..." className="w-full pl-4 pr-10 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-900 dark:text-white focus:outline-none focus:border-indigo-500" />
                 <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
               </div>
            </div>

            {/* Recent Posts */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 p-6">
              <h4 className="font-bold text-gray-900 dark:text-white mb-6 border-l-4 border-indigo-600 pl-3">Recent Posts</h4>
              <div className="space-y-6">
                {recentPosts.map(p => (
                  <Link to={`/post/${p.id}`} key={p.id} className="flex items-center group">
                    <img src={p.coverImage} className="w-20 h-20 rounded-lg object-cover flex-shrink-0" alt="" />
                    <div className="ml-4">
                      <h5 className="text-sm font-bold text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition line-clamp-2 leading-snug mb-1">
                        {p.title}
                      </h5>
                      <span className="text-xs text-gray-500 dark:text-gray-400">{new Date(p.createdAt).toLocaleDateString()}</span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Categories */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 p-6">
               <h4 className="font-bold text-gray-900 dark:text-white mb-6 border-l-4 border-indigo-600 pl-3">Top Categories</h4>
               <ul className="space-y-3">
                 {categories.map((cat, idx) => (
                   <li key={idx}>
                     <Link to={`/?category=${encodeURIComponent(cat.name)}`} className="flex items-center justify-between text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 cursor-pointer transition">
                       <span className="text-sm">{cat.name}</span>
                       <span className="text-xs bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded-full">{cat.count}</span>
                     </Link>
                   </li>
                 ))}
                 {categories.length === 0 && <li className="text-sm text-gray-400">Loading categories...</li>}
               </ul>
            </div>

             {/* Tags Cloud */}
             <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 p-6">
               <h4 className="font-bold text-gray-900 dark:text-white mb-6 border-l-4 border-indigo-600 pl-3">Popular Tags</h4>
               <div className="flex flex-wrap gap-2">
                 {popularTags.map((tag, idx) => (
                   <Link 
                     key={idx} 
                     to={`/?category=${encodeURIComponent(tag)}`}
                     className="px-3 py-1.5 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 text-xs rounded-md hover:bg-indigo-600 hover:text-white hover:border-indigo-600 transition cursor-pointer"
                   >
                     {tag}
                   </Link>
                 ))}
               </div>
            </div>

             {/* Newsletter */}
             <div className="bg-indigo-600 rounded-2xl shadow-lg p-8 text-center text-white">
                <h4 className="font-bold text-xl mb-2">Subscribe</h4>
                <p className="text-indigo-100 text-sm mb-6">Join 10,000+ subscribers and get the latest AI news.</p>
                <input type="email" placeholder="Email Address" className="w-full px-4 py-3 rounded-lg text-gray-900 text-sm focus:outline-none mb-3" />
                <button className="w-full bg-gray-900 hover:bg-gray-800 py-3 rounded-lg text-sm font-bold transition">Sign Up</button>
             </div>

          </aside>
        </div>
      </div>
    </div>
  );
};