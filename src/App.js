import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  Link,
} from "react-router-dom";

import { Toaster } from "react-hot-toast";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { NotificationProvider } from "./contexts/NotificationContext";
import Layout from "./components/Layout/Layout";
import Login from "./components/Auth/Login";
import Signup from "./components/Auth/Signup";
import ClientDashboard from "./components/Dashboard/ClientDashboard";
import NewProject from "./components/Projects/NewProject";
import MyProjects from "./components/Projects/MyProjects";
import AdminDashboard from "./components/Admin/AdminDashboard";
import AllProjects from "./components/Admin/AllProjects";
import Clients from "./components/Admin/Clients";
import Analytics from "./components/Admin/Analytics";
import AdminProjectDetail from "./components/Admin/AdminProjectDetail";
import ProjectDetail from "./components/Projects/ProjectDetail";
import Chat from "./components/Chat/Chat";
import Profile from "./components/Profile/Profile";
import Settings from "./components/Settings/Settings";
import Navbar from "./components/Navbar/Navbar";
import About from "./components/Pages/About";
import Reviews from "./components/Pages/Reviews";
import { useTypewriter, Cursor } from "react-simple-typewriter";
import { motion } from "framer-motion";
import video from "../src/home.mp4";
import Footer from "./components/Footer/Footer";
// Protected Route Component
const ProtectedRoute = ({ children, allowedRoles = ["client", "admin"] }) => {
  const { currentUser, userProfile, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(userProfile?.role)) {
    // Redirect based on user role
    if (userProfile?.role === "admin") {
      return <Navigate to="/admin" replace />;
    } else {
      return <Navigate to="/dashboard" replace />;
    }
  }

  return children;
};

// Public Route Component (redirects if already logged in)

