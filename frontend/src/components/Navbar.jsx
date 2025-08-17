import React from "react";
import { MdOutlineKeyboardDoubleArrowLeft } from "react-icons/md";

const Navbar = ({ isCollapsed, setCollapsed }) => {
  return (
    <div className="bg-white border-b border-gray-200 p-3">
      <div className="flex">
        <button
          className="cursor-pointer"
          onClick={() => setCollapsed((prev) => !prev)}
        >
          <MdOutlineKeyboardDoubleArrowLeft
            size={25}
            className={`transition-transform duration-300 ${
              isCollapsed ? "rotate-180" : ""
            }`}
          />
        </button>
        <p className="text-2xl ml-5 font-bold">Muibu</p>
      </div>
    </div>
  );
};

export default Navbar;
