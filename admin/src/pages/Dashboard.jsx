import React, { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { LogOut, FileText, PlusCircle, Menu } from "lucide-react";
import { useAppContext } from "../context/AppContext";

const colors = {
  midnightBlue: "#0A1F44",
  softWhite: "#FDFDFD",
  coolGray: "#DCE0E6",
  silverMist: "#C1C7D0",
  lavenderTint: "#E5E9F7",
  royalIndigo: "#3C4A9A",
};

const Dashboard = () => {
  const navigate = useNavigate();
  const {logout} = useAppContext();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/admin/login");
  };

  return (
    <div className="flex h-screen bg-[#0A1F44] text-[#FDFDFD] font-inter overflow-hidden">
      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-[#121D40] shadow-xl z-30 transform transition-transform duration-300
          md:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        <div className="flex flex-col h-full">
          <div
            style={{ backgroundColor: colors.midnightBlue }}
            className="flex items-center justify-center px-6 py-6 text-2xl font-extrabold tracking-wide shadow-md"
          >
            Tranquilify Admin
          </div>

          <nav className="flex-1 px-4 py-6 space-y-4 overflow-y-auto">
            <NavLink
              to="blogs"
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-3 rounded-lg font-semibold transition-colors duration-200 ${
                  isActive
                    ? `bg-[#3C4A9A] text-white shadow-md`
                    : `text-[#C1C7D0] hover:bg-[#3C4A9A]/80 hover:text-white`
                }`
              }
              onClick={() => setSidebarOpen(false)}
            >
              <FileText className="w-5 h-5" />
              Blog List
            </NavLink>

            <NavLink
              to="add"
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-3 rounded-lg font-semibold transition-colors duration-200 ${
                  isActive
                    ? `bg-[#3C4A9A] text-white shadow-md`
                    : `text-[#C1C7D0] hover:bg-[#3C4A9A]/80 hover:text-white`
                }`
              }
              onClick={() => setSidebarOpen(false)}
            >
              <PlusCircle className="w-5 h-5" />
              Add Blog
            </NavLink>
          </nav>

          <button
            onClick={handleLogout}
            style={{ backgroundColor: colors.royalIndigo }}
            className="mx-4 mb-6 rounded-lg py-3 font-semibold text-white hover:bg-[#2f3e7e] transition-colors duration-200 shadow-lg"
          >
            <div onClick={handleLogout} className="flex items-center justify-center gap-2">
              <LogOut className="w-5 h-5" />
              Logout
            </div>
          </button>
        </div>
      </aside>

      
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black opacity-40 z-20 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      
      <div className="flex flex-col flex-1 min-h-screen md:pl-64">
        <header
          style={{ backgroundColor: colors.midnightBlue }}
          className="flex items-center justify-between px-6 py-4 shadow-md text-[#FDFDFD]"
        >
          <button
            className="md:hidden focus:outline-none"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            aria-label="Toggle sidebar"
          >
            <Menu className="w-6 h-6 text-[#FDFDFD]" />
          </button>
          <h1 className="text-xl font-bold tracking-wide">Dashboard</h1>
          <div />
        </header>

        <main className="flex-1 p-6 bg-[#121A38] overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
