import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { getAuth, sendEmailVerification } from "firebase/auth";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  User,
  Phone,
  GraduationCap,
  AlertCircle,
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

  // Detect Brave browser
  const isBrave = navigator.brave && navigator.brave.isBrave();

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

      const userCredential = await signup(
        formData.email,
        formData.password,
        userData
      );

      // Try to send verification email, but don't fail if rate limited
      try {
        const auth = getAuth();
        if (auth.currentUser) {
          await sendEmailVerification(auth.currentUser, {
            url: window.location.origin + "/verify-email",
          });
          toast.success(
            "A verification email has been sent. Please verify your email before signing in."
          );
        }
      } catch (emailError) {
        console.error("Email verification error:", emailError);
        if (emailError.code === "auth/too-many-requests") {
          // Still succeed with signup, just inform about email
          toast.success(
            "Account created successfully! The verification email will be sent shortly due to high traffic."
          );
        } else {
          // For other email errors, still succeed but inform user
          toast.success(
            "Account created! Please check your email for verification or request a new one from your profile."
          );
        }
      }

      navigate("/verify-email-notice");
    } catch (error) {
      console.error("Signup error:", error);
      if (error.code === "auth/too-many-requests") {
        toast.error(
          "Too many signup attempts. Please wait a few minutes and try again."
        );
      } else if (error.code === "auth/email-already-in-use") {
        toast.error("This email is already in use. Please sign in instead.");
      } else {
        toast.error(error.message || "Failed to create account");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-brand-gradient py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Brave Browser Warning */}
        {isBrave && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
            <div className="flex items-start">
              <AlertCircle className="h-5 w-5 text-yellow-600 mr-2 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-yellow-800">
                <p className="font-medium">Using Brave Browser?</p>
                <p className="mt-1">
                  Brave's shields may block signup. Please disable shields for
                  this site or use Chrome/Firefox.
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl p-8 sm:p-10 border border-white/20">
          <div>
            <div className="flex justify-center mb-6 group">
              <div className="relative">
                <div className="absolute -inset-2 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full blur-lg opacity-30 group-hover:opacity-50 transition-opacity duration-300"></div>
                <img
                  src="/gradely-removebg.png"
                  alt="Gradely Logo"
                  className="relative h-24 w-24 object-contain transform transition-transform duration-300 group-hover:scale-110"
                />
              </div>
            </div>
            <h2 className="mt-6 text-center text-3xl sm:text-4xl font-extrabold text-gray-900">
              Create your account
            </h2>
            <p className="mt-3 text-center text-base sm:text-lg text-gray-600">
              Join Gradely and get your college projects completed
              professionally
            </p>
          </div>

          <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
            <div className="space-y-4">
              {/* Name */}
              <div>
                <div className="mt-1 relative">
                  <div className="absolute inset-y-0 right-5 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400 transition-colors duration-300" />
                  </div>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    autoComplete="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="peer block w-full appearance-none border-2 border-gray-200 bg-gray-50 px-5 pr-12 pt-6 pb-3 text-base text-gray-900 placeholder-transparent transition-all duration-300 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-100 rounded-2xl"
                    placeholder=""
                  />
                  <label
                    htmlFor="name"
                    className="absolute left-5 top-2 text-xs font-medium text-blue-600 transition-all duration-300 peer-placeholder-shown:top-4.5 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 peer-focus:top-2 peer-focus:text-xs peer-focus:text-blue-600"
                  >
                    Full Name
                  </label>
                </div>
              </div>

              {/* Email */}
              <div>
                <div className="mt-1 relative">
                  <div className="absolute inset-y-0 right-5 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400 transition-colors duration-300" />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="peer block w-full appearance-none rounded-2xl border-2 border-gray-200 bg-gray-50 px-5 pr-12 pt-6 pb-3 text-base text-gray-900 placeholder-transparent transition-all duration-300 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-100"
                    placeholder="Enter your email"
                  />
                  <label
                    htmlFor="email"
                    className="absolute left-5 top-2 text-xs font-medium text-blue-600 transition-all duration-300 peer-placeholder-shown:top-4.5 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 peer-focus:top-2 peer-focus:text-xs peer-focus:text-blue-600"
                  >
                    Email address
                  </label>
                </div>
              </div>

              {/* Phone */}
              <div>
                <div className="mt-1 relative">
                  <div className="absolute inset-y-0 right-5 flex items-center pointer-events-none">
                    <Phone className="h-5 w-5 text-gray-400 transition-colors duration-300" />
                  </div>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    autoComplete="tel"
                    value={formData.phone}
                    onChange={handleChange}
                    className="peer block w-full appearance-none rounded-2xl border-2 border-gray-200 bg-gray-50 px-5 pr-12 pt-6 pb-3 text-base text-gray-900 placeholder-transparent transition-all duration-300 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-100"
                    placeholder=""
                  />
                  <label
                    htmlFor="phone"
                    className="absolute left-5 top-2 text-xs font-medium text-blue-600 transition-all duration-300 peer-placeholder-shown:top-4.5 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 peer-focus:top-2 peer-focus:text-xs peer-focus:text-blue-600"
                  >
                    Phone Number
                  </label>
                </div>
              </div>

              {/* College */}
              <div>
                <div className="mt-1 relative">
                  <div className="absolute inset-y-0 right-5 flex items-center pointer-events-none">
                    <University className="h-5 w-5 text-gray-400 transition-colors duration-300" />
                  </div>
                  <input
                    id="college"
                    name="college"
                    type="text"
                    value={formData.college}
                    onChange={handleChange}
                    className="peer block w-full appearance-none rounded-2xl border-2 border-gray-200 bg-gray-50 px-5 pr-12 pt-6 pb-3 text-base text-gray-900 placeholder-transparent transition-all duration-300 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-100"
                    placeholder=""
                  />
                  <label
                    htmlFor="college"
                    className="absolute left-5 top-2 text-xs font-medium text-blue-600 transition-all duration-300 peer-placeholder-shown:top-4.5 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 peer-focus:top-2 peer-focus:text-xs peer-focus:text-blue-600"
                  >
                    College/University
                  </label>
                </div>
              </div>

              {/* Course */}
              <div>
                <div className="mt-1 relative">
                  <div className="absolute inset-y-0 right-5 flex items-center pointer-events-none">
                    <GraduationCap className="h-5 w-5 text-gray-400 transition-colors duration-300" />
                  </div>
                  <input
                    id="course"
                    name="course"
                    type="text"
                    value={formData.course}
                    onChange={handleChange}
                    className="peer block w-full appearance-none rounded-2xl border-2 border-gray-200 bg-gray-50 px-5 pr-12 pt-6 pb-3 text-base text-gray-900 placeholder-transparent transition-all duration-300 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-100"
                    placeholder="e.g., Computer Science, Engineering"
                  />
                  <label
                    htmlFor="course"
                    className="absolute left-5 top-2 text-xs font-medium text-blue-600 transition-all duration-300 peer-placeholder-shown:top-4.5 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 peer-focus:top-2 peer-focus:text-xs peer-focus:text-blue-600"
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
                  className="absolute left-5 -top-2 text-xs font-medium text-blue-600 bg-white px-2 z-10 rounded-full"
                >
                  Year of Study
                </label>

                {/* Select Box */}
                <select
                  id="year"
                  name="year"
                  value={formData.year}
                  onChange={handleChange}
                  className="w-full px-5 pt-6 pb-3 border-2 border-gray-200 rounded-2xl text-base bg-gray-50 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 focus:bg-white appearance-none cursor-pointer"
                >
                  <option value="">Select year</option>
                  <option value="1st Year">1st Year</option>
                  <option value="2nd Year">2nd Year</option>
                  <option value="3rd Year">3rd Year</option>
                  <option value="4th Year">4th Year</option>
                </select>

                {/* Custom dropdown arrow icon */}
                <div className="pointer-events-none absolute right-5 top-1/2 transform -translate-y-1/2 text-gray-400">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
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
                {/* Input Wrapper */}
                <div className="relative">
                  {/* Left Icon */}
                  <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400 transition-colors duration-300" />
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
                    className="peer w-full appearance-none rounded-2xl border-2 border-gray-200 bg-gray-50 py-4 pl-12 pr-12 text-base text-gray-900 placeholder-transparent transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 focus:bg-white"
                  />
                  <label
                    htmlFor="password"
                    className="absolute left-12 top-1 text-xs font-medium text-blue-600 transition-all duration-300
                     peer-placeholder-shown:top-4
                     peer-placeholder-shown:text-base 
                     peer-placeholder-shown:text-gray-500 
                     peer-focus:top-1 
                     peer-focus:text-xs 
                     peer-focus:text-blue-600"
                  >
                    Password
                  </label>
                  {/* Toggle Visibility Button */}
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-5 flex items-center text-gray-400 hover:text-gray-600 transition-colors duration-200"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>

              <div className="relative w-full mt-4">
                {/* Input Wrapper */}
                <div className="relative">
                  {/* Left Icon */}
                  <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400 transition-colors duration-300" />
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
                    className="peer w-full appearance-none rounded-2xl border-2 border-gray-200 bg-gray-50 py-4 pl-12 pr-12 text-base text-gray-900 placeholder-transparent transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 focus:bg-white"
                  />
                  <label
                    htmlFor="confirmPassword"
                    className="absolute left-12 top-1 text-xs font-medium text-blue-600 transition-all duration-300 
                     peer-placeholder-shown:top-4 
                     peer-placeholder-shown:text-base 
                     peer-placeholder-shown:text-gray-500 
                     peer-focus:top-1
                     peer-focus:text-xs 
                     peer-focus:text-blue-600"
                  >
                    Confirm Password
                  </label>

                  {/* Toggle Visibility Button */}
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 pr-5 flex items-center text-gray-400 hover:text-gray-600 transition-colors duration-200"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="group relative w-full flex justify-center py-4 px-6 text-base font-semibold text-white rounded-2xl transition-all duration-300 transform hover:scale-[1.02] hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none overflow-hidden"
                style={{
                  background: loading
                    ? "#E5E7EB"
                    : "linear-gradient(135deg, #2563EB, #3B82F6)",
                }}
              >
                <span className="relative z-10">
                  {loading ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2"></div>
                      <span>Creating Account...</span>
                    </div>
                  ) : (
                    "Create Account"
                  )}
                </span>
                {!loading && (
                  <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    style={{
                      background: "linear-gradient(135deg, #1D4ED8, #2563EB)",
                    }}
                  ></div>
                )}
              </button>
            </div>

            <div className="text-center pt-4">
              <p className="text-base text-gray-600">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="font-semibold text-blue-600 hover:text-blue-700 transition-colors duration-200"
                >
                  Sign in to Gradely
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Signup;
