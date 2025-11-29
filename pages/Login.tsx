import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Lock, Mail, ArrowRight, Zap, AlertCircle } from 'lucide-react';

export const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, loginWithGoogle } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (login(email, password)) {
      // Check if admin to redirect to dashboard
      if (email === 'prokashpul2@gmail.com') {
         navigate('/admin/dashboard');
      } else {
         navigate('/');
      }
    } else {
      setError('Invalid credentials. Please try again.');
    }
  };

  const handleGoogleLogin = () => {
     loginWithGoogle();
     navigate('/');
  };

  return (
    <div className="min-h-screen flex bg-white font-sans">
       {/* Left Side - Visual/Marketing */}
       <div className="hidden lg:flex lg:w-1/2 relative bg-indigo-900 overflow-hidden items-center justify-center">
          {/* Background Image */}
          <img 
            src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop" 
            alt="Login Background" 
            className="absolute inset-0 w-full h-full object-cover opacity-50 mix-blend-overlay"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/90 to-purple-800/90" />
          
          {/* Content */}
          <div className="relative z-10 max-w-lg px-12 text-center text-white">
             <div className="mb-8 flex justify-center">
               <div className="bg-white/20 p-4 rounded-2xl backdrop-blur-sm">
                 <Zap className="w-12 h-12 text-white" />
               </div>
             </div>
             <h2 className="text-4xl font-bold mb-6 leading-tight">Unlock the Power of AI Blogging</h2>
             <p className="text-lg text-indigo-100 leading-relaxed font-light">
               Manage your content, generate ideas with Gemini, and engage your audience—all in one intelligent platform.
             </p>
             
             {/* Decorative Elements */}
             <div className="absolute -bottom-40 -left-40 w-80 h-80 border border-white/10 rounded-full" />
             <div className="absolute -top-40 -right-40 w-80 h-80 border border-white/10 rounded-full" />
          </div>
       </div>

       {/* Right Side - Form */}
       <div className="w-full lg:w-1/2 flex items-center justify-center p-8 lg:p-12 bg-white">
          <div className="w-full max-w-md space-y-8">
             {/* Header */}
             <div className="text-center lg:text-left">
                <Link to="/" className="inline-flex items-center space-x-2 lg:hidden mb-8">
                   <div className="bg-indigo-600 p-1.5 rounded-lg">
                      <Zap className="text-white w-5 h-5" />
                   </div>
                   <span className="text-lg font-bold text-gray-800">TechPulse</span>
                </Link>
                <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Welcome Back</h1>
                <p className="mt-2 text-gray-500">Please enter your details to sign in.</p>
             </div>

             {/* Error Message */}
             {error && (
               <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r flex items-start">
                 <AlertCircle className="w-5 h-5 text-red-500 mr-2 flex-shrink-0 mt-0.5" />
                 <span className="text-sm text-red-700">{error}</span>
               </div>
             )}

             {/* Form */}
             <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                   <label className="block text-sm font-medium text-gray-700 mb-1.5">Email Address</label>
                   <div className="relative group">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 transition group-focus-within:text-indigo-600" />
                      <input 
                        type="email" 
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        placeholder="name@example.com"
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition bg-gray-50 focus:bg-white"
                        required 
                      />
                   </div>
                </div>

                <div>
                   <div className="flex items-center justify-between mb-1.5">
                      <label className="block text-sm font-medium text-gray-700">Password</label>
                      <a href="#" className="text-sm font-medium text-indigo-600 hover:text-indigo-800 hover:underline">Forgot password?</a>
                   </div>
                   <div className="relative group">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 transition group-focus-within:text-indigo-600" />
                      <input 
                        type="password" 
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition bg-gray-50 focus:bg-white"
                        required 
                      />
                   </div>
                </div>

                <div className="flex items-center">
                   <input 
                     id="remember-me" 
                     type="checkbox" 
                     className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded cursor-pointer" 
                   />
                   <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-600 cursor-pointer">Remember me for 30 days</label>
                </div>

                <button type="submit" className="w-full bg-indigo-600 text-white py-3.5 rounded-xl font-bold text-sm hover:bg-indigo-700 transition shadow-lg shadow-indigo-200 flex items-center justify-center group">
                   Sign In
                   <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </button>
             </form>

             {/* Divider */}
             <div className="relative">
                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-200"></div></div>
                <div className="relative flex justify-center text-sm"><span className="px-2 bg-white text-gray-500">Or continue with</span></div>
             </div>

             {/* Social Login */}
             <button 
               onClick={handleGoogleLogin}
               className="w-full border border-gray-300 bg-white text-gray-700 py-3 rounded-xl font-medium hover:bg-gray-50 transition flex items-center justify-center space-x-2"
             >
                <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-5 h-5" alt="Google" />
                <span>Sign in with Google</span>
             </button>

             {/* Footer */}
             <p className="text-center text-sm text-gray-600">
                Don't have an account? <Link to="/register" className="font-semibold text-indigo-600 hover:text-indigo-800 hover:underline">Create free account</Link>
             </p>

             {/* Hint for Demo */}
             <div className="mt-8 p-4 bg-gray-50 rounded-lg border border-gray-100 text-xs text-gray-500 text-center">
                <p className="font-semibold mb-1">Demo Credentials:</p>
                Admin: <span className="font-mono text-gray-700">prokashpul2@gmail.com</span> / <span className="font-mono text-gray-700">Proksh2</span><br/>
                User: <span className="font-mono text-gray-700">jane@example.com</span> / <span className="font-mono text-gray-700">password</span>
             </div>
          </div>
       </div>
    </div>
  );
};