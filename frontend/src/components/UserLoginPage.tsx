import React, { useState } from "react";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    // call backend login endpoint
    axios.post('http://localhost:8080/api/auth/login', {
      email,
      password
    }).then(res => {
      // success — redirect to admin panel
      // optionally store user info
      try {
        localStorage.setItem('user', JSON.stringify(res.data));
        localStorage.setItem('isAdmin', 'false');
      } catch (e) {}

        navigate('/chat', {replace: true});
    }).catch(err => {
      console.error('login error', err);
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else if (err.response && err.response.statusText) {
        setError(err.response.statusText);
      } else {
        setError('Login failed. Check credentials.');
      }
    });
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#800000] p-7">

      <div className="flex flex-col items-center mb-8">
        <img
          src="/wildcare.jpg"   
          alt="WildCare Logo"
          className="w-[240px] h-[240px]  object-contain"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.style.display = "none";
          }}
        />
      </div>

      <div className="bg-white w-full max-w-md rounded-xl shadow-lg p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email */}
          <div>
            <label className="text-gray-900 font-medium block">Email</label>
            <input
              type="email"
              placeholder="Enter Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:outline-none"
            />
          </div>

          {/* Password */}
          <div>
            <label className="text-gray-900 font-medium block">Password</label>
            <input
              type="password"
              placeholder="Enter Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:outline-none"
            />
          </div>

          {/* Button */}
          <button
            type="submit"
            className="w-full bg-gray-900 text-white py-3 rounded-lg font-medium hover:bg-gray-800 transition"
          >
            Sign In
          </button>
        </form>

        {error && (
          <div className="mt-4 text-center text-red-700">{error}</div>
        )}
        {/* Extra Links */}
        <div className="mt-6 text-center space-y-2">

          <button
            type="button"
            onClick={() => alert("Forgot password feature coming soon.")}
            className="block w-full text-gray-900 underline hover:text-red-700 transition"
          >
            Forgot password?
          </button>

          <p className="text-gray-700 text-sm">
            Don't have an account?
          </p>

          <button
            type="button"
            onClick={() => navigate("/register")}
            className="text-red-700 font-medium hover:underline"
          >
            Register here
          </button>

        </div>
      </div>
    </div>
  );
};

export default LoginPage;
