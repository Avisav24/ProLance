import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../../firebase/config";
import { FileText, Calendar, DollarSign, Send, Check } from "lucide-react";
import toast from "react-hot-toast";

const NewProject = () => {
  const { currentUser, userProfile } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    requirements: "",
    categories: [],
    deliverySpeed: "1_week",
    deliveryExtra: 0,
  });

  const categories = ["Project", "Report", "Assignment", "PPT"];

  const deliveryOptions = [
    { label: "1 Day Delivery (+₹100)", value: "1_day", extra: 100 },
    { label: "3 Day Delivery (+₹50)", value: "3_days", extra: 50 },
    { label: "1 Week Delivery (Free)", value: "1_week", extra: 0 },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCategoryChange = (category) => {
    setFormData((prev) => ({
      ...prev,
      categories: prev.categories.includes(category)
        ? prev.categories.filter((cat) => cat !== category)
        : [...prev.categories, category],
    }));
  };

  const handleDeliverySpeedChange = (value, extra) => {
    setFormData((prev) => ({
      ...prev,
      deliverySpeed: value,
      deliveryExtra: extra,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title || !formData.description || !formData.requirements) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (formData.categories.length === 0) {
      toast.error("Please select at least one category");
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
        categories: formData.categories,
        category: formData.categories.join(", "), // Keep for backward compatibility
        deliverySpeed: formData.deliverySpeed,
        deliveryExtra: formData.deliveryExtra,
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

            {/* Categories */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Project Categories *
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {categories.map((category) => (
                  <label
                    key={category}
                    className={`flex items-center p-3 border rounded-lg cursor-pointer transition-colors ${
                      formData.categories.includes(category)
                        ? "border-primary-500 bg-primary-50 text-primary-700"
                        : "border-gray-300 hover:border-gray-400"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={formData.categories.includes(category)}
                      onChange={() => handleCategoryChange(category)}
                      className="sr-only"
                    />
                    <div className="flex items-center space-x-2">
                      {formData.categories.includes(category) ? (
                        <Check className="h-4 w-4 text-primary-600" />
                      ) : (
                        <div className="h-4 w-4 border-2 border-gray-300 rounded"></div>
                      )}
                      <span className="text-sm font-medium">{category}</span>
                    </div>
                  </label>
                ))}
              </div>
              {formData.categories.length > 0 && (
                <p className="mt-2 text-sm text-gray-500">
                  Selected: {formData.categories.join(", ")}
                </p>
              )}
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

            {/* Delivery Speed */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Delivery Speed *
              </label>
              <div className="flex flex-col sm:flex-row gap-3">
                {deliveryOptions.map((option) => (
                  <label
                    key={option.value}
                    className={`flex items-center p-3 border rounded-lg cursor-pointer transition-colors ${
                      formData.deliverySpeed === option.value
                        ? "border-primary-500 bg-primary-50 text-primary-700"
                        : "border-gray-300 hover:border-gray-400"
                    }`}
                  >
                    <input
                      type="radio"
                      name="deliverySpeed"
                      checked={formData.deliverySpeed === option.value}
                      onChange={() =>
                        handleDeliverySpeedChange(option.value, option.extra)
                      }
                      className="sr-only"
                    />
                    <span className="text-sm font-medium">{option.label}</span>
                  </label>
                ))}
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
