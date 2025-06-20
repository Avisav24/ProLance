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
import {useTypewriter , Cursor } from 'react-simple-typewriter'
import { motion } from 'framer-motion';
import video from '../src/home.mp4'
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
    words: ['Web Development', 'App Development', 'College Projects'],
    loop: true,
  });
  return (
    
   <div className="min-h-screen bg-brand-gradient">
      <Navbar />
<section className="min-h-screen bg-brand-gradient text-black flex flex-col md:flex-row items-center justify-between px-10 py-12 gap-10">
  {/* Left: Text content */}
  <div className="max-w-2xl">
    <motion.h1
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1 }}
      className="text-4xl md:text-5xl font-extrabold leading-tight mb-6"
    >
      Say Goodbye to Project Stress. Hello, <span className="text-blue-700">Gradely</span>
    </motion.h1>

    <p className="text-lg md:text-xl mb-2">
      Your one-stop solution. We specialize in{" "}
      <span className="text-blue-800 font-semibold">
        {text}
      </span>
      <Cursor />
    </p>
  </div>

  {/* Right: Video */}
  <div className="w-full md:w-1/2">
    <video
      className="w-full rounded-xl shadow-lg"
      autoPlay
      muted
      loop
      playsInline
    >
      <source src={video} type="video/mp4" />
      Your browser does not support the video tag.
    </video>
  </div>
</section>


     <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Get Your College Projects
            <span className="text-blue-600"> Done Right</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Gradely connects you with professional developers to complete your
            college projects on time and with exceptional quality. Submit your
            requirements and get high-quality work delivered before your
            deadline.
          </p>
          <section className="bg-white py-20 px-6">
  <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10 text-center">
  {/* Feature Card 1 */}
  <div className="shadow-lg rounded-xl p-6">
    <div>
      <i class="fa-solid fa-gears text-5xl mb-4"></i>
    </div>

    <h3 className="text-xl font-bold mb-2">Web Development</h3>
    <p className="text-gray-600">Build responsive and modern websites with our expert team.</p>
  </div>
  {/* Feature Card 2 */}

  <div className="shadow-lg rounded-xl p-6">
    <div>
      <i class="fa-solid fa-rocket text-5xl mb-4"></i>
    </div>
    <h3 className="text-xl font-bold mb-2">App Development</h3>
    <p className="text-gray-600">iOS and Android apps tailored to your business needs.</p>
  </div>
  {/* Feature Card 3 */}
  <div className="shadow-lg rounded-xl p-6">
    <div>
      <i class="fa-solid fa-diagram-project text-5xl mb-4"></i>
    </div>
    <h3 className="text-xl font-bold mb-2">College Projects</h3>
    <p className="text-gray-600">End-to-end support for academic projects with quality assurance.</p>
  </div>

</div>


          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-12">
            <Link to="/signup" className="btn-primary bg-blue-500 text-lg px-8 py-3">
              Get Started with Gradely
            </Link>
            <Link to="/login" className="btn-outline text-lg px-8 py-3 hover:bg-blue-400 hover:text-white">
           Sign Up
            </Link>
          </div>
          </section>
        </div>

        {/* Features */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="bg-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 shadow-lg">
              <svg
                className="w-8 h-8 text-blue-500"
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
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Quality Guaranteed
            </h3>
            <p className="text-gray-600">
              Professional work delivered by experienced developers
            </p>
          </div>
          <div className="text-center">
            <div className="bg-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 shadow-lg">
              <svg
                className="w-8 h-8 text-blue-600"
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
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              On-Time Delivery
            </h3>
            <p className="text-gray-600">
              Meet your deadlines with our reliable delivery system
            </p>
          </div>
          <div className="text-center">
            <div className="bg-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 shadow-lg">
              <svg
                className="w-8 h-8 text-blue-600"
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
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              24/7 Support
            </h3>
            <p className="text-gray-600">
              Get help anytime with our dedicated support team
            </p>
          </div>
        </div>

        {/* How it works */}
        <div className="mt-20">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            How Gradely Works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="bg-blue-600 text-white rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                1
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Submit Project
              </h3>
              <p className="text-gray-600">
                Fill out our detailed project form with your requirements
              </p>
            </div>
            <div className="text-center">
              <div className="bg-blue-600 text-white rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                2
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Get Quote
              </h3>
              <p className="text-gray-600">
                Receive a fair price quote within 24 hours
              </p>
            </div>
            <div className="text-center">
              <div className="bg-blue-600 text-white rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                3
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Track Progress
              </h3>
              <p className="text-gray-600">
                Monitor your project progress in real-time
              </p>
            </div>
            <div className="text-center">
              <div className="bg-blue-600 text-white rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                4
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Receive Delivery
              </h3>
              <p className="text-gray-600">
                Get your completed project before deadline
              </p>
            </div>
          </div>
        </div>
      </div>
       <Footer/>
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
