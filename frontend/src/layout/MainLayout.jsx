import { useStateContext } from "../contexts/ContextProvider";
import { Navigate, Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import { HiDotsVertical } from "react-icons/hi";
import Sidebar from "../components/Sidebar";
import { useState } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const MainLayout = () => {
  const { token, user, typePosition, setTypePostion, setToken, setUser } = useStateContext();
  const [isCollapsed, setCollapsed] = useState(false); 

  if (!token || !user) {
    setToken(null);
    setUser(null);
    setTypePostion(null);
    return <Navigate to="/signin" />;
  }

  if (typePosition == "teller") {
    return <Navigate to="/teller" />;
  }  

  return (
    <div className="flex h-screen overflow-hidden">
      {/* 🟩 Sidebar for large screens */}
      <div
        className={`border-r border-gray-200 shadow-md hidden md:flex flex-col justify-between transition-all duration-300 ${
          isCollapsed ? "w-20" : "w-64"
        }`}
      >
        <div>
          <Sidebar isCollapsed={isCollapsed} setCollapsed={setCollapsed} />
        </div>
        <div
          className={`flex p-3 border-t border-gray-200 items-center ${
            isCollapsed ? "justify-center" : ""
          }`}
        >
          <img src="" alt="" className="w-10 h-10 rounded-md" />
          {!isCollapsed && (
            <div className="flex justify-between items-center w-52 ml-3">
              <div className="leading-4">
                <h4 className="font-semibold">{`${user.first_name} ${user.last_name}`}</h4>
                <span className="text-sm text-gray-600 truncate block max-w-[160px]">
                  {user.email}
                </span>
              </div>
              <HiDotsVertical className="cursor-pointer" />
            </div>
          )}
        </div>
      </div>

      {/* 🟥 Sidebar overlay for small screens (mobile) */}
      {isCollapsed && (
        <div
          className={`fixed inset-0 z-[9999] flex md:hidden ${
            isCollapsed ? "" : "pointer-events-none"
          }`}
        >
          <div
            className={`bg-white w-64 shadow-md h-full flex flex-col justify-between transition-transform duration-300 ${
              isCollapsed ? "translate-x-0" : "-translate-x-full"
            }`}
          >
            <Sidebar isCollapsed={false} setCollapsed={setCollapsed} />
            <div className="flex p-3 border-t border-gray-200 items-center">
              <img src="" alt="" className="w-10 h-10 rounded-md bg-gray-300" />
              <div className="flex justify-between items-center w-52 ml-3">
                <div className="leading-4">
                  <h4 className="font-semibold">{`${user.first_name} ${user.last_name}`}</h4>
                  <span className="text-sm text-gray-600 truncate block max-w-[160px]">
                    {user.email}
                  </span>
                </div>
                <HiDotsVertical className="cursor-pointer" />
              </div>
            </div>
          </div>
          <div
            className="flex-1 bg-[rgba(0,0,0,0.3)]"
            onClick={() => setCollapsed((prev) => !prev)}
          ></div>
        </div>
      )}

      {/* 🟦 Main content area */}
      <div className="flex flex-col flex-1 h-full bg-gray-100">
        {/* Navbar stays fixed at the top */}
        <Navbar isCollapsed={isCollapsed} setCollapsed={setCollapsed} />

        {/* Scrollable outlet area */}
        <div className="flex-1 overflow-auto md:p-4 w-full">
          <div className="min-w-full overflow-x-auto">
            <Outlet />
          </div>
        </div>

        <ToastContainer position="top-center" autoClose={2500} />
      </div>
    </div>
  );
};

export default MainLayout;
