import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import {
  Plus,
  Clock,
  CheckCircle,
  AlertCircle,
  FileText,
  DollarSign,
  TrendingUp,
  Users,
} from "lucide-react";
import { collection, query, where, getDocs, limit } from "firebase/firestore";
import { db } from "../../firebase/config";
import toast from "react-hot-toast";

const ClientDashboard = () => {
  const { currentUser, userProfile } = useAuth();
  const [projects, setProjects] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    inProgress: 0,
    completed: 0,
    totalSpent: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProjects();
  }, [currentUser]);

  const fetchProjects = async () => {
    if (!currentUser) return;

    try {
      const projectsRef = collection(db, "projects");
      const q = query(
        projectsRef,
        where("clientId", "==", currentUser.uid),
        limit(10)
      );

      const querySnapshot = await getDocs(q);
      const projectsData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      // Sort by createdAt in JavaScript
      const sortedProjects = projectsData.sort((a, b) => {
        const dateA = a.createdAt?.toDate?.() || new Date(0);
        const dateB = b.createdAt?.toDate?.() || new Date(0);
        return dateB - dateA;
      });

      setProjects(sortedProjects.slice(0, 5)); // Take only first 5 for display

      // Calculate stats from all projects
      const statsData = {
        total: projectsData.length,
        pending: projectsData.filter((p) =>
          ["pending", "approved", "in-progress", "completed"].includes(p.status)
        ).length,
        inProgress: projectsData.filter((p) => p.status === "in-progress")
          .length,
        completed: projectsData.filter(
          (p) => p.status === "completed" || p.status === "delivered"
        ).length,
        totalSpent: projectsData.reduce(
          (sum, p) => sum + ((p.totalAmount || 0) + (p.deliveryExtra || 0)),
          0
        ),
      };

      setStats(statsData);
    } catch (error) {
      console.error("Error fetching projects:", error);
      toast.error("Failed to load projects");
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "pending":
        return <Clock className="h-4 w-4 text-amber-500" />;
      case "approved":
        return <CheckCircle className="h-4 w-4" style={{ color: "#03A6A1" }} />;
      case "in-progress":
        return <AlertCircle className="h-4 w-4 text-blue-500" />;
      case "completed":
        return <CheckCircle className="h-4 w-4" style={{ color: "#03A6A1" }} />;
      case "delivered":
        return <CheckCircle className="h-4 w-4" style={{ color: "#03A6A1" }} />;
      default:
        return <Clock className="h-4 w-4 text-gray-400" />;
    }
  };

  const getStatusBadge = (status) => {
    const statusClasses = {
      pending: "bg-amber-50 text-amber-700 ring-1 ring-amber-600/20",
      approved: "ring-1 ring-teal-600/20",
      "in-progress": "bg-blue-50 text-blue-700 ring-1 ring-blue-600/20",
      completed: "ring-1 ring-teal-600/20",
      delivered: "ring-1 ring-teal-600/20",
      rejected: "bg-red-50 text-red-700 ring-1 ring-red-600/20",
      cancelled: "bg-gray-50 text-gray-700 ring-1 ring-gray-600/20",
    };

    const tealStatuses = ["approved", "completed", "delivered"];
    const isTealStatus = tealStatuses.includes(status);

    return (
      <span
        className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${
          !isTealStatus
            ? statusClasses[status] || "bg-gray-50 text-gray-700"
            : statusClasses[status]
        }`}
        style={
          isTealStatus ? { backgroundColor: "#E6F7F6", color: "#03A6A1" } : {}
        }
      >
        {status.replace("-", " ")}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="relative">
          <div className="h-12 w-12 rounded-full border-t-2 border-b-2 border-blue-500 animate-spin"></div>
          <div
            className="absolute inset-0 h-12 w-12 rounded-full border-t-2 border-b-2 animate-spin"
            style={{
              borderColor: "#03A6A1",
              animationDirection: "reverse",
              animationDuration: "1.5s",
            }}
          ></div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="w-full px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {userProfile?.name || "Student"}! 👋
          </h1>
          <p className="text-gray-600 text-sm sm:text-base">
            Ready to get your next project completed? Let's make it happen.
          </p>
        </div>

        {/* Stats Cards - Now only 3 cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 max-w-6xl mx-auto">
          <div className="bg-white rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow duration-200 border border-gray-100">
            <div className="flex items-center justify-between mb-2">
              <div className="p-2 bg-blue-50 rounded-xl">
                <FileText className="h-5 w-5 text-blue-600" />
              </div>
              <span className="text-2xl font-bold text-gray-900">
                {stats.total}
              </span>
            </div>
            <p className="text-sm text-gray-600">Total Projects</p>
          </div>

          <div className="bg-white rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow duration-200 border border-gray-100">
            <div className="flex items-center justify-between mb-2">
              <div className="p-2 bg-amber-50 rounded-xl">
                <Clock className="h-5 w-5 text-amber-600" />
              </div>
              <span className="text-2xl font-bold text-gray-900">
                {stats.pending}
              </span>
            </div>
            <p className="text-sm text-gray-600">Pending</p>
          </div>

          <div className="bg-white rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow duration-200 border border-gray-100">
            <div className="flex items-center justify-between mb-2">
              <div
                className="p-2 rounded-xl"
                style={{ backgroundColor: "#E6F7F6" }}
              >
                <TrendingUp className="h-5 w-5" style={{ color: "#03A6A1" }} />
              </div>
              <span className="text-2xl font-bold text-gray-900">
                {stats.completed}
              </span>
            </div>
            <p className="text-sm text-gray-600">Completed</p>
          </div>
        </div>

        {/* Quick Actions & Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8 max-w-6xl mx-auto">
          {/* Quick Actions */}
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900">
                Quick Actions
              </h3>
            </div>
            <div className="p-6 space-y-3">
              <Link
                to="/new-project"
                className="w-full flex items-center justify-center px-4 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors duration-200 shadow-sm hover:shadow-md"
              >
                <Plus className="h-4 w-4 mr-2" />
                Submit New Project
              </Link>
              <Link
                to="/my-projects"
                className="w-full flex items-center justify-center px-4 py-3 bg-white border-2 text-gray-700 rounded-xl font-medium transition-all duration-200"
                style={{ borderColor: "#03A6A1", color: "#03A6A1" }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = "#E6F7F6";
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = "white";
                }}
              >
                <FileText className="h-4 w-4 mr-2" />
                View All Projects
              </Link>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900">
                Recent Activity
              </h3>
            </div>
            <div className="p-6">
              {projects.length > 0 ? (
                <div className="space-y-3">
                  {projects.slice(0, 3).map((project) => (
                    <div
                      key={project.id}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors duration-200"
                    >
                      <div className="flex items-center space-x-3 min-w-0 flex-1">
                        {getStatusIcon(project.status)}
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {project.title}
                          </p>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {project.categories &&
                            project.categories.length > 0 ? (
                              project.categories
                                .slice(0, 2)
                                .map((cat, index) => (
                                  <span
                                    key={index}
                                    className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-blue-100 text-blue-700"
                                  >
                                    {cat}
                                  </span>
                                ))
                            ) : (
                              <span className="text-xs text-gray-500">
                                {project.category || "No category"}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      {getStatusBadge(project.status)}
                    </div>
                  ))}
                  {projects.length > 3 && (
                    <Link
                      to="/my-projects"
                      className="inline-flex items-center text-sm font-medium mt-2 transition-colors duration-200"
                      style={{ color: "#03A6A1" }}
                      onMouseEnter={(e) => (e.target.style.color = "#028A85")}
                      onMouseLeave={(e) => (e.target.style.color = "#03A6A1")}
                    >
                      View all {projects.length} projects
                      <svg
                        className="ml-1 w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </Link>
                  )}
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="mx-auto h-12 w-12 text-gray-300 mb-4">
                    <FileText className="h-12 w-12" />
                  </div>
                  <p className="text-sm text-gray-500 mb-4">No projects yet</p>
                  <Link
                    to="/new-project"
                    className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors duration-200 text-sm"
                  >
                    Get Started
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Recent Projects */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden max-w-6xl mx-auto">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">
              Recent Projects
            </h3>
            <Link
              to="/my-projects"
              className="text-sm font-medium transition-colors duration-200"
              style={{ color: "#03A6A1" }}
              onMouseEnter={(e) => (e.target.style.color = "#028A85")}
              onMouseLeave={(e) => (e.target.style.color = "#03A6A1")}
            >
              View all
            </Link>
          </div>
          <div className="p-6">
            {projects.length > 0 ? (
              <div className="space-y-4">
                {projects.map((project) => (
                  <div
                    key={project.id}
                    className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 border border-gray-200 rounded-xl hover:border-gray-300 hover:shadow-sm transition-all duration-200"
                  >
                    <div className="flex items-start sm:items-center space-x-4 mb-3 sm:mb-0">
                      <div className="mt-1 sm:mt-0">
                        {getStatusIcon(project.status)}
                      </div>
                      <div className="flex-1">
                        <h4 className="text-sm font-semibold text-gray-900 mb-1">
                          {project.title}
                        </h4>
                        <div className="flex flex-wrap gap-1">
                          {project.categories &&
                          project.categories.length > 0 ? (
                            project.categories.map((cat, index) => (
                              <span
                                key={index}
                                className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-blue-100 text-blue-700"
                              >
                                {cat}
                              </span>
                            ))
                          ) : (
                            <span className="text-xs text-gray-500">
                              {project.category || "No category"}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between sm:justify-end space-x-4">
                      <div className="text-left sm:text-right">
                        <p className="text-sm font-semibold text-gray-900">
                          ₹
                          {(project.totalAmount || 0) +
                            (project.deliveryExtra || 0) >
                          0
                            ? (
                                (project.totalAmount || 0) +
                                (project.deliveryExtra || 0)
                              ).toLocaleString()
                            : "Calculating..."}
                        </p>
                        <p className="text-xs text-gray-500">
                          {project.createdAt
                            ? new Date(
                                project.createdAt.toDate()
                              ).toLocaleDateString()
                            : "N/A"}
                        </p>
                      </div>
                      <Link
                        to={`/project/${project.id}`}
                        className="inline-flex items-center px-3 py-1.5 text-sm font-medium rounded-lg transition-all duration-200"
                        style={{ backgroundColor: "#E6F7F6", color: "#03A6A1" }}
                        onMouseEnter={(e) => {
                          e.target.style.backgroundColor = "#03A6A1";
                          e.target.style.color = "white";
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.backgroundColor = "#E6F7F6";
                          e.target.style.color = "#03A6A1";
                        }}
                      >
                        View
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <FileText className="mx-auto h-16 w-16 text-gray-300 mb-4" />
                <h3 className="text-base font-semibold text-gray-900 mb-2">
                  No projects yet
                </h3>
                <p className="text-sm text-gray-500 mb-6">
                  Get started by submitting your first project.
                </p>
                <Link
                  to="/new-project"
                  className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors duration-200 shadow-sm hover:shadow-md"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Submit Your First Project
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientDashboard;
