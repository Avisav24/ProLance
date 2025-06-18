import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../../firebase/config";
import { FileText, Calendar, DollarSign, Send } from "lucide-react";
import toast from "react-hot-toast";

const NewProject = () => {
  const { currentUser, userProfile } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    requirements: "",
    category: "",
    deadline: "",
    budget: "",
  });

  const categories = [
    "Web Development",
    "Mobile App Development",
    "Desktop Application",
    "Database Design",
    "Machine Learning",
    "Data Analysis",
    "UI/UX Design",
    "Other",
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title || !formData.description || !formData.requirements) {
      toast.error("Please fill in all required fields");
      return;
    }

    setLoading(true);

    try {
      const projectData = {
        clientId: currentUser.uid,
        clientName: userProfile?.name || currentUser.email,
        clientEmail: currentUser.email,
        title: formData.title,
        description: formData.description,
        requirements: formData.requirements,
        category: formData.category,
        deadline: new Date(formData.deadline),
        budget: parseFloat(formData.budget) || 0,
        status: "pending",
        price: 0,
        paymentStatus: "pending",
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };

      await addDoc(collection(db, "projects"), projectData);
      toast.success("Project submitted successfully!");
      navigate("/my-projects");
    } catch (error) {
      console.error("Error submitting project:", error);
      toast.error("Failed to submit project");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Submit New Project</h1>
        <p className="mt-1 text-sm text-gray-500">
          Fill out the form below to submit your project requirements
        </p>
      </div>

      {/* Form */}
      <div className="card">
        <div className="card-body">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Project Title */}
            <div>
              <label
                htmlFor="title"
                className="block text-sm font-medium text-gray-700"
              >
                Project Title *
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="input mt-1"
                placeholder="Enter project title"
                required
              />
            </div>

            {/* Category */}
            <div>
              <label
                htmlFor="category"
                className="block text-sm font-medium text-gray-700"
              >
                Project Category
              </label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="input mt-1"
              >
                <option value="">Select a category</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            {/* Description */}
            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-700"
              >
                Project Description *
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="4"
                className="input mt-1"
                placeholder="Describe your project in detail"
                required
              />
            </div>

            {/* Requirements */}
            <div>
              <label
                htmlFor="requirements"
                className="block text-sm font-medium text-gray-700"
              >
                Technical Requirements *
              </label>
              <textarea
                id="requirements"
                name="requirements"
                value={formData.requirements}
                onChange={handleChange}
                rows="6"
                className="input mt-1"
                placeholder="List all technical requirements, features, and specifications"
                required
              />
            </div>

            {/* Deadline and Budget */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label
                  htmlFor="deadline"
                  className="block text-sm font-medium text-gray-700"
                >
                  Deadline
                </label>
                <input
                  type="date"
                  id="deadline"
                  name="deadline"
                  value={formData.deadline}
                  onChange={handleChange}
                  className="input mt-1"
                  min={new Date().toISOString().split("T")[0]}
                />
              </div>

              <div>
                <label
                  htmlFor="budget"
                  className="block text-sm font-medium text-gray-700"
                >
                  Budget (₹)
                </label>
                <input
                  type="number"
                  id="budget"
                  name="budget"
                  value={formData.budget}
                  onChange={handleChange}
                  className="input mt-1"
                  placeholder="Enter your budget in rupees"
                  min="0"
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end">
              <button type="submit" disabled={loading} className="btn-primary">
                {loading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Submitting...
                  </div>
                ) : (
                  <div className="flex items-center">
                    <Send className="h-4 w-4 mr-2" />
                    Submit Project
                  </div>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default NewProject;
