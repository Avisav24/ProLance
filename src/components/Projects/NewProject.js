import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../../firebase/config";
import { useNotifications } from "../../contexts/NotificationContext";
import { FileText, Calendar, DollarSign, Send, Check } from "lucide-react";
import toast from "react-hot-toast";

const NewProject = () => {
  const { currentUser, userProfile } = useAuth();
  const { createNotificationForAdmins } = useNotifications();
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

      const docRef = await addDoc(collection(db, "projects"), projectData);

      await createNotificationForAdmins(
        "New Project Submitted",
        `A new project "${formData.title}" has been submitted by ${
          userProfile?.name || currentUser.email
        }.`,
        "info",
        docRef.id
      );

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
    <div
      className="min-h-screen"
      style={{
        background:
          "linear-gradient(to bottom right, #f8f6f8, #ffe4e9, #c8e5ff)",
      }}
    >
      <div className="w-full px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Header */}
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
              Submit New Project
            </h1>
            <p className="mt-2 text-sm sm:text-base text-gray-600">
              Fill out the form below to submit your project requirements
            </p>
          </div>

          {/* Form */}
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
            <div className="px-6 py-8 sm:p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Project Title */}
                <div>
                  <label
                    htmlFor="title"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Project Title *
                  </label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
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
                        className={`flex items-center p-3 border-2 rounded-xl cursor-pointer transition-all duration-200 ${
                          formData.categories.includes(category)
                            ? "border-blue-500 bg-blue-50"
                            : "border-gray-200 hover:border-gray-300 bg-white"
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
                            <Check className="h-4 w-4 text-blue-600" />
                          ) : (
                            <div className="h-4 w-4 border-2 border-gray-300 rounded"></div>
                          )}
                          <span
                            className={`text-sm font-medium ${
                              formData.categories.includes(category)
                                ? "text-blue-700"
                                : "text-gray-700"
                            }`}
                          >
                            {category}
                          </span>
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
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Project Description *
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows="4"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none"
                    placeholder="Describe your project in detail"
                    required
                  />
                </div>

                {/* Requirements */}
                <div>
                  <label
                    htmlFor="requirements"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Technical Requirements *
                  </label>
                  <textarea
                    id="requirements"
                    name="requirements"
                    value={formData.requirements}
                    onChange={handleChange}
                    rows="6"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none"
                    placeholder="List all technical requirements, features, and specifications"
                    required
                  />
                </div>

                {/* Delivery Speed */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Delivery Speed *
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {deliveryOptions.map((option) => (
                      <label
                        key={option.value}
                        className={`flex items-center justify-center p-4 border-2 rounded-xl cursor-pointer transition-all duration-200 ${
                          formData.deliverySpeed === option.value
                            ? "border-blue-500 bg-blue-50"
                            : "border-gray-200 hover:border-gray-300 bg-white"
                        }`}
                      >
                        <input
                          type="radio"
                          name="deliverySpeed"
                          checked={formData.deliverySpeed === option.value}
                          onChange={() =>
                            handleDeliverySpeedChange(
                              option.value,
                              option.extra
                            )
                          }
                          className="sr-only"
                        />
                        <span
                          className={`text-sm font-medium ${
                            formData.deliverySpeed === option.value
                              ? "text-blue-700"
                              : "text-gray-700"
                          }`}
                        >
                          {option.label}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Submit Button */}
                <div className="flex flex-col sm:flex-row gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => navigate(-1)}
                    className="w-full sm:w-auto px-6 py-3 border-2 rounded-xl font-medium transition-all duration-200 bg-white"
                    style={{ borderColor: "#03A6A1", color: "#03A6A1" }}
                    onMouseEnter={(e) => {
                      e.target.style.backgroundColor = "#E6F7F6";
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.backgroundColor = "white";
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full sm:w-auto flex items-center justify-center px-6 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-all duration-200 shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                  >
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
      </div>
    </div>
  );
};

export default NewProject;
