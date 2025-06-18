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
        pending: projectsData.filter((p) => p.status === "pending").length,
        inProgress: projectsData.filter((p) => p.status === "in-progress")
          .length,
        completed: projectsData.filter(
          (p) => p.status === "completed" || p.status === "delivered"
        ).length,
        totalSpent: projectsData.reduce(
          (sum, p) => sum + (p.totalAmount || 0),
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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-white rounded-lg shadow p-6">
        <h1 className="text-2xl font-bold text-gray-900">
          Welcome back, {userProfile?.name || "Student"}! 👋
        </h1>
        <p className="text-gray-600 mt-2">
          Ready to get your next project completed? Let's make it happen.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="card">
          <div className="card-body">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <FileText className="h-8 w-8 text-primary-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">
                  Total Projects
                </p>
                <p className="text-2xl font-semibold text-gray-900">
                  {stats.total}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-body">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Clock className="h-8 w-8 text-warning-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Pending</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {stats.pending}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-body">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <TrendingUp className="h-8 w-8 text-success-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Completed</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {stats.completed}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card">
          <div className="card-header">
            <h3 className="text-lg font-medium text-gray-900">Quick Actions</h3>
          </div>
          <div className="card-body">
            <div className="space-y-3">
              <Link to="/new-project" className="w-full btn-primary">
                <Plus className="h-4 w-4 mr-2" />
                Submit New Project
              </Link>
              <Link to="/my-projects" className="w-full btn-outline">
                <FileText className="h-4 w-4 mr-2" />
                View All Projects
              </Link>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h3 className="text-lg font-medium text-gray-900">
              Recent Activity
            </h3>
          </div>
          <div className="card-body">
            {projects.length > 0 ? (
              <div className="space-y-3">
                {projects.slice(0, 3).map((project) => (
                  <div
                    key={project.id}
                    className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg"
                  >
                    {getStatusIcon(project.status)}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {project.title}
                      </p>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {project.categories && project.categories.length > 0 ? (
                          project.categories.map((cat, index) => (
                            <span
                              key={index}
                              className="inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800"
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
                    {getStatusBadge(project.status)}
                  </div>
                ))}
                {projects.length > 3 && (
                  <Link
                    to="/my-projects"
                    className="text-sm text-primary-600 hover:text-primary-500"
                  >
                    View all {projects.length} projects →
                  </Link>
                )}
              </div>
            ) : (
              <div className="text-center py-4">
                <p className="text-sm text-gray-500">No projects yet</p>
                <Link to="/new-project" className="btn-primary mt-2">
                  Get Started
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Recent Projects */}
      <div className="card">
        <div className="card-header">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-gray-900">
              Recent Projects
            </h3>
            <Link
              to="/my-projects"
              className="text-sm text-primary-600 hover:text-primary-500"
            >
              View all
            </Link>
          </div>
        </div>
        <div className="card-body">
          {projects.length > 0 ? (
            <div className="space-y-4">
              {projects.map((project) => (
                <div
                  key={project.id}
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center space-x-4">
                    {getStatusIcon(project.status)}
                    <div>
                      <h4 className="text-sm font-medium text-gray-900">
                        {project.title}
                      </h4>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {project.categories && project.categories.length > 0 ? (
                          project.categories.map((cat, index) => (
                            <span
                              key={index}
                              className="inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800"
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
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900">
                        ₹{project.totalAmount?.toLocaleString() || "0"}
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
                      className="btn-outline btn-sm"
                    >
                      View
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <FileText className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">
                No projects yet
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Get started by submitting your first project.
              </p>
              <Link to="/new-project" className="btn-primary mt-4">
                Submit Your First Project
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ClientDashboard;
