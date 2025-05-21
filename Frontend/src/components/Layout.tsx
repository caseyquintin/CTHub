import React from "react";
import { Link, useLocation } from "react-router-dom";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-md">
        <div className="p-4">
          <h1 className="text-xl font-bold text-indigo-600">Container Tracking</h1>
        </div>
        <nav className="mt-6">
          <Link
            to="/"
            className={`flex items-center px-6 py-3 ${
              isActive("/") ? "bg-indigo-50 text-indigo-600" : "text-gray-600 hover:bg-gray-50"
            }`}
          >
            <span className="mx-3">Dashboard</span>
          </Link>
          <Link
            to="/containers"
            className={`flex items-center px-6 py-3 ${
              isActive("/containers") ? "bg-indigo-50 text-indigo-600" : "text-gray-600 hover:bg-gray-50"
            }`}
          >
            <span className="mx-3">Containers</span>
          </Link>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
};

export default Layout;
