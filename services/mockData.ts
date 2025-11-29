import { BlogPost, User, UserRole, Comment } from '../types';

// Seed Data
const INITIAL_USERS: User[] = [
  {
    id: 'admin-1',
    name: 'Prokash Pul',
    email: 'prokashpul2@gmail.com',
    role: UserRole.ADMIN,
    avatar: 'https://picsum.photos/id/64/200/200',
    bio: 'Full Stack Developer & AI Enthusiast. Building the future of tech blogging.'
  },
  {
    id: 'user-1',
    name: 'Jane Doe',
    email: 'jane@example.com',
    role: UserRole.USER,
    avatar: 'https://picsum.photos/id/65/200/200',
    bio: 'Tech reader and occasional writer.'
  }
];

const INITIAL_COMMENTS: Comment[] = [
  {
    id: 'c1',
    postId: 'post-0',
    userId: 'user-2',
    userName: 'Michael Scott',
    content: 'This is a fantastic article! The insights on Generative AI are spot on. I really liked how you explained the efficiency gains.',
    createdAt: new Date(Date.now() - 86400000).toISOString()
  },
  {
    id: 'c2',
    postId: 'post-0',
    userId: 'user-3',
    userName: 'Sarah Connor',
    content: 'I am worried about the future implications. We need to be careful with how we deploy these models.',
    createdAt: new Date(Date.now() - 3600000).toISOString()
  }
];

const generatePosts = (count: number): BlogPost[] => {
  return Array.from({ length: count }).map((_, i) => ({
    id: `post-${i}`,
    title: `The Future of AI: Trend #${i + 1}`,
    excerpt: `Exploring the deep impact of artificial intelligence on sector ${i + 1}. We dive into the details using Gemini...`,
    content: `
# The AI Revolution ${i + 1}

Artificial Intelligence is reshaping our world. In this post, we explore how **Generative AI** is changing the landscape.

## Key Takeaways
1. Efficiency is up by 40%.
2. Creativity is being augmented, not replaced.
3. New job roles are emerging.

> "AI is the new electricity." - Andrew Ng

![AI Abstract](https://picsum.photos/id/${10 + i}/800/400)

## Conclusion
The future is bright if we build responsibly.
    `,
    coverImage: `https://picsum.photos/id/${10 + i}/800/600`,
    authorId: 'admin-1',
    authorName: 'Prokash Pul',
    tags: ['AI', 'Tech', 'Future', 'Innovation'],
    createdAt: new Date(Date.now() - i * 86400000).toISOString(),
    views: Math.floor(Math.random() * 5000)
  }));
};

// Local Storage Keys
const KEYS = {
  USERS: 'techpulse_users',
  POSTS: 'techpulse_posts',
  COMMENTS: 'techpulse_comments',
  CURRENT_USER: 'techpulse_current_user'
};