const PublicRoute = ({ children }) => {
  const { currentUser, userProfile, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (currentUser) {
    // Redirect based on user role
    if (userProfile?.role === "admin") {
      return <Navigate to="/admin" replace />;
    } else {
      return <Navigate to="/dashboard" replace />;
    }
  }

  return children;
};

// Auth Route Component (accessible to everyone, no redirects)
const AuthRoute = ({ children }) => {
  return children;
};

// Landing Route Component (accessible to everyone, no redirects)
const LandingRoute = ({ children }) => {
  return children;
};

// Landing Page Component
const LandingPage = () => {
  const [text] = useTypewriter({
    words: ["Web Development", "Reports", "College Projects", "Assignments"],
    loop: true,
  });
  return (
    <div className="min-h-screen bg-brand-gradient">
      <Navbar />

      {/* Hero Section */}
      <section className="min-h-screen bg-brand-gradient flex items-center px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto w-full py-8 sm:py-12 lg:py-16">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-12">
            {/* Left: Text content */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="flex-1 w-full text-center lg:text-left"
            >
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-extrabold leading-tight mb-4 sm:mb-6">
                Say Goodbye to Project Stress. Hello,{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-blue-800 block sm:inline mt-2 sm:mt-0">
                  Gradely
                </span>
              </h1>

              <p className="text-lg sm:text-xl md:text-2xl mb-8 text-gray-700">
                Your one-stop solution. We specialize in
                <br />
                <span className="text-blue-700 font-bold bg-blue-50 px-2 py-1 rounded-lg inline-block mt-2">
                  {text}
                </span>
                <Cursor cursorColor="#2563EB" />
              </p>

              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start mt-6 sm:mt-8">
                <Link
                  to="/signup"
                  className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-xl sm:rounded-2xl transform transition-all duration-300 hover:scale-105 hover:shadow-xl shadow-lg text-center"
                >
                  Start Your Project
                </Link>
                <Link
                  to="/login"
                  className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 border-2 border-blue-600 text-blue-700 font-semibold rounded-xl sm:rounded-2xl transition-all duration-300 hover:bg-blue-50 hover:scale-105 text-center"
                >
                  Sign In
                </Link>
              </div>
            </motion.div>

            {/* Right: Video */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
              className="flex-1 w-full max-w-xl lg:max-w-none mt-8 lg:mt-0"
            >
              <div className="relative group">
                <div className="absolute -inset-2 sm:inset-4 bg-gradient-to-r from-blue-400 to-purple-400 rounded-xl sm:rounded-3xl blur-xl sm:blur-2xl opacity-20 group-hover:opacity-30 transition-opacity duration-500"></div>
                <video
                  className="relative w-full rounded-xl sm:rounded-2xl shadow-lg sm:shadow-2xl border border-white/20"
                  autoPlay
                  muted
                  loop
                  playsInline
                >
                  <source src={video} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Main Content Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
            Get Your College Projects
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
              {" "}
              Done Right
            </span>
          </h2>
          <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto">
            Gradely connects you with professional developers to complete your
            college projects on time and with exceptional quality. Submit your
            requirements and get high-quality work delivered before your
            deadline.
          </p>
        </motion.div>

        {/* Feature Cards */}
        <motion.section
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl p-8 sm:p-12 lg:p-20 mb-20"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
            {/* Feature Card 1 */}
            <motion.div
              whileHover={{ y: -10, scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
              className="bg-gradient-to-br from-white to-gray-50 shadow-xl rounded-2xl p-8 border border-gray-100 hover:border-blue-200 transition-all duration-300"
            >
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mb-6 mx-auto shadow-lg">
                <i className="fa-solid fa-gears text-white text-2xl"></i>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold mb-3 text-gray-900">
                Web Development
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Build responsive and modern websites with our expert team.
              </p>
            </motion.div>

            {/* Feature Card 2 */}
            <motion.div
              whileHover={{ y: -10, scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
              className="bg-gradient-to-br from-white to-gray-50 shadow-xl rounded-2xl p-8 border border-gray-100 hover:border-teal-200 transition-all duration-300"
            >
              <div className="w-16 h-16 bg-gradient-to-br from-teal-500 to-teal-600 rounded-2xl flex items-center justify-center mb-6 mx-auto shadow-lg">
                <i className="fa-solid fa-rocket text-white text-2xl"></i>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold mb-3 text-gray-900">
                Reports
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Project reports tailored to your needs.
              </p>
            </motion.div>

            {/* Feature Card 3 */}
            <motion.div
              whileHover={{ y: -10, scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
              className="bg-gradient-to-br from-white to-gray-50 shadow-xl rounded-2xl p-8 border border-gray-100 hover:border-purple-200 transition-all duration-300"
            >
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mb-6 mx-auto shadow-lg">
                <i className="fa-solid fa-diagram-project text-white text-2xl"></i>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold mb-3 text-gray-900">
                College Projects
              </h3>
              <p className="text-gray-600 leading-relaxed">
                End-to-end support for academic projects with quality assurance.
              </p>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="flex flex-col sm:flex-row gap-4 justify-center mt-12"
          >
            <Link
              to="/signup"
              className="px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-2xl transform transition-all duration-300 hover:scale-105 hover:shadow-xl shadow-lg text-center text-lg"
            >
              Get Started with Gradely
            </Link>
            <Link
              to="/login"
              className="px-8 py-4 bg-white border-2 border-gray-300 text-gray-700 font-semibold rounded-2xl transition-all duration-300 hover:border-blue-400 hover:bg-blue-50 hover:text-blue-700 hover:scale-105 text-center text-lg"
            >
              Sign Up
            </Link>
          </motion.div>
        </motion.section>

        {/* Features Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12 mb-20"
        >
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="text-center group"
          >
            <div className="bg-white rounded-3xl w-20 h-20 flex items-center justify-center mx-auto mb-6 shadow-xl group-hover:shadow-2xl transition-all duration-300">
              <svg
                className="w-10 h-10 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3">
              Quality Guaranteed
            </h3>
            <p className="text-gray-600 text-lg leading-relaxed">
              Professional work delivered by experienced developers
            </p>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.05 }}
            className="text-center group"
          >
            <div className="bg-white rounded-3xl w-20 h-20 flex items-center justify-center mx-auto mb-6 shadow-xl group-hover:shadow-2xl transition-all duration-300">
              <svg
                className="w-10 h-10 text-teal-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3">
              On-Time Delivery
            </h3>
            <p className="text-gray-600 text-lg leading-relaxed">
              Meet your deadlines with our reliable delivery system
            </p>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.05 }}
            className="text-center group"
          >
            <div className="bg-white rounded-3xl w-20 h-20 flex items-center justify-center mx-auto mb-6 shadow-xl group-hover:shadow-2xl transition-all duration-300">
              <svg
                className="w-10 h-10 text-purple-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z"
                />
              </svg>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3">
              24/7 Support
            </h3>
            <p className="text-gray-600 text-lg leading-relaxed">
              Get help anytime with our dedicated support team
            </p>
          </motion.div>
        </motion.div>

        {/* How it works */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl p-8 sm:p-12 lg:p-16"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-center text-gray-900 mb-12">
            How Gradely Works
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
            {[
              {
                num: "1",
                title: "Submit Project",
                desc: "Fill out our detailed project form with your requirements",
              },
              {
                num: "2",
                title: "Get Quote",
                desc: "Receive a fair price quote within 24 hours",
              },
              {
                num: "3",
                title: "Track Progress",
                desc: "Monitor your project progress in real-time",
              },
              {
                num: "4",
                title: "Receive Delivery",
                desc: "Get your completed project before deadline",
              },
            ].map((step, index) => (
              <motion.div
                key={step.num}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center group"
              >
                <div className="bg-gradient-to-br from-blue-600 to-blue-700 text-white rounded-2xl w-16 h-16 flex items-center justify-center mx-auto mb-6 text-2xl font-bold shadow-lg group-hover:scale-110 transition-transform duration-300">
                  {step.num}
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-3">
                  {step.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
      <Footer />
    </div>
  );
};

function App() {
  return (
    <Router
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true,
      }}
    >
      <AuthProvider>
        <NotificationProvider>
          <div className="App">
            <Toaster
              position="top-right"
              toastOptions={{
                duration: 4000,
                style: {
                  background: "#363636",
                  color: "#fff",
                },
                success: {
                  duration: 3000,
                  iconTheme: {
                    primary: "#22c55e",
                    secondary: "#fff",
                  },
                },
                error: {
                  duration: 4000,
                  iconTheme: {
                    primary: "#ef4444",
                    secondary: "#fff",
                  },
                },
              }}
            />

            <Routes>
              {/* Public Routes */}

              <Route
                path="/"
                element={
                  <LandingRoute>
                    <LandingPage />
                  </LandingRoute>
                }
              />
              <Route path="/about" element={<About />} />
              <Route path="/reviews" element={<Reviews />} />
              <Route
                path="/login"
                element={
                  <AuthRoute>
                    <Login />
                  </AuthRoute>
                }
              />
              <Route
                path="/signup"
                element={
                  <AuthRoute>
                    <Signup />
                  </AuthRoute>
                }
              />

              {/* Protected Client Routes */}
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute allowedRoles={["client"]}>
                    <Layout>
                      <ClientDashboard />
                    </Layout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/new-project"
                element={
                  <ProtectedRoute allowedRoles={["client"]}>
                    <Layout>
                      <NewProject />
                    </Layout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/my-projects"
                element={
                  <ProtectedRoute allowedRoles={["client"]}>
                    <Layout>
                      <MyProjects />
                    </Layout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/project/:id"
                element={
                  <ProtectedRoute allowedRoles={["client"]}>
                    <Layout>
                      <ProjectDetail />
                    </Layout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/chat/:projectId"
                element={
                  <ProtectedRoute allowedRoles={["client"]}>
                    <Layout>
                      <Chat />
                    </Layout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <Layout>
                      <Profile />
                    </Layout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/settings"
                element={
                  <ProtectedRoute>
                    <Layout>
                      <Settings />
                    </Layout>
                  </ProtectedRoute>
                }
              />

              {/* Protected Admin Routes */}
              <Route
                path="/admin"
                element={
                  <ProtectedRoute allowedRoles={["admin"]}>
                    <Layout>
                      <AdminDashboard />
                    </Layout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/projects"
                element={
                  <ProtectedRoute allowedRoles={["admin"]}>
                    <Layout>
                      <AllProjects />
                    </Layout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/clients"
                element={
                  <ProtectedRoute allowedRoles={["admin"]}>
                    <Layout>
                      <Clients />
                    </Layout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/analytics"
                element={
                  <ProtectedRoute allowedRoles={["admin"]}>
                    <Layout>
                      <Analytics />
                    </Layout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/project/:id"
                element={
                  <ProtectedRoute allowedRoles={["admin"]}>
                    <Layout>
                      <AdminProjectDetail />
                    </Layout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/chat/:projectId"
                element={
                  <ProtectedRoute allowedRoles={["admin"]}>
                    <Layout>
                      <Chat />
                    </Layout>
                  </ProtectedRoute>
                }
              />

              {/* Catch all route */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
        </NotificationProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
