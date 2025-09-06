import React from "react";
import { BeatLoader } from "react-spinners";

const loading = () => {
  return (
    <div className="fixed inset-0 z-[99999] px-10 flex items-center justify-center bg-[rgba(0,0,0,0.3)]">
      <div className="flex flex-col items-center">
        <BeatLoader color="#fdfdfdff" size={12} />
        <div className="mt-4 text-white text-sm">Loading...</div>
      </div>
    </div>
  );
};

export default loading;
