import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import {
  ArrowLeft,
  MessageSquare,
  Clock,
  CheckCircle,
  AlertCircle,
  DollarSign,
  FileText,
  Calendar,
  User,
} from "lucide-react";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase/config";
import toast from "react-hot-toast";

const ProjectDetail = () => {
  const { id } = useParams();
  const { currentUser, userProfile } = useAuth();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [paymentProof, setPaymentProof] = useState("");

  useEffect(() => {
    fetchProject();
  }, [id]);

  const fetchProject = async () => {
    try {
      const projectRef = doc(db, "projects", id);
      const projectSnap = await getDoc(projectRef);

      if (projectSnap.exists()) {
        const projectData = projectSnap.data();
        setProject({
          id: projectSnap.id,
          ...projectData,
        });
      } else {
        toast.error("Project not found");
      }
    } catch (error) {
      console.error("Error fetching project:", error);
      toast.error("Failed to load project details");
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentSubmit = async (e) => {
    e.preventDefault();

    if (!paymentProof.trim()) {
      toast.error("Please enter payment proof details");
      return;
    }

    try {
      const projectRef = doc(db, "projects", id);
      await updateDoc(projectRef, {
        paymentStatus: "pending_verification",
        paymentProof: paymentProof,
        updatedAt: new Date(),
      });

      toast.success("Payment proof submitted successfully");
      setPaymentProof("");
      fetchProject(); // Refresh project data
    } catch (error) {
      console.error("Error submitting payment proof:", error);
      toast.error("Failed to submit payment proof");
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "pending":
        return <Clock className="h-6 w-6 text-warning-500" />;
      case "approved":
        return <CheckCircle className="h-6 w-6 text-success-500" />;
      case "in-progress":
        return <AlertCircle className="h-6 w-6 text-primary-500" />;
      case "completed":
        return <CheckCircle className="h-6 w-6 text-success-500" />;
      case "delivered":
        return <CheckCircle className="h-6 w-6 text-success-500" />;
      default:
        return <Clock className="h-6 w-6 text-gray-500" />;
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

  const getStatusDescription = (status) => {
    const descriptions = {
      pending:
        "Your project is under review. We will get back to you with pricing soon.",
      approved:
        "Your project has been approved! Please complete the payment to start work.",
      "in-progress":
        "Work on your project has begun. We will keep you updated on progress.",
      completed: "Your project has been completed and is ready for delivery.",
      delivered:
        "Your project has been delivered. Please check your files and provide feedback.",
      rejected:
        "Your project has been rejected. Please contact us for more information.",
      cancelled: "Your project has been cancelled.",
    };
    return descriptions[status] || "Status information not available.";
  };

  // Get the correct chat route based on user role
  const getChatRoute = () => {
    if (userProfile?.role === "admin") {
      return `/admin/chat/${project.id}`;
    } else {
      return `/chat/${project.id}`;
    }
  };

  // Get the correct back route based on user role
  const getBackRoute = () => {
    if (userProfile?.role === "admin") {
      return "/admin/projects";
    } else {
      return "/my-projects";
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium text-gray-900">Project not found</h3>
        <p className="text-gray-500 mt-2">
          The project you're looking for doesn't exist.
        </p>
        <Link to={getBackRoute()} className="btn-primary mt-4">
          Back to Projects
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link to={getBackRoute()} className="btn-outline">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {project.title}
            </h1>
            <div className="flex flex-wrap gap-1 mt-1">
              {project.categories && project.categories.length > 0 ? (
                project.categories.map((cat, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800"
                  >
                    {cat}
                  </span>
                ))
              ) : (
                <p className="text-gray-600">
                  {project.category || "No category"}
                </p>
              )}
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          {getStatusBadge(project.status)}
          <Link to={getChatRoute()} className="btn-primary">
            <MessageSquare className="h-4 w-4 mr-2" />
            Chat
          </Link>
        </div>
      </div>

      {/* Project Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Status Card */}
          <div className="card">
            <div className="card-header">
              <div className="flex items-center space-x-3">
                {getStatusIcon(project.status)}
                <div>
                  <h3 className="text-lg font-medium text-gray-900">
                    Project Status
                  </h3>
                  <p className="text-sm text-gray-500">
                    {getStatusDescription(project.status)}
                  </p>
                </div>
              </div>
            </div>
            <div className="card-body">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Project Description
                  </label>
                  <p className="text-sm text-gray-900 mt-1">
                    {project.description}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Technical Requirements
                  </label>
                  <p className="text-sm text-gray-900 mt-1 whitespace-pre-wrap">
                    {project.requirements}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Categories
                    </label>
                    <div className="mt-1">
                      {project.categories && project.categories.length > 0 ? (
                        <div className="flex flex-wrap gap-1">
                          {project.categories.map((cat, index) => (
                            <span
                              key={index}
                              className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-primary-100 text-primary-800"
                            >
                              {cat}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-gray-900">
                          {project.category || "Not specified"}
                        </p>
                      )}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Deadline
                    </label>
                    <p className="text-sm text-gray-900 mt-1">
                      {project.deadline
                        ? new Date(
                            project.deadline.toDate()
                          ).toLocaleDateString()
                        : "Not specified"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Section */}
          {project.status === "approved" &&
            project.paymentStatus === "pending" && (
              <div className="card">
                <div className="card-header">
                  <h3 className="text-lg font-medium text-gray-900">
                    Payment Information
                  </h3>
                </div>
                <div className="card-body">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Project Amount
                      </label>
                      <p className="text-2xl font-bold text-gray-900">
                        ₹{project.totalAmount?.toLocaleString() || "0"}
                      </p>
                    </div>

                    <form onSubmit={handlePaymentSubmit} className="space-y-4">
                      <div>
                        <label
                          htmlFor="paymentProof"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Payment Proof Details
                        </label>
                        <textarea
                          id="paymentProof"
                          value={paymentProof}
                          onChange={(e) => setPaymentProof(e.target.value)}
                          className="input mt-1"
                          rows="4"
                          placeholder="Enter payment transaction details, reference number, or any proof of payment..."
                          required
                        />
                      </div>
                      <button type="submit" className="btn-primary">
                        Submit Payment Proof
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            )}

          {/* Payment Status */}
          {project.paymentStatus === "pending_verification" && (
            <div className="card">
              <div className="card-header">
                <h3 className="text-lg font-medium text-gray-900">
                  Payment Status
                </h3>
              </div>
              <div className="card-body">
                <div className="flex items-center space-x-3">
                  <Clock className="h-6 w-6 text-warning-500" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      Payment Proof Submitted
                    </p>
                    <p className="text-sm text-gray-500">
                      We are verifying your payment. You will be notified once
                      confirmed.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Payment Confirmed */}
          {project.paymentStatus === "paid" && (
            <div className="card">
              <div className="card-header">
                <h3 className="text-lg font-medium text-gray-900">
                  Payment Status
                </h3>
              </div>
              <div className="card-body">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-6 w-6 text-success-500" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      Payment Confirmed
                    </p>
                    <p className="text-sm text-gray-500">
                      Your payment has been verified. Work on your project has
                      begun.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Project Info */}
          <div className="card">
            <div className="card-header">
              <h3 className="text-lg font-medium text-gray-900">
                Project Info
              </h3>
            </div>
            <div className="card-body space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-500">
                  Project ID
                </label>
                <p className="text-sm text-gray-900">{project.id}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500">
                  Created
                </label>
                <p className="text-sm text-gray-900">
                  {project.createdAt
                    ? new Date(project.createdAt.toDate()).toLocaleDateString()
                    : "N/A"}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500">
                  Last Updated
                </label>
                <p className="text-sm text-gray-900">
                  {project.updatedAt
                    ? new Date(project.updatedAt.toDate()).toLocaleDateString()
                    : "N/A"}
                </p>
              </div>
            </div>
          </div>

          {/* Budget Info */}
          <div className="card">
            <div className="card-header">
              <h3 className="text-lg font-medium text-gray-900">Budget</h3>
            </div>
            <div className="card-body space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-500">
                  Your Budget
                </label>
                <p className="text-lg font-semibold text-gray-900">
                  ₹{project.budget?.toLocaleString() || "0"}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500">
                  Project Amount
                </label>
                <p className="text-lg font-semibold text-gray-900">
                  ₹{project.totalAmount?.toLocaleString() || "0"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetail;
