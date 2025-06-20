import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-12">
      <div className="container mx-auto px-4">
        {/* Changed grid-cols-1 md:grid-cols-3 to use auto-cols-fr and justify-between */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-19">
          <div>
            <h3 className="text-xl font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link to="/" className="hover:text-blue-400 transition-colors">Home</Link></li>
              <li><Link to="/reviews" className="hover:text-blue-400 transition-colors">Reviews</Link></li>
              <li><Link to="/about" className="hover:text-blue-400 transition-colors">About</Link></li>
            </ul>
          </div>
          {/* Add an empty div for the middle column to push "Follow Us" to the right */}
          <div></div> 
          <div className="md:text-right"> {/* Added md:text-right to align content to the right on medium screens and above */}
            <h3 className="text-xl font-semibold mb-4 justify-center">Follow Us</h3>
            <div className="flex space-x-3 mb-6 md:justify-end"> {/* Added md:justify-end to align social icons to the right */}
              <a href="#" className="hover:text-blue-600 transition-colors text-2xl"><i className="fab fa-facebook"></i></a>
              <a href="#" className="hover:text-blue-600 transition-colors text-2xl"><i className="fab fa-twitter"></i></a>
              <a href="#" className="hover:text-blue-600 transition-colors text-2xl"><i className="fab fa-linkedin"></i></a>
              <a href="#" className="hover:text-blue-600 transition-colors text-2xl"><i className="fab fa-instagram"></i></a>
            </div>
            <div className="text-sm text-gray-400">
              <p>&copy; 2025 Gradely . All rights reserved.</p>
              <p className="mt-2">
                <a href="#" className="hover:text-blue-400 transition-colors">Privacy Policy</a> |
                <a href="#" className="hover:text-blue-400 transition-colors">Terms of Service</a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;