import React from "react";
import Sidebar from "../components/Sidebar";
import { Route, Routes } from "react-router-dom";
import Customer from "./Customer";
import Dashboard from "./Dashboard";

const Main = () => {
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex-1 overflow-y-auto bg-slate-100 pt-14 lg:pt-0">
        <Routes>
          <Route path="/" element={<Customer />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </div>
    </div>
  );
};

export default Main;
