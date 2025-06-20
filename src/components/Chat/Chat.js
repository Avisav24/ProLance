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
    <div className="h-[100vh] lg:h-[calc(100vh-2rem)] max-h-[900px] flex flex-col bg-gray-50 lg:rounded-2xl lg:shadow-2xl lg:border lg:border-gray-200 lg:m-4 overflow-hidden">
      {/* Header */}
      <div className="bg-white/95 backdrop-blur-sm border-b border-gray-200 px-4 sm:px-6 py-3 sm:py-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3 sm:space-x-4">
            <Link
              to={`/project/${projectId}`}
              className="inline-flex items-center px-3 py-1.5 sm:px-4 sm:py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition-all duration-200 hover:scale-105"
            >
              <ArrowLeft className="h-4 w-4 sm:mr-2" />
              <span className="hidden sm:inline">Back</span>
            </Link>
            <div className="min-w-0 flex-1">
              <h1 className="text-base sm:text-lg font-semibold text-gray-900 truncate">
                {project?.title || "Project Chat"}
              </h1>
              <p className="text-xs sm:text-sm text-gray-500 hidden sm:block">
                Chat with the development team
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2 bg-gradient-to-r from-blue-50 to-purple-50 px-3 py-1.5 rounded-full">
            <MessageSquare className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
            <span className="text-xs sm:text-sm font-medium text-gray-700">
              {messages.length}
            </span>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30 px-4 py-4 sm:px-6">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center px-4">
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-r from-blue-200 to-purple-200 rounded-full blur-2xl opacity-30"></div>
              <MessageSquare className="relative h-16 w-16 sm:h-20 sm:w-20 text-gray-400 mb-4" />
            </div>
            <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">
              No messages yet
            </h3>
            <p className="text-sm sm:text-base text-gray-500 max-w-sm">
              Start the conversation by sending a message below.
            </p>
          </div>
        ) : (
          <div className="space-y-3 sm:space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  isOwnMessage(message) ? "justify-end" : "justify-start"
                } animate-fadeIn`}
              >
                <div
                  className={`max-w-[85%] sm:max-w-xs lg:max-w-md px-4 py-3 rounded-2xl shadow-sm transition-all duration-200 hover:shadow-md ${
                    isOwnMessage(message)
                      ? "bg-gradient-to-br from-blue-500 to-blue-600 text-white"
                      : "bg-white text-gray-900 border border-gray-100"
                  }`}
                >
                  <div className="flex items-center space-x-2 mb-1.5">
                    <div
                      className={`w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center text-xs font-semibold shadow-inner ${
                        isOwnMessage(message)
                          ? "bg-blue-700/50 text-white"
                          : "bg-gradient-to-br from-gray-100 to-gray-200 text-gray-700"
                      }`}
                    >
                      {message.senderName?.charAt(0).toUpperCase() || "U"}
                    </div>
                    <span
                      className={`text-xs sm:text-sm font-medium ${
                        isOwnMessage(message)
                          ? "text-blue-100"
                          : "text-gray-600"
                      }`}
                    >
                      {message.senderName}
                    </span>
                    {message.senderRole === "admin" && (
                      <span className="text-xs bg-gradient-to-r from-yellow-100 to-orange-100 text-orange-800 px-2 py-0.5 rounded-full font-medium">
                        Admin
                      </span>
                    )}
                  </div>
                  <p className="text-sm sm:text-base leading-relaxed whitespace-pre-wrap break-words">
                    {message.text}
                  </p>
                  <p
                    className={`text-xs mt-2 ${
                      isOwnMessage(message) ? "text-blue-200" : "text-gray-400"
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
      <div className="bg-white border-t border-gray-200 px-4 py-3 sm:px-6 sm:py-4 shadow-lg">
        <form onSubmit={sendMessage} className="flex space-x-2 sm:space-x-4">
          <div className="flex-1 relative">
            <textarea
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type your message..."
              className="w-full px-4 py-3 sm:px-5 sm:py-3 pr-12 border-2 border-gray-200 rounded-2xl resize-none focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-400 transition-all duration-200 text-sm sm:text-base"
              rows="1"
              disabled={sending}
              style={{ minHeight: "44px", maxHeight: "120px" }}
              onInput={(e) => {
                e.target.style.height = "auto";
                e.target.style.height =
                  Math.min(e.target.scrollHeight, 120) + "px";
              }}
            />
          </div>
          <button
            type="submit"
            disabled={!newMessage.trim() || sending}
            className="px-4 sm:px-5 py-2 sm:py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-2xl hover:from-blue-600 hover:to-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-100 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105 disabled:hover:scale-100 shadow-lg hover:shadow-xl"
          >
            {sending ? (
              <div className="animate-spin rounded-full h-4 w-4 sm:h-5 sm:w-5 border-2 border-white border-t-transparent"></div>
            ) : (
              <Send className="h-4 w-4 sm:h-5 sm:w-5" />
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Chat;
