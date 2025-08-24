import { useStateContext } from "../contexts/ContextProvider";
import { Navigate, Outlet, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { HiDotsVertical } from "react-icons/hi";
import Sidebar from "../components/Sidebar";
import { useState } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaUserCog } from "react-icons/fa";

const MainLayout = () => {
  const { token, user, typePosition, setTypePostion, setToken, setUser } =
    useStateContext();
  const [isCollapsed, setCollapsed] = useState(false);
  const [myAccount, setMyAccount] = useState(false);
  const navigate = useNavigate();

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
    <div className="min-h-screen flex">
      {/* 🟩 Sidebar for large screens */}
      <div
        className={`border-r border-gray-300 shadow-md hidden md:flex flex-col justify-between transition-all duration-300 ${
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
          <img src={user.image} alt="" className="w-10 h-10 rounded-md" />
          {!isCollapsed && (
            <div className="flex justify-between items-center w-52 ml-3 relative">
              <div className="leading-4">
                <h4 className="font-semibold">{`${user.first_name} ${user.last_name}`}</h4>
                <span className="text-sm text-gray-600 truncate block max-w-[160px]">
                  {user.email}
                </span>
              </div>
              {myAccount && (
                <div
                  onClick={() => {
                    navigate("/my-account"), setMyAccount(false);
                  }}
                  className="cursor-pointer absolute -top-12 bg-gray-300 hover:bg-gray-300 -right-15 mt-2 bg-white shadow-md rounded p-2 z-50"
                >
                  <div className="flex items-center gap-2 text-gray-700">
                    <FaUserCog />{" "}
                    <span className="cursor-pointer ">My account</span>{" "}
                  </div>
                </div>
              )}
              <HiDotsVertical
                onClick={() => setMyAccount((prev) => !prev)}
                className="cursor-pointer"
              />
            </div>
          )}
        </div>
      </div>

      {/* 🟥 Sidebar overlay for small screens (mobile) */}
      {isCollapsed && (
        <div
          onClick={() => (setCollapsed(false), setMyAccount(false))}
          className={`fixed inset-0 z-[9999] flex md:hidden ${
            isCollapsed ? "" : "pointer-events-none"
          }`}
        >
          {/* Sidebar drawer */}
          <div
            className={`bg-white w-64 shadow-md h-full flex flex-col justify-between transition-transform duration-300 ${
              isCollapsed ? "translate-x-0" : "-translate-x-full"
            }`}
          >
            <Sidebar isCollapsed={false} setCollapsed={setCollapsed} />
            <div className="flex p-3 border-t border-gray-200 items-center relative">
              <img src={user.image} alt="" className="w-10 h-10 rounded-md bg-gray-300" />
              <div className="flex justify-between items-center w-52 ml-3">
                <div className="leading-4">
                  <h4 className="font-semibold">{`${user.first_name} ${user.last_name}`}</h4>
                  <span className="text-s  text-gray-600 truncate block max-w-[160px]">
                    {user.email}
                  </span>
                </div>

                {myAccount && (
                  <div
                    onClick={() => {
                      navigate("/my-account"), setMyAccount(false);
                    }}
                    className="cursor-pointer absolute -top-9 bg-gray-300 hover:bg-gray-300 -right-15 mt-2 bg-white shadow-md rounded p-2 z-50"
                  >
                    <div className="flex items-center gap-2 text-gray-700">
                      <FaUserCog />{" "}
                      <span className="cursor-pointer ">My account</span>{" "}
                    </div>
                  </div>
                )}
                <HiDotsVertical
                  onClick={(e) => {
                    e.stopPropagation(); // prevents parent click handler
                    setMyAccount((prev) => !prev);
                  }}
                  className="cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* Dark overlay to close sidebar */}
          <div
            className="flex-1 bg-[rgba(0,0,0,0.3)]"
            onClick={() => setCollapsed((prev) => !prev)}
          ></div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col bg-gray-100 h-screen">
        {/* Navbar */}
        <Navbar isCollapsed={isCollapsed} setCollapsed={setCollapsed} />

        {/* ✅ Outlet - scrollable content area */}
        <div className="flex-1 overflow-y-auto">
          <ToastContainer position="top-center" autoClose={2500} />
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default MainLayout;
