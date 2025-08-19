import { Navigate, Outlet } from "react-router-dom";
import { useStateContext } from "../contexts/ContextProvider";

const DefaultLayout = () => {
  const { token, typePosition } = useStateContext();

  if (token) {
    if (typePosition === "admin") {
      return <Navigate to="/dashboard" />;
    } else {
      return <Navigate to="/teller" />;
    }
  }

  return (
    <>
      <Outlet />
    </>
  );
};

export default DefaultLayout;
