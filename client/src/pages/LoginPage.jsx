import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import person from '../assets/images/login2.jpeg';
import Button from '../Components/BlueButton';
import Cookies from 'universal-cookie';
import { toast } from 'react-toastify';

const LoginPage = () => {
  const navigate = useNavigate();
  const cookies = new Cookies();

  const handleCreateAccountClick = () => {
    navigate('/signup');
  };

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword); 
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    if (!formData.email || !formData.password) {
      toast.error('Email and password are required');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      const { email, password } = formData;

      try {
        const response = await fetch('http://localhost:8000/user/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email, password }),
        });

        const data = await response.json();
        if (data.success) {
          toast.success('Login successful!');
          // console.log(data.user);
          cookies.set('token', data.token);
          cookies.set('user', data.user);
          // console.log(cookies.get('token'));
          // console.log(cookies.get('user'));
          navigate('/');
        } 
        else {
          toast.error(data.message || 'Login failed');
        }
      } catch (error) {
        toast.error('An error occurred. Please try again.');
        console.log(error.message);
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-100">
      <div className="bg-white shadow-lg rounded-lg flex">
        
        {/* left side */}
        <div className="p-8 w-full md:w-[500px]">
          <h2 className="text-4xl font-semibold mb-2">Sign In</h2>
          <p className="text-gray-600 mb-6">Unlock your world.</p>

          <form onSubmit={handleSubmit}>

            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-1">  Email <span className="text-red-500 ml-1">*</span> </label>
              <input  type="email"  name="email"  value={formData.email}  onChange={handleChange}  placeholder="Enter your email"  className="w-full border border-gray-300 rounded-lg p-2 focus:ring focus:ring-blue-300"  />
            </div>

  

    <div className="mb-4">
      <label className="block text-gray-700 font-medium mb-1">    Password <span className="text-red-500 ml-1">*</span>  </label>
      <div className="relative">
      <input   type={showPassword ? "text" : "password"}  value={formData.password}  name="password"  onChange={handleChange}  placeholder="Enter your password"  className="w-full border border-gray-300 rounded-lg p-2 focus:ring focus:ring-blue-300"/>

        <span  className="absolute inset-y-0 right-3 flex items-center cursor-pointer"  onClick={togglePasswordVisibility}  >
          {showPassword ? (
            <svg  className="w-5 h-5 text-gray-400"  xmlns="http://www.w3.org/2000/svg"  fill="none"  viewBox="0 0 24 24"  stroke="currentColor"  >
              {/* Icon for "show password" */}
              <path  strokeLinecap="round"  strokeLinejoin="round"  strokeWidth="2"  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"  />
              <path  strokeLinecap="round"  strokeLinejoin="round"  strokeWidth="2"  d="M2.458 12C3.732 7.943 7.522 5 12 5c4.478 0 8.268 2.943 9.542 7-.274.982-.69 1.898-1.23 2.708M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
            </svg>
          ) : (
            <svg  className="w-5 h-5 text-gray-400"  xmlns="http://www.w3.org/2000/svg"  fill="none"  viewBox="0 0 24 24"  stroke="currentColor"   >
              {/* Icon for "hide password" */}
              <path  strokeLinecap="round"  strokeLinejoin="round"  strokeWidth="2"  d="M13.875 18.825A8.96 8.96 0 0112 19C7.522 19 3.732 16.057 2.458 12a8.959 8.959 0 013.293-4.708M8.465 8.465A4.978 4.978 0 0112 7c1.355 0 2.591.528 3.535 1.465M15.535 15.535A4.978 4.978 0 0112 17c-1.355 0-2.591-.528-3.535-1.465" />
              <path  strokeLinecap="round"  strokeLinejoin="round"  strokeWidth="2"  d="M3 3l18 18"  />
            </svg>
          )}
        </span>
      </div>
    </div>

            <Button label="Sign In" type="submit" />

          </form>

          <div className="mt-4 text-center">  <Button label="Create an account" onClick={handleCreateAccountClick} className="w-auto text-blue-500 hover:underline" />  </div>
        </div>

            {/* Right Side */}
        <div className="hidden md:flex items-center justify-center bg-blue-50 p-6 rounded-l-lg">
          <img src={person} alt="Person with laptop" className="h-80" />
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
