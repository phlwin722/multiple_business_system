import { Navigate, Outlet } from "react-router-dom"; // Don't forget to import Navigate!
import { useStateContext } from "../contexts/ContextProvider";
import Navtellerbar from "../components/Navtellerbar";
import { useState } from "react";
import { ToastContainer } from "react-toastify";

const TellerLayout = () => {
  const { token, user, typePosition, setTypePostion, setToken, setUser } =
    useStateContext();
  const [userNav, setUserNav] = useState(false);

  // Check if token or user is missing and redirect to signin
  if (!token || !user) {
    setToken(null);
    setUser(null);
    setTypePostion(null);
    return <Navigate to="/signin" />;
  }

  // Redirect based on typePosition (Admin user should be redirected to /dashboard)
  if (typePosition === "admin" || typePosition === 'manager') {
    return <Navigate to="/dashboard" />;
  }

  // This will render Navbarteller only if the user is valid and typePosition is set
  return (
    <div
      className="h-screen flex flex-col bg-gray-200"
      onClick={() => userNav && setUserNav(false)}
    >
      <ToastContainer
        position="top-center"
        autoClose={2500}
        toastStyle={{ width: "17rem", marginTop: '20px' }} // 60 in Tailwind = 15rem
      />

      {/* Nav Bar - fixed height */}
      <div className="shrink-0">
        <Navtellerbar userNav={userNav} setUserNav={setUserNav} />
      </div>

      {/* Page Content - fills remaining height */}
      <div className="flex-1 overflow-y-auto">
        <Outlet />
      </div>
    </div>
  );
};

export default TellerLayout;
