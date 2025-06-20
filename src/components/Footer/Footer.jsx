import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <>
      {/* Divider */}
      <div className="w-full h-1 bg-gradient-to-r from-blue-100 via-blue-300 to-blue-100 opacity-60 mb-0"></div>
      <footer className="bg-gradient-to-r from-gray-900 via-blue-900 to-gray-800 text-white py-10 animate-fadeIn">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-20 items-center">
            {/* Quick Links */}
            <div className="text-center md:text-left">
              <h3 className="text-xl font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li><Link to="/" className="hover:text-blue-400 transition-colors">Home</Link></li>
                <li><Link to="/reviews" className="hover:text-blue-400 transition-colors">Reviews</Link></li>
                <li><Link to="/about" className="hover:text-blue-400 transition-colors">About</Link></li>
              </ul>
            </div>
            {/* Center Logo or Slogan */}
            <div className="flex flex-col items-center justify-center my-6 md:my-0">
              <img src="/gradely-removebg.png" alt="Gradely Logo" className="h-24 mb-2 animate-fadeIn" />
              <span className="text-lg text-blue-200 font-semibold tracking-wide">Empowering Your Projects</span>
            </div>
            {/* Social & Legal */}
            <div className="md:text-right text-center">
              <h3 className="text-xl font-semibold mb-4">Follow Us</h3>
              <div className="flex justify-center md:justify-end space-x-3 mb-6">
                <a href="#" className="bg-white/10 hover:bg-blue-600 transition-colors rounded-full p-2 text-2xl"><i className="fab fa-facebook"></i></a>
                <a href="#" className="bg-white/10 hover:bg-blue-600 transition-colors rounded-full p-2 text-2xl"><i className="fab fa-twitter"></i></a>
                <a href="#" className="bg-white/10 hover:bg-blue-600 transition-colors rounded-full p-2 text-2xl"><i className="fab fa-linkedin"></i></a>
                <a href="#" className="bg-white/10 hover:bg-blue-600 transition-colors rounded-full p-2 text-2xl"><i className="fab fa-instagram"></i></a>
              </div>
              <div className="text-sm text-gray-400">
                <p>&copy; 2025 Gradely. All rights reserved.</p>
                <p className="mt-2">
                  <a href="#" className="hover:text-blue-400 transition-colors">Privacy Policy</a> |
                  <a href="#" className="hover:text-blue-400 transition-colors ml-1">Terms of Service</a>
                </p>
              </div>
            </div>
          </div>
        </div>
        {/* Fade-in animation */}
        <style>{`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(30px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .animate-fadeIn {
            animation: fadeIn 1.2s cubic-bezier(0.4,0,0.2,1) both;
          }
        `}</style>
      </footer>
    </>
  );
};

export default Footer;