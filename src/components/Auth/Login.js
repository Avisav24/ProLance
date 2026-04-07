import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { Mail, Lock, Eye, EyeOff, GraduationCap } from "lucide-react";
import toast from "react-hot-toast";
import { getAuth, signOut } from "firebase/auth";

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
      if (!user.emailVerified) {
        const auth = getAuth();
        await signOut(auth);
        toast.error("Please verify your email before signing in.");
        return;
      }
      toast.success("Welcome back to ProLance!");

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
          <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl p-8 sm:p-10 border border-white/20">
            <div>
              <div className="flex justify-center mb-6 group">
                <div className="relative">
                  <div className="absolute -inset-2 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full blur-lg opacity-30 group-hover:opacity-50 transition-opacity duration-300"></div>
                  <span className="relative inline-block text-4xl sm:text-5xl font-extrabold tracking-tight transform transition-transform duration-300 group-hover:scale-105">
                    <span className="text-blue-700">Pro</span>
                    <span className="text-pink-500">Lance</span>
                  </span>
                </div>
              </div>
              <h2 className="mt-6 text-center text-3xl sm:text-4xl font-extrabold text-gray-900">
                Welcome Back
              </h2>
              <p className="mt-3 text-center text-base sm:text-lg text-gray-600">
                Welcome back! Sign in to continue managing your projects
              </p>
            </div>

            <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
              <div className="space-y-5">
                <div className="relative group">
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder=" "
                    className="peer block w-full appearance-none rounded-2xl border-2 border-gray-200 bg-gray-50 px-5 pt-6 pb-3 text-base text-gray-900 placeholder-transparent transition-all duration-300 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-100"
                  />
                  <label
                    htmlFor="email"
                    className="absolute left-5 top-2 text-xs font-medium text-blue-600 transition-all duration-300 peer-placeholder-shown:top-4.5 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 peer-focus:top-2 peer-focus:text-xs peer-focus:text-blue-600"
                  >
                    Email Address
                  </label>
                </div>

                <div>
                  <div className="mt-1 relative group">
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      autoComplete="current-password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="peer block w-full appearance-none rounded-2xl border-2 border-gray-200 bg-gray-50 px-5 pt-6 pb-3 pr-12 text-base text-gray-900 placeholder-transparent transition-all duration-300 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-100"
                      placeholder=""
                    />
                    <label
                      htmlFor="password"
                      className="absolute left-5 top-2 text-xs font-medium text-blue-600 transition-all duration-300 peer-placeholder-shown:top-4.5 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 peer-focus:top-2 peer-focus:text-xs peer-focus:text-blue-600"
                    >
                      Password
                    </label>
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 transition-colors duration-200"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
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
                        <span>Signing in...</span>
                      </div>
                    ) : (
                      "Sign in"
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
                  Don't have an account?{" "}
                  <Link
                    to="/signup"
                    className="font-semibold text-blue-600 hover:text-blue-700 transition-colors duration-200"
                  >
                    Sign up for ProLance
                  </Link>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
