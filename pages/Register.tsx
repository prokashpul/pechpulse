import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Lock, Zap, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const Register: React.FC = () => {
  const { loginWithGoogle } = useAuth();
  const navigate = useNavigate();

  const handleGoogleSignup = () => {
     loginWithGoogle();
     navigate('/');
  };

  return (
    <div className="min-h-screen flex bg-white font-sans">
       {/* Left Side - Visual (Different image than login) */}
       <div className="hidden lg:flex lg:w-1/2 relative bg-purple-900 overflow-hidden items-center justify-center">
          <img 
            src="https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=2670&auto=format&fit=crop" 
            alt="Register Background" 
            className="absolute inset-0 w-full h-full object-cover opacity-50 mix-blend-overlay"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-purple-600/90 to-indigo-800/90" />
          
          <div className="relative z-10 max-w-lg px-12 text-center text-white">
             <div className="mb-8 flex justify-center">
               <div className="bg-white/20 p-4 rounded-2xl backdrop-blur-sm">
                 <Zap className="w-12 h-12 text-white" />
               </div>
             </div>
             <h2 className="text-4xl font-bold mb-6 leading-tight">Join the Community</h2>
             <p className="text-lg text-purple-100 leading-relaxed font-light">
               Create an account today to start sharing your stories and exploring the world of technology.
             </p>
          </div>
       </div>

       {/* Right Side - Form */}
       <div className="w-full lg:w-1/2 flex items-center justify-center p-8 lg:p-12 bg-white">
          <div className="w-full max-w-md space-y-8">
             <div className="text-center lg:text-left">
                <Link to="/" className="inline-flex items-center space-x-2 lg:hidden mb-8">
                   <div className="bg-indigo-600 p-1.5 rounded-lg">
                      <Zap className="text-white w-5 h-5" />
                   </div>
                   <span className="text-lg font-bold text-gray-800">TechPulse</span>
                </Link>
                <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Create Account</h1>
                <p className="mt-2 text-gray-500">Get started with your free account.</p>
             </div>

             <form className="space-y-5">
                <div>
                   <label className="block text-sm font-medium text-gray-700 mb-1.5">Full Name</label>
                   <div className="relative group">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 transition group-focus-within:text-purple-600" />
                      <input type="text" placeholder="John Doe" className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition bg-gray-50 focus:bg-white" />
                   </div>
                </div>

                <div>
                   <label className="block text-sm font-medium text-gray-700 mb-1.5">Email Address</label>
                   <div className="relative group">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 transition group-focus-within:text-purple-600" />
                      <input type="email" placeholder="name@example.com" className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition bg-gray-50 focus:bg-white" />
                   </div>
                </div>

                <div>
                   <label className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
                   <div className="relative group">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 transition group-focus-within:text-purple-600" />
                      <input type="password" placeholder="Create a password" className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition bg-gray-50 focus:bg-white" />
                   </div>
                </div>

                <div className="flex items-start">
                   <div className="flex items-center h-5">
                     <input id="terms" type="checkbox" className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded" />
                   </div>
                   <div className="ml-3 text-sm">
                     <label htmlFor="terms" className="font-medium text-gray-700">I agree to the <a href="#" className="text-purple-600 hover:underline">Terms of Service</a> and <a href="#" className="text-purple-600 hover:underline">Privacy Policy</a></label>
                   </div>
                </div>

                <button type="button" className="w-full bg-gray-900 text-white py-3.5 rounded-xl font-bold text-sm hover:bg-gray-800 transition shadow-lg flex items-center justify-center group">
                   Create Account
                   <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </button>
             </form>
             
             {/* Divider */}
             <div className="relative">
                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-200"></div></div>
                <div className="relative flex justify-center text-sm"><span className="px-2 bg-white text-gray-500">Or sign up with</span></div>
             </div>

             {/* Social Login */}
             <button 
               onClick={handleGoogleSignup}
               className="w-full border border-gray-300 bg-white text-gray-700 py-3 rounded-xl font-medium hover:bg-gray-50 transition flex items-center justify-center space-x-2"
             >
                <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-5 h-5" alt="Google" />
                <span>Sign up with Google</span>
             </button>

             <p className="text-center text-sm text-gray-600">
                Already have an account? <Link to="/login" className="font-semibold text-purple-600 hover:text-purple-800 hover:underline">Sign In</Link>
             </p>
          </div>
       </div>
    </div>
  );
};