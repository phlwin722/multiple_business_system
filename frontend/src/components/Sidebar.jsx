import { NavLink } from "react-router-dom";
import { FaHome, FaUser, FaCog } from "react-icons/fa";
import { RiArrowRightDoubleLine } from "react-icons/ri";
import { MdOutlineBusiness } from "react-icons/md";
import { MdLogout } from "react-icons/md";
import axiosClient from "../axiosClient";
import { useEffect, useState } from "react";
import { IoIosArrowBack } from "react-icons/io";
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

  const [menuItems, setMenuItems] = useState([]);
  const [openMenus, setOpenMenus] = useState({});

  const toggleMenu = (name) => {
    setOpenMenus((prev) => ({
      ...prev,
      [name]: !prev[name],
    }));
  };

  const getExactPathFor = (parentName) => {
    const map = {
      Business: "/business",
      Employee: "/employee",
      Product: "/product",
    };
    return map[parentName] || "";
  };

  const validating = () => {
    if (user.position === "Admin") {
      setMenuItems([
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
          icon: <IoPeople side={23} />,
          Children: [
            {
              name: "List",
              path: "/employees",
            },
            {
              name: "Archive",
              path: "/employee/archives",
            },
          ],
        },
        {
          name: "Product",
          icon: <FaBoxOpen size={23} />,
          Children: [
            {
              name: "List",
              path: "/products",
            },
            {
              name: "Archive",
              path: "/product/archives",
            },
          ],
        },
        {
          name: "Attendance",
          path: "/attendance",
          icon: <FaPenToSquare size={23} />,
        },
        {
          name: "Sales",
          path: "/sales",
          icon: <BsGraphUpArrow size={23} />,
        },
        {
          name: "Logout",
          path: "/signin",
          icon: <MdLogout size={23} />,
          action: "true",
        },
      ]);
    } else {
      setMenuItems([
        {
          name: "Dashboard",
          path: "/dashboard",
          icon: <FaHome size={23} />,
        },
        {
          name: "Employee",
          icon: <IoPeople side={23} />,
          Children: [
            {
              name: "List",
              path: "/employees",
            },
            {
              name: "Archive",
              path: "/employee/archives",
            },
          ],
        },
        {
          name: "Product",
          icon: <FaBoxOpen size={23} />,
          Children: [
            {
              name: "List",
              path: "/products",
            },
            {
              name: "Archive",
              path: "/product/archives",
            },
          ],
        },
        {
          name: "Attendance",
          path: "/attendance",
          icon: <FaPenToSquare size={23} />,
        },
        {
          name: "Sales",
          path: "/sales",
          icon: <BsGraphUpArrow size={23} />,
        },
        {
          name: "Logout",
          path: "/signin",
          icon: <MdLogout size={23} />,
          action: "true",
        },
      ]);
    }
  };

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

  useEffect(() => {
    validating();
  }, []);

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
        {menuItems.map((item) => (
          <li key={item.name}>
            {item.action ? (
              // Logout button
              <button
                onClick={handleLogout}
                className={`flex items-center gap-3 cursor-pointer p-2 w-full text-left rounded-md transition-colors text-gray-700 hover:bg-gray-200 ${
                  isCollapsed ? "justify-center" : ""
                }`}
              >
                {item.icon}
                {!isCollapsed && <span>{item.name}</span>}
              </button>
            ) : item.Children ? (
              // Parent with dropdown
              <div>
                <button
                  onClick={() => toggleMenu(item.name)}
                  className={`flex items-center justify-between gap-3 p-2 w-full text-left rounded-md transition-colors text-gray-700 hover:bg-gray-200 ${
                    isCollapsed ? "justify-center" : ""
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {item.icon}
                    {!isCollapsed && <span>{item.name}</span>}
                  </div>
                  {!isCollapsed && (
                    <span
                      className={`transform transition-transform ${
                        openMenus[item.name] ? "-rotate-90" : ""
                      }`}
                    >
                      <IoIosArrowBack />
                    </span>
                  )}
                </button>

                {/* Dropdown children */}
                <div
                  className={`overflow-hidden transition-all duration-300 ${
                    isCollapsed
                      ? "max-h-0"
                      : openMenus[item.name]
                      ? "max-h-40"
                      : "max-h-0"
                  }`}
                >
                  <ul className="ml-6 mt-1 space-y-1">
                    {item.Children.map((child) => (
                      <li key={child.name}>
                        <NavLink
                          to={child.path}
                          end={child.path === getExactPathFor(item.name)}
                          className={({ isActive }) =>
                            `block px-2 py-1 rounded-md text-sm transition-colors ${
                              isActive
                                ? "bg-blue-500 text-white"
                                : "text-gray-700 hover:bg-gray-200"
                            }`
                          }
                        >
                          {child.name}
                        </NavLink>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ) : (
              // Normal NavLink
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 p-2 rounded-md transition-colors ${
                    isActive
                      ? "bg-blue-600 text-white"
                      : "text-gray-700 hover:bg-gray-200"
                  } ${isCollapsed ? "justify-center" : ""}`
                }
              >
                {item.icon}
                {!isCollapsed && <span>{item.name}</span>}
              </NavLink>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;
