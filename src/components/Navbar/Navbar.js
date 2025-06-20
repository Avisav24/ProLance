import { Link } from "react-router-dom";
import image from "./Gradely-G logo.png";
import image1 from "./logo.jpg";
const Navbar = () => {
  return (
    <header
      className="bg-white/90 dark:bg-[#048d87]/95 backdrop-blur-md shadow-sm sticky top-0 z-30 transition-all duration-300"
      style={{
        boxShadow:
          "0 1px 3px 0 rgba(0, 0, 0, 0.05), 0 20px 25px -5px rgba(0, 0, 0, 0.05), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
      }}
    >
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
        <div className="flex items-center justify-between">
          {/* Left: Logo and Brand */}
          <div className="flex items-center space-x-2 sm:ml-4 md:ml-8 lg:ml-12">
            <Link to="/" className="group">
              <div className="w-16 h-10 sm:w-20 sm:h-11 overflow-hidden rounded-xl transition-all duration-300 group-hover:scale-105 group-hover:shadow-lg">
                <img
                  src={image1}
                  alt="Gradely Logo"
                  className="w-full h-full object-cover"
                />
              </div>
            </Link>
          </div>

          {/* Right: Auth Buttons + Toggle */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            <Link
              to="/signup"
              className="relative px-4 sm:px-6 py-2 sm:py-2.5 text-sm font-medium text-white rounded-xl overflow-hidden group transition-all duration-300 hover:shadow-xl transform hover:scale-105"
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
            <Link
              to="/login"
              className="relative px-4 sm:px-6 py-2 sm:py-2.5 text-sm font-medium rounded-xl border-2 transition-all duration-300 transform hover:scale-105 hover:shadow-lg bg-white dark:bg-white text-gray-700 dark:text-gray-800 border-gray-200 dark:border-gray-200 hover:border-blue-500 dark:hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-50 hover:text-blue-700 dark:hover:text-blue-700 group"
            >
              <span className="relative z-10">Sign In</span>
              <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-indigo-50 opacity-0 group-hover:opacity-100 rounded-xl transition-opacity duration-300"></div>
            </Link>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
