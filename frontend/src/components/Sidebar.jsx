import { NavLink } from "react-router-dom";
import { FaHome, FaUser, FaCog } from "react-icons/fa";
import { RiArrowRightDoubleLine } from "react-icons/ri";
import { MdOutlineBusiness } from "react-icons/md";
import { MdLogout } from "react-icons/md";
import axiosClient from "../axiosClient";
import { useState } from "react";
import { useStateContext } from "../contexts/ContextProvider";
import Loading from "./loading";
import { IoPeople } from "react-icons/io5";
import { FaBoxOpen } from "react-icons/fa";
import { FaPenToSquare } from "react-icons/fa6";
import { BsGraphUpArrow } from "react-icons/bs";

const Sidebar = ({ isCollapsed, setCollapsed }) => {
  const URL = "auth";

  const [loading, setLoading] = useState(null);

  const { user, setTypePostion, setUser, setToken } = useStateContext();

  const menuItems = [
    {
      name: "Dashboard",
      path: "/dashboard",
      icon: <FaHome size={23} />,
    },
    {
      name: "Business",
      path: "/business",
      icon: <MdOutlineBusiness size={23} />,
    },
    {
      name: "Employee",
      path: "/employee",
      icon: <IoPeople side={23} />,
    },
    {
      name: "Product",
      path: "/product",
      icon: <FaBoxOpen size={23} />,
    },
    {
      name: "Attendance",
      path: "/attendance",
      icon: <FaPenToSquare size={23} />,
    },
    {
      name: "Sales",
      path: "/sale",
      icon: <BsGraphUpArrow size={23} />,
    },
    {
      name: "Logout",
      path: "/signin",
      icon: <MdLogout size={23} />,
      action: "true",
    },
  ];

  const handleLogout = async () => {
    try {
      setLoading(true);
      await axiosClient.post(`${URL}/logout`, {
        id: user.id,
      });
      setToken(null);
      setUser(null);
      setTypePostion(null);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4">
      {loading && <Loading />}
      <div className="flex justify-between">
        <h2 className="text-lg font-bold mb-4">Menu</h2>
        <RiArrowRightDoubleLine
          onClick={() => setCollapsed((prev) => !prev)}
          size={25}
          className={`md:hidden cursor-pointer transition-form duration 300 ${
            isCollapsed ? "rotate-180" : ""
          }`}
        />
      </div>

      <ul className="space-y-2">
        {menuItems.map((items) => (
          <li key={items.name}>
            {items.action ? (
              <button
                onClick={handleLogout}
                className={`flex items-center gap-3 cursor-pointer p-2 w-full text-left rounded-md transition-colors text-gray-700 hover:bg-gray-200 ${
                  isCollapsed ? "justify-center" : ""
                }`}
              >
                {items.icon}
                {!isCollapsed && <span>{items.name}</span>}
              </button>
            ) : (
              <NavLink
                to={items.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 p-2 rounded-md transition-colors ${
                    isActive
                      ? "bg-blue-600 text-white"
                      : "text-gray-700 hover:bg-gray-200"
                  } ${isCollapsed ? "justify-center" : ""}`
                }
              >
                {items.icon}
                {!isCollapsed && <span>{items.name}</span>}
              </NavLink>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;
