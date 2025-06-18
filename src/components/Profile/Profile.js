import React, { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import {
  User,
  Mail,
  Phone,
  GraduationCap,
  Calendar,
  Edit,
  Save,
  X,
} from "lucide-react";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase/config";
import toast from "react-hot-toast";

const Profile = () => {
  const { currentUser, userProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: userProfile?.name || "",
    phone: userProfile?.phone || "",
    college: userProfile?.college || "",
    course: userProfile?.course || "",
    year: userProfile?.year || "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const userRef = doc(db, "users", currentUser.uid);
      await updateDoc(userRef, {
        ...formData,
        updatedAt: new Date(),
      });

      toast.success("Profile updated successfully");
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      name: userProfile?.name || "",
      phone: userProfile?.phone || "",
      college: userProfile?.college || "",
      course: userProfile?.course || "",
      year: userProfile?.year || "",
    });
    setIsEditing(false);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Profile</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage your account information and preferences
          </p>
        </div>
        {!isEditing && (
          <button onClick={() => setIsEditing(true)} className="btn-primary">
            <Edit className="h-4 w-4 mr-2" />
            Edit Profile
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <div className="lg:col-span-1">
          <div className="card">
            <div className="card-body text-center">
              <div className="mx-auto h-24 w-24 rounded-full bg-primary-600 flex items-center justify-center mb-4">
                <span className="text-white text-2xl font-bold">
                  {userProfile?.name?.charAt(0) || currentUser.email?.charAt(0)}
                </span>
              </div>
              <h3 className="text-lg font-medium text-gray-900">
                {userProfile?.name || "User"}
              </h3>
              <p className="text-sm text-gray-500">{currentUser.email}</p>
              <div className="mt-4">
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    userProfile?.role === "admin"
                      ? "bg-purple-100 text-purple-800"
                      : "bg-blue-100 text-blue-800"
                  }`}
                >
                  {userProfile?.role === "admin" ? "Administrator" : "Client"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Profile Details */}
        <div className="lg:col-span-2">
          <div className="card">
            <div className="card-header">
              <h3 className="text-lg font-medium text-gray-900">
                Personal Information
              </h3>
            </div>
            <div className="card-body">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Full Name
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="input mt-1"
                        required
                      />
                    ) : (
                      <p className="mt-1 text-sm text-gray-900">
                        {userProfile?.name || "Not provided"}
                      </p>
                    )}
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Email Address
                    </label>
                    <p className="mt-1 text-sm text-gray-900">
                      {currentUser.email}
                    </p>
                    <p className="mt-1 text-xs text-gray-500">
                      Email cannot be changed
                    </p>
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Phone Number
                    </label>
                    {isEditing ? (
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="input mt-1"
                      />
                    ) : (
                      <p className="mt-1 text-sm text-gray-900">
                        {userProfile?.phone || "Not provided"}
                      </p>
                    )}
                  </div>

                  {/* College */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      College/University
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="college"
                        value={formData.college}
                        onChange={handleChange}
                        className="input mt-1"
                      />
                    ) : (
                      <p className="mt-1 text-sm text-gray-900">
                        {userProfile?.college || "Not provided"}
                      </p>
                    )}
                  </div>

                  {/* Course */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Course/Program
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="course"
                        value={formData.course}
                        onChange={handleChange}
                        className="input mt-1"
                      />
                    ) : (
                      <p className="mt-1 text-sm text-gray-900">
                        {userProfile?.course || "Not provided"}
                      </p>
                    )}
                  </div>

                  {/* Year */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Year of Study
                    </label>
                    {isEditing ? (
                      <select
                        name="year"
                        value={formData.year}
                        onChange={handleChange}
                        className="input mt-1"
                      >
                        <option value="">Select year</option>
                        <option value="1st Year">1st Year</option>
                        <option value="2nd Year">2nd Year</option>
                        <option value="3rd Year">3rd Year</option>
                        <option value="4th Year">4th Year</option>
                        <option value="Final Year">Final Year</option>
                      </select>
                    ) : (
                      <p className="mt-1 text-sm text-gray-900">
                        {userProfile?.year || "Not provided"}
                      </p>
                    )}
                  </div>
                </div>

                {/* Account Information */}
                <div className="border-t border-gray-200 pt-6">
                  <h4 className="text-sm font-medium text-gray-700 mb-4">
                    Account Information
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Member Since
                      </label>
                      <p className="mt-1 text-sm text-gray-900">
                        {userProfile?.createdAt
                          ? new Date(
                              userProfile.createdAt.toDate()
                            ).toLocaleDateString()
                          : "N/A"}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Last Updated
                      </label>
                      <p className="mt-1 text-sm text-gray-900">
                        {userProfile?.updatedAt
                          ? new Date(
                              userProfile.updatedAt.toDate()
                            ).toLocaleDateString()
                          : "N/A"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                {isEditing && (
                  <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
                    <button
                      type="button"
                      onClick={handleCancel}
                      className="btn-outline"
                    >
                      <X className="h-4 w-4 mr-2" />
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className="btn-primary"
                    >
                      {loading ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      ) : (
                        <Save className="h-4 w-4 mr-2" />
                      )}
                      Save Changes
                    </button>
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
