import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <header
      className="bg-white border-b border-gray-200 sticky top-0 z-30"
      style={{
        boxShadow: "0 1px 2px rgba(0, 0, 0, 0.04)",
      }}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex items-center justify-between">
          {/* Left: Logo and Brand */}
          <div className="flex items-center space-x-2">
            <Link to="/" className="group">
              <div className="transition-all duration-200 group-hover:opacity-80">
                <span className="text-2xl sm:text-3xl font-black tracking-tight leading-none">
                  <span className="text-emerald-700">Pro</span>
                  <span className="text-emerald-500">Lance</span>
                </span>
              </div>
            </Link>
          </div>

          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-700">
            <Link to="/" className="hover:text-gray-900">Community</Link>
            <Link to="/about" className="hover:text-gray-900">Jobs</Link>
            <Link to="/reviews" className="hover:text-gray-900">Companies</Link>
            <Link to="/reviews" className="hover:text-gray-900">Salaries</Link>
          </div>

          {/* Right: Auth Buttons + Toggle */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            <Link
              to="/signup"
              className="px-4 sm:px-5 py-2 text-sm font-semibold text-white rounded-lg bg-gray-900 hover:bg-black transition-colors"
            >
              Create post
            </Link>
            <Link
              to="/login"
              className="px-4 sm:px-5 py-2 text-sm font-semibold rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 transition-colors"
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
