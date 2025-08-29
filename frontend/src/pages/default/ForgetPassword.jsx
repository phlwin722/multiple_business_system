import { useState, useEffect, useRef } from "react";
import axiosClient from "../../axiosClient";
import { IoClose } from "react-icons/io5";
import toastify from "../../components/toastify";
import { FaEye, FaRegEyeSlash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const ForgetPassword = () => {
  const URL = "/auth";
  const navigate = useNavigate();

  const [validation, setValidation] = useState(false);
  const [errors, setErrors] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [serverCode, setServerCode] = useState(null);
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [cooldown, setCooldown] = useState(0);
  const [resending, setResending] = useState(false);
  const [resendingMessage, setResendingMessasge] = useState(null);
  const [loading, setLoading] = useState(false);
  const [setupPassword, setSetupPassword] = useState(false);
  const [newPass, setNewPass] = useState(false);
  const [confirmPass, setConfirmPass] = useState(false);
  const [errorPasswordValidation, setErrorPasswordValidation] = useState([]);
  const [user_id, setUserID] = useState(null);

  const codRefs = useRef([]);
  const newPassword = useRef();
  const confirmPassword = useRef();
  const email = useRef();

  const handleChangeCodeInput = (e, index) => {
    const { value } = e.target;

    if (!/^[0-9]?$/.test(value)) return;

    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    if (value && index < 5) {
      codRefs.current[index + 1].focus();
    }

    if (newCode.every((char) => char !== "")) {
      const fullCode = newCode.join("");
      if (serverCode !== fullCode) {
        toastify("error", "Please provide the correct verification code.");
        return;
      }
      setValidation(false);
      setSetupPassword(true);
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      codRefs.current[index - 1].focus();
    }
  };

  const handleVerifyCode = () => {
    const fullCode = code.join("");

    if (fullCode.length < 6) {
      toastify("Please enter all 6 digits");
      return;
    }

    if (serverCode != fullCode) {
      toastify("error", "Please provide the correct verification code.");
      return;
    }

    setValidation(false);
    setSetupPassword(true);
  };

  const handleResendCode = async () => {
    try {
      if (cooldown > 0) return;

      handleSubmit();
      setCooldown(60);
      setResending(true);
      setResendingMessasge("A new Verification code has been sent");
    } catch (error) {
      setResendingMessasge("Failed to resend code. Please Try again.");
    } finally {
      setResending(false);
    }
  };

  useEffect(() => {
    if (cooldown === 0) return;
    const interval = setInterval(() => {
      setCooldown((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [cooldown]);

  useEffect(() => {
    document.title = "Forget Password - Muibu";
  }, []);

  const handleSubmit = async (e) => {
    try {
      setLoading(true);
      e.preventDefault();
      setErrors([]);

      const response = await axiosClient.post(`${URL}/email-verification`, {
        email: email.current.value,
      });

      if (response.data.message) {
        setUserID(response.data.user_id);
        setServerCode(response.data.code);
        setValidation(true);
      }
    } catch (error) {
      if (error.response?.status === 421) {
        setErrorMessage(error.response.data.errors);
      } else if (error.response?.status === 422) {
        setErrors(error.response.data.errors);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitPassword = async (e) => {
    try {
      e.preventDefault();
      setErrorPasswordValidation([]);
      setLoading(true);

      const response = await axiosClient.post(`${URL}/change-password`, {
        new_password: newPassword.current.value,
        confirm_password: confirmPassword.current.value,
        user_id: user_id,
      });

      if (response.data.message) {
        setUserID(null);
        navigate("/signin");
      }
    } catch (error) {
      if (error.response?.status === 422) {
        setErrorPasswordValidation(error.response.data.errors);
      }
    } finally {
      setLoading(false);
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="min-h-screen bg-gradient-to-tr from-blue-100 via-white to-blue-50 flex items-center justify-center px-4">
      {validation ? (
        <motion.div
          initial="hidden"
          animate="visible"
          variants={cardVariants}
          transition={{ duration: 0.6 }}
          className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-md"
        >
          <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">
            Enter Verification Code
          </h2>

          {resendingMessage && (
            <p className="text-sm text-green-600 text-center mb-6">
              {resendingMessage}
            </p>
          )}

          <p className="text-sm text-gray-600 text-center mb-6">
            Please check your email. A 6-digit verification code has been sent
            to you.
          </p>

          <form
            onSubmit={(e) => e.preventDefault()}
            className="flex justify-between gap-2 mb-4"
          >
            {[...Array(6)].map((_, i) => (
              <input
                key={i}
                type="text"
                maxLength={1}
                inputMode="numeric"
                value={code[i]}
                ref={(el) => (codRefs.current[i] = el)}
                onChange={(e) => handleChangeCodeInput(e, i)}
                onKeyDown={(e) => handleKeyDown(e, i)}
                className="w-12 h-14 text-center text-xl border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            ))}
          </form>

          <button
            onClick={handleVerifyCode}
            className="w-full py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition duration-200"
          >
            Submit Code
          </button>

          <div className="mt-4 text-center">
            <button
              type="button"
              onClick={handleResendCode}
              className={`text-sm font-medium transition-colors duration-200 ${
                cooldown > 0 || resending
                  ? "text-gray-400 cursor-not-allowed"
                  : "text-blue-600 hover:underline"
              }`}
            >
              {cooldown > 0
                ? `Resend code in ${cooldown}`
                : resending
                ? "Resending..."
                : "Didn't receive the code? Resend"}
            </button>
          </div>
        </motion.div>
      ) : setupPassword ? (
        <motion.div
          initial="hidden"
          animate="visible"
          variants={cardVariants}
          transition={{ duration: 0.6 }}
          className="w-full bg-white max-w-md rounded-2xl p-8 shadow-xl"
        >
          <h2 className="text-gray-800 font-bold text-2xl mb-5 text-center">
            Reset Your Password
          </h2>
          <form onSubmit={handleSubmitPassword} className="space-y-4">
            <div>
              <label
                htmlFor="new_password"
                className="text-sm font-medium text-gray-600"
              >
                New Password
              </label>
              <div className="relative mt-2">
                <span
                  onClick={() => setNewPass((prev) => !prev)}
                  className="absolute inset-y-0 right-0 pr-3 top-2 flex items-center cursor-pointer text-gray-500"
                >
                  {newPass ? <FaRegEyeSlash /> : <FaEye />}
                </span>
                <input
                  id="new_password"
                  ref={newPassword}
                  type={newPass ? "text" : "password"}
                  placeholder="Enter new password"
                  className="border border-gray-300 w-full py-3 px-4 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
              {errorPasswordValidation?.new_password && (
                <p className="mt-1 text-sm text-red-500">
                  {errorPasswordValidation.new_password[0]}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="confirm_password"
                className="text-sm font-medium text-gray-600"
              >
                Confirm Password
              </label>
              <div className="relative mt-2">
                <span
                  onClick={() => setConfirmPass((prev) => !prev)}
                  className="absolute inset-y-0 right-0 pr-3 top-2 flex items-center cursor-pointer text-gray-500"
                >
                  {confirmPass ? <FaRegEyeSlash /> : <FaEye />}
                </span>
                <input
                  ref={confirmPassword}
                  type={confirmPass ? "text" : "password"}
                  id="confirm_password"
                  placeholder="Confirm new password"
                  className="border border-gray-300 w-full py-3 px-4 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
              {errorPasswordValidation?.confirm_password && (
                <p className="text-sm mt-1 text-red-500">
                  {errorPasswordValidation.confirm_password[0]}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full text-white py-3 rounded-lg font-semibold transition duration-200 ${
                loading
                  ? "cursor-not-allowed bg-blue-400"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              Set New Password
            </button>
          </form>
        </motion.div>
      ) : (
        <motion.div
          initial="hidden"
          animate="visible"
          variants={cardVariants}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md bg-white shadow-xl rounded-2xl p-8"
        >
          <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
            Forgot Password
          </h2>

          {errorMessage && (
            <div className="flex mb-5 w-full justify-between gap-2 bg-red-100 text-red-700 p-3 rounded-lg">
              <p className="text-sm">{errorMessage}</p>
              <IoClose
                onClick={() => setErrorMessage(null)}
                className="cursor-pointer"
              />
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-600"
              >
                Email address
              </label>
              <input
                id="email"
                name="email"
                autoComplete="off"
                ref={email}
                type="text"
                placeholder="you@example.com"
                className={`mt-2 w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-gray-700 ${
                  errors.email ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors?.email && (
                <p className="mt-2 text-sm text-red-500">{errors.email[0]}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 text-white font-semibold rounded-lg transition duration-200 ${
                loading
                  ? "cursor-not-allowed bg-blue-400"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              Verify Email
            </button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => navigate("/signin")}
              className="text-sm cursor-pointer text-blue-600 hover:underline"
            >
              Back to login
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default ForgetPassword;
