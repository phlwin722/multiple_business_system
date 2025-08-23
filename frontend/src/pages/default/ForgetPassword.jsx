import { useState, useEffect, useRef } from "react";
import axiosClient from "../../axiosClient";
import { IoClose } from "react-icons/io5";
import toastify from "../../components/toastify";
import { FaEye, FaRegEye, FaRegEyeSlash } from "react-icons/fa";

const ForgetPassword = () => {
  const URL = "/auth";

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
      console.log(serverCode, " ", fullCode);
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
      toastify("Please enter all 6 degits");
      return;
    }

    if (serverCode != fullCode) {
      toastify("error", "Please provide the correct verification code.");
      return;
    }

    setValidation(false);
    setSetupPassword(true);
    console.log(serverCode, " ", fullCode);
  };

  const handleResendCode = async () => {
    try {
      if (cooldown > 0) return;

      handleSubmit();
      setCooldown(60);
      setResending(true);
      setResendingMessasge(null);
      setResendingMessasge("A new Verification code has been sent");
    } catch (error) {
      console.log(error);
      setResendingMessasge("Failed to resent code. Please Try again.");
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
    document.title = 'Forget Password - Muibu';
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
      if (error.response.status === 421) {
        setErrorMessage(error.response.data.errors);
      } else if (error.response.status === 422) {
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
        window.location.href = "/signin";
      }
    } catch (error) {
      if (error.response?.status === 422) {
        setErrorPasswordValidation(error.response.data.errors);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-tr from-blue-50 to-white flex items-center justify-center px-4">
      {validation ? (
        <div className="bg-white shadow-2xl rounded-xl p-8 w-full max-w-md">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Enter verification Code
          </h2>

          {resendingMessage && (
            <p className="text-sm text-red-500 text-center mb-6">
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
                className="w-12 h-14 text-center text-xl border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            ))}
          </form>

          <button
            onClick={handleVerifyCode}
            className="w-full py-3 bg-blue-500 text-white font-medium rounded-md hover:bg-blue-700 transition duration-200"
          >
            Submit code
          </button>

          <div className="mt-4 text-center">
            <button
              type="button"
              onClick={handleResendCode}
              className={`text-sm font-medium ${
                cooldown > 0 || resending
                  ? "text-gray-400 cursor-not-allowed"
                  : "text-blue-500 hover:underline"
              }`}
            >
              {cooldown > 0
                ? `Resend code in ${cooldown}`
                : resending
                ? "Resending..."
                : "Didn't receive the code? Resend"}
            </button>
          </div>
        </div>
      ) : setupPassword ? (
        <div className="w-full bg-white max-w-md rounded-xl p-8 shadow-2xl">
          <h2 className="text-gray-700 font-semibold text-2xl mb-5">
            Reset Your Password
          </h2>
          <form onSubmit={handleSubmitPassword}>
            <label
              htmlFor="new_password"
              className="text-sm font-medium text-gray-600 mb-1"
            >
              New Password
            </label>
            <div className="relative">
              <span
                onClick={() => setNewPass((prev) => !prev)}
                className="absolute inset-y-0 right-0 pr-3 top-2 flex items-center"
              >
                {newPass ? <FaRegEyeSlash /> : <FaEye />}
              </span>
              <input
                id="new_password"
                ref={newPassword}
                type={newPass ? "text" : "password"}
                placeholder="Enter new password"
                className={`border border-gray-300 w-full py-2 px-3  rounded-md mt-2 focus:ring-2 focus:ring-blue-500 focus:outline-none`}
              />
            </div>
            {errorPasswordValidation?.new_password && (
              <p className="mt-1 text-sm text-red-500">
                {errorPasswordValidation.new_password[0]}
              </p>
            )}

            <div className="mt-2">
              <label
                htmlFor="confirm_password"
                className="text-sm font-medium text-gray-600 mb-1"
              >
                Confirm Password
              </label>
              <div className="relative">
                <span
                  onClick={() => setConfirmPass((prev) => !prev)}
                  className="absolute inset-y-0 right-0 pr-3 top-2 flex items-center"
                >
                  {confirmPass ? <FaRegEyeSlash /> : <FaEye />}
                </span>
                <input
                  ref={confirmPassword}
                  type={confirmPass ? "text" : "password"}
                  id="confirm_password"
                  placeholder="Confirm new password"
                  className={`focus:ring-2 focus:ring-blue-500 focus:outline-none border border-gray-300 w-full py-2 px-3 rounded-md mt-2`}
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
              className={`w-full text-white py-2 rounded-md mt-7 transition duration-200 ${
                loading
                  ? "cursor-not-allowed bg-blue-400 text-gray-400"
                  : "bg-blue-500  hover:bg-blue-700 "
              }`}
            >
              Set New Password
            </button>
          </form>
        </div>
      ) : (
        <div className="w-full max-w-md bg-white shadow-2xl rounded-xl p-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">
            Forgot Password
          </h2>

          {errorMessage && (
            <div className="flex mb-5 w-full justify-between gap-2 bg-red-500 text-white p-2 py-3 rounded-md">
              <div>
                <p className=" text-sm">{errorMessage}</p>
              </div>
              <div>
                <IoClose onClick={() => setErrorMessage(null)} />
              </div>
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
                ref={email}
                type="text"
                placeholder="you@example.com"
                className={`mt-2 w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none text-gray-700 ${
                  errors.email ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors?.email && (
                <div>
                  <p className="mt-2 text-sm text-red-500">{errors.email[0]}</p>
                </div>
              )}
            </div>

            {/* You can optionally add a newPassword field after email is verified */}

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 text-white font-medium rounded-md transition duration-200 ${
                loading
                  ? "cursor-not-allowed bg-blue-400 text-gray-400"
                  : "bg-blue-600  hover:bg-blue-700 "
              }`}
            >
              Verify Email
            </button>
          </form>

          <div className="mt-6 text-center">
            <a href="/signin" className="text-sm text-blue-500 hover:underline">
              Back to login
            </a>
          </div>
        </div>
      )}
    </div>
  );
};

export default ForgetPassword;
