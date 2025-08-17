import { useRef, useState } from "react";
import axiosClient from "../../axiosClient";
import { useNavigate } from "react-router-dom";
import Loading from "../../components/loading";
import toastify from "../../components/toastify";
import { ToastContainer } from "react-toastify";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";

const Signup = () => {
  const URL = "auth";
  const navigate = useNavigate();

  const firstName = useRef(null);
  const lastName = useRef(null);
  const email = useRef(null);
  const password = useRef(null);

  const [errors, setErrors] = useState(null);
  const [loading, setLoading] = useState(false);
  const [hidden, setHidden] = useState(true);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors(null);

    const payLoad = {
      first_name: firstName.current.value,
      last_name: lastName.current.value,
      email: email.current.value,
      password: password.current.value,
    };

    try {
      const response = await axiosClient.post(`${URL}/create`, payLoad);

      if (response.data.message) {
        toastify("success", "Registered successfully!");
        navigate("/signin");
      }
    } catch (error) {
      if (error.response?.status === 422) {
        setErrors(error.response.data.errors);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-10">
      <ToastContainer />

      {loading && (
        <Loading />
      )}

      <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-lg">
        <h2 className="text-3xl font-semibold text-center text-gray-800">
          Sign Up
        </h2>
        <p className="text-sm text-center text-gray-500 mt-1 mb-6">
          Create your account
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* First Name */}
          <div>
            <label
              htmlFor="firstName"
              className="block text-sm font-medium text-gray-700"
            >
              First Name
            </label>
            <input
              id="firstName"
              type="text"
              ref={firstName}
              className={`mt-2 w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none ${
              errors?.first_name ? "border-red-500" :  "border-gray-300" }`}
            />
            {errors?.first_name && (
              <p className="text-red-500 text-xs mt-1">{errors.first_name}</p>
            )}
          </div>

          {/* Last Name */}
          <div>
            <label
              htmlFor="lastName"
              className="block text-sm font-medium text-gray-700"
            >
              Last Name
            </label>
            <input
              id="lastName"
              type="text"
              ref={lastName}
              className={`mt-2 w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none ${
              errors?.last_name ? "border-red-500" : "border-gray-300"}`}
            />
            {errors?.last_name && (
              <p className="text-red-500 text-xs mt-1">{errors.last_name}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email Address
            </label>
            <input
              id="email"
              type="email"
              ref={email}
              className={`mt-2 w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none ${
              errors?.email ? "border-red-500" : "border-gray-300" }`}
            />
            {errors?.email && (
              <p className="text-red-500 text-xs mt-1">{errors.email}</p>
            )}
          </div>

          {/* Password */}
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <div className="relative mt-2">
              <input
                id="password"
                type={hidden ? "password" : "text"}
                ref={password}
                className={`w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none ${
                errors?.password ? "border-red-500" : "border-gray-300"}`}
              />
              <span
                onClick={() => setHidden(!hidden)}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-600 cursor-pointer"
              >
                {hidden ? <FaRegEye /> : <FaRegEyeSlash />}
              </span>
            </div>
            {errors?.password && (
              <p className="text-red-500 text-xs mt-1">{errors.password[0]}</p>
            )}
          </div>

          {/* Link to Sign In */}
          <div className="text-sm text-gray-600 text-center">
            Already have an account?
            <span
              className="text-blue-600 hover:underline cursor-pointer ml-1"
              onClick={() => navigate("/signin")}
            >
              Sign in
            </span>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition duration-300"
          >
            Create Account
          </button>
        </form>
      </div>
    </div>
  );
};

export default Signup;
