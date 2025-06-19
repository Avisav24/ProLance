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
  Download,
} from "lucide-react";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase/config";
import toast from "react-hot-toast";

// Helper to get delivery duration in ms
const getDeliveryDurationMs = (deliverySpeed) => {
  switch (deliverySpeed) {
    case "1_day":
      return 24 * 60 * 60 * 1000;
    case "3_days":
      return 3 * 24 * 60 * 60 * 1000;
    default:
      return 7 * 24 * 60 * 60 * 1000;
  }
};

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
        return <Clock className="h-6 w-6 text-amber-500" />;
      case "approved":
        return <CheckCircle className="h-6 w-6" style={{ color: "#03A6A1" }} />;
      case "in-progress":
        return <AlertCircle className="h-6 w-6 text-blue-500" />;
      case "completed":
        return <CheckCircle className="h-6 w-6" style={{ color: "#03A6A1" }} />;
      case "delivered":
        return <CheckCircle className="h-6 w-6" style={{ color: "#03A6A1" }} />;
      default:
        return <Clock className="h-6 w-6 text-gray-500" />;
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

  // Calculate deadline as createdAt + delivery duration
  const getDeadlineDate = () => {
    if (!project || !project.createdAt || !project.deliverySpeed) return null;
    const created = project.createdAt.toDate
      ? project.createdAt.toDate()
      : new Date(project.createdAt);
    const duration = getDeliveryDurationMs(project.deliverySpeed);
    return new Date(created.getTime() + duration);
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

  if (!project) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{
          background:
            "linear-gradient(to bottom right, #f8f6f8, #ffe4e9, #c8e5ff)",
        }}
      >
        <div className="text-center py-12">
          <h3 className="text-lg font-medium text-gray-900">
            Project not found
          </h3>
          <p className="text-gray-500 mt-2">
            The project you're looking for doesn't exist.
          </p>
          <Link
            to={getBackRoute()}
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors duration-200 shadow-sm hover:shadow-md mt-4"
          >
            Back to Projects
          </Link>
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
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center space-x-4">
              <Link
                to={getBackRoute()}
                className="inline-flex items-center px-4 py-2 border-2 rounded-xl font-medium transition-all duration-200"
                style={{
                  borderColor: "#03A6A1",
                  color: "#03A6A1",
                  backgroundColor: "white",
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = "#E6F7F6";
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = "white";
                }}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Link>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                  {project.title}
                </h1>
                <div className="flex flex-wrap gap-2 mt-2">
                  {project.categories && project.categories.length > 0 ? (
                    project.categories.map((cat, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-3 py-1 rounded-lg text-xs font-medium bg-blue-100 text-blue-700"
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
              <Link
                to={getChatRoute()}
                className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors duration-200 shadow-sm hover:shadow-md"
              >
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
              <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
                <div className="p-6 border-b border-gray-100">
                  <div className="flex items-center space-x-3">
                    {getStatusIcon(project.status)}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        Project Status
                      </h3>
                      <p className="text-sm text-gray-600 mt-1">
                        {getStatusDescription(project.status)}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="p-6">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Project Description
                      </label>
                      <p className="text-sm text-gray-900 bg-gray-50 p-4 rounded-xl">
                        {project.description}
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Technical Requirements
                      </label>
                      <p className="text-sm text-gray-900 whitespace-pre-wrap bg-gray-50 p-4 rounded-xl">
                        {project.requirements}
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Categories
                        </label>
                        <div className="mt-1">
                          {project.categories &&
                          project.categories.length > 0 ? (
                            <div className="flex flex-wrap gap-2">
                              {project.categories.map((cat, index) => (
                                <span
                                  key={index}
                                  className="inline-flex items-center px-3 py-1 rounded-lg text-xs font-medium bg-blue-100 text-blue-700"
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
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Deadline
                        </label>
                        <p className="text-sm text-gray-900">
                          {getDeadlineDate()
                            ? getDeadlineDate().toLocaleDateString()
                            : "Not specified"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment Breakdown (show for all except pending/rejected) */}
              {[
                "approved",
                "in-progress",
                "completed",
                "delivered",
                "paid",
                "done",
              ].includes(project.status) &&
                project.status !== "rejected" && (
                  <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
                    <div className="p-6 border-b border-gray-100">
                      <h3 className="text-lg font-semibold text-gray-900">
                        Payment Information
                      </h3>
                    </div>
                    <div className="p-6">
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-3">
                            Payment Breakdown
                          </label>
                          <div className="bg-gray-50 p-4 rounded-xl space-y-2">
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-600">Base Price:</span>
                              <span className="font-medium text-gray-900">
                                ₹{project.totalAmount?.toLocaleString() || "0"}
                              </span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-600">
                                Delivery Extra:
                              </span>
                              <span className="font-medium text-gray-900">
                                ₹
                                {project.deliveryExtra
                                  ? project.deliveryExtra
                                  : 0}
                              </span>
                            </div>
                            <div className="pt-2 border-t border-gray-200 flex justify-between">
                              <span className="font-medium text-gray-900">
                                Final Amount:
                              </span>
                              <span className="font-semibold text-lg text-blue-600">
                                ₹
                                {(
                                  (project.totalAmount || 0) +
                                  (project.deliveryExtra || 0)
                                ).toLocaleString()}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              {/* Payment Section (only for payment proof submission) */}
              {project.status === "approved" &&
                project.paymentStatus === "pending" && (
                  <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
                    <div className="p-6 border-b border-gray-100">
                      <h3 className="text-lg font-semibold text-gray-900">
                        Payment Submission
                      </h3>
                    </div>
                    <div className="p-6">
                      <form
                        onSubmit={handlePaymentSubmit}
                        className="space-y-4"
                      >
                        <div>
                          <label
                            htmlFor="paymentProof"
                            className="block text-sm font-medium text-gray-700 mb-2"
                          >
                            Payment Proof Details
                          </label>
                          <textarea
                            id="paymentProof"
                            value={paymentProof}
                            onChange={(e) => setPaymentProof(e.target.value)}
                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none"
                            rows="4"
                            placeholder="Enter payment transaction details, reference number, or any proof of payment..."
                            required
                          />
                        </div>
                        <button
                          type="submit"
                          className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors duration-200 shadow-sm hover:shadow-md"
                        >
                          Submit Payment Proof
                        </button>
                      </form>
                    </div>
                  </div>
                )}

              {/* Payment Status */}
              {project.paymentStatus === "pending_verification" && (
                <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
                  <div className="p-6 border-b border-gray-100">
                    <h3 className="text-lg font-semibold text-gray-900">
                      Payment Status
                    </h3>
                  </div>
                  <div className="p-6">
                    <div className="flex items-center space-x-3">
                      <Clock className="h-6 w-6 text-amber-500" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          Payment Proof Submitted
                        </p>
                        <p className="text-sm text-gray-600 mt-1">
                          We are verifying your payment. You will be notified
                          once confirmed.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {project.paymentStatus === "done" && (
                <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
                  <div className="p-6 border-b border-gray-100">
                    <h3 className="text-lg font-semibold text-gray-900">
                      Payment Status
                    </h3>
                  </div>
                  <div className="p-6">
                    <div className="flex items-center space-x-3">
                      <CheckCircle
                        className="h-6 w-6"
                        style={{ color: "#03A6A1" }}
                      />
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          Payment Done
                        </p>
                        <p className="text-sm text-gray-600 mt-1">
                          Your payment has been verified and work has started on
                          your project.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Payment Confirmed */}
              {project.paymentStatus === "paid" && (
                <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
                  <div className="p-6 border-b border-gray-100">
                    <h3 className="text-lg font-semibold text-gray-900">
                      Payment Status
                    </h3>
                  </div>
                  <div className="p-6">
                    <div className="flex items-center space-x-3">
                      <CheckCircle
                        className="h-6 w-6"
                        style={{ color: "#03A6A1" }}
                      />
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          Payment Confirmed
                        </p>
                        <p className="text-sm text-gray-600 mt-1">
                          Your payment has been verified. Work on your project
                          has begun.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Project Delivery */}
              {project.status === "delivered" && project.projectLink && (
                <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
                  <div className="p-6 border-b border-gray-100">
                    <h3 className="text-lg font-semibold text-gray-900">
                      Project Delivered! 🎉
                    </h3>
                  </div>
                  <div className="p-6">
                    <div className="space-y-4">
                      <div className="flex items-center space-x-3">
                        <CheckCircle
                          className="h-6 w-6"
                          style={{ color: "#03A6A1" }}
                        />
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            Your project has been delivered successfully!
                          </p>
                          <p className="text-sm text-gray-600 mt-1">
                            Click the link below to access your completed
                            project.
                          </p>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-3">
                          Project Link
                        </label>
                        <a
                          href={project.projectLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors duration-200 shadow-sm hover:shadow-md"
                        >
                          <Download className="h-4 w-4 mr-2" />
                          Access Your Project
                        </a>
                      </div>

                      {project.deliveryNotes && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Delivery Notes
                          </label>
                          <p className="text-sm text-gray-900 bg-gray-50 p-4 rounded-xl">
                            {project.deliveryNotes}
                          </p>
                        </div>
                      )}

                      <div className="text-xs text-gray-500 pt-2">
                        Delivered on:{" "}
                        {project.deliveredAt
                          ? new Date(
                              project.deliveredAt.toDate()
                            ).toLocaleDateString()
                          : "Recently"}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetail;
