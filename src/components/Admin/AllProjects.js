import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Search,
  Filter,
  Eye,
  Edit,
  DollarSign,
  Calendar,
  User,
  FileText,
} from "lucide-react";
import {
  collection,
  query,
  getDocs,
  where,
  limit,
  updateDoc,
  doc,
} from "firebase/firestore";
import { db } from "../../firebase/config";
import { useNotifications } from "../../contexts/NotificationContext";
import toast from "react-hot-toast";

const AllProjects = () => {
  const [projects, setProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedProject, setSelectedProject] = useState(null);
  const [showPricingModal, setShowPricingModal] = useState(false);
  const [pricingData, setPricingData] = useState({
    price: "",
    notes: "",
  });
  const { createNotification } = useNotifications();

  useEffect(() => {
    fetchProjects();
  }, []);

  useEffect(() => {
    filterProjects();
  }, [projects, searchTerm, statusFilter]);

  const fetchProjects = async () => {
    try {
      const projectsRef = collection(db, "projects");
      const q = query(projectsRef);
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
          project.clientName
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          project.clientEmail?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter((project) => project.status === statusFilter);
    }

    setFilteredProjects(filtered);
  };

  const handlePricingSubmit = async (e) => {
    e.preventDefault();

    if (!pricingData.price || parseFloat(pricingData.price) <= 0) {
      toast.error("Please enter a valid price");
      return;
    }

    try {
      const projectRef = doc(db, "projects", selectedProject.id);
      await updateDoc(projectRef, {
        totalAmount: parseFloat(pricingData.price),
        status: "approved",
        adminNotes: pricingData.notes,
        updatedAt: new Date(),
      });

      // Send notification to client
      await createNotification(
        selectedProject.clientId,
        "Project Approved",
        `Your project "${selectedProject.title}" has been approved with a price of ₹${pricingData.price}. Please complete the payment to start work.`,
        "success",
        selectedProject.id
      );

      toast.success("Project approved and priced successfully");
      setShowPricingModal(false);
      setSelectedProject(null);
      setPricingData({ price: "", notes: "" });
      fetchProjects(); // Refresh projects
    } catch (error) {
      console.error("Error updating project:", error);
      toast.error("Failed to update project");
    }
  };

  const updateProjectStatus = async (projectId, newStatus) => {
    try {
      const project = projects.find((p) => p.id === projectId);
      const projectRef = doc(db, "projects", projectId);
      await updateDoc(projectRef, {
        status: newStatus,
        updatedAt: new Date(),
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
      fetchProjects(); // Refresh projects
    } catch (error) {
      console.error("Error updating project status:", error);
      toast.error("Failed to update project status");
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
          <h1 className="text-2xl font-bold text-gray-900">All Projects</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage and review all client projects
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="card">
        <div className="card-body">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
            <div>
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
            <div className="text-sm text-gray-500 flex items-center">
              <Filter className="h-4 w-4 mr-1" />
              {filteredProjects.length} of {projects.length} projects
            </div>
          </div>
        </div>
      </div>

      {/* Projects Table */}
      <div className="card">
        <div className="card-body">
          {filteredProjects.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Project
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Client
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Created
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredProjects.map((project) => (
                    <tr key={project.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {project.title}
                          </div>
                          <div className="flex flex-wrap gap-1 mt-1">
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
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {project.clientName}
                          </div>
                          <div className="text-sm text-gray-500">
                            {project.clientEmail}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(project.status)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <DollarSign className="h-4 w-4 mr-1 text-gray-400" />
                          <span className="text-sm text-gray-900">
                            ₹{project.totalAmount?.toLocaleString() || "0"}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {project.createdAt
                          ? new Date(
                              project.createdAt.toDate()
                            ).toLocaleDateString()
                          : "N/A"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <Link
                            to={`/admin/project/${project.id}`}
                            className="btn-outline btn-sm"
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            View
                          </Link>
                          {project.status === "pending" && (
                            <button
                              onClick={() => {
                                setSelectedProject(project);
                                setShowPricingModal(true);
                              }}
                              className="btn-primary btn-sm"
                            >
                              <Edit className="h-4 w-4 mr-1" />
                              Price
                            </button>
                          )}
                          {project.status === "approved" && (
                            <button
                              onClick={() =>
                                updateProjectStatus(project.id, "in-progress")
                              }
                              className="btn-success btn-sm"
                            >
                              Start
                            </button>
                          )}
                          {project.status === "in-progress" && (
                            <button
                              onClick={() =>
                                updateProjectStatus(project.id, "completed")
                              }
                              className="btn-success btn-sm"
                            >
                              Complete
                            </button>
                          )}
                          {project.status === "completed" && (
                            <Link
                              to={{
                                pathname: `/admin/project/${project.id}`,
                                state: { openDeliveryModal: true },
                              }}
                              className="btn-success btn-sm"
                            >
                              Deliver
                            </Link>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="mx-auto h-12 w-12 text-gray-400">
                <FileText className="h-12 w-12" />
              </div>
              <h3 className="mt-2 text-sm font-medium text-gray-900">
                {projects.length === 0
                  ? "No projects yet"
                  : "No projects match your search"}
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                {projects.length === 0
                  ? "Projects will appear here when clients submit them."
                  : "Try adjusting your search criteria."}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Pricing Modal */}
      {showPricingModal && selectedProject && (
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
                  <p className="text-sm text-gray-900 mt-1">
                    {selectedProject.title}
                  </p>
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
                      setSelectedProject(null);
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
    </div>
  );
};

export default AllProjects;
