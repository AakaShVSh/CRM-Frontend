import React, { useState } from "react";
import {
  MdOutlineDashboard,
  MdPeople,
  MdOutlineSettings,
  MdMenu,
  MdClose,
  MdChevronLeft,
  MdChevronRight,
} from "react-icons/md";
import { Link, useLocation } from "react-router-dom";

const Sidebar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [desktopOpen, setDesktopOpen] = useState(true);
  const location = useLocation();

  const menuItems = [
    { name: "Customers", icon: <MdPeople size={22} />, pageLink: "/" },
    {
      name: "Dashboard",
      icon: <MdOutlineDashboard size={22} />,
      pageLink: "/dashboard",
    },
    { name: "Settings", icon: <MdOutlineSettings size={22} />, pageLink: "#" },
  ];

  return (
    <>
      {/* ── Mobile Topbar ── */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-40 h-14 bg-slate-900 text-white flex items-center px-4 gap-3 shadow-md">
        <button
          onClick={() => setMobileOpen(true)}
          className="p-1.5 rounded-lg hover:bg-slate-800 transition"
        >
          <MdMenu size={24} />
        </button>
        <h1 className="text-xl font-bold">
          CRM<span className="text-blue-500">.</span>
        </h1>
      </div>

      {/* ── Mobile Backdrop ── */}
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 z-40 bg-black/50"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* ── Sidebar ── */}
      <aside
        className={`
          fixed lg:static inset-y-0 left-0 z-50
          h-screen bg-slate-900 text-white flex flex-col
          transition-all duration-300 overflow-hidden shrink-0
          ${mobileOpen ? "translate-x-0 w-72" : "-translate-x-full w-72"}
          ${desktopOpen ? "lg:w-72" : "lg:w-20"}
          lg:translate-x-0
        `}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-800 min-h-[65px]">
          {/* Logo — hidden when desktop collapsed */}
          <div className={`${desktopOpen ? "block" : "hidden"} lg:block`}>
            {desktopOpen && (
              <div>
                <h1 className="text-2xl font-bold">
                  CRM<span className="text-blue-500">.</span>
                </h1>
                <p className="text-xs text-slate-400 mt-1">
                  Customer Management
                </p>
              </div>
            )}
          </div>

          {/* Desktop collapse/expand button */}
          <button
            onClick={() => setDesktopOpen(!desktopOpen)}
            className="hidden lg:flex p-2 rounded-lg hover:bg-slate-800 transition"
          >
            {desktopOpen ? (
              <MdChevronLeft size={22} />
            ) : (
              <MdChevronRight size={22} />
            )}
          </button>

          {/* Mobile close button */}
          <button
            onClick={() => setMobileOpen(false)}
            className="lg:hidden p-2 rounded-lg hover:bg-slate-800 transition"
          >
            <MdClose size={22} />
          </button>
        </div>

        {/* Menu */}
        <div className="flex-1 p-3">
          <div className="space-y-2">
            {menuItems.map((item) => (
              <Link
                key={item.name}
                to={item.pageLink}
                onClick={() => setMobileOpen(false)}
                title={!desktopOpen ? item.name : undefined}
              >
                <button
                  className={`w-full flex items-center p-3 rounded-xl transition
                    ${location.pathname === item.pageLink ? "bg-blue-600" : "hover:bg-slate-800"}
                    ${desktopOpen ? "gap-3" : "lg:justify-center gap-3"}
                  `}
                >
                  {item.icon}
                  <span
                    className={`font-medium ${desktopOpen ? "block" : "lg:hidden"}`}
                  >
                    {item.name}
                  </span>
                </button>
              </Link>
            ))}
          </div>
        </div>

        {/* Profile */}
        <div className="p-4 border-t border-slate-800">
          <div
            className={`flex items-center ${desktopOpen ? "gap-3" : "lg:justify-center gap-3"}`}
          >
            <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center font-bold shrink-0">
              A
            </div>
            <div className={desktopOpen ? "block" : "lg:hidden"}>
              <h3 className="font-medium">Admin</h3>
              <p className="text-xs text-slate-400">CRM Manager</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
