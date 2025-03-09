import React, { useState } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import person from '../assets/images/man.jpeg';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const SignupPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({  fullName: '',  username: '',  email: '',  password: '',  confirmPassword: '',  dob: '',  verificationCode: '' });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showVerificationInput, setShowVerificationInput] = useState(false);
  const [isCodeSent, setIsCodeSent] = useState(false);
  const [errors, setErrors] = useState({});
  const [verificationCode, setVerificationCode] = useState(null);
  const [isVerified, setIsVerified] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSendCode = () => {
    const email = formData.email;

    // Check if email ends with @mnnit.ac.in
    if (email.endsWith('@mnnit.ac.in')) {
      const code = Math.floor(1000 + Math.random() * 9000);
      setVerificationCode(code);

      axios.post('http://localhost:8000/send/verification-code', { email, code })
        .then((response) => {
          toast.success('Verification code sent to your email');
          setShowVerificationInput(true);
          setIsCodeSent(true);
        })
        .catch((error) => {
          toast.error('Error sending verification code');
        });
    } else {
      setErrors({ email: 'Email must end with @mnnit.ac.in' });
    }
  };


  const validateForm = () => {
    const newErrors = {};
    const { fullName, username, email, password, confirmPassword, dob } = formData;
  
    if (!fullName) {
      newErrors.fullName = 'Full Name is required';
      toast.error('Full Name is required');
    }
    if (!username) {
      newErrors.username = 'Username is required';
      toast.error('Username is required');
    }
    if (!email) {
      newErrors.email = 'Email is required';
      toast.error('Email is required');
    }
    if (!password) {
      newErrors.password = 'Password is required';
      toast.error('Password is required');
    }
    if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
      toast.error('Passwords do not match');
    }
    if (!dob || new Date().getFullYear() - new Date(dob).getFullYear() < 16) {
      newErrors.dob = 'You must be at least 16 years old to create an account';
      toast.error('You must be at least 16 years old to create an account');
    }
  
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm() && isVerified) {
      const { fullName, dob, email, username, password } = formData;
      const userData = { name: fullName, dob, email, username, password };
      console.log(userData);

      try {
        const response = await axios.post(' http://localhost:8000/user/signup', userData);
        if (response.data.success) 
        {
          toast.success('Signup successful');
          navigate("/login");
        } 
        else {
          setErrors({ general: response.data.message || 'Signup failed' });
        }
      } 
      catch (error) 
      {
        setErrors({ general: 'An error occurred. Please try again.' });
      }
    } 
    else if (!isVerified) {
      toast.error('Please verify your email');
    }
  };

  const handleVerifyCode = () => {
    if (formData.verificationCode == verificationCode) {
      toast.success('Email verified successfully');
      setIsVerified(true);
    }
     else {
      toast.error('Invalid verification code');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-100">
      <div className="bg-white shadow-lg rounded-lg flex">

        {/* left side */}
        <div className="hidden md:block md:w-2/3">
          <img src={person} alt="Sign Up" className="h-full object-cover rounded-r-lg" />
        </div>

        {/* right side */}
        <div className="p-8 w-full md:w-1/3">
          <h2 className="text-4xl font-semibold mb-2">Sign Up</h2>
          <p className="text-gray-600 mb-6">Create your account.</p>
          <form onSubmit={handleSubmit}>

            {/* Full Name */}
            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-1"> Full Name <span className="text-red-500 ml-1">*</span> </label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                className={`w-full px-4 py-2 mt-1 bg-gray-100 border ${errors.fullName ? 'border-red-500' : 'border-gray-300'} rounded-md focus:ring-2 focus:ring-blue-500`}
                placeholder="Enter your full name"
              />
              {errors.fullName && <p className="mt-1 text-sm text-red-500">{errors.fullName}</p>}
            </div>

            {/* Username */}
            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-1"> Username <span className="text-red-500 ml-1">*</span> </label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className={`w-full px-4 py-2 mt-1 bg-gray-100 border ${errors.username ? 'border-red-500' : 'border-gray-300'} rounded-md focus:ring-2 focus:ring-blue-500`}
                placeholder="Enter a username"
              />
              {errors.username && <p className="mt-1 text-sm text-red-500">{errors.username}</p>}
            </div>

            {/* Date of Birth */}
            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-1"> Date of Birth <span className="text-red-500 ml-1">*</span></label>
              <input
                name="dob"
                value={formData.dob}
                type="date"
                onChange={handleChange}
                className={`w-full px-4 py-2 mt-1 bg-gray-100 border ${errors.dob ? 'border-red-500' : 'border-gray-300'} rounded-md focus:ring-2 focus:ring-blue-500`}
              />
              {errors.dob && <p className="mt-1 text-sm text-red-500">{errors.dob}</p>}
            </div>

            {/* Email */}
            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-1"> Email <span className="text-red-500 ml-1">*</span> </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`w-full px-4 py-2 mt-1 bg-gray-100 border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded-md focus:ring-2 focus:ring-blue-500`}
                placeholder="Enter your email"
              />
              {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email}</p>}

              {!isVerified && !isCodeSent && (
                <button
                  type="button"
                  onClick={handleSendCode}
                  className="w-full px-4 py-2 mt-2 text-white bg-blue-500 rounded-md hover:bg-blue-600"
                >
                  Send Verification Code
                </button>
              )}
            </div>

            {/* Verification Code */}
            {showVerificationInput && (
              <div className="mb-4">
                <label className="block text-gray-700 font-medium mb-1"> Verification Code </label>
                <input
                  type="text"
                  name="verificationCode"
                  value={formData.verificationCode}
                  onChange={handleChange}
                  className="w-full px-4 py-2 mt-1 bg-gray-100 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter the verification code"
                />
                <button
                  type="button"
                  onClick={handleVerifyCode}
                  className="w-full px-4 py-2 mt-2 text-white bg-blue-500 rounded-md hover:bg-blue-600"
                >
                  Verify Code
                </button>
              </div>
            )}

            {/* Password */}
            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-1"> Password <span className="text-red-500 ml-1">*</span> </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 mt-1 bg-gray-100 border ${errors.password ? 'border-red-500' : 'border-gray-300'} rounded-md focus:ring-2 focus:ring-blue-500`}
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-4 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
              {errors.password && <p className="mt-1 text-sm text-red-500">{errors.password}</p>}
            </div>

            {/* Confirm Password */}
            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-1"> Confirm Password <span className="text-red-500 ml-1">*</span> </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 mt-1 bg-gray-100 border ${errors.confirmPassword ? 'border-red-500' : 'border-gray-300'} rounded-md focus:ring-2 focus:ring-blue-500`}
                  placeholder="Confirm your password"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-4 flex items-center"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
              {errors.confirmPassword && <p className="mt-1 text-sm text-red-500">{errors.confirmPassword}</p>}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full px-4 py-2 text-white bg-green-500 rounded-md hover:bg-green-600"
            >
              Sign Up
            </button>

            {errors.general && <p className="mt-4 text-sm text-red-500">{errors.general}</p>}
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
