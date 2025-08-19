import { useStateContext } from "../contexts/ContextProvider";
import { useState } from "react";

const Navbarteller = () => {
  const { user } = useStateContext();
  const [userNav, setUserNav] = useState(false)

  return (
    <div className="flex py-2  px-4 bg-white w-full items-center justify-between border-b border-gray-300">
      <div>
        <p className="text-2xl ml-5 font-bold">{`${user.business_name} `}</p>
      </div>
      <div>
        <button onClick={() => setUserNav((prev) => !prev)} className="flex spaces-x-2 bg-blue-500 hover:bg-blue-700 text-white border border-gray-300 rounded-md items-center p-2">
          <img
            className="w-6 h-6 mr-2 bg-white rounded-2xl p-1"
            src={user.image}
            alt={user.business_name}
          />
          <p>{`${user.first_name} ${user.last_name}`}</p>
        </button>
        { userNav && (
           <div className="fixed w-33 bg-gray-200 mt-1 p-2 hover:bg-gray-300 rounded-md text-gray-700 cursor-pointer">Logout</div>
        )}
      </div>
    </div>
  );
};

export default Navbarteller;
