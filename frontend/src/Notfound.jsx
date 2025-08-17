import React from "react";
import { useNavigate } from "react-router-dom";

const Notfound = () => {
  const navigate = useNavigate();
  return (
    <div className="w-full min-h-screen bg-gray-100 flex flex-col items-center justify-center text-center px-4">
      <h1 className="text-[100px] font-extrabold text-blue-600 leading-none mb-4">
        404
      </h1>
      <h2 className="text-2xl md:text-3xl font-semibold mb-2">
        Oops! Page not found
      </h2>
      <p className="text-gray-600 mb-6 wax-w-md">
        The page you're looking for doesn't exist or has been moved. Please
        check the URL or return to the homepage.
      </p>
      <button
        onClick={() => navigate(-1)}
        className="bg-blue-500 px-6 cursor-pointer py-2 text-white rounded-md hover:bg-blue-700 transition duration-300"
      >
        Go to Homepage
      </button>
    </div>
  );
};

export default Notfound;
