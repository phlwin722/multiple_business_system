import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axiosClient from "../../axiosClient";
import Loading from "../../components/loading";
import { useStateContext } from "../../contexts/ContextProvider";
import { IoClose } from "react-icons/io5";

const Login = () => {
  const URL = "auth";
  const navigate = useNavigate();
  const { setUser, setToken } = useStateContext();

  const [hidden, setHidden] = useState(true);
  const [errors, setErrors] = useState([]);
  const [validation, setValidation] = useState(null);
  const [loading, setLoading] = useState(false);

  const email = useRef();
  const password = useRef();

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      setErrors([]);
      setValidation(null);
      setLoading(true);

      const payLoad = {
        email: email.current.value,
        password: password.current.value,
      };

      const response = await axiosClient.post(`${URL}/signin`, payLoad);

      if (response.data.user) {
        setUser(response.data.user);
        setToken(response.data.token);
      }
    } catch (error) {
      if (error.response.status === 422) {
        setErrors(error.response.data.errors);
      } else {
        setValidation(error.response.data.errors);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen flex items-center justify-center px-4 py-10">
      {loading && (
        <div className="fixed inset-0 bg-[rgba(0,0,0,0.3)] z-[9999] flex items-center justify-center">
          <Loading />
        </div>
      )}

      <div className="bg-white w-full max-w-md p-8 rounded-xl shadow-lg">
        <h2 className="text-3xl font-semibold text-center text-gray-800">
          Sign in
        </h2>
        <p className="text-sm text-center text-gray-500 mt-1 mb-6">
          Access your account
        </p>
        {/* Global error */}

        {validation && (
          <div className="mb-3 bg-red-500 text-white p-2 rounded-lg mt-4 relative">
            <span
              onClick={() => setValidation(!validation)}
              className="cursor-pointer absolute inset-y-0 right-0 flex items-center p-3"
            >
              <IoClose />
            </span>
            <p className="text-sm pr-6">{validation}</p>
          </div>
        )}
        <form action="" onSubmit={handleSubmit}>
          {/* email failed */}
          <div>
            <label htmlFor="email" className="block font-medium text-gray-700">
              Email
            </label>
            <input
              type="text"
              id="email"
              ref={email}
              className="border border-gray-300 mt-2 w-full px-4 py-2 rounded-md shadow-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
            {errors?.email && (
              <p className="text-red-500 text-xs mt-1">{errors.email}</p>
            )}
          </div>

          {/* Password field */}
          <div className="mt-4">
            <label
              htmlFor="password"
              className="block font-medium text-gray-700"
            >
              Password
            </label>
            <div className="relative">
              <input
                type={hidden ? "password" : "text"}
                ref={password}
                className="border border-gray-300 w-full py-2 px-4 mt-2 rounded-md shadow-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
              <span
                className="absolute inset-y-0 right-0 top-1 pr-3 flex items-center text-gray-600 cursor-pointer"
                onClick={() => setHidden((prev) => !prev)}
              >
                {hidden ? <FaRegEye /> : <FaRegEyeSlash />}
              </span>
            </div>
            {errors?.password && (
              <p className="text-red-500 text-xs mt-1">{errors.password}</p>
            )}
            {/* Sign up link */}
            <div className="text-sm text-gray-600 text-center mt-3">
              Don't have and account?
              <span
                onClick={() => navigate("/signup")}
                className="text-blue-600 hover:underline cursor-pointer ml-1"
              >
                Sign up
              </span>
            </div>
            <button className="w-full py-3 bg-blue-600 mt-4 text-white font-medium rounded-md hover:bg-blue-700 transition duration-300">
              Sign in
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
