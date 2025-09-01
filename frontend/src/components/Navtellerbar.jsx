import { useStateContext } from "../contexts/ContextProvider";
import axiosClient from "../axiosClient";
import { MdPointOfSale } from "react-icons/md";
import ModalSales from "./ModalSales";
import { useState } from "react";
import toastify from "../components/toastify";

const Navtellerbar = ({ userNav, setUserNav }) => {
  const URL = "/auth";
  const { user, setToken, setTypePostion, setUser } = useStateContext();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [rows, setRows] = useState([]);

  const handleLogout = async () => {
    try {
      const countOrder = JSON.parse(localStorage.getItem("order"));

      if (countOrder && countOrder.length > 0) {
        toastify(
          "error",
          "You still have pending orders. Please complete them before logging out."
        );
        return;
      }

      await axiosClient.post(`${URL}/logout`, {
        id: user.id,
      });
      setToken(null);
      setTypePostion(null);
      setUser(null);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchSale = async () => {
    try {
      const response = await axiosClient.post("/sale/indexTeller", {
        business_id: user.business_id,
      });

      setIsModalOpen(true);
      setRows(response.data.sale);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="flex py-2  px-2 md:px-4 bg-white w-full items-center justify-between border-b border-gray-300">
      <ModalSales
        isOpen={isModalOpen}
        rows={rows}
        title={"Sales today"}
        onClose={() => setIsModalOpen(false)}
      />

      <div className="flex gap-3 items-center mr-10">
        <img
          src={user.business_image}
          alt={user.business_name}
          className="w-8 h-8 rounded-full bg-white object-cover"
        />
        <p className="text-md md:text-lg xl:text-2xl font-bold cursor-pointer">{`${user.business_name}`}</p>
      </div>

      <div className="flex space-x-1 md:space-x-2 md:space-x-2">
        <button
          onClick={fetchSale}
          title="View Sales"
          className="group relative flex items-center justify-center p-2 md:p-2.5 rounded-full bg-white shadow-sm hover:text-gray-700 transition duration-200 ease-in-out"
        >
          <MdPointOfSale className="w-5 h-5 md:w-6 md:h-6 transition-transform duration-200 group-hover:scale-110" />
        </button>

        <div className="relative flex flex-col">
          <button
            onClick={() => setUserNav((prev) => !prev)}
            className="flex items-center space-x-2 px-3 py-1.5 rounded-md bg-blue-600 hover:bg-blue-700 text-white transition"
          >
            <img
              src={user.image}
              alt={`${user.first_name} ${user.last_name}`}
              className="w-8 h-8 rounded-full bg-white object-cover"
            />
            <span className="font-semibold max-w-[80px] md:max-w-[120px] text-sm md:text-lg truncate">
              {user.first_name} {user.last_name}
            </span>
          </button>

          {userNav && (
            <div
              onClick={handleLogout}
              className="absolute top-full left-0 min-w-full bg-gray-200 mt-1 p-2 hover:bg-gray-300 font-medium rounded-md text-gray-700 cursor-pointer z-20"
            >
              Logout
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navtellerbar;
