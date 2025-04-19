import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios"; // Using basic axios
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useDispatch } from "react-redux";
import { setToken, setUser } from "../slices/authSlice.js";
import Cookies from "universal-cookie";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const cookies = new Cookies();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
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
      toast.error("Email and password are required");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      const { email, password } = formData;

      try {
        const response = await axios.post("http://localhost:8000/api/user/login", { email, password });
        const data = response.data;

        if (data.success) 
          {
          toast.success("Login successful!");
          cookies.set("token", data.token, { path: "/" });
          cookies.set("user", data.user, { path: "/" });
          localStorage.setItem("token", data.token);
          localStorage.setItem("user", JSON.stringify(data.user));

          dispatch(setToken(data.token));
          dispatch(setUser(data.user));
          navigate("/home");
        } 
        else {  toast.error(data.message || "Login failed");  }
      } 
      catch (error) {
        toast.error(
          error.response?.data?.message || "An error occurred. Please try again."
        );
      }
    }
  };

  return (
    <div className="pt-16">
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-black transition-colors duration-300">
        <ToastContainer />
        <div className="w-full max-w-md p-8 space-y-6 bg-white dark:bg-gray-900 shadow-2xl rounded-2xl border border-gray-200 dark:border-gray-800 transition-all">
          <h2 className="text-3xl font-extrabold text-center text-gray-800 dark:text-white">
            Welcome Back 👋
          </h2>

          <form className="space-y-5" onSubmit={handleSubmit}>
            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1"
              >
                Email Address
              </label>
              <input
                id="email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                placeholder=""
                required
              />
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1"
              >
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                  placeholder=""
                  required
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute inset-y-0 right-3 flex items-center text-gray-500 dark:text-gray-400"
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition duration-300"
            >
              Login
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center justify-center">
            <span className="text-xs text-gray-400 dark:text-gray-600">OR</span>
          </div>

          {/* Alumni Login */}
          <button
            onClick={() => navigate("/company/login")}
            className="w-full py-2 px-4 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg transition duration-300"
          >
            Alumni Login
          </button>

          {/* Signup Prompt */}
          <p className="text-sm text-center text-gray-600 dark:text-gray-400">
            Don't have an account?{" "}
            <button
              onClick={() => navigate("/signup")}
              className="text-blue-500 hover:underline font-medium"
            >
              Sign up here
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
