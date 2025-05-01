import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Register } from "../auth/authSlice";

const Signup = () => {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch(); 

  const handleSubmit = async(e) => {
    e.preventDefault();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isEmailValid = emailRegex.test(email);
    const isPasswordStrong = password.length >= 8;
    const isUsernameValid = username.length >= 3;
        if (!isEmailValid) {
          toast.error("Please enter a valid email address.");
          return;
        }
        else if (!isPasswordStrong) {
          toast.error("Password must be at least 8 characters long.");
          return;
        }
        else if (!isUsernameValid) {
          toast.error("Password must be at least 8 characters long.");
          return;
        }
        else{
          await dispatch(Register({"email":email, "username":username, "password":password}))
        }
  };

  return (
    <div className="flex bg-white w-full h-screen justify-center items-center p-4">
      <div className="bg-white flex flex-col shadow-xl w-full max-w-lg rounded-2xl overflow-hidden">
        <div className="bg-black p-6">
          <h1 className="font-bold text-2xl text-white text-center">Create Account</h1>
          <p className="text-blue-100 text-center mt-2">Sign up to get started</p>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="space-y-2">
            <label htmlFor="username" className="block text-sm font-medium text-gray-700">Username</label>
            <input 
              id="username"
              type="text" 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full h-12 px-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              placeholder="yourname"
              required
            />
          </div>
          
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
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
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
              {isLoading ? 'Creating account...' : 'Sign Up'}
            </button>
          </div>
          
          <div className="text-center mt-4">
            <p className="text-sm text-gray-600">
              Already have an account? <a className="text-black hover:opacity-75 hover:cursor-pointer font-medium" onClick={()=>navigate("/login")}>Sign in</a>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Signup;