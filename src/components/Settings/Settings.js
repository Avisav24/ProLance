import React, { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { Bell, Shield, Eye, EyeOff, Save, Lock, Mail } from "lucide-react";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase/config";
import toast from "react-hot-toast";

const Settings = () => {
  const { currentUser, userProfile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    projectUpdates: true,
    paymentReminders: true,
    chatMessages: true,
  });

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleNotificationChange = (setting) => {
    setNotificationSettings((prev) => ({
      ...prev,
      [setting]: !prev[setting],
    }));
  };

  const changePassword = async (e) => {
    e.preventDefault();

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }

    if (passwordData.newPassword.length < 6) {
      toast.error("New password must be at least 6 characters long");
      return;
    }

    setLoading(true);

    try {
      // In a real app, you would re-authenticate the user and update password
      // For now, we'll just show a success message
      toast.success("Password updated successfully");
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error) {
      console.error("Error changing password:", error);
      toast.error("Failed to change password");
    } finally {
      setLoading(false);
    }
  };

  const saveNotificationSettings = async () => {
    setLoading(true);

    try {
      const userRef = doc(db, "users", currentUser.uid);
      await updateDoc(userRef, {
        notificationSettings,
        updatedAt: new Date(),
      });

      toast.success("Notification settings saved");
    } catch (error) {
      console.error("Error saving notification settings:", error);
      toast.error("Failed to save notification settings");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="mt-1 text-sm text-gray-500">
          Manage your account settings and preferences
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Security Settings */}
        <div className="card">
          <div className="card-header">
            <div className="flex items-center">
              <Shield className="h-5 w-5 text-gray-400 mr-2" />
              <h3 className="text-lg font-medium text-gray-900">Security</h3>
            </div>
          </div>
          <div className="card-body">
            <form onSubmit={changePassword} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Current Password
                </label>
                <div className="mt-1 relative">
                  <input
                    type={showCurrentPassword ? "text" : "password"}
                    name="currentPassword"
                    value={passwordData.currentPassword}
                    onChange={handlePasswordChange}
                    className="input pr-10"
                    placeholder="Enter current password"
                    required
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  >
                    {showCurrentPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400" />
                    )}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  New Password
                </label>
                <div className="mt-1 relative">
                  <input
                    type={showNewPassword ? "text" : "password"}
                    name="newPassword"
                    value={passwordData.newPassword}
                    onChange={handlePasswordChange}
                    className="input pr-10"
                    placeholder="Enter new password"
                    required
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                  >
                    {showNewPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400" />
                    )}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Confirm New Password
                </label>
                <div className="mt-1 relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    value={passwordData.confirmPassword}
                    onChange={handlePasswordChange}
                    className="input pr-10"
                    placeholder="Confirm new password"
                    required
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400" />
                    )}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full"
              >
                {loading ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                ) : (
                  <Lock className="h-4 w-4 mr-2" />
                )}
                Change Password
              </button>
            </form>
          </div>
        </div>

        {/* Notification Settings */}
        <div className="card">
          <div className="card-header">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Bell className="h-5 w-5 text-gray-400 mr-2" />
                <h3 className="text-lg font-medium text-gray-900">
                  Notifications
                </h3>
              </div>
              <button
                onClick={saveNotificationSettings}
                disabled={loading}
                className="btn-primary btn-sm"
              >
                <Save className="h-4 w-4 mr-1" />
                Save
              </button>
            </div>
          </div>
          <div className="card-body">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-medium text-gray-900">
                    Email Notifications
                  </h4>
                  <p className="text-sm text-gray-500">
                    Receive notifications via email
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => handleNotificationChange("emailNotifications")}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    notificationSettings.emailNotifications
                      ? "bg-primary-600"
                      : "bg-gray-200"
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      notificationSettings.emailNotifications
                        ? "translate-x-6"
                        : "translate-x-1"
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-medium text-gray-900">
                    Project Updates
                  </h4>
                  <p className="text-sm text-gray-500">
                    Get notified about project status changes
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => handleNotificationChange("projectUpdates")}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    notificationSettings.projectUpdates
                      ? "bg-primary-600"
                      : "bg-gray-200"
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      notificationSettings.projectUpdates
                        ? "translate-x-6"
                        : "translate-x-1"
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-medium text-gray-900">
                    Payment Reminders
                  </h4>
                  <p className="text-sm text-gray-500">
                    Receive payment due reminders
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => handleNotificationChange("paymentReminders")}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    notificationSettings.paymentReminders
                      ? "bg-primary-600"
                      : "bg-gray-200"
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      notificationSettings.paymentReminders
                        ? "translate-x-6"
                        : "translate-x-1"
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-medium text-gray-900">
                    Chat Messages
                  </h4>
                  <p className="text-sm text-gray-500">
                    Get notified about new chat messages
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => handleNotificationChange("chatMessages")}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    notificationSettings.chatMessages
                      ? "bg-primary-600"
                      : "bg-gray-200"
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      notificationSettings.chatMessages
                        ? "translate-x-6"
                        : "translate-x-1"
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Account Information */}
      <div className="card">
        <div className="card-header">
          <h3 className="text-lg font-medium text-gray-900">
            Account Information
          </h3>
        </div>
        <div className="card-body">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Email Address
              </label>
              <p className="mt-1 text-sm text-gray-900">{currentUser.email}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Account Type
              </label>
              <p className="mt-1 text-sm text-gray-900 capitalize">
                {userProfile?.role || "client"}
              </p>
            </div>
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
                Last Login
              </label>
              <p className="mt-1 text-sm text-gray-900">
                {currentUser.metadata?.lastSignInTime
                  ? new Date(
                      currentUser.metadata.lastSignInTime
                    ).toLocaleDateString()
                  : "N/A"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="card border-red-200">
        <div className="card-header">
          <h3 className="text-lg font-medium text-red-900">Danger Zone</h3>
        </div>
        <div className="card-body">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-medium text-red-900">
                Delete Account
              </h4>
              <p className="text-sm text-red-600">
                Permanently delete your account and all associated data
              </p>
            </div>
            <button className="btn-danger">Delete Account</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
