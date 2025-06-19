import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { useNotifications } from "../../contexts/NotificationContext";
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
  Edit,
  Send,
  Eye,
  Download,
  Star,
} from "lucide-react";
import { doc, getDoc, updateDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../../firebase/config";
import toast from "react-hot-toast";

const AdminProjectDetail = () => {
  const { id } = useParams();
  const { currentUser, userProfile } = useAuth();
  const { createNotification } = useNotifications();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [adminNotes, setAdminNotes] = useState("");
  const [showPricingModal, setShowPricingModal] = useState(false);
  const [showDeliveryModal, setShowDeliveryModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [pricingData, setPricingData] = useState({
    price: "",
    notes: "",
  });
  const [deliveryData, setDeliveryData] = useState({
    projectLink: "",
    notes: "",
  });
  const [rejectReason, setRejectReason] = useState("");

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
        setAdminNotes(projectData.adminNotes || "");
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

  const updateProjectStatus = async (newStatus) => {
    try {
      const projectRef = doc(db, "projects", id);
      await updateDoc(projectRef, {
        status: newStatus,
        updatedAt: serverTimestamp(),
      });

      // Send notification to client
      await createNotification(
        project.clientId,
        "Project Status Updated",
        `Your project "${
          project.title
        }" status has been updated to ${newStatus.replace("-", " ")}.`,
        "info",
        project.id
      );

      toast.success("Project status updated successfully");
      fetchProject();
    } catch (error) {
      console.error("Error updating project status:", error);
      toast.error("Failed to update project status");
    }
  };

  const handlePricingSubmit = async (e) => {
    e.preventDefault();

    if (!pricingData.price || parseFloat(pricingData.price) <= 0) {
      toast.error("Please enter a valid price");
      return;
    }

    try {
      const projectRef = doc(db, "projects", id);
      await updateDoc(projectRef, {
        totalAmount: parseFloat(pricingData.price),
        status: "approved",
        adminNotes: pricingData.notes,
        updatedAt: serverTimestamp(),
      });

      // Send notification to client
      await createNotification(
        project.clientId,
        "Project Approved",
        `Your project "${project.title}" has been approved with a price of ₹${pricingData.price}. Please complete the payment to start work.`,
        "success",
        project.id
      );

      toast.success("Project approved and priced successfully");
      setShowPricingModal(false);
      setPricingData({ price: "", notes: "" });
      fetchProject();
    } catch (error) {
      console.error("Error updating project:", error);
      toast.error("Failed to update project");
    }
  };

  const handleDeliverySubmit = async (e) => {
    e.preventDefault();

    if (!deliveryData.projectLink.trim()) {
      toast.error("Please enter the project link");
      return;
    }

    try {
      const projectRef = doc(db, "projects", id);
      await updateDoc(projectRef, {
        status: "delivered",
        projectLink: deliveryData.projectLink,
        deliveryNotes: deliveryData.notes,
        deliveredAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      // Send notification to client
      await createNotification(
        project.clientId,
        "Project Delivered",
        `Your project "${project.title}" has been delivered! Check the project link in your project details.`,
        "success",
        project.id
      );

      toast.success("Project delivered successfully");
      setShowDeliveryModal(false);
      setDeliveryData({ projectLink: "", notes: "" });
      fetchProject();
    } catch (error) {
      console.error("Error delivering project:", error);
      toast.error("Failed to deliver project");
    }
  };

  const handleRejectSubmit = async (e) => {
    e.preventDefault();
    if (!rejectReason.trim()) {
      toast.error("Please provide a reason for rejection");
      return;
    }
    try {
      const projectRef = doc(db, "projects", id);
      await updateDoc(projectRef, {
        status: "rejected",
        rejectReason,
        updatedAt: serverTimestamp(),
      });
      await createNotification(
        project.clientId,
        "Project Rejected",
        `Your project \"${project.title}\" was rejected. Reason: ${rejectReason}`,
        "danger",
        project.id
      );
      toast.success("Project rejected");
      setShowRejectModal(false);
      setRejectReason("");
      fetchProject();
    } catch (error) {
      console.error("Error rejecting project:", error);
      toast.error("Failed to reject project");
    }
  };

  const saveAdminNotes = async () => {
    try {
      const projectRef = doc(db, "projects", id);
      await updateDoc(projectRef, {
        adminNotes: adminNotes,
        updatedAt: serverTimestamp(),
      });

      toast.success("Admin notes saved successfully");
    } catch (error) {
      console.error("Error saving admin notes:", error);
      toast.error("Failed to save admin notes");
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

  const getStatusActions = () => {
    switch (project.status) {
      case "pending":
        return (
          <div className="flex gap-2">
            <button
              onClick={() => setShowPricingModal(true)}
              className="btn-primary"
            >
              <Edit className="h-4 w-4 mr-2" />
              Set Price & Approve
            </button>
            <button
              onClick={() => setShowRejectModal(true)}
              className="btn-danger"
            >
              Reject
            </button>
          </div>
        );
      case "approved":
        return (
          <div className="flex gap-2">
            <button
              onClick={() => updateProjectStatus("in-progress")}
              className="btn-success"
            >
              <AlertCircle className="h-4 w-4 mr-2" />
              Start Development
            </button>
            <button
              onClick={() => setShowRejectModal(true)}
              className="btn-danger"
            >
              Reject
            </button>
          </div>
        );
      case "in-progress":
        return (
          <button
            onClick={() => updateProjectStatus("completed")}
            className="btn-success"
          >
            <CheckCircle className="h-4 w-4 mr-2" />
            Mark as Completed
          </button>
        );
      case "completed":
        return (
          <button
            onClick={() => setShowDeliveryModal(true)}
            className="btn-success"
          >
            <Download className="h-4 w-4 mr-2" />
            Deliver to Client
          </button>
        );
      default:
        return null;
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
        <Link to="/admin/projects" className="btn-primary mt-4">
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
          <Link to="/admin/projects" className="btn-outline">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Projects
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {project.title}
            </h1>
            <p className="text-gray-600">Project ID: {project.id}</p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          {getStatusBadge(project.status)}
          <Link to={`/admin/chat/${project.id}`} className="btn-primary">
            <MessageSquare className="h-4 w-4 mr-2" />
            Chat with Client
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
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  {getStatusIcon(project.status)}
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">
                      Project Status
                    </h3>
                    <p className="text-sm text-gray-500">
                      Current status: {project.status.replace("-", " ")}
                    </p>
                  </div>
                </div>
                {getStatusActions()}
              </div>
            </div>
            <div className="card-body">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Project Description
                  </label>
                  <p className="mt-1 text-sm text-gray-900 bg-gray-50 p-3 rounded-md">
                    {project.description || "No description provided"}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Requirements
                  </label>
                  <p className="mt-1 text-sm text-gray-900 bg-gray-50 p-3 rounded-md">
                    {project.requirements || "No requirements specified"}
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
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Deadline
                    </label>
                    <p className="mt-1 text-sm text-gray-900">
                      {project.deadline
                        ? new Date(
                            project.deadline.toDate()
                          ).toLocaleDateString()
                        : "Not specified"}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Created Date
                    </label>
                    <p className="mt-1 text-sm text-gray-900">
                      {project.createdAt
                        ? new Date(
                            project.createdAt.toDate()
                          ).toLocaleDateString()
                        : "N/A"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Admin Notes */}
          <div className="card">
            <div className="card-header">
              <h3 className="text-lg font-medium text-gray-900">Admin Notes</h3>
            </div>
            <div className="card-body">
              <textarea
                value={adminNotes}
                onChange={(e) => setAdminNotes(e.target.value)}
                placeholder="Add internal notes about this project..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                rows="4"
              />
              <div className="mt-3 flex justify-end">
                <button onClick={saveAdminNotes} className="btn-primary btn-sm">
                  <Edit className="h-4 w-4 mr-1" />
                  Save Notes
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Client Information */}
          <div className="card">
            <div className="card-header">
              <h3 className="text-lg font-medium text-gray-900">
                Client Information
              </h3>
            </div>
            <div className="card-body">
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="h-10 w-10 rounded-full bg-primary-600 flex items-center justify-center">
                    <span className="text-white text-sm font-medium">
                      {project.clientName?.charAt(0) || "C"}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {project.clientName}
                    </p>
                    <p className="text-sm text-gray-500">
                      {project.clientEmail}
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <div>
                    <label className="block text-xs font-medium text-gray-500">
                      College
                    </label>
                    <p className="text-sm text-gray-900">
                      {project.college || "Not specified"}
                    </p>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500">
                      Course
                    </label>
                    <p className="text-sm text-gray-900">
                      {project.course} • {project.year}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Project Details */}
          <div className="card">
            <div className="card-header">
              <h3 className="text-lg font-medium text-gray-900">
                Project Details
              </h3>
            </div>
            <div className="card-body">
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-gray-500">
                    Project Amount
                  </label>
                  <p className="text-lg font-semibold text-gray-900">
                    ₹{project.totalAmount?.toLocaleString() || "Not set"}
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-500">
                    Payment Status
                  </label>
                  <p className="text-sm text-gray-900">
                    {project.paymentStatus || "Pending"}
                  </p>
                </div>

                {project.paymentProof && (
                  <div>
                    <label className="block text-xs font-medium text-gray-500">
                      Payment Proof
                    </label>
                    <p className="text-sm text-gray-900 bg-gray-50 p-2 rounded">
                      {project.paymentProof}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="card">
            <div className="card-header">
              <h3 className="text-lg font-medium text-gray-900">
                Quick Actions
              </h3>
            </div>
            <div className="card-body">
              <div className="space-y-2">
                <Link
                  to={`/admin/chat/${project.id}`}
                  className="w-full btn-outline btn-sm"
                >
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Chat with Client
                </Link>

                {project.status === "pending" && (
                  <button
                    onClick={() => setShowPricingModal(true)}
                    className="w-full btn-primary btn-sm"
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Set Price
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Pricing Modal */}
      {showPricingModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Set Project Price
              </h3>
              <form onSubmit={handlePricingSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Project Title
                  </label>
                  <p className="text-sm text-gray-900 mt-1">{project.title}</p>
                </div>
                <div>
                  <label
                    htmlFor="price"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Amount (₹)
                  </label>
                  <input
                    type="number"
                    id="price"
                    value={pricingData.price}
                    onChange={(e) =>
                      setPricingData({ ...pricingData, price: e.target.value })
                    }
                    className="input mt-1"
                    placeholder="Enter project amount"
                    min="0"
                    step="100"
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor="notes"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Admin Notes (Optional)
                  </label>
                  <textarea
                    id="notes"
                    value={pricingData.notes}
                    onChange={(e) =>
                      setPricingData({ ...pricingData, notes: e.target.value })
                    }
                    className="input mt-1"
                    rows="3"
                    placeholder="Any notes for the client..."
                  />
                </div>
                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => {
                      setShowPricingModal(false);
                      setPricingData({ price: "", notes: "" });
                    }}
                    className="btn-outline"
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn-primary">
                    Approve & Price
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Delivery Modal */}
      {showDeliveryModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Deliver Project
              </h3>
              <form onSubmit={handleDeliverySubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Project Title
                  </label>
                  <p className="text-sm text-gray-900 mt-1">{project.title}</p>
                </div>
                <div>
                  <label
                    htmlFor="projectLink"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Project Link *
                  </label>
                  <input
                    type="url"
                    id="projectLink"
                    value={deliveryData.projectLink}
                    onChange={(e) =>
                      setDeliveryData({
                        ...deliveryData,
                        projectLink: e.target.value,
                      })
                    }
                    className="input mt-1"
                    placeholder="https://drive.google.com/... or any project link"
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor="deliveryNotes"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Delivery Notes (Optional)
                  </label>
                  <textarea
                    id="deliveryNotes"
                    value={deliveryData.notes}
                    onChange={(e) =>
                      setDeliveryData({
                        ...deliveryData,
                        notes: e.target.value,
                      })
                    }
                    className="input mt-1"
                    rows="3"
                    placeholder="Any additional notes for the client..."
                  />
                </div>
                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => {
                      setShowDeliveryModal(false);
                      setDeliveryData({ projectLink: "", notes: "" });
                    }}
                    className="btn-outline"
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn-success">
                    <Download className="h-4 w-4 mr-2" />
                    Deliver Project
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Reject Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Reject Project
              </h3>
              <form onSubmit={handleRejectSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Project Title
                  </label>
                  <p className="text-sm text-gray-900 mt-1">{project.title}</p>
                </div>
                <div>
                  <label
                    htmlFor="rejectReason"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Reason for Rejection *
                  </label>
                  <textarea
                    id="rejectReason"
                    value={rejectReason}
                    onChange={(e) => setRejectReason(e.target.value)}
                    className="input mt-1"
                    rows="3"
                    placeholder="Please provide a clear reason for rejection"
                    required
                  />
                </div>
                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => {
                      setShowRejectModal(false);
                      setRejectReason("");
                    }}
                    className="btn-outline"
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn-danger">
                    Reject Project
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProjectDetail;
