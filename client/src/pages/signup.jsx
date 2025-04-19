
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../config/axios.js";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import axios from "axios";
import { toast } from "react-toastify";

const Signup = () => {
  const navigate = useNavigate();
 
  const [formData, setFormData] = useState({  fullName: "", username: "", email: "", password: "", confirmPassword: "", dob: "", verificationCode: "", program: "", batch: "", branch: ""  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showVerificationInput, setShowVerificationInput] = useState(false);
  const [isCodeSent, setIsCodeSent] = useState(false);
  const [verificationCode, setVerificationCode] = useState(null);
  const [isVerified, setIsVerified] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSendCode = () => {
    const email = formData.email;
    if (email.endsWith("@mnnit.ac.in")) {
      const code = Math.floor(1000 + Math.random() * 9000);
      setVerificationCode(code);
      axios
        .post("http://localhost:8000/api/send/verification-code", { email, code })
        .then(() => {
          toast.success("Verification code sent!");
          setShowVerificationInput(true);
          setIsCodeSent(true);
        })
        .catch(() => toast.error("Failed to send verification code"));
    } else {
      setErrors({ email: "Use @mnnit.ac.in email" });
      toast.error("Use @mnnit.ac.in email");
    }
  };

  const validateForm = () => {
    const { fullName, username, email, password, confirmPassword, dob } = formData;
    const newErrors = {};

    if (!fullName) {
      newErrors.fullName = "Full Name is required";
      toast.error("Full Name required");
    }
    if (!username) {
      newErrors.username = "Username is required";
      toast.error("Username required");
    }
    if (!email) {
      newErrors.email = "Email is required";
      toast.error("Email required");
    }
    if (!password) {
      newErrors.password = "Password is required";
      toast.error("Password required");
    }
    if (password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
      toast.error("Passwords do not match");
    }
    if (!dob || new Date().getFullYear() - new Date(dob).getFullYear() < 16) {
      newErrors.dob = "You must be at least 16 years old to create an account";
      toast.error("You must be at least 16");
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      if (!isVerified) {
        toast.error("Please verify your email before signing up.");
        return;
      }

      // const { fullName, dob, email, username, password } = formData;
      // const userData = {  name: fullName,  dob,  email,  username,  password,  };
      const { fullName, dob, email, username, password, program, batch, branch } = formData;

const userData = {  name: fullName,  dob,  email,  username,  password,  program,  batch,  branch};


      try {
        const response = await axiosInstance.post("/user/signup", userData);
        if (response.data.success) {
          toast.success("Signup successful!");
          navigate("/login");
        } else {  setErrors({ general: response.data.message || "Signup failed" });  }
      } 
      catch (error) { setErrors({ general: "An error occurred. Please try again." }); }
    }
  };

  const handleVerifyCode = () => {
    if (formData.verificationCode === verificationCode?.toString()) {
      toast.success("Email verified!");
      setIsVerified(true);
    }
     else { toast.error("Incorrect verification code.");  }
  };

  return (
    <div className="pt-16">
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-black">
        <div className="w-full max-w-md p-8 space-y-6 bg-white dark:bg-gray-800 shadow-lg rounded-lg">
          <h2 className="text-2xl font-bold text-center text-gray-800 dark:text-white">    Create an Account  </h2>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <InputField   label="Full Name"   type="text"   name="fullName"   value={formData.fullName}   onChange={handleChange}   error={errors.fullName} />

            <InputField   label="Username"   type="text"   name="username"   value={formData.username}   onChange={handleChange}   error={errors.username} />

            <InputField   label="Date of Birth"   type="date"   name="dob"   value={formData.dob}   onChange={handleChange}   error={errors.dob} />
            {/* Program Dropdown */}
<div>
  <label className="block text-sm font-medium text-gray-700 dark:text-white">Program</label>
  <select
    name="program"
    value={formData.program || ""}
    onChange={handleChange}
    className="w-full px-4 py-2 mt-1 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
  >
    <option value="">Select Program</option>
    <option value="MCA">MCA</option>
    <option value="MBA">MBA</option>
    <option value="M.Sc">M.Sc</option>
    <option value="B.Tech">B.Tech</option>
  </select>
</div>

{/* Batch Dropdown */}
<div>
  <label className="block text-sm font-medium text-gray-700 dark:text-white">Batch</label>
  <select
    name="batch"
    value={formData.batch || ""}
    onChange={handleChange}
    className="w-full px-4 py-2 mt-1 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
  >
    <option value="">Select Batch</option>
    {Array.from({ length: 28 }, (_, i) => 2027 - i).map((year) => (
      <option key={year} value={year}>Batch {year}</option>
    ))}
  </select>
</div>

{/* Branch Dropdown */}
<div>
  <label className="block text-sm font-medium text-gray-700 dark:text-white">Branch</label>
  <select
    name="branch"
    value={formData.branch || ""}
    onChange={handleChange}
    className="w-full px-4 py-2 mt-1 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
  >
    <option value="">Select Branch</option>
    <option value="Computer Science">Computer Science</option>
    <option value="Electrical">Electrical</option>
    <option value="Mechanical">Mechanical</option>
    <option value="Civil">Civil</option>
    <option value="Electronics">Electronics</option>
    <option value="Chemical">Chemical</option>
    <option value="MCA">MCA</option>
    <option value="MBA">MBA</option>
    <option value="M.Sc">M.Sc</option>
  </select>
</div>


            <InputField   label="Email"   type="email"   name="email"   value={formData.email}   onChange={handleChange}   error={errors.email} />
            

            {/* Send verification code button */}
            {!isCodeSent && (    <button    type="button"    onClick={handleSendCode}    className="w-full px-4 py-2 text-white bg-green-500 rounded-md hover:bg-green-600"  >    Send Verification Code  </button>  )}

            {/* Verification input */}
            {showVerificationInput && !isVerified && (
              <div>
                <InputField   label="Verification Code"   type="text"   name="verificationCode"   value={formData.verificationCode}   onChange={handleChange} />
                <button   type="button"   onClick={handleVerifyCode}   className="w-full mt-2 px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600" >   Verify Code </button>
              </div>
            )}


            <PasswordField   label="Password"   name="password"   value={formData.password}   onChange={handleChange}   showPassword={showPassword}   setShowPassword={setShowPassword}   error={errors.password} />

            <PasswordField   label="Confirm Password"   name="confirmPassword"   value={formData.confirmPassword}   onChange={handleChange}   showPassword={showConfirmPassword}   setShowPassword={setShowConfirmPassword}   error={errors.confirmPassword} />

            <button    type="submit"    className="w-full px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600"  >    Sign Up  </button>

            {errors.general && (    <p className="mt-1 text-sm text-red-500">{errors.general}</p>  )}
          </form>
        </div>
      </div>
    </div>
  );
};

/* Input Field Component */
const InputField = ({ label, type, name, value, onChange, error }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 dark:text-white">   {label} </label>
    <input  type={type}  name={name}  value={value}  onChange={onChange}  className={`w-full px-4 py-2 mt-1 bg-gray-100 dark:bg-gray-700 border ${    error ? "border-red-500" : "border-gray-300 dark:border-gray-600"  } rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none`}  placeholder={`Enter your ${label.toLowerCase()}`}/>
    {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
  </div>
);

/* Password Field Component */
const PasswordField = ({  label,  name,  value,  onChange,  showPassword,  setShowPassword,  error,}) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 dark:text-white">   {label} </label>
    <div className="relative">
      <input  type={showPassword ? "text" : "password"}  name={name}  value={value}  onChange={onChange}  className={`w-full px-4 py-2 mt-1 bg-gray-100 dark:bg-gray-700 border ${    error ? "border-red-500" : "border-gray-300 dark:border-gray-600"  } rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none`}  placeholder={`Enter your ${label.toLowerCase()}`}  />
      <button    type="button"    onClick={() => setShowPassword(!showPassword)}    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-300"  >    {showPassword ? <FaEyeSlash /> : <FaEye />}  </button>
    </div>
    {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
  </div>
);

export default Signup;

