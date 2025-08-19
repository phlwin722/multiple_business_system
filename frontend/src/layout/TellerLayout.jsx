import { Navigate, Outlet } from "react-router-dom";  // Don't forget to import Navigate!
import { useStateContext } from "../contexts/ContextProvider";
import Navbarteller from "../components/NavBarTeller";

const TellerLayout = () => {
  const { token, user, typePosition, setTypePostion, setToken, setUser } = useStateContext();

  // Check if token or user is missing and redirect to signin
  if (!token || !user) {
    setToken(null);
    setUser(null);
    setTypePostion(null);
    return <Navigate to="/signin" />;
  }

  // Redirect based on typePosition (Admin user should be redirected to /dashboard)
  if (typePosition === "admin") {
    return <Navigate to="/dashboard" />;
  } 

  // This will render Navbarteller only if the user is valid and typePosition is set
  return (
    <div>
      <div>
         <Navbarteller />
      </div>
       <div>
         <Outlet />
       </div>
    </div> 
  );
};

export default TellerLayout;
