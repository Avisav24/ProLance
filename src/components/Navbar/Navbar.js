import { Link } from "react-router-dom";
import image from "./Gradely-G logo.png";
import image1 from "./logo.jpg";
const Navbar = () => {
  return (
    <header className="bg-white dark:bg-[#048d87] shadow-sm sticky top-0 z-30 transition-colors duration-300">
      <nav className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Left: Logo and Brand */}
          <div className="flex items-center space-x-2 ml-12">
            <div className="w-20 h-11 overflow-hidden rounded-lg">
              <img
                src={image1}
                alt="Gradely Logo"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Right: Auth Buttons + Toggle */}
          <div className="flex items-center space-x-4">
            <Link
              to="/signup"
              className="btn-primary bg-blue-500 text-sm px-5 py-2 rounded hover:shadow-md dark:bg-blue-800"
            >
              Get Started
            </Link>
            <Link
              to="/login"
              className="btn-outline text-sm px-5 py-2 rounded hover:bg-blue-500 hover:text-white dark:bg-white dark:text-black dark:hover:bg-blue-500 dark:hover:text-white dark:hover:border-blue-500"
            >
              Sign In
            </Link>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
