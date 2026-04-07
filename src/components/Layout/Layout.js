import React from "react";
import Header from "./Header";

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen bg-[#f4f5f7]">
      <Header />
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8 mt-10">
        {children}
      </main>
    </div>
  );
};

export default Layout;
