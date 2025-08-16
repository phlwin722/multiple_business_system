import { Navigate, Outlet } from "react-router-dom";
import { useStateContext } from "../contexts/ContextProvider";


const DefaultLayout = () => {
  const { token } = useStateContext(); 

  if (token) { 
    return <Navigate to ='/dashboard'/>
  }

  return (
    <>
      <Outlet />
    </>
  );
};

export default DefaultLayout;
