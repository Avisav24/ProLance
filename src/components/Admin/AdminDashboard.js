import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import {
  Users,
  FileText,
  DollarSign,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertCircle,
  Eye,
  MessageSquare,
} from "lucide-react";
import { collection, query, getDocs, where, limit } from "firebase/firestore";
import { db } from "../../firebase/config";
import toast from "react-hot-toast";

const AdminDashboard = () => {
  const { userProfile } = useAuth();
  const [stats, setStats] = useState({
    totalProjects: 0,
    pendingProjects: 0,
    inProgressProjects: 0,
    completedProjects: 0,
    totalRevenue: 0,
    totalClients: 0,
    thisMonthRevenue: 0,
    thisMonthProjects: 0,
  });
  const [recentProjects, setRecentProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Fetch all projects
      const projectsRef = collection(db, "projects");
      const projectsQuery = query(projectsRef);
      const projectsSnapshot = await getDocs(projectsQuery);
      const projects = projectsSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      // Sort by createdAt in JavaScript (newest first)
      const sortedProjects = projects.sort((a, b) => {
        const dateA = a.createdAt?.toDate?.() || new Date(0);
        const dateB = b.createdAt?.toDate?.() || new Date(0);
        return dateB - dateA;
      });

      // Fetch all users (clients)
      const usersRef = collection(db, "users");
      const usersQuery = query(usersRef, where("role", "==", "client"));
      const usersSnapshot = await getDocs(usersQuery);
      const clients = usersSnapshot.docs.map((doc) => doc.data());

      // Calculate stats
      const totalProjects = projects.length;
      const pendingProjects = projects.filter(
        (p) => p.status === "pending"
      ).length;
      const inProgressProjects = projects.filter(
        (p) => p.status === "in-progress"
      ).length;
      const completedProjects = projects.filter((p) =>
        ["completed", "delivered"].includes(p.status)
      ).length;
      const totalRevenue = projects.reduce(
        (sum, p) => sum + (p.totalAmount || 0),
        0
      );
      const totalClients = clients.length;

      // This month calculations
      const now = new Date();
      const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
      const thisMonthProjects = projects.filter((p) => {
        const createdAt = p.createdAt?.toDate();
        return createdAt && createdAt >= thisMonthStart;
      });
      const thisMonthRevenue = thisMonthProjects.reduce(
        (sum, p) => sum + (p.totalAmount || 0),
        0
      );

      setStats({
        totalProjects,
        pendingProjects,
        inProgressProjects,
        completedProjects,
        totalRevenue,
        totalClients,
        thisMonthRevenue,
        thisMonthProjects: thisMonthProjects.length,
      });

      // Set recent projects
      setRecentProjects(sortedProjects.slice(0, 5));
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      toast.error("Failed to load dashboard data");
    } finally {
      setLoading(false);
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
          Welcome back, {userProfile?.name || "Admin"}! 👋
        </h1>
        <p className="text-gray-600 mt-2">
          Here's what's happening with your project delivery service today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
                  {stats.totalProjects}
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
                <p className="text-sm font-medium text-gray-500">
                  Pending Review
                </p>
                <p className="text-2xl font-semibold text-gray-900">
                  {stats.pendingProjects}
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
                <p className="text-sm font-medium text-gray-500">
                  Total Revenue
                </p>
                <p className="text-2xl font-semibold text-gray-900">
                  ₹{stats.totalRevenue.toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-body">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Users className="h-8 w-8 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">
                  Total Clients
                </p>
                <p className="text-2xl font-semibold text-gray-900">
                  {stats.totalClients}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Additional Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card">
          <div className="card-header">
            <h3 className="text-lg font-medium text-gray-900">This Month</h3>
          </div>
          <div className="card-body">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-gray-500">
                  New Projects
                </p>
                <p className="text-2xl font-semibold text-gray-900">
                  {stats.thisMonthProjects}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Revenue</p>
                <p className="text-2xl font-semibold text-gray-900">
                  ₹{stats.thisMonthRevenue.toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h3 className="text-lg font-medium text-gray-900">
              Project Status
            </h3>
          </div>
          <div className="card-body">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">In Progress</span>
                <span className="text-sm font-medium text-gray-900">
                  {stats.inProgressProjects}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Completed</span>
                <span className="text-sm font-medium text-gray-900">
                  {stats.completedProjects}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Pending Review</span>
                <span className="text-sm font-medium text-gray-900">
                  {stats.pendingProjects}
                </span>
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
          <div className="card-body space-y-4">
            <Link
              to="/admin/projects"
              className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-colors"
            >
              <div className="flex items-center">
                <FileText className="h-6 w-6 text-primary-600 mr-3" />
                <div>
                  <h4 className="font-medium text-gray-900">Review Projects</h4>
                  <p className="text-sm text-gray-500">
                    Approve, reject, or set pricing
                  </p>
                </div>
              </div>
              <div className="text-primary-600">
                <svg
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </div>
            </Link>

            <Link
              to="/admin/clients"
              className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-colors"
            >
              <div className="flex items-center">
                <Users className="h-6 w-6 text-primary-600 mr-3" />
                <div>
                  <h4 className="font-medium text-gray-900">Manage Clients</h4>
                  <p className="text-sm text-gray-500">
                    View client information
                  </p>
                </div>
              </div>
              <div className="text-primary-600">
                <svg
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </div>
            </Link>

            <Link
              to="/admin/analytics"
              className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-colors"
            >
              <div className="flex items-center">
                <TrendingUp className="h-6 w-6 text-primary-600 mr-3" />
                <div>
                  <h4 className="font-medium text-gray-900">View Analytics</h4>
                  <p className="text-sm text-gray-500">
                    Revenue and performance insights
                  </p>
                </div>
              </div>
              <div className="text-primary-600">
                <svg
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </div>
            </Link>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h3 className="text-lg font-medium text-gray-900">
              Recent Projects
            </h3>
          </div>
          <div className="card-body">
            {recentProjects.length > 0 ? (
              <div className="space-y-4">
                {recentProjects.map((project) => (
                  <div
                    key={project.id}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        {project.status === "pending" && (
                          <Clock className="h-5 w-5 text-warning-500" />
                        )}
                        {project.status === "in-progress" && (
                          <AlertCircle className="h-5 w-5 text-primary-500" />
                        )}
                        {["completed", "delivered"].includes(
                          project.status
                        ) && (
                          <CheckCircle className="h-5 w-5 text-success-500" />
                        )}
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-gray-900">
                          {project.title}
                        </p>
                        <p className="text-xs text-gray-500">
                          {project.clientName} •{" "}
                          {new Date(
                            project.createdAt?.toDate()
                          ).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {getStatusBadge(project.status)}
                      <Link
                        to={`/admin/project/${project.id}`}
                        className="text-primary-600 hover:text-primary-800"
                      >
                        <Eye className="h-4 w-4" />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">
                No recent projects
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Alerts */}
      {stats.pendingProjects > 0 && (
        <div className="bg-warning-50 border border-warning-200 rounded-lg p-4">
          <div className="flex">
            <AlertCircle className="h-5 w-5 text-warning-400" />
            <div className="ml-3">
              <h3 className="text-sm font-medium text-warning-800">
                {stats.pendingProjects} project
                {stats.pendingProjects > 1 ? "s" : ""} pending review
              </h3>
              <div className="mt-2 text-sm text-warning-700">
                <p>
                  You have {stats.pendingProjects} project
                  {stats.pendingProjects > 1 ? "s" : ""} waiting for approval
                  and pricing.
                </p>
              </div>
              <div className="mt-4">
                <Link to="/admin/projects" className="btn-warning btn-sm">
                  Review Now
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
