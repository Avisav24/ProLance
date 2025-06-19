import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import {
  Search,
  Filter,
  Eye,
  MessageSquare,
  Clock,
  CheckCircle,
  AlertCircle,
  X,
  Plus,
} from "lucide-react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../../firebase/config";
import toast from "react-hot-toast";

const MyProjects = () => {
  const { currentUser } = useAuth();
  const [projects, setProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetchProjects();
  }, [currentUser]);

  useEffect(() => {
    filterProjects();
  }, [projects, searchTerm, statusFilter]);

  const fetchProjects = async () => {
    if (!currentUser) return;

    try {
      const projectsRef = collection(db, "projects");
      const q = query(projectsRef, where("clientId", "==", currentUser.uid));

      const querySnapshot = await getDocs(q);
      const projectsData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      // Sort by createdAt in JavaScript (newest first)
      const sortedProjects = projectsData.sort((a, b) => {
        const dateA = a.createdAt?.toDate?.() || new Date(0);
        const dateB = b.createdAt?.toDate?.() || new Date(0);
        return dateB - dateA;
      });

      setProjects(sortedProjects);
    } catch (error) {
      console.error("Error fetching projects:", error);
      toast.error("Failed to load projects");
    } finally {
      setLoading(false);
    }
  };

  const filterProjects = () => {
    let filtered = projects;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (project) =>
          project.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          project.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (project.categories &&
            project.categories.some((cat) =>
              cat.toLowerCase().includes(searchTerm.toLowerCase())
            )) ||
          project.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter((project) => project.status === statusFilter);
    }

    setFilteredProjects(filtered);
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "pending":
        return <Clock className="h-5 w-5 text-amber-500" />;
      case "approved":
        return <CheckCircle className="h-5 w-5" style={{ color: "#03A6A1" }} />;
      case "in-progress":
        return <AlertCircle className="h-5 w-5 text-blue-500" />;
      case "completed":
        return <CheckCircle className="h-5 w-5" style={{ color: "#03A6A1" }} />;
      case "delivered":
        return <CheckCircle className="h-5 w-5" style={{ color: "#03A6A1" }} />;
      default:
        return <Clock className="h-5 w-5 text-gray-500" />;
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
        className={`inline-flex items-center px-3 py-1 text-xs font-medium rounded-full ${
          !isTealStatus
            ? statusClasses[status] || "bg-gray-50 text-gray-700"
            : statusClasses[status]
        }`}
        style={
          isTealStatus ? { backgroundColor: "#E6F7F6", color: "#03A6A1" } : {}
        }
      >
        {status.replace("-", " ").toUpperCase()}
      </span>
    );
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: "text-amber-600",
      approved: "text-teal-600",
      "in-progress": "text-blue-600",
      completed: "text-teal-600",
      delivered: "text-teal-600",
      rejected: "text-red-600",
      cancelled: "text-gray-600",
    };
    return colors[status] || "text-gray-600";
  };

  const clearFilters = () => {
    setSearchTerm("");
    setStatusFilter("all");
  };

  if (loading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{
          background:
            "linear-gradient(to bottom right, #f8f6f8, #ffe4e9, #c8e5ff)",
        }}
      >
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
    <div
      className="min-h-screen"
      style={{
        background:
          "linear-gradient(to bottom right, #f8f6f8, #ffe4e9, #c8e5ff)",
      }}
    >
      <div className="w-full px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                My Projects
              </h1>
              <p className="mt-2 text-sm sm:text-base text-gray-600">
                Track the progress of all your submitted projects
              </p>
            </div>
            <Link
              to="/new-project"
              className="mt-4 sm:mt-0 inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors duration-200 shadow-sm hover:shadow-md"
            >
              <Plus className="h-4 w-4 mr-2" />
              New Project
            </Link>
          </div>

          {/* Search and Filters */}
          <div className="bg-white rounded-2xl shadow-sm">
            <div className="p-6">
              <div className="flex flex-col sm:flex-row gap-4">
                {/* Search */}
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search projects..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    />
                  </div>
                </div>

                {/* Filter Toggle */}
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="inline-flex items-center px-6 py-3 border-2 rounded-xl font-medium transition-all duration-200"
                  style={{
                    borderColor: "#03A6A1",
                    color: "#03A6A1",
                    backgroundColor: showFilters ? "#E6F7F6" : "white",
                  }}
                  onMouseEnter={(e) => {
                    if (!showFilters)
                      e.target.style.backgroundColor = "#E6F7F6";
                  }}
                  onMouseLeave={(e) => {
                    if (!showFilters) e.target.style.backgroundColor = "white";
                  }}
                >
                  <Filter className="h-4 w-4 mr-2" />
                  Filters
                </button>
              </div>

              {/* Filter Options */}
              {showFilters && (
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <div className="flex flex-col sm:flex-row gap-4 items-end">
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Status
                      </label>
                      <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      >
                        <option value="all">All Status</option>
                        <option value="pending">Pending</option>
                        <option value="approved">Approved</option>
                        <option value="in-progress">In Progress</option>
                        <option value="completed">Completed</option>
                        <option value="delivered">Delivered</option>
                        <option value="rejected">Rejected</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </div>

                    <button
                      onClick={clearFilters}
                      className="inline-flex items-center px-6 py-3 border border-gray-200 bg-white text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors duration-200"
                    >
                      <X className="h-4 w-4 mr-2" />
                      Clear
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Projects List */}
          <div className="space-y-4">
            {filteredProjects.length > 0 ? (
              filteredProjects.map((project) => (
                <div
                  key={project.id}
                  className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-all duration-200"
                >
                  <div className="p-6">
                    <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-start gap-4">
                          <div className="flex-shrink-0 mt-1">
                            {getStatusIcon(project.status)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">
                              {project.title}
                            </h3>
                            <div className="flex flex-wrap items-center gap-2 mb-3">
                              {project.categories &&
                              project.categories.length > 0 ? (
                                project.categories.map((cat, index) => (
                                  <span
                                    key={index}
                                    className="inline-flex items-center px-3 py-1 rounded-lg text-xs font-medium bg-blue-100 text-blue-700"
                                  >
                                    {cat}
                                  </span>
                                ))
                              ) : (
                                <span className="text-sm text-gray-500">
                                  {project.category || "No category"}
                                </span>
                              )}
                            </div>

                            {project.description && (
                              <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                                {project.description}
                              </p>
                            )}

                            <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-gray-500">
                              <div className="flex items-center">
                                <Clock className="h-4 w-4 mr-1.5" />
                                {(() => {
                                  if (project.deliverySpeed === "1_day")
                                    return "1 Day Delivery";
                                  if (project.deliverySpeed === "3_days")
                                    return "3 Day Delivery";
                                  return "1 Week Delivery";
                                })()}
                              </div>
                              <div>
                                Created:{" "}
                                {project.createdAt
                                  ? new Date(
                                      project.createdAt.toDate()
                                    ).toLocaleDateString()
                                  : "N/A"}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col items-end gap-3">
                        {getStatusBadge(project.status)}

                        <div className="text-right">
                          <div className="text-sm text-gray-500 mb-1">
                            Total Amount
                          </div>
                          <div className="text-xl font-semibold text-gray-900">
                            ₹
                            {(
                              (project.totalAmount || 0) +
                              (project.deliveryExtra || 0)
                            ).toLocaleString()}
                          </div>
                        </div>

                        <div className="flex gap-2">
                          <Link
                            to={`/project/${project.id}`}
                            className="inline-flex items-center px-4 py-2 rounded-lg transition-all duration-200"
                            style={{
                              backgroundColor: "#E6F7F6",
                              color: "#03A6A1",
                            }}
                            onMouseEnter={(e) => {
                              e.target.style.backgroundColor = "#03A6A1";
                              e.target.style.color = "white";
                            }}
                            onMouseLeave={(e) => {
                              e.target.style.backgroundColor = "#E6F7F6";
                              e.target.style.color = "#03A6A1";
                            }}
                            title="View Details"
                          >
                            <Eye className="h-4 w-4" />
                          </Link>

                          <Link
                            to={`/chat/${project.id}`}
                            className="inline-flex items-center px-4 py-2 border border-gray-200 bg-white text-gray-700 rounded-lg hover:bg-gray-50 transition-all duration-200"
                            title="Chat"
                          >
                            <MessageSquare className="h-4 w-4" />
                          </Link>
                        </div>
                      </div>
                    </div>

                    {/* Payment Status or Delivery Link */}
                    <div className="mt-4 pt-4 border-t border-gray-100">
                      {project.status === "delivered" && project.projectLink ? (
                        <div className="flex items-center justify-between">
                          <a
                            href={project.projectLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center px-6 py-2.5 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors duration-200"
                          >
                            Access Your Project
                          </a>
                          {project.deliveryNotes && (
                            <span className="text-sm text-gray-500">
                              {project.deliveryNotes}
                            </span>
                          )}
                        </div>
                      ) : (
                        <div className="flex items-center justify-between">
                          <div className="text-sm text-gray-600">
                            Payment Status:{" "}
                            <span className="font-medium capitalize">
                              {project.paymentStatus || "pending"}
                            </span>
                          </div>
                          <div className="text-sm">
                            {project.paymentStatus === "pending" &&
                              project.status === "approved" && (
                                <span className="text-amber-600 font-medium">
                                  Payment Required
                                </span>
                              )}
                            {project.paymentStatus === "paid" && (
                              <span
                                className="font-medium"
                                style={{ color: "#03A6A1" }}
                              >
                                Payment Confirmed
                              </span>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="bg-white rounded-2xl shadow-sm">
                <div className="text-center py-16 px-6">
                  <div className="mx-auto h-16 w-16 text-gray-300 mb-4">
                    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-base font-semibold text-gray-900 mb-2">
                    {projects.length === 0
                      ? "No projects yet"
                      : "No projects match your filters"}
                  </h3>
                  <p className="text-sm text-gray-500 mb-6">
                    {projects.length === 0
                      ? "Get started by submitting your first project."
                      : "Try adjusting your search or filter criteria."}
                  </p>
                  {projects.length === 0 && (
                    <Link
                      to="/new-project"
                      className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors duration-200 shadow-sm hover:shadow-md"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Submit Your First Project
                    </Link>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Results Summary */}
          {filteredProjects.length > 0 && (
            <div className="text-center text-sm text-gray-500">
              Showing {filteredProjects.length} of {projects.length} projects
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyProjects;
