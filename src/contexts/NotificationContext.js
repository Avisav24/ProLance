import React, { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./AuthContext";
import {
  collection,
  query,
  where,
  onSnapshot,
  addDoc,
  serverTimestamp,
  doc,
  updateDoc,
  writeBatch,
  getDocs,
} from "firebase/firestore";
import { db } from "../firebase/config";

const NotificationContext = createContext();

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error(
      "useNotifications must be used within a NotificationProvider"
    );
  }
  return context;
};

export const NotificationProvider = ({ children }) => {
  const { currentUser, userProfile } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentUser) {
      setNotifications([]);
      setUnreadCount(0);
      setLoading(false);
      return;
    }

    const notificationsRef = collection(db, "notifications");
    const q = query(
      notificationsRef,
      where("recipientId", "==", currentUser.uid)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const notificationsData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      // Sort by createdAt (newest first)
      const sortedNotifications = notificationsData.sort((a, b) => {
        const dateA = a.createdAt?.toDate?.() || new Date(0);
        const dateB = b.createdAt?.toDate?.() || new Date(0);
        return dateB - dateA;
      });

      setNotifications(sortedNotifications);
      setUnreadCount(sortedNotifications.filter((n) => !n.read).length);
      setLoading(false);
    });

    return unsubscribe;
  }, [currentUser]);

  const markAsRead = async (notificationId) => {
    try {
      const notificationRef = doc(db, "notifications", notificationId);
      await updateDoc(notificationRef, {
        read: true,
        readAt: serverTimestamp(),
      });
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  const markAllAsRead = async () => {
    try {
      const batch = writeBatch(db);
      notifications
        .filter((n) => !n.read)
        .forEach((notification) => {
          const notificationRef = doc(db, "notifications", notification.id);
          batch.update(notificationRef, {
            read: true,
            readAt: serverTimestamp(),
          });
        });
      await batch.commit();
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
    }
  };

  const createNotification = async (
    recipientId,
    title,
    message,
    type = "info",
    projectId = null
  ) => {
    try {
      await addDoc(collection(db, "notifications"), {
        recipientId,
        title,
        message,
        type,
        projectId,
        read: false,
        createdAt: serverTimestamp(),
      });
    } catch (error) {
      console.error("Error creating notification:", error);
    }
  };

  const createNotificationForAdmins = async (
    title,
    message,
    type = "info",
    projectId = null
  ) => {
    try {
      const adminsQuery = query(
        collection(db, "users"),
        where("role", "==", "admin")
      );
      const adminSnapshot = await getDocs(adminsQuery);
      if (adminSnapshot.empty) {
        console.log("No admin users found to notify.");
        return;
      }

      const batch = writeBatch(db);
      adminSnapshot.forEach((adminDoc) => {
        const adminId = adminDoc.id;
        const notificationRef = doc(collection(db, "notifications"));
        batch.set(notificationRef, {
          recipientId: adminId,
          title,
          message,
          type,
          projectId,
          read: false,
          createdAt: serverTimestamp(),
        });
      });
      await batch.commit();
    } catch (error) {
      console.error("Error creating notification for admins:", error);
    }
  };

  const value = {
    notifications,
    unreadCount,
    loading,
    markAsRead,
    markAllAsRead,
    createNotification,
    createNotificationForAdmins,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};
