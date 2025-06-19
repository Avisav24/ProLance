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
        return <Clock className="h-5 w-5 text-warning-500" />;
      case "approved":
        return <CheckCircle className="h-5 w-5 text-success-500" />;
      case "in-progress":
        return <AlertCircle className="h-5 w-5 text-primary-500" />;
      case "completed":
        return <CheckCircle className="h-5 w-5 text-success-500" />;
      case "delivered":
        return <CheckCircle className="h-5 w-5 text-success-500" />;
      default:
        return <Clock className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusBadge = (status) => {
    const statusClasses = {
      pending: "status-pending",
      approved: "status-approved",
      "in-progress": "status-in-progress",
      completed: "status-completed",
      delivered: "status-delivered",
      rejected: "status-rejected",
      cancelled: "status-cancelled",
    };

    return (
      <span className={statusClasses[status] || "status-pending"}>
        {status.replace("-", " ").toUpperCase()}
      </span>
    );
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: "text-warning-600",
      approved: "text-success-600",
      "in-progress": "text-primary-600",
      completed: "text-success-600",
      delivered: "text-success-600",
      rejected: "text-danger-600",
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
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Projects</h1>
          <p className="mt-1 text-sm text-gray-500">
            Track the progress of all your submitted projects
          </p>
        </div>
        <Link to="/new-project" className="btn-primary mt-4 sm:mt-0">
          New Project
        </Link>
      </div>

      {/* Search and Filters */}
      <div className="card">
        <div className="card-body">
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
                  className="input pl-10"
                />
              </div>
            </div>

            {/* Filter Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="btn-outline flex items-center"
            >
              <Filter className="h-4 w-4 mr-2" />
              Filters
            </button>
          </div>

          {/* Filter Options */}
          {showFilters && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="flex flex-col sm:flex-row gap-4 items-center">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Status
                  </label>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="input"
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
                  className="btn-outline flex items-center"
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
              className="card hover:shadow-md transition-shadow"
            >
              <div className="card-body">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3">
                          <div className="flex-shrink-0">
                            {getStatusIcon(project.status)}
                          </div>
                          <div>
                            <h3 className="text-lg font-medium text-gray-900">
                              {project.title}
                            </h3>
                            <div className="flex items-center space-x-2 mt-1">
                              <div className="flex flex-wrap gap-1">
                                {project.categories &&
                                project.categories.length > 0 ? (
                                  project.categories.map((cat, index) => (
                                    <span
                                      key={index}
                                      className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800"
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
                              <span className="text-gray-400">•</span>
                              <span className="text-sm text-gray-500">
                                {project.status}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="mt-3 flex flex-wrap gap-4 text-sm text-gray-600">
                          <div className="flex items-center">
                            <Clock className="h-4 w-4 mr-1" />
                            Delivery Speed:{" "}
                            {(() => {
                              if (project.deliverySpeed === "1_day")
                                return "1 Day Delivery (+₹100)";
                              if (project.deliverySpeed === "3_days")
                                return "3 Day Delivery (+₹50)";
                              return "1 Week Delivery (Free)";
                            })()}
                          </div>
                          <div className="flex flex-col">
                            <span>
                              Base Price: ₹
                              {project.totalAmount?.toLocaleString() || "0"}
                            </span>
                            <span>
                              Delivery Extra: ₹
                              {project.deliveryExtra
                                ? project.deliveryExtra
                                : 0}
                            </span>
                            <span className="font-semibold">
                              Final Amount: ₹
                              {(
                                (project.totalAmount || 0) +
                                (project.deliveryExtra || 0)
                              ).toLocaleString()}
                            </span>
                          </div>
                          <div className="flex items-center">
                            Created:{" "}
                            {project.createdAt
                              ? new Date(
                                  project.createdAt.toDate()
                                ).toLocaleDateString()
                              : "N/A"}
                          </div>
                        </div>

                        {project.description && (
                          <p className="mt-2 text-sm text-gray-600 line-clamp-2">
                            {project.description}
                          </p>
                        )}
                      </div>

                      <div className="ml-4 flex flex-col items-end space-y-2">
                        {getStatusBadge(project.status)}

                        <div className="flex space-x-2">
                          <Link
                            to={`/project/${project.id}`}
                            className="btn-outline btn-sm"
                            title="View Details"
                          >
                            <Eye className="h-4 w-4" />
                          </Link>

                          <Link
                            to={`/chat/${project.id}`}
                            className="btn-outline btn-sm"
                            title="Chat"
                          >
                            <MessageSquare className="h-4 w-4" />
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Payment Status or Delivery Link */}
                <div className="mt-4 pt-4 border-t border-gray-200">
                  {project.status === "delivered" && project.projectLink ? (
                    <div className="flex items-center space-x-3">
                      <a
                        href={project.projectLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors"
                      >
                        {/* You can use a download or link icon here if available */}
                        Access Your Project
                      </a>
                      {project.deliveryNotes && (
                        <span className="ml-2 text-xs text-gray-500">
                          {project.deliveryNotes}
                        </span>
                      )}
                    </div>
                  ) : (
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-gray-600">
                        Payment: {project.paymentStatus || "pending"}
                      </div>
                      <div className="text-sm text-gray-600">
                        {project.paymentStatus === "pending" &&
                          project.status === "approved" && (
                            <span className="text-warning-600 font-medium">
                              Payment Required
                            </span>
                          )}
                        {project.paymentStatus === "paid" && (
                          <span className="text-success-600 font-medium">
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
          <div className="text-center py-12">
            <div className="mx-auto h-12 w-12 text-gray-400">
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              {projects.length === 0
                ? "No projects yet"
                : "No projects match your filters"}
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              {projects.length === 0
                ? "Get started by submitting your first project."
                : "Try adjusting your search or filter criteria."}
            </p>
            {projects.length === 0 && (
              <Link to="/new-project" className="btn-primary mt-4">
                Submit Your First Project
              </Link>
            )}
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
  );
};

export default MyProjects;
