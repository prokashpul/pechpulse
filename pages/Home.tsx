import React, { useEffect, useState, useRef, useCallback } from 'react';
import { PostCard } from '../components/PostCard';
import { MockBackend } from '../services/mockData';
import { BlogPost } from '../types';
import { Loader2, Search } from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';

export const Home: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCategory = searchParams.get('category') || 'All';

  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  
  // Category state
  const categories = ['All', 'AI', 'Tech', 'Future', 'Innovation'];
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  
  const observer = useRef<IntersectionObserver | null>(null);

  // Sync state if URL param changes (e.g. back button or external link)
  useEffect(() => {
    const cat = searchParams.get('category');
    if (cat) {
      setSelectedCategory(cat);
    } else if (!cat && selectedCategory !== 'All') {
       // Optional: reset if param removed, though typically we just default 'All' on mount
    }
  }, [searchParams]);

  const loadPosts = useCallback(() => {
    if (loading || !hasMore || isSearching) return;
    
    setLoading(true);
    // Simulate network delay for realism
    setTimeout(() => {
      // Use category aware fetcher
      const { posts: newPosts, hasMore: more } = MockBackend.getPostsByCategory(selectedCategory, page, 12);
      
      setPosts(prev => (page === 1 ? newPosts : [...prev, ...newPosts]));
      setHasMore(more);
      setPage(prev => prev + 1);
      setLoading(false);
    }, 800);
  }, [page, hasMore, loading, isSearching, selectedCategory]);

  // Handle Search
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setIsSearching(false);
      setPage(1);
      // Let the category effect handle the reload
      if (selectedCategory !== 'All') {
         // trigger via category effect if needed
      } else {
         const { posts: newPosts, hasMore: more } = MockBackend.getPosts(1, 12);
         setPosts(newPosts);
         setPage(2);
         setHasMore(more);
      }
      return;
    }

    setIsSearching(true);
    const results = MockBackend.searchPosts(searchQuery);
    setPosts(results);
    setHasMore(false); // Disable infinite scroll for search results in this mock
  }, [searchQuery]);

  // Handle Category Change
  useEffect(() => {
    if (isSearching) return; // Search takes precedence
    
    setPage(1);
    setPosts([]);
    setHasMore(true);
    setLoading(true);
    
    // Immediate fetch for responsiveness
    setTimeout(() => {
      const { posts: newPosts, hasMore: more } = MockBackend.getPostsByCategory(selectedCategory, 1, 12);
      setPosts(newPosts);
      setPage(2);
      setHasMore(more);
      setLoading(false);
    }, 500);

  }, [selectedCategory, isSearching]);

  // Handle manual click on pill
  const handleCategoryClick = (cat: string) => {
    setSelectedCategory(cat);
    setSearchParams(cat === 'All' ? {} : { category: cat });
  };

  const lastPostElementRef = useCallback((node: HTMLDivElement) => {
    if (loading || isSearching) return;
    if (observer.current) observer.current.disconnect();
    
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        loadPosts();
      }
    });
    
    if (node) observer.current.observe(node);
  }, [loading, hasMore, loadPosts, isSearching]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
           <nav className="text-sm text-gray-500 dark:text-gray-400 mb-1">
             <Link to="/" className="hover:text-indigo-600 dark:hover:text-indigo-400">Home</Link> <span className="mx-1">/</span> <span className="text-gray-900 dark:text-white font-medium">Blog</span>
           </nav>
           <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Blog Posts</h1>
        </div>

        {/* Search & Filter */}
        <div className="flex items-center space-x-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
             <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
             <input 
               type="text" 
               placeholder="Search posts..." 
               value={searchQuery}
               onChange={(e) => setSearchQuery(e.target.value)}
               className="w-full pl-10 pr-4 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none shadow-sm transition" 
             />
          </div>
        </div>
      </div>

      {/* Categories Pills */}
      <div className="flex overflow-x-auto pb-4 mb-6 scrollbar-hide space-x-2">
         {categories.map((cat, idx) => (
           <button 
             key={cat} 
             onClick={() => handleCategoryClick(cat)}
             className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${selectedCategory === cat ? 'bg-indigo-600 text-white' : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700'}`}
           >
             {cat}
           </button>
         ))}
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {posts.map((post, index) => {
          const isLast = index === posts.length - 1;
          
          return (
            <div ref={isLast ? lastPostElementRef : null} key={post.id}>
              <PostCard post={post} />
            </div>
          );
        })}
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center items-center py-12">
          <div className="flex flex-col items-center">
            <Loader2 className="w-8 h-8 text-indigo-600 animate-spin mb-2" />
            <span className="text-sm text-gray-500 dark:text-gray-400">Loading content...</span>
          </div>
        </div>
      )}
      
      {/* End of Content */}
      {!hasMore && posts.length > 0 && (
        <div className="text-center py-12 border-t border-gray-100 dark:border-gray-800 mt-12">
          <p className="text-gray-400 dark:text-gray-600 text-sm">You've reached the end of the list.</p>
        </div>
      )}
      
      {/* Empty State */}
      {posts.length === 0 && !loading && (
         <div className="text-center py-20 bg-white dark:bg-gray-900 rounded-xl border border-dashed border-gray-300 dark:border-gray-700">
            <div className="mx-auto bg-gray-50 dark:bg-gray-800 w-16 h-16 rounded-full flex items-center justify-center mb-4">
              <Search className="w-8 h-8 text-gray-400 dark:text-gray-500" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">No posts found</h3>
            <p className="text-gray-500 dark:text-gray-400">Try adjusting your filters or search.</p>
         </div>
      )}
    </div>
  );
};