import { useRef, useState, useEffect } from "react";
import axiosClient from "../../axiosClient";
import { useNavigate } from "react-router-dom";
import Loading from "../../components/loading";
import toastify from "../../components/toastify";
import { ToastContainer } from "react-toastify";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import TermsAgreementModal from "../../components/TermsAgreementModal";

const Signup = () => {
  const URL = "auth";
  const navigate = useNavigate();

  const firstName = useRef(null);
  const lastName = useRef(null);
  const email = useRef(null);
  const password = useRef(null);

  const [termsAgreement, setTermsAgreement] = useState(false);
  const [errors, setErrors] = useState(null);
  const [loading, setLoading] = useState(false);
  const [hidden, setHidden] = useState(true);
  const [isOpen, setIsOpen] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors(null);

    const payLoad = {
      first_name: firstName.current.value,
      last_name: lastName.current.value,
      email: email.current.value,
      password: password.current.value,
      position: "admin",
      terms_agreement: termsAgreement,
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
      } else {
        toastify("error", "Something went wrong. Please try again later.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (ref) => {
    const input = ref.current;
    if (input) {
      const capitalized = input.value.replace(/\b\w/g, (c) => c.toUpperCase());
      if (input.value !== capitalized) {
        input.value = capitalized;
      }
    }
  };

  useEffect(() => {
    document.title = "Sign up - Muibu";
  }, []);

  return (
    <div className="bg-gray-100 min-h-screen flex items-center justify-center px-4 py-10">
      <ToastContainer />

      <TermsAgreementModal isOpen={isOpen} onClose={() => setIsOpen(false)} />

      {loading && <Loading />}

      <div className="bg-white w-full max-w-md p-8 rounded-2xl shadow-2xl transform transition duration-500 hover:scale-[1.02] animate-fade-in-up">
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
              onChange={() => handleChange(firstName)}
              ref={firstName}
              autoComplete="off"
              className={`mt-2 w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none ${
                errors?.first_name
                  ? "border-red-500 focus:ring-2 focus:ring-blue-500 focus:outline-none focus:border-none"
                  : "border-gray-300"
              }`}
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
              onChange={() => handleChange(lastName)}
              autoComplete="off"
              ref={lastName}
              className={`mt-2 w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none ${
                errors?.last_name
                  ? "border-red-500 focus:ring-2 focus:ring-blue-500 focus:outline-none focus:border-none"
                  : "border-gray-300"
              }`}
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
              autoComplete="off"
              ref={email}
              className={`mt-2 w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none ${
                errors?.email
                  ? "border-red-500 focus:ring-2 focus:ring-blue-500 focus:outline-none focus:border-none"
                  : "border-gray-300"
              }`}
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
                inputMode="text"
                autoComplete="new-password"
                type={hidden ? "password" : "text"}
                ref={password}
                className={`w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none ${
                  errors?.password
                    ? "border-red-500 focus:ring-2 focus:ring-blue-500 focus:outline-none focus:border-none"
                    : "border-gray-300"
                }`}
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

          {/* Terms and Conditions */}
          <div className="flex items-center">
            <input
              id="terms"
              type="checkbox"
              checked={termsAgreement} // Use checked to reflect state
              onChange={() => setTermsAgreement((prev) => !prev)}
              className="h-4 w-4 text-blue-600 border-gray-300 rounded"
            />
            <label htmlFor="terms" className="ml-2 mr-1 text-sm text-gray-600">
              I agree to the{" "}
            </label>

            <span
              onClick={() => setIsOpen(true)}
              className="text-blue-600 hover:underline cursor-pointer"
            >
                Terms & Agreement
            </span>
          </div>
          {errors?.terms_agreement && (
            <p className="text-red-500 text-xs -mt-3">
              {errors.terms_agreement[0]}
            </p>
          )}

          {/* Link to Sign In */}
          <div className="text-sm text-gray-600 text-center">
            Already have an account?
            <span
              className="text-blue-600 hover:underline cursor-pointer ml-1 font-medium"
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
