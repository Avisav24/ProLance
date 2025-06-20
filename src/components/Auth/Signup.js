import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  User,
  Phone,
  GraduationCap,
} from "lucide-react";

import toast from "react-hot-toast";
import { ReactComponent as University } from "./university.svg";

const Signup = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    college: "",
    course: "",
    year: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = () => {
    if (
      !formData.name ||
      !formData.email ||
      !formData.password ||
      !formData.confirmPassword
    ) {
      toast.error("Please fill in all required fields");
      return false;
    }

    if (formData.password.length < 6) {
      toast.error("Password must be at least 6 characters long");
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error("Please enter a valid email address");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const userData = {
        name: formData.name,
        phone: formData.phone,
        college: formData.college,
        course: formData.course,
        year: formData.year,
      };

      await signup(formData.email, formData.password, userData);
      toast.success(
        "Welcome to Gradely! Your account has been created successfully."
      );
      navigate("/dashboard");
    } catch (error) {
      console.error("Signup error:", error);
      toast.error(error.message || "Failed to create account");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-brand-gradient py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <div className="flex justify-center">
            <div className="flex items-center space-x-2">
              <GraduationCap className="h-12 w-12 text-blue-600" />
              <span className="text-3xl font-bold text-gray-900">Gradely</span>
            </div>
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Create your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Join Gradely and get your college projects completed professionally
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            {/* Name */}
            <div>
              <div className="mt-1 relative">
                <div className="absolute inset-y-8 right-5 mb-5 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="peer block w-full appearance-none  border border-black bg-white px-3 pt-5 pb-2 text-sm text-black placeholder-transparent focus:border-blue-600 focus:outline-none focus:ring-2 rounded-full"
                  placeholder=""
                />
                <label
                  htmlFor="name"
                  className="absolute left-8 top-0.5 text-sm text-blue-600 transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-base peer-placeholder-shown:text-black peer-focus:top-0.5 peer-focus:text-sm peer-focus:text-blue-600"
                >
                  Full Name
                </label>
              </div>
            </div>

            {/* Email */}
            <div>
              <div className="mt-1 relative">
                <div className="absolute inset-y-8 right-5 mb-5  flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="peer block w-full appearance-none rounded-full border border-black bg-white px-3 pt-5 pb-2 text-sm text-black placeholder-transparent focus:border-blue-600 focus:outline-none focus:ring-2"
                  placeholder="Enter your email"
                />
                <label
                  htmlFor="email"
                  className="absolute left-8 top-0.5 text-sm text-blue-600 transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-base peer-placeholder-shown:text-black peer-focus:top-0.5 peer-focus:text-sm peer-focus:text-blue-600"
                >
                  Email address
                </label>
              </div>
            </div>

            {/* Phone */}
            <div>
              <div className="mt-1 relative">
                <div className="absolute inset-y-8 right-5 mb-5  flex items-center pointer-events-none">
                  <Phone className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  autoComplete="tel"
                  value={formData.phone}
                  onChange={handleChange}
                  className="peer block w-full appearance-none rounded-full border border-black bg-white px-3 pt-5 pb-2 text-sm text-black placeholder-transparent focus:border-blue-600 focus:outline-none focus:ring-2"
                  placeholder=""
                />
                <label
                  htmlFor="phone"
                  className="absolute left-8 top-0.5 text-sm text-blue-600 transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-base peer-placeholder-shown:text-black peer-focus:top-0.5 peer-focus:text-sm peer-focus:text-blue-600"
                >
                  Phone Number
                </label>
              </div>
            </div>

            {/* College */}
            <div>
              <div className="mt-1 relative">
                <div className="absolute inset-y-8 right-5 mb-5  flex items-center pointer-events-none">
                  <University className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="college"
                  name="college"
                  type="text"
                  value={formData.college}
                  onChange={handleChange}
                  className="peer block w-full appearance-none rounded-full border border-black bg-white px-3 pt-5 pb-2 text-sm text-black placeholder-transparent focus:border-blue-600 focus:outline-none focus:ring-2"
                  placeholder=""
                />
                <label
                  htmlFor="phone"
                  className="absolute left-8 top-0.5 text-sm text-blue-600 transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-base peer-placeholder-shown:text-black peer-focus:top-0.5 peer-focus:text-sm peer-focus:text-blue-600"
                >
                  College/University
                </label>
              </div>
            </div>

            {/* Course */}
            <div>
              <div className="mt-1 relative">
                <div className="absolute inset-y-8 right-5 mb-5  flex items-center pointer-events-none">
                  <GraduationCap className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="course"
                  name="course"
                  type="text"
                  value={formData.course}
                  onChange={handleChange}
                  className=" peer block w-full appearance-none rounded-full border border-black bg-white px-3 pt-5 pb-2 text-sm text-black placeholder-transparent focus:border-blue-600 focus:outline-none focus:ring-2"
                  placeholder="e.g., Computer Science, Engineering"
                />
                <label
                  htmlFor="phone"
                  className="absolute left-8 top-0.5 text-sm text-blue-600 transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-base peer-placeholder-shown:text-black peer-focus:top-0.5 peer-focus:text-sm peer-focus:text-blue-600"
                >
                  Course/Program
                </label>
              </div>
            </div>

            {/* Year */}
            <div className="relative w-full mt-4">
              {/* Floating Label */}
              <label
                htmlFor="year"
                className="absolute left-3 -top-0 text-sm text-blue-600 bg-white px-1 z-10 rounded-full"
              >
                Year of Study
              </label>

              {/* Select Box */}
              <select
                id="year"
                name="year"
                value={formData.year}
                onChange={handleChange}
                className="w-full px-3 pt-5 pb-2 border border-gray-300 rounded-full text-base focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
              >
                <option value="">Select year</option>
                <option value="1st Year">1st Year</option>
                <option value="2nd Year">2nd Year</option>
                <option value="3rd Year">3rd Year</option>
                <option value="4th Year">4th Year</option>
              </select>

              {/* Custom dropdown arrow icon */}
              <div className="pointer-events-none absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
            </div>
            {/* Password */}
            <div className="relative w-full mt-4">
              {/* Floating Label */}

              {/* Input Wrapper */}
              <div className="relative">
                {/* Left Icon */}
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="h-4 w-4 text-gray-400" />
                </div>

                {/* Input Field */}
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Password"
                  className="peer w-full appearance-none rounded-full border border-gray-300 bg-white py-3 pl-10 pr-10 text-sm text-black placeholder-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <label
                  htmlFor="password"
                  className="absolute left-10 top-0 text-sm text-gray-500 transition-all 
               peer-placeholder-shown:top-2
               peer-placeholder-shown:text-base 
               peer-placeholder-shown:text-black 
               peer-focus:top-0 
               peer-focus:text-sm 
               peer-focus:text-blue-600"
                >
                  Password
                </label>
                {/* Toggle Visibility Button */}
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>
            </div>

            <div className="relative w-full mt-4">
              {/* Floating Label */}

              {/* Input Wrapper */}
              <div className="relative">
                {/* Left Icon */}
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="h-4 w-4 text-gray-400" />
                </div>

                {/* Input Field */}
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  autoComplete="new-password"
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm Password"
                  className="peer w-full appearance-none rounded-full border border-gray-300 bg-white py-3 pl-10 pr-10 text-sm text-black placeholder-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <label
                  htmlFor="confirmPassword"
                  className="absolute left-10 top-0 text-sm text-gray-500 transition-all 
               peer-placeholder-shown:top-2 
               peer-placeholder-shown:text-base 
               peer-placeholder-shown:text-black 
               peer-focus:top-0
               peer-focus:text-sm 
               peer-focus:text-blue-600"
                >
                  Confirm Password
                </label>

                {/* Toggle Visibility Button */}
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>
            </div>
          </div>
          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              ) : (
                "Create Account"
              )}
            </button>
          </div>

          <div className="text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{" "}
              <Link
                to="/login"
                className="font-medium text-blue-500 hover:text-primary-500"
              >
                Sign in to Gradely
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Signup;
