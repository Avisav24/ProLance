import React from "react";
import { Link } from "react-router-dom";

const EmailVerified = () => (
  <div className="min-h-screen flex flex-col items-center justify-center bg-brand-gradient px-4 py-12">
    <span className="mb-6 text-4xl sm:text-5xl font-extrabold tracking-tight leading-none">
      <span className="text-blue-700">Pro</span>
      <span className="text-pink-500">Lance</span>
    </span>
    <h1 className="text-2xl font-bold mb-4 text-center">Email Verified!</h1>
    <p className="text-gray-700 text-center max-w-md mb-8">
      Your email has been successfully verified. You can now sign in to your
      account.
    </p>
    <Link
      to="/login"
      className="px-8 py-3 bg-blue-600 text-white rounded-full font-medium hover:bg-blue-700 transition-all duration-200"
    >
      Move to Sign In
    </Link>
  </div>
);

export default EmailVerified;
