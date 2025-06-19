import React from "react";
import Header from "./Header";

const Layout = ({ children }) => {
  return (
    <div
      className="min-h-screen"
      style={{
        background:
          "linear-gradient(to bottom right, #f8f6f8, #ffe4e9, #c8e5ff)",
      }}
    >
      <Header />
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">{children}</main>
    </div>
  );
};

export default Layout;
