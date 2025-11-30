export enum UserRole {
  ADMIN = 'ADMIN',
  USER = 'USER',
  GUEST = 'GUEST'
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  bio?: string;
  apiKey?: string; // User provided Gemini API Key
}

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string; // Markdown supported
  coverImage: string;
  authorId: string;
  authorName: string;
  tags: string[];
  createdAt: string;
  views: number;
}

export interface Comment {
  id: string;
  postId: string;
  userId: string;
  userName: string;
  content: string;
  createdAt: string;
}

// Gemini specific types
export interface GeminiImageEditRequest {
  image: string; // Base64
  prompt: string;
}