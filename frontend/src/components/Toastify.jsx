import React from 'react'
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const toastify = (type, message) => {
  const config = {
    position: "top-center"
  };

  switch (type) {
    case "success" :
      toast.success(message, config)
    case "error" : 
      toast.error(message, config)
    case "info" :
      toast.info(message, config)
    case "warn" :
      toast.warn(message, config)
    default:
      toast(message, config)
  }
}

export default toastify
