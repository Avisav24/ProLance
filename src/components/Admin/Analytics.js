import React, { useState, useEffect } from "react";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  FileText,
  Users,
  Calendar,
  CheckCircle,
  Clock,
} from "lucide-react";
import { collection, query, getDocs, orderBy, where } from "firebase/firestore";
import { db } from "../../firebase/config";
import toast from "react-hot-toast";

const Analytics = () => {
  const [analytics, setAnalytics] = useState({
    totalRevenue: 0,
    totalProjects: 0,
    totalClients: 0,
    completedProjects: 0,
    pendingProjects: 0,
    inProgressProjects: 0,
    monthlyRevenue: [],
    projectTypes: {},
    statusDistribution: {},
    recentActivity: [],
  });
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState("30"); // days

  useEffect(() => {
    fetchAnalytics();
  }, [timeRange]);

  const fetchAnalytics = async () => {
    try {
      // Fetch all projects
      const projectsRef = collection(db, "projects");
      const projectsQuery = query(projectsRef, orderBy("createdAt", "desc"));
      const projectsSnapshot = await getDocs(projectsQuery);
      const projects = projectsSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      // Fetch all clients
      const usersRef = collection(db, "users");
      const usersQuery = query(usersRef, where("role", "==", "client"));
      const usersSnapshot = await getDocs(usersQuery);
      const clients = usersSnapshot.docs.map((doc) => doc.data());

      // Calculate basic stats
      const totalRevenue = projects.reduce(
        (sum, p) => sum + (p.totalAmount || 0),
        0
      );
      const totalProjects = projects.length;
      const totalClients = clients.length;
      const completedProjects = projects.filter((p) =>
        ["completed", "delivered"].includes(p.status)
      ).length;
      const pendingProjects = projects.filter(
        (p) => p.status === "pending"
      ).length;
      const inProgressProjects = projects.filter(
        (p) => p.status === "in-progress"
      ).length;

      // Calculate monthly revenue
      const now = new Date();
      const months = [];
      for (let i = 0; i < 6; i++) {
        const month = new Date(now.getFullYear(), now.getMonth() - i, 1);
        months.unshift({
          month: month.toLocaleDateString("en-US", {
            month: "short",
            year: "numeric",
          }),
          revenue: 0,
          projects: 0,
        });
      }

      projects.forEach((project) => {
        const createdAt = project.createdAt?.toDate();
        if (createdAt) {
          const monthIndex = months.findIndex((m) => {
            const monthDate = new Date(m.month);
            return (
              createdAt.getMonth() === monthDate.getMonth() &&
              createdAt.getFullYear() === monthDate.getFullYear()
            );
          });
          if (monthIndex !== -1) {
            months[monthIndex].revenue += project.totalAmount || 0;
            months[monthIndex].projects += 1;
          }
        }
      });

      // Project types distribution
      const projectTypes = {};
      projects.forEach((project) => {
        const type = project.projectType || "other";
        projectTypes[type] = (projectTypes[type] || 0) + 1;
      });

      // Status distribution
      const statusDistribution = {};
      projects.forEach((project) => {
        const status = project.status || "unknown";
        statusDistribution[status] = (statusDistribution[status] || 0) + 1;
      });

      // Recent activity (last 10 projects)
      const recentActivity = projects.slice(0, 10).map((project) => ({
        id: project.id,
        title: project.title,
        clientName: project.clientName,
        status: project.status,
        amount: project.totalAmount || 0,
        date: project.createdAt?.toDate(),
      }));

      setAnalytics({
        totalRevenue,
        totalProjects,
        totalClients,
        completedProjects,
        pendingProjects,
        inProgressProjects,
        monthlyRevenue: months,
        projectTypes,
        statusDistribution,
        recentActivity,
      });
    } catch (error) {
      console.error("Error fetching analytics:", error);
      toast.error("Failed to load analytics data");
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "pending":
        return <Clock className="h-4 w-4 text-warning-500" />;
      case "in-progress":
        return <Clock className="h-4 w-4 text-primary-500" />;
      case "completed":
      case "delivered":
        return <CheckCircle className="h-4 w-4 text-success-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
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
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
          <p className="mt-1 text-sm text-gray-500">
            Performance metrics and insights
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="input"
          >
            <option value="7">Last 7 days</option>
            <option value="30">Last 30 days</option>
            <option value="90">Last 90 days</option>
            <option value="365">Last year</option>
          </select>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card">
          <div className="card-body">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <DollarSign className="h-8 w-8 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">
                  Total Revenue
                </p>
                <p className="text-2xl font-semibold text-gray-900">
                  ₹{analytics.totalRevenue.toLocaleString()}
                </p>
                <div className="flex items-center mt-1">
                  <TrendingUp className="h-4 w-4 text-green-500" />
                  <span className="text-sm text-green-600 ml-1">+12%</span>
                </div>
              </div>
            </div>
          </div>
        </div>

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
                  {analytics.totalProjects}
                </p>
                <div className="flex items-center mt-1">
                  <TrendingUp className="h-4 w-4 text-green-500" />
                  <span className="text-sm text-green-600 ml-1">+8%</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-body">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Users className="h-8 w-8 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">
                  Total Clients
                </p>
                <p className="text-2xl font-semibold text-gray-900">
                  {analytics.totalClients}
                </p>
                <div className="flex items-center mt-1">
                  <TrendingUp className="h-4 w-4 text-green-500" />
                  <span className="text-sm text-green-600 ml-1">+15%</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-body">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <CheckCircle className="h-8 w-8 text-success-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Completed</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {analytics.completedProjects}
                </p>
                <div className="flex items-center mt-1">
                  <TrendingUp className="h-4 w-4 text-green-500" />
                  <span className="text-sm text-green-600 ml-1">+5%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Charts and Detailed Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Revenue Chart */}
        <div className="card">
          <div className="card-header">
            <h3 className="text-lg font-medium text-gray-900">
              Monthly Revenue
            </h3>
          </div>
          <div className="card-body">
            <div className="space-y-4">
              {analytics.monthlyRevenue.map((month, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">
                    {month.month}
                  </span>
                  <div className="flex items-center space-x-4">
                    <span className="text-sm text-gray-600">
                      {month.projects} projects
                    </span>
                    <span className="text-sm font-medium text-gray-900">
                      ₹{month.revenue.toLocaleString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Project Status Distribution */}
        <div className="card">
          <div className="card-header">
            <h3 className="text-lg font-medium text-gray-900">
              Project Status
            </h3>
          </div>
          <div className="card-body">
            <div className="space-y-4">
              {Object.entries(analytics.statusDistribution).map(
                ([status, count]) => (
                  <div
                    key={status}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center">
                      {getStatusIcon(status)}
                      <span className="ml-2 text-sm font-medium text-gray-700">
                        {status.replace("-", " ").toUpperCase()}
                      </span>
                    </div>
                    <span className="text-sm font-medium text-gray-900">
                      {count}
                    </span>
                  </div>
                )
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Project Types and Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Project Types */}
        <div className="card">
          <div className="card-header">
            <h3 className="text-lg font-medium text-gray-900">Project Types</h3>
          </div>
          <div className="card-body">
            <div className="space-y-4">
              {Object.entries(analytics.projectTypes).map(([type, count]) => (
                <div key={type} className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700 capitalize">
                    {type.replace("-", " ")}
                  </span>
                  <span className="text-sm font-medium text-gray-900">
                    {count}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="card">
          <div className="card-header">
            <h3 className="text-lg font-medium text-gray-900">
              Recent Activity
            </h3>
          </div>
          <div className="card-body">
            <div className="space-y-4">
              {analytics.recentActivity.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center">
                    {getStatusIcon(activity.status)}
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-900">
                        {activity.title}
                      </p>
                      <p className="text-xs text-gray-500">
                        {activity.clientName} •{" "}
                        {activity.date
                          ? new Date(activity.date).toLocaleDateString()
                          : "N/A"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {getStatusBadge(activity.status)}
                    <span className="text-sm font-medium text-gray-900">
                      ₹{activity.amount.toLocaleString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="card">
        <div className="card-header">
          <h3 className="text-lg font-medium text-gray-900">
            Performance Metrics
          </h3>
        </div>
        <div className="card-body">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary-600">
                {analytics.totalProjects > 0
                  ? Math.round(
                      (analytics.completedProjects / analytics.totalProjects) *
                        100
                    )
                  : 0}
                %
              </div>
              <div className="text-sm text-gray-600">Completion Rate</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary-600">
                ₹
                {analytics.totalProjects > 0
                  ? Math.round(analytics.totalRevenue / analytics.totalProjects)
                  : 0}
              </div>
              <div className="text-sm text-gray-600">Average Project Value</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary-600">
                {analytics.totalClients > 0
                  ? Math.round(analytics.totalProjects / analytics.totalClients)
                  : 0}
              </div>
              <div className="text-sm text-gray-600">Projects per Client</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
