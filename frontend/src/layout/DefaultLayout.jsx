import { Navigate, Outlet } from "react-router-dom";
import { useStateContext } from "../contexts/ContextProvider";
import { ToastContainer } from "react-toastify";

const DefaultLayout = () => {
  const { token, typePosition } = useStateContext();

  if (token) {
    if (typePosition === "Admin" || typePosition === 'Manager') {
      return <Navigate to="/dashboard" />;
    } else {
      return <Navigate to="/teller" />;
    }
  }

  return (
    <>
      <ToastContainer />
      <Outlet />
    </>
  );
};

export default DefaultLayout;
