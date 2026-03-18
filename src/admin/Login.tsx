import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Navigate, useNavigate } from 'react-router-dom';
import { Coffee, LogIn } from 'lucide-react';

const AdminLogin = () => {
  const { user, isAdmin, login, loading } = useAuth();
  const navigate = useNavigate();

  if (loading) return <div className="h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cafe-gold"></div></div>;
  if (user && isAdmin) return <Navigate to="/admin" />;

  const handleLogin = async () => {
    try {
      await login();
      navigate('/admin');
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 bg-cafe-cream">
      <div className="max-w-md w-full bg-white rounded-[3rem] p-12 shadow-2xl text-center border border-cafe-brown/5">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-cafe-brown text-cafe-gold mb-8 rotate-3">
          <Coffee className="h-10 w-10" />
        </div>
        <h1 className="text-3xl font-serif font-bold mb-4">Admin Portal</h1>
        <p className="text-cafe-dark/60 mb-10">Please sign in with your authorized Google account to access the dashboard.</p>
        
        {user && !isAdmin && (
          <div className="mb-8 p-4 bg-red-50 text-red-600 rounded-2xl text-sm font-medium">
            Access Denied. Your account does not have administrator privileges.
          </div>
        )}

        <button
          onClick={handleLogin}
          className="w-full bg-cafe-brown text-cafe-cream py-4 rounded-full font-bold flex items-center justify-center space-x-3 hover:bg-cafe-gold hover:text-cafe-dark transition-all shadow-lg group"
        >
          <LogIn className="h-5 w-5 transition-transform group-hover:translate-x-1" />
          <span>Sign in with Google</span>
        </button>
        
        <p className="mt-8 text-xs text-cafe-dark/40 uppercase tracking-widest">Authorized Personnel Only</p>
      </div>
    </div>
  );
};

export default AdminLogin;
