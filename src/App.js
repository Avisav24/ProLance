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
import VerifyEmailNotice from "./components/Auth/VerifyEmailNotice";
import EmailVerified from "./components/Auth/EmailVerified";
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
    loop: 0,
  });

  const bowls = [
    "Startups and Entrepreneurship",
    "Designers",
    "The Worklife Bowl",
    "Career Pivot",
    "Job Referrals",
    "Tech",
  ];

  const suggestedBowls = [
    {
      name: "Job Hunting in Tech",
      members: "7M",
      desc: "A community to discuss applying for jobs and interview prep.",
    },
    {
      name: "Career Advice for Students",
      members: "3M",
      desc: "Ask questions and get advice from professionals.",
    },
    {
      name: "MBA Applicants",
      members: "137K",
      desc: "All things MBA admissions, essays, and profiles.",
    },
  ];

  return (
    <div className="min-h-screen bg-[#f4f5f7]">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-[260px_minmax(0,1fr)_320px] gap-6">
          <motion.aside
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
            className="space-y-4"
          >
            <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm">
              <p className="text-sm text-gray-500">Post anonymously as</p>
              <p className="font-semibold text-gray-900">Product Designer</p>
              <button className="mt-4 px-4 py-2 rounded-full bg-gray-900 text-white text-sm font-semibold hover:bg-black transition-colors">
                Create post +
              </button>
            </div>

            <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-3">My Spaces</h3>
              <ul className="space-y-2 text-sm text-gray-700">
                {bowls.map((bowl) => (
                  <li key={bowl} className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                    {bowl}
                  </li>
                ))}
              </ul>
              <button className="mt-4 px-3 py-2 rounded-lg border border-gray-300 text-sm font-medium hover:bg-gray-50 transition-colors">
                Explore Spaces
              </button>
            </div>
          </motion.aside>

          <section className="space-y-4">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.05 }}
              className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm"
            >
              <div className="w-full rounded-xl bg-gray-100 px-4 py-3 text-gray-400 mb-3">
                Search for discussions
              </div>
              <div className="rounded-xl border border-gray-200 px-4 py-3 text-gray-500">
                Post as "Student"
              </div>
            </motion.div>

            <motion.article
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.12 }}
              className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="font-semibold text-gray-900">The Worklife Space</h4>
                  <p className="text-sm text-gray-500">Community Manager</p>
                </div>
                <span className="text-xs text-gray-400">3d</span>
              </div>

              <p className="mt-3 text-gray-800 font-medium">
                Early in your career, what impacted your quality of life the most?
              </p>

              <div className="mt-4 rounded-xl border border-gray-200 overflow-hidden text-sm font-medium text-gray-700">
                {["Housing affordability", "Job/growth opportunities", "Work-life balance", "Other (comment)"].map((item) => (
                  <button
                    key={item}
                    className="w-full text-left px-4 py-3 border-b border-gray-200 last:border-b-0 hover:bg-gray-50 transition-colors"
                  >
                    {item}
                  </button>
                ))}
              </div>

              <div className="mt-4 flex items-center gap-5 text-sm text-gray-500">
                <span>Like</span>
                <span>58 comments</span>
                <span>2 shares</span>
              </div>
            </motion.article>

            <motion.article
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.18 }}
              className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm"
            >
              <h4 className="font-semibold text-gray-900">Built for outcomes, not just tasks</h4>
              <p className="mt-2 text-gray-600 leading-relaxed">
                ProLance helps you ship full assignments and project work with
                clear milestones in {text}
                <Cursor cursorColor="#374151" />
              </p>
              <div className="mt-4 rounded-xl overflow-hidden border border-gray-200">
                <video className="w-full" autoPlay muted loop playsInline>
                  <source src={video} type="video/mp4" />
                </video>
              </div>
              <div className="mt-4 flex flex-wrap gap-3">
                <Link
                  to="/signup"
                  className="px-4 py-2 rounded-lg bg-gray-900 text-white text-sm font-semibold hover:bg-black transition-colors"
                >
                  Start project
                </Link>
                <Link
                  to="/login"
                  className="px-4 py-2 rounded-lg border border-gray-300 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Sign in
                </Link>
              </div>
            </motion.article>
          </section>

          <motion.aside
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.08 }}
            className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm h-max"
          >
            <h3 className="text-xl font-bold text-gray-900">Spaces for you</h3>
            <p className="text-sm text-emerald-700 font-semibold mt-1">Explore all spaces</p>
            <div className="mt-4 space-y-3">
              {suggestedBowls.map((space) => (
                <div key={space.name} className="border border-gray-200 rounded-xl p-3">
                  <p className="font-semibold text-gray-900">{space.name}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{space.members}</p>
                  <p className="text-sm text-gray-600 mt-1">{space.desc}</p>
                  <div className="mt-3 flex gap-2">
                    <button className="px-3 py-1.5 text-sm rounded-lg border border-gray-300 hover:bg-gray-50">
                      View
                    </button>
                    <button className="px-3 py-1.5 text-sm rounded-lg bg-gray-900 text-white hover:bg-black">
                      Join
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </motion.aside>
        </div>
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

              {/* Email Verification Notice */}
              <Route
                path="/verify-email-notice"
                element={<VerifyEmailNotice />}
              />
              {/* Email Verified Callback */}
              <Route path="/verify-email" element={<EmailVerified />} />

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
