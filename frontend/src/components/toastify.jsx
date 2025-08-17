import React from 'react'
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const toastify = (type, message) => {
  const config = {
    position: "top-center"
  };

  switch (type) {
    case "success" :
      toast.success(message, config)
      break;
    case "error" : 
      toast.error(message, config)
      break;
    case "info" :
      toast.info(message, config)
      break;
    case "warn" :
      toast.warn(message, config)
      break;
    default:
      toast(message, config)
      break;
  }
}

export default toastify
