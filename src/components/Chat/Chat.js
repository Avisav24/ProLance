import React, { useState, useEffect, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { Send, Paperclip, ArrowLeft, User, MessageSquare } from "lucide-react";
import {
  collection,
  doc,
  addDoc,
  onSnapshot,
  query,
  serverTimestamp,
  getDoc,
  setDoc,
  where,
} from "firebase/firestore";
import { db } from "../../firebase/config";
import toast from "react-hot-toast";

const Chat = () => {
  const { projectId } = useParams();
  const { currentUser, userProfile } = useAuth();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    fetchProject();
    setupChatListener();
  }, [projectId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchProject = async () => {
    try {
      const projectRef = doc(db, "projects", projectId);
      const projectSnap = await getDoc(projectRef);

      if (projectSnap.exists()) {
        setProject(projectSnap.data());
      }
    } catch (error) {
      console.error("Error fetching project:", error);
    }
  };

  const setupChatListener = () => {
    const chatRef = collection(db, "chats");
    const chatQuery = query(chatRef, where("projectId", "==", projectId));

    const unsubscribe = onSnapshot(
      chatQuery,
      (snapshot) => {
        const messagesData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        // Sort by createdAt in JavaScript
        const sortedMessages = messagesData.sort((a, b) => {
          const dateA = a.createdAt?.toDate?.() || new Date(0);
          const dateB = b.createdAt?.toDate?.() || new Date(0);
          return dateA - dateB; // Ascending order for chat
        });

        setMessages(sortedMessages);
        setLoading(false);
      },
      (error) => {
        console.error("Error listening to chat:", error);
        setLoading(false);
      }
    );

    return unsubscribe;
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const sendMessage = async (e) => {
    e.preventDefault();

    if (!newMessage.trim()) return;

    setSending(true);

    try {
      const messageData = {
        projectId,
        senderId: currentUser.uid,
        senderName:
          userProfile?.name || currentUser.displayName || currentUser.email,
        senderRole: userProfile?.role || "client",
        text: newMessage.trim(),
        createdAt: serverTimestamp(),
      };

      await addDoc(collection(db, "chats"), messageData);
      setNewMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error("Failed to send message");
    } finally {
      setSending(false);
    }
  };

  const formatTime = (timestamp) => {
    if (!timestamp) return "";
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const isOwnMessage = (message) => {
    return message.senderId === currentUser.uid;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link to={`/project/${projectId}`} className="btn-outline">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Link>
            <div>
              <h1 className="text-lg font-semibold text-gray-900">
                {project?.title || "Project Chat"}
              </h1>
              <p className="text-sm text-gray-500">
                Chat with the development team
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <MessageSquare className="h-5 w-5 text-primary-600" />
            <span className="text-sm text-gray-600">
              {messages.length} messages
            </span>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto bg-gray-50 p-4">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <MessageSquare className="h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No messages yet
            </h3>
            <p className="text-gray-500">
              Start the conversation by sending a message below.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  isOwnMessage(message) ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                    isOwnMessage(message)
                      ? "bg-primary-600 text-white"
                      : "bg-white text-gray-900 border border-gray-200"
                  }`}
                >
                  <div className="flex items-center space-x-2 mb-1">
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium ${
                        isOwnMessage(message)
                          ? "bg-primary-700 text-white"
                          : "bg-gray-200 text-gray-700"
                      }`}
                    >
                      {message.senderName?.charAt(0) || "U"}
                    </div>
                    <span
                      className={`text-xs ${
                        isOwnMessage(message)
                          ? "text-primary-100"
                          : "text-gray-500"
                      }`}
                    >
                      {message.senderName}
                    </span>
                    {message.senderRole === "admin" && (
                      <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
                        Admin
                      </span>
                    )}
                  </div>
                  <p className="text-sm whitespace-pre-wrap">{message.text}</p>
                  <p
                    className={`text-xs mt-1 ${
                      isOwnMessage(message)
                        ? "text-primary-100"
                        : "text-gray-400"
                    }`}
                  >
                    {formatTime(message.createdAt)}
                  </p>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Message Input */}
      <div className="bg-white border-t border-gray-200 px-6 py-4">
        <form onSubmit={sendMessage} className="flex space-x-4">
          <div className="flex-1">
            <textarea
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type your message..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              rows="2"
              disabled={sending}
            />
          </div>
          <div className="flex items-end space-x-2">
            <button
              type="button"
              className="p-2 text-gray-400 hover:text-gray-600"
              disabled={sending}
            >
              <Paperclip className="h-5 w-5" />
            </button>
            <button
              type="submit"
              disabled={!newMessage.trim() || sending}
              className="btn-primary px-4 py-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {sending ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              ) : (
                <Send className="h-4 w-4" />
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Chat;
