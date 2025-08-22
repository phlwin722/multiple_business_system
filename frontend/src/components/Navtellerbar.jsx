import { useStateContext } from "../contexts/ContextProvider";
import axiosClient from "../axiosClient";
import { MdPointOfSale } from "react-icons/md";
import ModalSales from "./ModalSales";
import { useState } from "react";
import Teller from "../pages/teller/Teller";

const Navtellerbar = ({ userNav, setUserNav }) => {
  const URL = "/auth";
  const { user, setToken, setTypePostion, setUser } = useStateContext();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [rows, setRows] = useState([]);

  const handleLogout = async () => {
    try {
      await axiosClient.post(`${URL}/logout`, {
        id: user.id,
      });
      setToken(null), setTypePostion(null), setUser(null);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchSale = async () => {
    try {
      const response = await axiosClient.post("/sale/indexTeller", {
        user_id: user.id,
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

      <div>
        <p className="text-md md:text-lg xl:text-2xl font-bold cursor-pointer">{`${user.business_name}`}</p>
      </div>
      <div className="flex space-x-1 md:space-x-2 md:space-x-2">
        <button
          onClick={fetchSale}
          title="View Sales"
          className="group relative flex items-center justify-center p-2 md:p-2.5 rounded-full border border-gray-300 bg-white shadow-sm hover:bg-blue-600 hover:text-white transition duration-200 ease-in-out"
        >
          <MdPointOfSale className="w-5 h-5 md:w-6 md:h-6 transition-transform duration-200 group-hover:scale-110" />
        </button>

        <div className="flex-col">
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
            <>
              <div
                onClick={() => setUserNav(false)}
                className="fixed inset-0 z-10"
              ></div>

              <div
                onClick={handleLogout}
                className="font-semibold fixed w-35 md:w-40 bg-gray-200 mt-1 p-2 hover:bg-gray-300 rounded-md px-4 text-gray-700 cursor-pointer z-20"
              >
                Logout
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navtellerbar;
