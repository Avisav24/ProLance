import React, { useState, useEffect } from 'react';
// import Navbar from '../Navbar/Navbar'; // Temporarily removed due to resolution error. Please re-add with correct path.
import { motion } from 'framer-motion';
import image from './ace.png';
import image1 from './sabo.png';
import image2 from './luffy.png'
import Navbar from '../Navbar/Navbar';
import Footer from '../Footer/Footer';
const teamMemberVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } },
};

const missionVariants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1, transition: { duration: 1, ease: "easeOut" } },
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

    const currentMission = "Building Brilliance Digitally. We specialize in developing exceptional websites, functional applications, and comprehensive college projects, transforming ideas into tangible digital assets.";
    const prompt = `Elaborate extensively on the following mission statement, providing more detail, core values, suggesting future aspirations, and explaining what "Building Brilliance Digitally" truly encompasses. Ensure the response is concise, in not more than 8 lines, and returned as plain text without any special formatting (like markdown headers or lists): "${currentMission}"`;

    let chatHistory = [];
    chatHistory.push({ role: "user", parts: [{ text: prompt }] });
    const payload = { contents: chatHistory };
    const apiKey = "AIzaSyDOyPIUmU2QynPut9XtcS1RyiAXs89eaFw"; // Canvas will provide this in runtime
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      // Log the full response for debugging
      console.log("Gemini API Response Status:", response.status);
      console.log("Gemini API Response Headers:", response.headers);

      if (!response.ok) {
        // If response is not OK (e.g., 4xx or 5xx status code)
        const errorBody = await response.text();
        console.error("Gemini API HTTP Error:", response.status, errorBody);
        setErrorMessage(`API Error: ${response.status} - ${errorBody.substring(0, 100)}...`);
        setShowError(true);
        return; // Stop execution if there's an HTTP error
      }

      const result = await response.json();
      console.log("Gemini API Full Result:", result); // Log full JSON result

      if (result.candidates && result.candidates.length > 0 &&
          result.candidates[0].content && result.candidates[0].content.parts &&
          result.candidates[0].content.parts.length > 0) {
        const text = result.candidates[0].content.parts[0].text;
        setExpandedMission(text);
      } else {
        console.error("Gemini API response structure unexpected or empty content:", result);
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
      <Navbar/>
      <div className="text-center mt-7 p-4">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-4xl md:text-6xl font-bold text-gray-900 mb-6"
        >
          Things U need
          <span className="text-blue-400"> to Know </span>
        </motion.h1>
      </div>

      <div className="text-center mt-7 p-4">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-4xl md:text-6xl font-bold text-gray-900 mb-6"
        >
          Our
          <span className="text-blue-400"> Team </span>
        </motion.h1>
      </div>

      {/* Team Member Section */}
      <div className="flex flex-col md:flex-row justify-center items-center gap-8 mb-12 p-4">
        {/* Ace */}
        <motion.div
          variants={teamMemberVariants}
          initial="hidden"
          animate="visible"
          className="flex flex-col items-center"
        >
          <div className="w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden border-4 border-blue-400 shadow-lg">
            {/* Using the first uploaded image for Ace */}
            <img src={image } alt="Ace" className="w-full h-full object-cover" />
          </div>
          <p className="mt-4 text-xl md:text-2xl font-semibold text-gray-800">Ace</p>
        </motion.div>

        {/* Sabo */}
        <motion.div
          variants={teamMemberVariants}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.2 }}
          className="flex flex-col items-center"
        >
          <div className="w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden border-4 border-blue-400 shadow-lg">
            {/* Using the second uploaded image for Sabo */}
            <img src={image1} alt="Sabo" className="w-full h-full object-cover cursor-pointer hover:shadow-2xl" />
          </div>
          <p className="mt-4 text-xl md:text-2xl font-semibold text-gray-800">Sabo</p>
        </motion.div>

        {/* Luffy */}
        <motion.div
          variants={teamMemberVariants}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.4 }}
          className="flex flex-col items-center"
        >
          <div className="w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden border-4 border-blue-400 shadow-lg">
            {/* Using a placeholder image for Luffy as no third image was provided */}
            <img src={image2} alt="Luffy" className="w-full h-full object-cover" />
          </div>
          <p className="mt-4 text-xl md:text-2xl font-semibold text-gray-800">Luffy</p>
        </motion.div>
      </div>

      {/* Sworn Brothers Text */}
      <div className="text-center mb-12 p-4">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="text-3xl md:text-5xl font-extrabold text-gray-900"
        >
          Sworn     <span className="text-blue-400"> Brothers </span>
        </motion.p>
      </div>

      {/* Mission Section */}
      <div className="text-center max-w-4xl mx-auto p-4 mb-10">
        <motion.h2
          variants={missionVariants}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.8 }}
          className="text-3xl md:text-4xl font-bold text-gray-900 mb-4"
        >
          Our Mission
        </motion.h2>
        <motion.p
          variants={missionVariants}
          initial="hidden"
          animate="visible"
          transition={{ delay: 1 }}
          className="text-lg md:text-xl text-gray-700 leading-relaxed mb-6"
        >
          Building Brilliance Digitally. We specialize in developing exceptional websites, functional applications,
          and comprehensive college projects, transforming ideas into tangible digital assets.
        </motion.p>

        {/* Gemini API Integration: Mission Elaboration */}
        {loadingMission ? (
          <p className="text-blue-600 mt-4 text-lg">Loading expanded mission...</p>
        ) : (
          <>
            {showError && (
              <p className="text-red-600 mt-4 text-sm">
                Error generating mission elaboration: {errorMessage || "Please try again."}
              </p>
            )}
            {expandedMission && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="mt-8 p-6 bg-blue-50 rounded-lg shadow-inner text-left border border-blue-200"
              >
                <h3 className="text-2xl font-semibold text-blue-800 mb-3">Expanded Vision:</h3>
                <p className="text-gray-800 leading-relaxed text-base">{expandedMission}</p>
              </motion.div>
            )}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-lg shadow-lg transition duration-300 ease-in-out transform focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75 mt-6"
              onClick={elaborateMission}
              disabled={loadingMission}
            >
              ✨ Re-elaborate Mission ✨
            </motion.button>
          </>
        )}
      
      </div>
        <Footer/>
    </div>
  );
};

export default About;