// Service
export const MockBackend = {
  getUsers: (): User[] => {
    const stored = localStorage.getItem(KEYS.USERS);
    if (!stored) {
      localStorage.setItem(KEYS.USERS, JSON.stringify(INITIAL_USERS));
      return INITIAL_USERS;
    }
    return JSON.parse(stored);
  },

  getPosts: (page: number, limit: number): { posts: BlogPost[], hasMore: boolean } => {
    let allPosts: BlogPost[] = [];
    const stored = localStorage.getItem(KEYS.POSTS);
    if (!stored) {
      allPosts = generatePosts(50); // Seed 50 posts
      localStorage.setItem(KEYS.POSTS, JSON.stringify(allPosts));
    } else {
      allPosts = JSON.parse(stored);
    }
    
    // Sort by Date Descending
    allPosts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    const start = (page - 1) * limit;
    const end = start + limit;
    return {
      posts: allPosts.slice(start, end),
      hasMore: end < allPosts.length
    };
  },
  
  getPostsByCategory: (category: string, page: number, limit: number): { posts: BlogPost[], hasMore: boolean } => {
    const { posts } = MockBackend.getPosts(1, 1000); // Get all to filter
    const filtered = category === 'All' 
      ? posts 
      : posts.filter(p => p.tags.some(t => t.toLowerCase() === category.toLowerCase()));
    
    // Sort
    filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    const start = (page - 1) * limit;
    const end = start + limit;
    return {
      posts: filtered.slice(start, end),
      hasMore: end < filtered.length
    };
  },
  
  searchPosts: (query: string): BlogPost[] => {
    const { posts } = MockBackend.getPosts(1, 1000);
    const lowerQuery = query.toLowerCase();
    return posts.filter(p => 
      p.title.toLowerCase().includes(lowerQuery) || 
      p.excerpt.toLowerCase().includes(lowerQuery)
    );
  },

  getPostById: (id: string): BlogPost | undefined => {
    const { posts } = MockBackend.getPosts(1, 1000); // Get all (simplified)
    return posts.find(p => p.id === id);
  },

  getRelatedPosts: (currentPostId: string): BlogPost[] => {
    const { posts } = MockBackend.getPosts(1, 1000);
    return posts.filter(p => p.id !== currentPostId).slice(0, 5);
  },
  
  getPopularPosts: (): BlogPost[] => {
    const { posts } = MockBackend.getPosts(1, 1000);
    return [...posts].sort((a, b) => b.views - a.views).slice(0, 5);
  },

  getComments: (postId: string): Comment[] => {
     // In a real app, filter by postId. Here we just return mock + stored
     const stored = localStorage.getItem(KEYS.COMMENTS);
     let comments = stored ? JSON.parse(stored) : INITIAL_COMMENTS;
     // For demo, we just return all comments as if they belong to this post to populate UI
     return comments;
  },

  addComment: (comment: Omit<Comment, 'id' | 'createdAt'>): Comment => {
     const stored = localStorage.getItem(KEYS.COMMENTS);
     let comments = stored ? JSON.parse(stored) : INITIAL_COMMENTS;
     
     const newComment: Comment = {
       ...comment,
       id: `c-${Date.now()}`,
       createdAt: new Date().toISOString()
     };
     
     comments.push(newComment);
     localStorage.setItem(KEYS.COMMENTS, JSON.stringify(comments));
     return newComment;
  },

  createPost: (post: Omit<BlogPost, 'id' | 'createdAt' | 'views'>): BlogPost => {
    const { posts } = MockBackend.getPosts(1, 1000);
    const newPost: BlogPost = {
      ...post,
      id: `post-${Date.now()}`,
      createdAt: new Date().toISOString(),
      views: 0
    };
    const updatedPosts = [newPost, ...posts];
    localStorage.setItem(KEYS.POSTS, JSON.stringify(updatedPosts));
    return newPost;
  },

  updatePost: (post: BlogPost): void => {
     const { posts } = MockBackend.getPosts(1, 1000);
     const index = posts.findIndex(p => p.id === post.id);
     if (index !== -1) {
       posts[index] = post;
       localStorage.setItem(KEYS.POSTS, JSON.stringify(posts));
     }
  },

  deletePost: (id: string): void => {
    const { posts } = MockBackend.getPosts(1, 1000);
    const filtered = posts.filter(p => p.id !== id);
    localStorage.setItem(KEYS.POSTS, JSON.stringify(filtered));
  },

  updateUser: (user: User): void => {
    const users = MockBackend.getUsers();
    const index = users.findIndex(u => u.id === user.id);
    if (index !== -1) {
      users[index] = user;
      localStorage.setItem(KEYS.USERS, JSON.stringify(users));
      
      // Also update current session if it matches
      const currentUserStr = localStorage.getItem(KEYS.CURRENT_USER);
      if (currentUserStr) {
        const currentUser = JSON.parse(currentUserStr);
        if (currentUser.id === user.id) {
           localStorage.setItem(KEYS.CURRENT_USER, JSON.stringify(user));
        }
      }
    }
  },

  deleteUser: (id: string): void => {
    const users = MockBackend.getUsers();
    const filtered = users.filter(u => u.id !== id);
    localStorage.setItem(KEYS.USERS, JSON.stringify(filtered));
  },
  
  login: (email: string, password: string): User | null => {
    // Specific hardcoded credential check per requirements
    if (email === 'prokashpul2@gmail.com' && password === 'Proksh2') {
      const users = MockBackend.getUsers();
      return users.find(u => u.email === email) || INITIAL_USERS[0];
    }
    
    // Generic Login for testing
    const users = MockBackend.getUsers();
    return users.find(u => u.email === email) || null;
  },

  loginWithGoogle: (): User => {
    // Simulate finding or creating a user via Google
    const users = MockBackend.getUsers();
    const googleEmail = 'google_demo@techpulse.com';
    let googleUser = users.find(u => u.email === googleEmail);
    
    if (!googleUser) {
        googleUser = {
            id: `google-${Date.now()}`,
            name: 'Google User',
            email: googleEmail,
            role: UserRole.USER,
            avatar: 'https://ui-avatars.com/api/?name=Google+User&background=DB4437&color=fff',
            bio: 'I signed up with Google!'
        };
        // Add to local storage users
        const updatedUsers = [...users, googleUser];
        localStorage.setItem(KEYS.USERS, JSON.stringify(updatedUsers));
    }
    return googleUser;
  }
};