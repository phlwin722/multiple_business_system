import { useState, useRef, useEffect } from "react";
import { useStateContext } from "../../contexts/ContextProvider";

const MyAccount = () => {
  const { user } = useStateContext();
  const [paPassword, setPaPassword] = useState(false);
  const [myInfo, setMyInfo] = useState(true);

  const firstName = useRef(null);
  const lastName = useRef(null);
  const emailUser = useRef(null);

  useEffect(() => {
    if (user) {
      firstName.current.value = user.first_name;
      lastName.current.value = user.last_name;
      emailUser.current.value = user.email;
    }
  }, [user]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">My Account</h1>
      <div className="bg-white rounded-md mt-2 w-full shadow-lg">
        <div className="w-full border-b border-gray-300 py-3 px-5">
          <ul className="flex gap-5 justify-end">
            <li
              onClick={() => {
                setMyInfo(true);
                setPaPassword(false);
              }}
              className={`cursor-pointer ${
                myInfo ? "font-bold border-b-2 border-blue-500" : ""
              }`}
            >
              My Information
            </li>
            <li
              onClick={() => {
                setMyInfo(false);
                setPaPassword(true);
              }}
              className={`cursor-pointer ${
                paPassword ? "font-bold border-b-2 border-blue-500" : ""
              }`}
            >
              Password
            </li>
          </ul>
        </div>
        <div className="p-6">
          {myInfo ? (
            <div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div>
                  <label htmlFor="first_name">First name</label>
                  <input
                    ref={firstName}
                    type="text"
                    id="first_name"
                    className="py-2 px-4 w-full rounded-md mt-2 focus:ring-2 focus:ring-blue-500 focus:outline-none border border-gray-300"
                  />
                </div>
                <div>
                  <label htmlFor="last_name">Last name</label>
                  <input
                    ref={lastName}
                    type="text"
                    id="last_name"
                    className="py-2 px-4 w-full rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none mt-2"
                  />
                </div>
                <div>
                  <label htmlFor="email">Email</label>
                  <input
                    ref={emailUser}
                    type="text"
                    id="email"
                    className="block py-2 mt-2 w-full px-4  rounded-md border border-gray-300"
                  />
                </div>
                <div>
                  <label htmlFor="image">Image</label>
                </div>
              </div>
              <div className="flex justify-end mt-5">
                <button className="bg-blue-500 px-5 py-2 text-white rounded-md hover:bg-gray-600">
                  Save
                </button>
              </div>
            </div>
          ) : (
            paPassword && (
              <div className="flex flex-col gap-5">
                <div>
                  <label htmlFor="">Current Password</label>
                  <input
                    type="text"
                    className="border border-gray-300 w-full py-2 px-4 mt-2 rounded-md"
                  />
                </div>
                <div>
                  <label htmlFor="">New Password</label>
                  <input
                    type="text"
                    className="border border-gray-300 w-full py-2 px-4 mt-2 rounded-md"
                  />
                </div>
                <div>
                  <label htmlFor="">Confirm Password</label>
                  <input
                    type="text"
                    className="border border-gray-300 w-full px-4 py-2 mt-2 rounded-md"
                  />
                </div>
                <div className="flex justify-end">
                  <button className="bg-blue-500 py-2 px-5 text-white rounded-md hover:bg-blue-600">
                    Save
                  </button>
                </div>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default MyAccount;
