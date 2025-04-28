import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      alert("Login attempt with: " + email);
    }, 1500);
  };

  return (
    <div className="flex bg-white w-full h-screen justify-center items-center p-4">
      <div className="bg-white flex flex-col shadow-xl w-full max-w-lg rounded-2xl overflow-hidden">
        <div className="bg-black p-6">
          <h1 className="font-bold text-2xl text-white text-center">Welcome Back</h1>
          <p className="text-blue-100 text-center mt-2">Sign in to your account</p>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="space-y-2">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email Address</label>
            <input 
              id="email"
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full h-12 px-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              placeholder="your@email.com"
              required
            />
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
              <a href="#" className="text-sm text-black hover:opacity-75 transition-colors">Forgot password?</a>
            </div>
            <input 
              id="password"
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full h-12 px-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              placeholder="••••••••"
              required
            />
          </div>
          
          <div>
            <button 
              type="submit"
              disabled={isLoading}
              className={`w-full py-3 px-4 bg-black hover:opacity-75 text-white font-medium rounded-lg shadow transition-colors ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {isLoading ? 'Signing in...' : 'Sign In'}
            </button>
          </div>
          
          <div className="text-center mt-4">
            <p className="text-sm text-gray-600">
              Don't have an account? <a className="text-black hover:opacity-75 hover:cursor-pointer font-medium" onClick={()=>navigate("/signup")}>Sign up</a>
            </p>
          </div>
        </form>
        
        
      </div>
    </div>
  );
};

export default Login;