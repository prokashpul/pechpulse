import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { GeminiService } from '../../services/geminiService';
import { MockBackend } from '../../services/mockData';
import { Sparkles, Loader2, Upload, X, Image as ImageIcon, ArrowLeft, Save, Plus, Wand2, FileText, Clock, AlertTriangle } from 'lucide-react';
import { BlogPost } from '../../types';
import { Editor } from '../../components/Editor';
import { useAuth } from '../../context/AuthContext';

export const CreatePost: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { user, hasApiKey } = useAuth();
  
  // Form State
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [excerpt, setExcerpt] = useState('');
  
  // Tags & Category
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [category, setCategory] = useState('Tech');
  
  const [coverImage, setCoverImage] = useState<string | null>(null);
  const [isPublished, setIsPublished] = useState(true);

  // AI State
  const [topic, setTopic] = useState('');
  const [loadingAI, setLoadingAI] = useState(false);
  const [loadingTitle, setLoadingTitle] = useState(false);
  const [loadingImage, setLoadingImage] = useState(false);
  
  // Draft State
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  
  // Edit mode
  const [existingPost, setExistingPost] = useState<BlogPost | null>(null);
  const isEditMode = !!id;
  const fileInputRef = useRef<HTMLInputElement>(null);

  const categories = ['Tech', 'AI', 'Future', 'Innovation', 'Design', 'Business'];
  const DRAFT_KEY = 'techpulse_post_draft';

  // Load Post for Edit Mode
  useEffect(() => {
    if (id) {
      const post = MockBackend.getPostById(id);
      if (post) {
        setExistingPost(post);
        setTitle(post.title);
        setContent(post.content);
        setExcerpt(post.excerpt);
        setTags(post.tags);
        setCoverImage(post.coverImage);
        // Attempt to find category from tags or default
        const foundCat = categories.find(c => post.tags.includes(c)) || 'Tech';
        setCategory(foundCat);
      } else {
        navigate('/admin/posts');
      }
    }
  }, [id, navigate]);

  // Load Draft for New Post
  useEffect(() => {
    if (!isEditMode) {
      const savedDraft = localStorage.getItem(DRAFT_KEY);
      if (savedDraft) {
        try {
          const parsed = JSON.parse(savedDraft);
          // Only prompt if there is substantial content
          if (parsed.title || parsed.content) {
             if (window.confirm('A saved draft was found. Do you want to restore it?')) {
                setTitle(parsed.title || '');
                setContent(parsed.content || '');
                setExcerpt(parsed.excerpt || '');
                setTags(parsed.tags || []);
                setCategory(parsed.category || 'Tech');
                setCoverImage(parsed.coverImage || null);
                setTopic(parsed.topic || '');
                if (parsed.savedAt) setLastSaved(new Date(parsed.savedAt));
             } else {
                // If user declines, maybe clear it? For now, keep it safely.
             }
          }
        } catch (e) {
          console.error("Failed to parse draft", e);
        }
      }
    }
  }, [isEditMode]);

  // Auto-save logic
  useEffect(() => {
    if (isEditMode) return; // Don't auto-save to new-post-draft if editing existing

    const timer = setInterval(() => {
      if (title || content) {
        saveDraftToLocal(true);
      }
    }, 30000); // 30 seconds

    return () => clearInterval(timer);
  }, [title, content, excerpt, tags, category, coverImage, topic, isEditMode]);

  const saveDraftToLocal = (silent = false) => {
    const draft = {
      title,
      content,
      excerpt,
      tags,
      category,
      coverImage,
      topic,
      savedAt: new Date().toISOString()
    };
    localStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
    setLastSaved(new Date());
    if (!silent) {
       // Optional toast here
    }
  };

  const handleManualDraftSave = () => {
    saveDraftToLocal();
    alert("Draft saved successfully to local storage!");
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCoverImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGenerateTitle = async () => {
    if (!topic) return alert("Please enter a topic first.");
    if (!user?.apiKey) return alert("API Key Missing");
    
    setLoadingTitle(true);
    const newTitle = await GeminiService.generateTitle(topic, user.apiKey);
    setTitle(newTitle);
    setLoadingTitle(false);
  };

  const handleGenerateContent = async () => {
    // Prioritize the 'topic' input for AI generation
    const promptTopic = topic || title;
    
    if (!promptTopic) {
        alert("Please enter a topic in the Gemini Assistant to generate content.");
        return;
    }
    if (!user?.apiKey) return alert("API Key Missing");
    
    setLoadingAI(true);
    try {
        const { content: newContent } = await GeminiService.generateBlogPost(promptTopic, user.apiKey);
        
        if (newContent) {
            setContent(newContent);
            
            // Auto-generate excerpt if empty by stripping HTML and truncating
            if (!excerpt) {
                const plainText = newContent.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
                const generatedExcerpt = plainText.substring(0, 150) + (plainText.length > 150 ? '...' : '');
                setExcerpt(generatedExcerpt);
            }
        } else {
            alert("Failed to generate content. Please try again.");
        }
    } catch (error) {
        console.error("AI Generation Error:", error);
        alert("An error occurred while generating content.");
    } finally {
        setLoadingAI(false);
    }
  };

  const handleGenerateThumbnail = async () => {
    const prompt = topic || title;
    if (!prompt) return alert("Please enter a topic to generate an image.");
    if (!user?.apiKey) return alert("API Key Missing");
    
    setLoadingImage(true);
    // Add specific instruction for thumbnail style
    const imagePrompt = `A high quality, modern, digital art blog post thumbnail about: ${prompt}. minimalist, tech-oriented, 4k resolution.`;
    const imageBase64 = await GeminiService.generateThumbnail(imagePrompt, user.apiKey);
    
    if (imageBase64) {
      setCoverImage(imageBase64);
    } else {
      alert("Failed to generate image. Please try again.");
    }
    setLoadingImage(false);
  };

  const handleAddTag = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      if (!tags.includes(tagInput.trim())) {
        setTags([...tags, tagInput.trim()]);
      }
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(t => t !== tagToRemove));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Fallback excerpt if empty
    const plainTextContent = content.replace(/<[^>]+>/g, ' ');
    const finalExcerpt = excerpt || plainTextContent.substring(0, 150) + '...';
    
    // Ensure category is in tags
    const finalTags = [...tags];
    if (!finalTags.includes(category)) {
      finalTags.unshift(category);
    }

    const postData = {
      title,
      content,
      excerpt: finalExcerpt,
      coverImage: coverImage || `https://picsum.photos/seed/${Date.now()}/800/600`,
      tags: finalTags,
      authorId: user?.id || 'admin-1',
      authorName: user?.name || 'Prokash Pul',
    };

    if (isEditMode && existingPost) {
       MockBackend.updatePost({ ...existingPost, ...postData });
    } else {
       MockBackend.createPost(postData);
       // Clear draft only if successfully created new post
       localStorage.removeItem(DRAFT_KEY);
    }
    
    navigate('/admin/posts');
  };

  // Only render editor when we have data (if editing) or immediately (if new)
  const shouldRenderEditor = !isEditMode || (isEditMode && existingPost);

  return (
    <div className="max-w-7xl mx-auto pb-12 px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
        <div>
           <div className="flex items-center text-sm text-gray-500 mb-2 flex-wrap">
              <Link to="/admin/dashboard" className="hover:text-indigo-600">Dashboard</Link> 
              <span className="mx-2">/</span>
              <Link to="/admin/posts" className="hover:text-indigo-600">Blog</Link> 
              <span className="mx-2">/</span>
              <span className="text-gray-800 dark:text-gray-200">{isEditMode ? 'Edit' : 'Add'} Blog</span>
           </div>
           <div className="flex items-end gap-3">
             <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{isEditMode ? 'Edit Blog Post' : 'Add New Blog Post'}</h1>
             {lastSaved && !isEditMode && (
               <div className="flex items-center text-xs text-gray-400 mb-1 ml-2">
                 <Clock className="w-3 h-3 mr-1" />
                 Saved {lastSaved.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
               </div>
             )}
           </div>
        </div>
        <div className="flex gap-3 w-full sm:w-auto flex-wrap">
          <button 
            type="button" 
            onClick={() => navigate('/admin/posts')} 
            className="flex-1 sm:flex-none justify-center px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition"
          >
            Cancel
          </button>
          
          {!isEditMode && (
            <button 
              type="button"
              onClick={handleManualDraftSave}
              className="flex-1 sm:flex-none justify-center px-4 py-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-lg text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition flex items-center"
            >
              <FileText className="w-4 h-4 mr-2" />
              Save Draft
            </button>
          )}

          <button 
            onClick={handleSubmit} 
            className="flex-1 sm:flex-none justify-center px-6 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition shadow-sm flex items-center"
          >
            <Save className="w-4 h-4 mr-2" />
            {isEditMode ? 'Save Changes' : 'Publish'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column - Main Content */}
        <div className="lg:col-span-2 space-y-6 order-2 lg:order-1">
          
          {/* Main Form */}
          <div className="bg-white dark:bg-gray-900 p-6 sm:p-8 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800">
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Blog Title</label>
                <input 
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  placeholder="Enter a descriptive title"
                  className="w-full border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white" 
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Description / Excerpt</label>
                <textarea 
                  value={excerpt}
                  onChange={e => setExcerpt(e.target.value)}
                  placeholder="Short summary of the post..."
                  rows={3}
                  className="w-full border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white resize-none" 
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Blog Content</label>
                <div className="rounded-xl overflow-hidden shadow-sm border border-gray-200 dark:border-gray-700 bg-white">
                  {shouldRenderEditor ? (
                    <Editor value={content} onChange={setContent} />
                  ) : (
                     <div className="h-[300px] flex items-center justify-center bg-gray-50 text-gray-400">Loading editor...</div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Sidebar */}
        <div className="space-y-6 order-1 lg:order-2">
          
          {/* AI Tools Widget - Improved Responsiveness */}
          {hasApiKey ? (
            <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10">
                 <Sparkles className="w-24 h-24" />
              </div>
              
              <div className="relative z-10">
                <div className="flex items-center mb-4">
                  <div className="bg-white/20 p-2 rounded-lg mr-3">
                    <Sparkles className="w-5 h-5 text-white" />
                  </div>
                  <div>
                     <h3 className="font-bold text-lg leading-tight">Gemini Assistant</h3>
                     <p className="text-indigo-200 text-xs">AI-Powered Creation</p>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div>
                     <label className="text-xs font-semibold text-indigo-200 mb-1 block">Topic Idea</label>
                     <input 
                       value={topic}
                       onChange={e => setTopic(e.target.value)}
                       placeholder="e.g. The Future of AI"
                       className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-sm placeholder-indigo-300 text-white focus:outline-none focus:ring-1 focus:ring-white/50 transition"
                     />
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-2">
                     <button 
                        onClick={handleGenerateTitle}
                        disabled={loadingTitle}
                        className="flex items-center justify-center px-3 py-2.5 bg-white text-indigo-700 rounded-lg text-xs font-bold hover:bg-indigo-50 transition shadow-sm disabled:opacity-70"
                     >
                       {loadingTitle ? <Loader2 className="animate-spin w-3 h-3 mr-1" /> : <Wand2 className="w-3 h-3 mr-1" />}
                       Gen Title
                     </button>
                     <button 
                        onClick={handleGenerateContent}
                        disabled={loadingAI}
                        className="flex items-center justify-center px-3 py-2.5 bg-indigo-500 text-white rounded-lg text-xs font-bold hover:bg-indigo-400 transition shadow-sm disabled:opacity-70"
                     >
                       {loadingAI ? <Loader2 className="animate-spin w-3 h-3 mr-1" /> : <Sparkles className="w-3 h-3 mr-1" />}
                       Gen Content
                     </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-gray-100 dark:bg-gray-800 p-6 rounded-2xl text-center border-2 border-dashed border-gray-300 dark:border-gray-700">
               <div className="mx-auto w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center mb-3">
                  <AlertTriangle className="text-gray-400 w-6 h-6" />
               </div>
               <h3 className="text-sm font-bold text-gray-800 dark:text-gray-200 mb-1">AI Assistant Disabled</h3>
               <p className="text-xs text-gray-500 mb-3">Add your API Key in settings to unlock AI features.</p>
               <Link to="/profile" className="text-indigo-600 text-xs font-bold hover:underline">Go to Settings</Link>
            </div>
          )}

          {/* Cover Image & Generation */}
          <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800">
             <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-4">Cover Image</label>
             
             <div 
               className={`relative border-2 border-dashed rounded-xl h-48 flex flex-col items-center justify-center transition overflow-hidden bg-gray-50 dark:bg-gray-800 ${coverImage ? 'border-indigo-500' : 'border-gray-300 dark:border-gray-700'}`}
             >
               <input type="file" ref={fileInputRef} onChange={handleImageUpload} className="hidden" accept="image/*" />
               
               {coverImage ? (
                 <>
                   <img src={coverImage} alt="Cover" className="w-full h-full object-cover" />
                   <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center opacity-0 hover:opacity-100 transition duration-200 group">
                      <div className="flex space-x-2">
                        <button 
                          onClick={() => fileInputRef.current?.click()}
                          className="px-3 py-1.5 bg-white rounded-lg text-xs font-bold text-gray-800 hover:bg-gray-100"
                        >
                          Change
                        </button>
                        <button 
                          onClick={() => setCoverImage(null)}
                          className="px-3 py-1.5 bg-red-500 rounded-lg text-xs font-bold text-white hover:bg-red-600"
                        >
                          Remove
                        </button>
                      </div>
                   </div>
                 </>
               ) : (
                 <div className="text-center p-4">
                    {loadingImage ? (
                       <div className="flex flex-col items-center">
                          <Loader2 className="w-8 h-8 text-indigo-500 animate-spin mb-2" />
                          <span className="text-xs text-indigo-600 font-medium">Generating AI Image...</span>
                       </div>
                    ) : (
                       <>
                         <div className="bg-white dark:bg-gray-700 p-3 rounded-full inline-flex mb-3 shadow-sm">
                            <ImageIcon className="w-6 h-6 text-indigo-500 dark:text-indigo-400" />
                         </div>
                         <p className="text-sm font-medium text-gray-900 dark:text-white">No image selected</p>
                         <div className="flex gap-2 mt-3 justify-center">
                           <button 
                             onClick={() => fileInputRef.current?.click()}
                             className="text-xs px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-white dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 transition"
                           >
                             Upload
                           </button>
                           
                           {hasApiKey && (
                             <button 
                               onClick={handleGenerateThumbnail}
                               className="text-xs px-3 py-1.5 bg-indigo-100 text-indigo-700 rounded-lg hover:bg-indigo-200 transition flex items-center"
                             >
                               <Sparkles className="w-3 h-3 mr-1" /> AI Generate
                             </button>
                           )}
                         </div>
                       </>
                    )}
                 </div>
               )}
             </div>
          </div>

          {/* Organization */}
          <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800">
            <h3 className="font-bold text-gray-900 dark:text-white mb-4 text-sm border-b border-gray-100 dark:border-gray-800 pb-2">Organization</h3>
            
            <div className="space-y-4">
              {/* Category */}
              <div>
                 <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase mb-2">Category</label>
                 <select 
                   value={category} 
                   onChange={(e) => setCategory(e.target.value)}
                   className="w-full border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-gray-200"
                 >
                   {categories.map(cat => (
                     <option key={cat} value={cat}>{cat}</option>
                   ))}
                 </select>
              </div>

              {/* Tags */}
              <div>
                <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase mb-2">Tags</label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {tags.map((tag, idx) => (
                    <span key={idx} className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400">
                      {tag}
                      <button onClick={() => removeTag(tag)} className="ml-1 text-indigo-400 hover:text-indigo-600">
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
                <div className="relative">
                  <input 
                    value={tagInput}
                    onChange={e => setTagInput(e.target.value)}
                    onKeyDown={handleAddTag}
                    placeholder="Add tag and hit Enter"
                    className="w-full border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-gray-200 pr-8"
                  />
                  <Plus className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                </div>
              </div>

              {/* Status Toggles */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Published</span>
                  <button 
                    type="button"
                    onClick={() => setIsPublished(!isPublished)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${isPublished ? 'bg-green-500' : 'bg-gray-200 dark:bg-gray-700'}`}
                  >
                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${isPublished ? 'translate-x-6' : 'translate-x-1'}`} />
                  </button>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
};