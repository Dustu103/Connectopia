import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Login.css'; // Ensure this file has the updated CSS
import toast from 'react-hot-toast';
import { setUser } from '../../Redux/User/userSlice';
import { useDispatch } from 'react-redux';


function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };
      const { data } = await axios.post(`${process.env.REACT_APP_BACKEND}/user/login`, { email, password }, config);
      localStorage.setItem("userInfo", JSON.stringify(data));
      // console.log(data);
      toast.success(data.message);
      dispatch(setUser(data));
      navigate("/chat");
      
    } catch (err) {
      console.log(err)
      toast.error(err.response?.data?.message || "Error in Login");
    }
  };

  return (
    <div className="relative h-screen w-screen overflow-hidden flex items-center justify-center">
      {/* Background Animation */}
      <div className="background-animation"></div>
      <div className="circular-gradient"></div>

      {/* Glassmorphism Form Container */}
      <div className="relative z-10 bg-white bg-opacity-10 backdrop-blur-2xl rounded-lg shadow-lg p-8 w-full max-w-lg lg:w-1/2 md:w-2/3 border border-opacity-30 border-gray-300">
        <h1 className="text-2xl font-bold text-gray-100 mb-6">Sign in to your account</h1>
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-200">
              Your email
            </label>
            <input
              type="email"
              name="email"
              id="email"
              className="bg-[#020b1a] bg-opacity-50 border border-gray-600 text-gray-200 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              placeholder="name@company.com"
              required
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-200">
              Password
            </label>
            <input
              type="password"
              name="password"
              id="password"
              className="bg-[#020b1a] bg-opacity-50 border border-gray-600 text-gray-200 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              placeholder="••••••••"
              required
              onChange={(e) => setPassword(e.target.value)}
            />
            <p className='text-white w-full text-right mr-3'>
              <Link to="/forgetpassword">Forget Password?</Link>
            </p>
          </div>
          <button
            type="submit"
            className="w-full text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
          >
            Sign in
          </button>
          <p className="text-sm text-gray-400">
            Don't have an account yet?{" "}
            <Link to="/register" className="font-medium text-blue-500 hover:underline">
              Sign up
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Login;
