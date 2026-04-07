import React, { useState, useEffect, useRef } from "react";
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

  const notificationMenuRef = useRef(null);
  const notificationButtonRef = useRef(null);
  const userMenuRef = useRef(null);
  const userMenuButtonRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        notificationMenuRef.current &&
        !notificationMenuRef.current.contains(event.target) &&
        notificationButtonRef.current &&
        !notificationButtonRef.current.contains(event.target)
      ) {
        setIsNotificationMenuOpen(false);
      }
      if (
        userMenuRef.current &&
        !userMenuRef.current.contains(event.target) &&
        userMenuButtonRef.current &&
        !userMenuButtonRef.current.contains(event.target)
      ) {
        setIsUserMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

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
        return <Check className="h-4 w-4" style={{ color: "#03A6A1" }} />;
      case "warning":
        return <AlertCircle className="h-4 w-4 text-amber-500" />;
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
    <header
      className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200"
      style={{
        boxShadow: "0 1px 2px rgba(0, 0, 0, 0.04)",
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link
              to={dashboardPath}
              className="flex items-center space-x-2 group"
            >
              <div className="relative">
                <span className="text-2xl sm:text-3xl font-black tracking-tight leading-none transition-transform duration-300 group-hover:opacity-80 inline-block">
                  <span className="text-emerald-700">Pro</span>
                  <span className="text-emerald-500">Lance</span>
                </span>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {currentUser &&
              currentNavigation.map((item, index) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className="relative px-4 py-2 text-sm font-medium text-gray-700 transition-all duration-300 rounded-lg group"
                  style={{
                    animation: `fadeInNav 0.3s ease-out ${index * 0.1}s both`,
                  }}
                >
                  <span className="relative z-10 transition-colors duration-300 group-hover:text-blue-600">
                    {item.name}
                  </span>
                  <div className="absolute inset-0 bg-gray-100 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
                </Link>
              ))}
          </nav>

          {/* User Menu */}
          <div className="flex items-center space-x-2">
            {currentUser ? (
              <>
                {/* Notifications */}
                <div className="relative">
                  <button
                    ref={notificationButtonRef}
                    onClick={() =>
                      setIsNotificationMenuOpen(!isNotificationMenuOpen)
                    }
                    className="relative p-2.5 rounded-full transition-all duration-300 group"
                    style={{
                      background: isNotificationMenuOpen
                        ? "linear-gradient(135deg, #E6F7F6, #F0FFFE)"
                        : "transparent",
                    }}
                    onMouseEnter={(e) => {
                      if (!isNotificationMenuOpen) {
                        e.currentTarget.style.background =
                          "linear-gradient(135deg, #F8F9FA, #F1F3F5)";
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isNotificationMenuOpen) {
                        e.currentTarget.style.background = "transparent";
                      }
                    }}
                  >
                    <Bell className="h-5 w-5 text-gray-600 transition-all duration-300 group-hover:text-gray-900 group-hover:scale-110" />
                    {unreadCount > 0 && (
                      <span
                        className="absolute -top-0.5 -right-0.5 h-5 w-5 flex items-center justify-center text-xs font-bold text-white rounded-full transform transition-all duration-300 hover:scale-110"
                        style={{
                          background:
                            "linear-gradient(135deg, #FF6B6B, #EE5A6F)",
                          boxShadow: "0 2px 5px rgba(238, 90, 111, 0.3)",
                        }}
                      >
                        {unreadCount > 9 ? "9+" : unreadCount}
                      </span>
                    )}
                  </button>

                  {isNotificationMenuOpen && (
                    <div
                      ref={notificationMenuRef}
                      className="fixed top-20 right-4 left-4 rounded-2xl bg-white overflow-hidden transform transition-all duration-300 origin-top
                                 sm:absolute sm:top-full sm:left-auto sm:right-0 sm:mt-2 sm:w-96 sm:origin-top-right"
                      style={{
                        boxShadow:
                          "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
                        animation: "slideInNotification 0.3s ease-out",
                      }}
                    >
                      <div
                        className="px-6 py-4 flex items-center justify-between"
                        style={{
                          background:
                            "linear-gradient(135deg, #F8FAFC, #F1F5F9)",
                        }}
                      >
                        <h3 className="text-base font-semibold text-gray-900">
                          Notifications
                        </h3>
                        {unreadCount > 0 && (
                          <button
                            onClick={markAllAsRead}
                            className="text-sm font-medium transition-all duration-200 hover:scale-105"
                            style={{ color: "#03A6A1" }}
                            onMouseEnter={(e) => {
                              e.target.style.color = "#028a85";
                            }}
                            onMouseLeave={(e) => {
                              e.target.style.color = "#03A6A1";
                            }}
                          >
                            Mark all as read
                          </button>
                        )}
                      </div>

                      <div className="overflow-y-auto max-h-[28rem] scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent">
                        {notifications.length > 0 ? (
                          notifications
                            .slice(0, 10)
                            .map((notification, index) => (
                              <button
                                key={notification.id}
                                onClick={() =>
                                  handleNotificationClick(notification)
                                }
                                className={`w-full text-left px-6 py-4 transition-all duration-200 relative group ${
                                  !notification.read
                                    ? "bg-gradient-to-r from-blue-50/50 to-indigo-50/50"
                                    : "hover:bg-gray-50"
                                }`}
                                style={{
                                  animation: `fadeInNotification 0.3s ease-out ${
                                    index * 0.05
                                  }s both`,
                                }}
                              >
                                <div className="flex items-start space-x-3">
                                  <div className="flex-shrink-0 mt-0.5">
                                    {getNotificationIcon(notification.type)}
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <p
                                      className={`text-sm leading-5 ${
                                        !notification.read
                                          ? "font-semibold text-gray-900"
                                          : "font-medium text-gray-700"
                                      }`}
                                    >
                                      {notification.title}
                                    </p>
                                    <p className="text-sm text-gray-500 mt-1 leading-5">
                                      {notification.message}
                                    </p>
                                    <p className="text-xs text-gray-400 mt-2">
                                      {notification.createdAt?.toDate?.()
                                        ? new Date(
                                            notification.createdAt.toDate(),
                                          ).toLocaleString()
                                        : "Just now"}
                                    </p>
                                  </div>
                                  {!notification.read && (
                                    <div
                                      className="w-2 h-2 rounded-full flex-shrink-0 mt-2 animate-pulse"
                                      style={{
                                        background:
                                          "linear-gradient(135deg, #2563EB, #3B82F6)",
                                      }}
                                    ></div>
                                  )}
                                </div>
                                <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent opacity-50"></div>
                              </button>
                            ))
                        ) : (
                          <div className="px-6 py-16 text-center">
                            <Bell className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                            <p className="text-sm text-gray-500">
                              No notifications yet
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* User Menu */}
                <div className="relative ml-2">
                  <button
                    ref={userMenuButtonRef}
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="flex items-center space-x-2 text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                  >
                    <div
                      className="h-8 w-8 rounded-full bg-primary-600 flex items-center justify-center"
                      style={{
                        background: `linear-gradient(135deg, #2563EB, #3B82F6)`,
                      }}
                    >
                      <span className="text-white text-sm font-medium">
                        {userProfile?.name?.charAt(0) || "U"}
                      </span>
                    </div>
                  </button>

                  {isUserMenuOpen && (
                    <div
                      ref={userMenuRef}
                      className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg py-2 z-50 transform transition-all duration-300 origin-top-right"
                      style={{
                        boxShadow:
                          "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
                        animation: "slideInMenu 0.3s ease-out",
                      }}
                    >
                      <div
                        className="px-6 py-4"
                        style={{
                          background:
                            "linear-gradient(135deg, #F8FAFC, #F1F5F9)",
                        }}
                      >
                        <p className="font-semibold text-gray-900">
                          {userProfile?.name || "User"}
                        </p>
                        <p className="text-sm text-gray-500 mt-0.5">
                          {currentUser.email}
                        </p>
                      </div>
                      <div className="py-2">
                        <Link
                          to="/profile"
                          className="flex items-center px-6 py-3 text-sm text-gray-700 transition-all duration-200 hover:bg-gray-50 group"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          <User className="h-4 w-4 mr-3 text-gray-400 transition-colors duration-200 group-hover:text-gray-600" />
                          <span className="transition-transform duration-200 group-hover:translate-x-0.5">
                            Profile
                          </span>
                        </Link>
                        <Link
                          to="/settings"
                          className="flex items-center px-6 py-3 text-sm text-gray-700 transition-all duration-200 hover:bg-gray-50 group"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          <Settings className="h-4 w-4 mr-3 text-gray-400 transition-colors duration-200 group-hover:text-gray-600" />
                          <span className="transition-transform duration-200 group-hover:translate-x-0.5">
                            Settings
                          </span>
                        </Link>
                        <div className="border-t border-gray-100 mt-2 pt-2">
                          <button
                            onClick={handleLogout}
                            className="flex items-center w-full px-6 py-3 text-sm text-red-600 transition-all duration-200 hover:bg-red-50 group"
                          >
                            <LogOut className="h-4 w-4 mr-3 transition-transform duration-200 group-hover:-translate-x-0.5" />
                            <span>Sign out</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  to="/login"
                  className="px-5 py-2.5 text-sm font-medium text-gray-700 hover:text-gray-900 transition-all duration-200"
                >
                  Sign in
                </Link>
                <Link
                  to="/signup"
                  className="relative px-6 py-2.5 text-sm font-medium text-white rounded-full overflow-hidden group transition-all duration-300 hover:shadow-lg"
                  style={{
                    background: "linear-gradient(135deg, #2563EB, #3B82F6)",
                  }}
                >
                  <span className="relative z-10">Get Started</span>
                  <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    style={{
                      background: "linear-gradient(135deg, #1D4ED8, #2563EB)",
                    }}
                  ></div>
                </Link>
              </div>
            )}

            {/* Mobile menu button */}
            <div className="md:hidden ml-3">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2.5 rounded-xl transition-all duration-300"
                style={{
                  background: isMenuOpen
                    ? "linear-gradient(135deg, #F8F9FA, #F1F3F5)"
                    : "transparent",
                }}
              >
                {isMenuOpen ? (
                  <X className="h-6 w-6 text-gray-700 transition-transform duration-300 rotate-90" />
                ) : (
                  <Menu className="h-6 w-6 text-gray-700 transition-transform duration-300" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div
            className="md:hidden"
            style={{
              animation: "slideDownMobile 0.3s ease-out",
            }}
          >
            <div className="px-2 py-4 space-y-2 border-t border-gray-100">
              {currentUser &&
                currentNavigation.map((item, index) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    className="text-gray-700 hover:text-gray-900 block px-4 py-3 text-base font-medium rounded-xl transition-all duration-200 hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-100"
                    onClick={() => setIsMenuOpen(false)}
                    style={{
                      animation: `fadeInMobile 0.3s ease-out ${
                        index * 0.1
                      }s both`,
                    }}
                  >
                    {item.name}
                  </Link>
                ))}
              {!currentUser && (
                <div className="space-y-3 pt-3">
                  <Link
                    to="/login"
                    className="text-gray-700 hover:text-gray-900 block px-4 py-3 text-base font-medium rounded-xl transition-all duration-200 hover:bg-gray-50"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Sign in
                  </Link>
                  <Link
                    to="/signup"
                    className="block mx-2 px-6 py-3 text-white text-center font-medium rounded-full transition-all duration-300 hover:shadow-lg"
                    onClick={() => setIsMenuOpen(false)}
                    style={{
                      background: "linear-gradient(135deg, #2563EB, #3B82F6)",
                    }}
                  >
                    Get Started
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes fadeInNav {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideInNotification {
          from {
            opacity: 0;
            transform: scale(0.95) translateY(-10px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }

        @keyframes slideInMenu {
          from {
            opacity: 0;
            transform: scale(0.95) translateY(-10px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }

        @keyframes fadeInNotification {
          from {
            opacity: 0;
            transform: translateX(-10px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes slideDownMobile {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeInMobile {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        .scrollbar-thin::-webkit-scrollbar {
          width: 6px;
        }

        .scrollbar-thin::-webkit-scrollbar-track {
          background: transparent;
        }

        .scrollbar-thin::-webkit-scrollbar-thumb {
          background-color: #e5e7eb;
          border-radius: 20px;
        }

        .scrollbar-thin::-webkit-scrollbar-thumb:hover {
          background-color: #d1d5db;
        }
      `}</style>
    </header>
  );
};

export default Header;
