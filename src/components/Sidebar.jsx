import React, { useState } from "react";
import {
  MdOutlineDashboard,
  MdPeople,
  MdOutlineSettings,
  MdMenu,
} from "react-icons/md";
import { Link, useLocation } from "react-router-dom";

const Sidebar = () => {
  const [open, setOpen] = useState(true);

  const location = useLocation();

  const menuItems = [
    {
      name: "Customers",
      icon: <MdPeople size={22} />,
      pageLink: "/",
    },
    {
      name: "Dashboard",
      icon: <MdOutlineDashboard size={22} />,
      pageLink: "/dashboard",
    },
    {
      name: "Settings",
      icon: <MdOutlineSettings size={22} />,
      // pageLink: "#",
    },
  ];

  return (
    <aside
      className={`h-screen bg-slate-900 text-white flex flex-col overflow-hidden transition-all duration-300 ${
        open ? "w-72" : "w-20"
      }`}
    >
      {/* Header */}
      <div
        className={`flex items-center p-4 border-b border-slate-800 ${
          open ? "justify-between" : "justify-center"
        }`}
      >
        {open && (
          <div>
            <h1 className="text-2xl font-bold">
              CRM<span className="text-blue-500">.</span>
            </h1>
            <p className="text-xs text-slate-400 mt-1">Customer Management</p>
          </div>
        )}

        <button
          onClick={() => setOpen(!open)}
          className="p-2 rounded-lg hover:bg-slate-800"
        >
          <MdMenu size={24} />
        </button>
      </div>

      {/* Menu */}
      <div className="flex-1 p-3">
        <div className="space-y-2">
          {menuItems.map((item) => (
            <Link key={item.name} to={item.pageLink}>
              <button
                className={`w-full flex items-center p-3 rounded-xl transition ${
                  location.pathname === item.pageLink
                    ? "bg-blue-600"
                    : "hover:bg-slate-800"
                } ${open ? "gap-3" : "justify-center"}`}
              >
                {item.icon}

                {open && <span className="font-medium">{item.name}</span>}
              </button>
            </Link>
          ))}
        </div>
      </div>

      {/* Profile */}
      <div className="p-4 border-t border-slate-800">
        <div
          className={`flex items-center ${open ? "gap-3" : "justify-center"}`}
        >
          <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center font-bold">
            A
          </div>

          {open && (
            <div>
              <h3 className="font-medium">Admin</h3>
              <p className="text-xs text-slate-400">CRM Manager</p>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
