import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { useNotifications } from "../../contexts/NotificationContext";
import {
  Menu,
  X,
  User,
  LogOut,
  Settings,
  Bell,
  GraduationCap,
  Check,
  AlertCircle,
  Info,
} from "lucide-react";

const Header = () => {
  const { currentUser, userProfile, logout } = useAuth();
  const { notifications, unreadCount, markAsRead, markAllAsRead } =
    useNotifications();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isNotificationMenuOpen, setIsNotificationMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (error) {
      console.error("Failed to log out:", error);
    }
  };

  const handleNotificationClick = (notification) => {
    if (!notification.read) {
      markAsRead(notification.id);
    }

    // Navigate based on notification type
    if (notification.projectId) {
      if (userProfile?.role === "admin") {
        navigate(`/admin/project/${notification.projectId}`);
      } else {
        navigate(`/project/${notification.projectId}`);
      }
    }

    setIsNotificationMenuOpen(false);
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case "success":
        return <Check className="h-4 w-4 text-green-500" />;
      case "warning":
        return <AlertCircle className="h-4 w-4 text-yellow-500" />;
      case "error":
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Info className="h-4 w-4 text-blue-500" />;
    }
  };

  const navigation = [
    { name: "Dashboard", href: "/dashboard", current: true },
    { name: "New Project", href: "/new-project", current: false },
    { name: "My Projects", href: "/my-projects", current: false },
  ];

  const adminNavigation = [
    { name: "Admin Dashboard", href: "/admin", current: true },
    { name: "All Projects", href: "/admin/projects", current: false },
    { name: "Clients", href: "/admin/clients", current: false },
    { name: "Analytics", href: "/admin/analytics", current: false },
  ];

  const currentNavigation =
    userProfile?.role === "admin" ? adminNavigation : navigation;

  const dashboardPath = currentUser
    ? userProfile?.role === "admin"
      ? "/admin"
      : "/dashboard"
    : "/";

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to={dashboardPath} className="flex items-center space-x-2">
              <img src="/logo.png" alt="Gradely Logo" className="h-10" />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            {currentUser &&
              currentNavigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className="text-gray-500 hover:text-gray-900 px-3 py-2 text-sm font-medium transition-colors"
                >
                  {item.name}
                </Link>
              ))}
          </nav>

          {/* User Menu */}
          <div className="flex items-center space-x-4">
            {currentUser ? (
              <>
                {/* Notifications */}
                <div className="relative">
                  <button
                    onClick={() =>
                      setIsNotificationMenuOpen(!isNotificationMenuOpen)
                    }
                    className="p-2 text-gray-400 hover:text-gray-500 relative"
                  >
                    <Bell className="h-5 w-5" />
                    {unreadCount > 0 && (
                      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                        {unreadCount > 9 ? "9+" : unreadCount}
                      </span>
                    )}
                  </button>

                  {isNotificationMenuOpen && (
                    <div className="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg py-1 z-50 max-h-96 overflow-y-auto">
                      <div className="px-4 py-2 border-b border-gray-100 flex items-center justify-between">
                        <h3 className="text-sm font-medium text-gray-900">
                          Notifications
                        </h3>
                        {unreadCount > 0 && (
                          <button
                            onClick={markAllAsRead}
                            className="text-xs text-primary-600 hover:text-primary-500"
                          >
                            Mark all as read
                          </button>
                        )}
                      </div>

                      {notifications.length > 0 ? (
                        notifications.slice(0, 10).map((notification) => (
                          <button
                            key={notification.id}
                            onClick={() =>
                              handleNotificationClick(notification)
                            }
                            className={`w-full text-left px-4 py-3 hover:bg-gray-50 border-b border-gray-100 last:border-b-0 ${
                              !notification.read ? "bg-blue-50" : ""
                            }`}
                          >
                            <div className="flex items-start space-x-3">
                              {getNotificationIcon(notification.type)}
                              <div className="flex-1 min-w-0">
                                <p
                                  className={`text-sm font-medium ${
                                    !notification.read
                                      ? "text-gray-900"
                                      : "text-gray-700"
                                  }`}
                                >
                                  {notification.title}
                                </p>
                                <p className="text-xs text-gray-500 mt-1">
                                  {notification.message}
                                </p>
                                <p className="text-xs text-gray-400 mt-1">
                                  {notification.createdAt?.toDate?.()
                                    ? new Date(
                                        notification.createdAt.toDate()
                                      ).toLocaleString()
                                    : "Just now"}
                                </p>
                              </div>
                              {!notification.read && (
                                <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 mt-1"></div>
                              )}
                            </div>
                          </button>
                        ))
                      ) : (
                        <div className="px-4 py-3 text-sm text-gray-500">
                          No notifications
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* User Menu */}
                <div className="relative">
                  <button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="flex items-center space-x-2 text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                  >
                    <div className="h-8 w-8 rounded-full bg-primary-600 flex items-center justify-center">
                      <span className="text-white text-sm font-medium">
                        {userProfile?.name?.charAt(0) ||
                          currentUser.email?.charAt(0)}
                      </span>
                    </div>
                  </button>

                  {isUserMenuOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                      <div className="px-4 py-2 text-sm text-gray-700 border-b border-gray-100">
                        <p className="font-medium">
                          {userProfile?.name || "User"}
                        </p>
                        <p className="text-gray-500">{currentUser.email}</p>
                      </div>
                      <Link
                        to="/profile"
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        <User className="h-4 w-4 mr-2" />
                        Profile
                      </Link>
                      <Link
                        to="/settings"
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        <Settings className="h-4 w-4 mr-2" />
                        Settings
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        <LogOut className="h-4 w-4 mr-2" />
                        Sign out
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  to="/login"
                  className="text-gray-500 hover:text-gray-900 px-3 py-2 text-sm font-medium"
                >
                  Sign in
                </Link>
                <Link to="/signup" className="btn-primary">
                  Get Started
                </Link>
              </div>
            )}

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 text-gray-400 hover:text-gray-500"
              >
                {isMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 border-t border-gray-200">
              {currentUser &&
                currentNavigation.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    className="text-gray-500 hover:text-gray-900 block px-3 py-2 text-base font-medium"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                ))}
              {!currentUser && (
                <>
                  <Link
                    to="/login"
                    className="text-gray-500 hover:text-gray-900 block px-3 py-2 text-base font-medium"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Sign in
                  </Link>
                  <Link
                    to="/signup"
                    className="btn-primary block text-center"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Get Started
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
