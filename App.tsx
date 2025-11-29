import React from 'react';
import { HashRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { Sidebar } from './components/Sidebar';
import { MobileHeader } from './components/MobileHeader';
import { Home } from './pages/Home';
import { SinglePost } from './pages/SinglePost';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { AdminLayout } from './pages/admin/AdminLayout';
import { Dashboard } from './pages/admin/Dashboard';
import { PostList } from './pages/admin/PostList';
import { CreatePost } from './pages/admin/CreatePost';
import { UserList } from './pages/admin/UserList';
import { Features } from './pages/Features';
import { Categories } from './pages/Categories';
import { Profile } from './pages/Profile';

// Main Layout Wrapper
const MainLayout: React.FC = () => {
  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors duration-200">
      <Sidebar />
      <div className="flex-1 flex flex-col md:ml-64 transition-all duration-300">
        <MobileHeader />
        <main className="flex-1">
          <Outlet />
        </main>
        <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 py-8 text-center text-sm text-gray-500 dark:text-gray-400 transition-colors">
          <p>© {new Date().getFullYear()} TechPulse. Built with Gemini.</p>
        </footer>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <ThemeProvider>
        <Router>
          <Routes>
            {/* Public Routes inside Layout */}
            <Route path="/" element={<MainLayout />}>
              <Route index element={<Home />} />
              <Route path="categories" element={<Categories />} />
              <Route path="post/:id" element={<SinglePost />} />
              <Route path="features" element={<Features />} />
              <Route path="profile" element={<Profile />} />
            </Route>

            {/* Auth Routes (Standalone) */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Admin Routes */}
            <Route path="/admin" element={<AdminLayout />}>
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="posts" element={<PostList />} />
              <Route path="posts/new" element={<CreatePost />} />
              <Route path="posts/edit/:id" element={<CreatePost />} />
              <Route path="users" element={<UserList />} />
            </Route>
          </Routes>
        </Router>
      </ThemeProvider>
    </AuthProvider>
  );
};

export default App;