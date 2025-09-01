// components/Modal.jsx
import React from "react";

const Modal = ({ isOpen, title, backgroundBtn, messageBtn,  message, children, onClose, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 px-10 flex items-center justify-center bg-[rgba(0,0,0,0.3)]">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 relative">
        <button
          className="absolute top-2 right-3 text-gray-500 hover:text-gray-700 text-lg font-bold"
          onClick={onClose}
        >
          &times;
        </button>

        <h2 className="text-xl font-semibold mb-4">{title}</h2>

        <div className="mb-6 text-gray-700">
          {message || children}
        </div>

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded"
          >
            Keep, it
          </button>
          <button
            onClick={onConfirm}
            className={`text-white px-4 py-2 rounded ${backgroundBtn}`}
          >
            {messageBtn}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
