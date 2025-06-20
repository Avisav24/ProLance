import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { Mail, Lock, Eye, EyeOff, GraduationCap } from "lucide-react";
import toast from "react-hot-toast";


const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login, userProfile } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error("Please fill in all fields");
      return;
    }

    setLoading(true);
    try {
      const { user, profile } = await login(email, password);
      toast.success("Welcome back to Gradely!");

      // Redirect based on user role
      if (profile?.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/dashboard");
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error(error.message || "Failed to sign in");
    } finally {
      setLoading(false);
    }
  };

  return (
  <>
  
    <div className="min-h-screen flex items-center justify-center bg-brand-gradient py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <div className="flex justify-center">
            <div className="flex items-center space-x-2">
              <GraduationCap className="h-12 w-12 text-blue-500" />
              <span className="text-3xl font-bold text-gray-900">Gradely</span>
            </div>
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Welcome Back
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Welcome back! Sign in to continue managing your projects
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div className="relative">
  <input
    type="email"
    id="email"
    name="email"
    value={email}
    onChange={(e) => setEmail(e.target.value)}
    required
    placeholder=" "
    className="peer block w-full appearance-none rounded-full border border-black bg-white px-3 pt-5 pb-2 text-sm text-black placeholder-transparent focus:border-blue-600 focus:outline-none focus:ring-2"
  />
  <label
    htmlFor="email"
    className="absolute left-3 top-0.5 text-sm text-blue-600 transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-base peer-placeholder-shown:text-black peer-focus:top-0.5 peer-focus:text-sm peer-focus:text-blue-600"
  >
    Email Address

  </label>
</div>


            <div>
             
              <div className="mt-1 relative">
                <input
  id="password"
  name="password"
  type={showPassword ? "text" : "password"}
  autoComplete="current-password"
  required
  value={password}
  onChange={(e) => setPassword(e.target.value)}
  className="peer block w-full appearance-none rounded-full border border-black bg-white px-3 pt-5 pb-2 text-sm text-black placeholder-transparent focus:border-blue-600 focus:outline-none focus:ring-2"
  placeholder=""
/>
 <label
                htmlFor="password"
                className="absolute left-3 top-0.5 text-sm text-blue-600 transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-base peer-placeholder-shown:text-black peer-focus:top-0.5 peer-focus:text-sm peer-focus:text-blue-600"
              >
                Password
              </label>
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
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
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-500 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              ) : (
                "Sign in"
              )}
            </button>
          </div>

          <div className="text-center">
            <p className="text-sm text-gray-600">
              Don't have an account?{" "}
              <Link
                to="/signup"
                className="font-medium text-blue-500 hover:text-blue-800"
              >
                Sign up for Gradely
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
</>
  )
};

export default Login;
