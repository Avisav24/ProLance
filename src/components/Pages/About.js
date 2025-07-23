import React, { useState, useEffect } from "react";
// import Navbar from '../Navbar/Navbar'; // Temporarily removed due to resolution error. Please re-add with correct path.
import { motion } from "framer-motion";
import image from "./ace.png";
import image1 from "./sabo.png";
import image2 from "./luffy.png";
import Navbar from "../Navbar/Navbar";
import Footer from "../Footer/Footer";
const teamMemberVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } },
};

const missionVariants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 1, ease: "easeOut" },
  },
};

const About = () => {
  const [expandedMission, setExpandedMission] = useState("");
  const [loadingMission, setLoadingMission] = useState(true); // Set to true to show loading on initial render
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState(""); // State to hold specific error message

  // Function to call the Gemini API for mission elaboration
  const elaborateMission = async () => {
    setLoadingMission(true);
    setShowError(false);
    setErrorMessage(""); // Clear previous error message
    setExpandedMission(""); // Clear previous expansion

    const currentMission =
      "Building Brilliance Digitally. We specialize in developing exceptional websites, functional applications, and comprehensive college projects, transforming ideas into tangible digital assets.";
    const prompt = `Elaborate extensively on the following mission statement, providing more detail, core values, suggesting future aspirations, and explaining what "Building Brilliance Digitally" truly encompasses. Ensure the response is concise, in not more than 8 lines, and returned as plain text without any special formatting (like markdown headers or lists): "${currentMission}"`;

    let chatHistory = [];
    chatHistory.push({ role: "user", parts: [{ text: prompt }] });
    const payload = { contents: chatHistory };
    const apiKey = "AIzaSyAgg2UOiZpbP7RSFqXvGa_Xqt0iq0cR4ds"; // Canvas will provide this in runtime
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      // Log the full response for debugging
      console.log("Gemini API Response Status:", response.status);
      console.log("Gemini API Response Headers:", response.headers);

      if (!response.ok) {
        // If response is not OK (e.g., 4xx or 5xx status code)
        const errorBody = await response.text();
        console.error("Gemini API HTTP Error:", response.status, errorBody);
        setErrorMessage(
          `API Error: ${response.status} - ${errorBody.substring(0, 100)}...`
        );
        setShowError(true);
        return; // Stop execution if there's an HTTP error
      }

      const result = await response.json();
      console.log("Gemini API Full Result:", result); // Log full JSON result

      if (
        result.candidates &&
        result.candidates.length > 0 &&
        result.candidates[0].content &&
        result.candidates[0].content.parts &&
        result.candidates[0].content.parts.length > 0
      ) {
        const text = result.candidates[0].content.parts[0].text;
        setExpandedMission(text);
      } else {
        console.error(
          "Gemini API response structure unexpected or empty content:",
          result
        );
        setErrorMessage("Unexpected API response. Content might be missing.");
        setShowError(true);
      }
    } catch (error) {
      console.error("Error calling Gemini API:", error);
      setErrorMessage(`Network or Fetch Error: ${error.message}`);
      setShowError(true);
    } finally {
      setLoadingMission(false);
    }
  };

  // Call elaborateMission on component mount to load expanded mission by default
  useEffect(() => {
    elaborateMission();
  }, []); // Empty dependency array ensures it runs only once on mount

  return (
    <div className="bg-brand-gradient min-h-screen">
      <Navbar />

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-12">
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center"
        >
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold mb-8">
            <span className="text-gray-900">Things U need</span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-blue-800">
              {" "}
              to Know
            </span>
          </h1>
        </motion.div>

        {/* Team Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-center mt-16 mb-12"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold">
            <span className="text-gray-900">Our</span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
              {" "}
              Team
            </span>
          </h2>
        </motion.div>

        {/* Team Members Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 lg:gap-12 max-w-4xl mx-auto mb-16">
          {/* Ace */}
          <motion.div
            variants={teamMemberVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            whileHover={{ y: -10 }}
            className="flex flex-col items-center group"
          >
            <div className="relative">
              <div className="absolute -inset-2 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full blur-lg opacity-0 group-hover:opacity-60 transition-opacity duration-500"></div>
              <div className="relative w-32 h-32 sm:w-36 sm:h-36 md:w-40 md:h-40 rounded-full overflow-hidden border-4 border-white shadow-2xl transform transition-all duration-300 group-hover:scale-105">
                <img
                  src={image}
                  alt="Ace"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            <p className="mt-6 text-xl md:text-2xl font-bold text-gray-800 group-hover:text-blue-600 transition-colors duration-300">
              Ace
            </p>
          </motion.div>

          {/* Sabo */}
          <motion.div
            variants={teamMemberVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            whileHover={{ y: -10 }}
            className="flex flex-col items-center group"
          >
            <div className="relative">
              <div className="absolute -inset-2 bg-gradient-to-r from-teal-400 to-blue-400 rounded-full blur-lg opacity-0 group-hover:opacity-60 transition-opacity duration-500"></div>
              <div className="relative w-32 h-32 sm:w-36 sm:h-36 md:w-40 md:h-40 rounded-full overflow-hidden border-4 border-white shadow-2xl transform transition-all duration-300 group-hover:scale-105">
                <img
                  src={image1}
                  alt="Sabo"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            <p className="mt-6 text-xl md:text-2xl font-bold text-gray-800 group-hover:text-teal-600 transition-colors duration-300">
              Sabo
            </p>
          </motion.div>

          {/* Luffy */}
          <motion.div
            variants={teamMemberVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            whileHover={{ y: -10 }}
            className="flex flex-col items-center group"
          >
            <div className="relative">
              <div className="absolute -inset-2 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full blur-lg opacity-0 group-hover:opacity-60 transition-opacity duration-500"></div>
              <div className="relative w-32 h-32 sm:w-36 sm:h-36 md:w-40 md:h-40 rounded-full overflow-hidden border-4 border-white shadow-2xl transform transition-all duration-300 group-hover:scale-105">
                <img
                  src={image2}
                  alt="Luffy"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            <p className="mt-6 text-xl md:text-2xl font-bold text-gray-800 group-hover:text-purple-600 transition-colors duration-300">
              Luffy
            </p>
          </motion.div>
        </div>

        {/* Sworn Brothers Text */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center mb-20"
        >
          <p className="text-3xl sm:text-4xl md:text-5xl font-extrabold">
            <span className="text-gray-900">Sworn</span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
              {" "}
              Brothers
            </span>
          </p>
        </motion.div>

        {/* Mission Section */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto"
        >
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl p-8 sm:p-12">
            <motion.h2
              variants={missionVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6 text-center"
            >
              Our Mission
            </motion.h2>

            <motion.p
              variants={missionVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-lg sm:text-xl text-gray-700 leading-relaxed mb-8 text-center"
            >
              Building Brilliance Digitally. We specialize in developing
              exceptional websites, functional applications, and comprehensive
              college projects, transforming ideas into tangible digital assets.
            </motion.p>

            {/* Gemini API Integration: Mission Elaboration */}
            {loadingMission ? (
              <div className="flex justify-center py-8">
                <div className="relative">
                  <div className="h-12 w-12 rounded-full border-t-2 border-b-2 border-blue-500 animate-spin"></div>
                  <div
                    className="absolute inset-0 h-12 w-12 rounded-full border-t-2 border-b-2 animate-spin"
                    style={{
                      borderColor: "#03A6A1",
                      animationDirection: "reverse",
                      animationDuration: "1.5s",
                    }}
                  ></div>
                </div>
              </div>
            ) : (
              <>
                {showError && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6"
                  >
                    <p className="text-red-600 text-sm">
                      Error generating mission elaboration:{" "}
                      {errorMessage || "Please try again."}
                    </p>
                  </motion.div>
                )}

                {expandedMission && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 sm:p-8 border border-blue-100 shadow-inner mb-8"
                  >
                    <h3 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-700 to-indigo-700 mb-4">
                      Expanded Vision:
                    </h3>
                    <p className="text-gray-800 leading-relaxed text-base sm:text-lg">
                      {expandedMission}
                    </p>
                  </motion.div>
                )}

                <div className="flex justify-center">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="relative px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-bold rounded-2xl shadow-lg transition-all duration-300 hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden group"
                    onClick={elaborateMission}
                    disabled={loadingMission}
                  >
                    <span className="relative z-10 flex items-center">
                      <span className="mr-2">✨</span>
                      Re-elaborate Mission
                      <span className="ml-2">✨</span>
                    </span>
                    <div
                      className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      style={{
                        background: "linear-gradient(135deg, #1D4ED8, #2563EB)",
                      }}
                    ></div>
                  </motion.button>
                </div>
              </>
            )}
          </div>
        </motion.div>
      </div>

      <Footer />
    </div>
  );
};

export default About;
