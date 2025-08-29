import { useState, useEffect, useRef } from "react";
import { useStateContext } from "../../contexts/ContextProvider";
import noImage from "../../assets/noImage.jpeg";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import axiosClient from "../../axiosClient";
import Loading from "../../components/loading";
import Modal from "../../components/Modal";
import toastify from "../../components/toastify";

const MyAccount = () => {
  const URL = "/auth";
  const { user, setToken, setTypePostion, setUser } = useStateContext();
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [paPassword, setPaPassword] = useState(false);
  const [myInfo, setMyInfo] = useState(true);
  const [errors, setErrors] = useState([]);
  const [new_password, setNewPassword] = useState(true);
  const [current_password, setCurrentPassword] = useState(true);
  const [confirm_password, setConfirmPassword] = useState(true);
  const [imagePreview, setImagePreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);

  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    id: "",
  });

  const handleChangeInput = (e) => {
    const { name, value } = e.target;
    const capitalized = value.replace(/\b\w/g, (c) => c.toUpperCase());
    setFormData((prev) => ({
      ...prev,
      [name]: capitalized,
    }));
  };

  const [formDataPass, setFormDataPass] = useState({
    new_password: "",
    current_password: "",
    confirm_password: "",
    id: user.id,
  });

  const handleChangePassword = (e) => {
    const { name, value } = e.target;
    setFormDataPass((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);

      const reader = new FileReader();
      reader.onload = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async () => {
    try {
      setIsModalOpen(false);
      setLoading(true);
      const form = new FormData();
      form.append("id", formData.id);
      form.append("first_name", formData.first_name);
      form.append("last_name", formData.last_name);
      form.append("email", formData.email);

      if (imageFile instanceof File) {
        form.append("image", imageFile);
      }

      await axiosClient.post(`${URL}/user-update`, form, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      const response = await axiosClient.post(`${URL}/logout`, {
        id: formData.id,
      });

      if (response.data.message) {
        setToken(null);
        setTypePostion(null);
        setUser(null);
      }
    } catch (error) {
      if (error.response?.status === 422) {
        setErrors(error.response.data.errors);
      } else if (error.response?.status === 413) {
        setErrors({ image: ["The image must not be greater than 2Mb"] });
      } else {
        toastify("error", "Something went wrong. Please try again.");
        console.log(error);
      }
    } finally {
      setLoading(false);
    }
  };
  const handleUpdatePassword = async () => {
    try {
      setLoading(true);
      setErrors([]);
      await axiosClient.post(`${URL}/change-password`, formDataPass);
      toastify("success", "Password updated successfully.");
    } catch (error) {
      if (error.response.status === 422) {
        setErrors(error.response.data.errors);
      } else {
        console.log(error);
        toastify("error", "Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    setErrors([]);
    setFormData({
      first_name: user.first_name || "",
      last_name: user.last_name || "",
      email: user.email || "",
      id: user.id || "",
    });
    setImagePreview(user.image);
  }, [myInfo]);

  useEffect(() => {
    setFormDataPass({
      confirm_password: "",
      current_password: "",
      new_password: "",
      id: user.id,
    });
  }, [paPassword]);

  useEffect(() => {
    document.title = "My account - Muibu";
    setImagePreview(user.image);
  }, []);

  return (
    <div className="p-6 mb-6">
      <Modal
        isOpen={isModalOpen}
        title="Important Notice"
        backgroundBtn="bg-blue-500 hover:bg-blue-600"
        messageBtn="Proceed with Update"
        message="Updating your account details will automatically log you out for security reasons."
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleSubmit}
      />

      {loading && <Loading />}
      <h1 className="text-2xl font-semibold mb-4">My Account</h1>
      <div className="bg-white rounded-md mt-2 w-full shadow-lg">
        <div className="w-full border-b border-gray-300 py-3 px-5">
          <ul className="flex gap-5 justify-end">
            <li
              onClick={() => {
                setMyInfo(true);
                setPaPassword(false);
              }}
              className={`cursor-pointer ${
                myInfo ? "font-bold border-b-2 border-blue-500" : ""
              }`}
            >
              My Information
            </li>
            <li
              onClick={() => {
                setMyInfo(false);
                setPaPassword(true);
              }}
              className={`cursor-pointer ${
                paPassword ? "font-bold border-b-2 border-blue-500" : ""
              }`}
            >
              Password
            </li>
          </ul>
        </div>
        <div className="p-6">
          {myInfo ? (
            <div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div>
                  <label
                    htmlFor="first_name"
                    className="font-medium text-gray-800"
                  >
                    First name
                  </label>
                  <input
                    value={formData.first_name}
                    name="first_name"
                    autoComplete="off"
                    onChange={handleChangeInput}
                    type="text"
                    id="first_name"
                    className={`py-2 px-4 w-full rounded-md mt-2 focus:ring-2 focus:ring-blue-500 focus:outline-none border ${
                      errors.first_name ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                  {errors?.first_name && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.first_name}
                    </p>
                  )}
                </div>
                <div>
                  <label
                    htmlFor="last_name"
                    className="font-medium text-gray-800"
                  >
                    Last name
                  </label>
                  <input
                    value={formData.last_name}
                    type="text"
                    onChange={handleChangeInput}
                    autoComplete="off"
                    name="last_name"
                    id="last_name"
                    className={`py-2 px-4 w-full rounded-md mt-2 focus:ring-2 focus:ring-blue-500 focus:outline-none border ${
                      errors.last_name ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                  {errors?.last_name && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.last_name}
                    </p>
                  )}
                </div>
                <div>
                  <label htmlFor="email" className="font-medium text-gray-800">
                    Email
                  </label>
                  <input
                    value={formData.email}
                    type="text"
                    disabled
                    name="email"
                    autoComplete="off"
                    id="email"
                    className={`py-2 px-4 w-full bg-gray-100 rounded-md mt-2 focus:ring-2 focus:ring-blue-500 focus:outline-none border ${
                      errors.email ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                  {errors?.email && (
                    <p className="mt-1 text-sm text-red-500">{errors.email}</p>
                  )}
                </div>
                <div>
                  <label htmlFor="image" className="font-medium text-gray-800">
                    Image
                  </label>
                  <div
                    className={`cursor-pointer border p-3 ${
                      errors?.image ? "border-red-500" : "border-gray-300"
                    } w-full max-w-md h-64 md:h-72 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition duration-300 ease-in-out hover:opacity-90 mt-2`}
                    onClick={() => fileInputRef.current.click()}
                  >
                    <img
                      src={imagePreview || noImage}
                      alt="Click to upload"
                      className="w-full h-full object-fit"
                    />
                  </div>

                  <input
                    ref={fileInputRef}
                    type="file"
                    className="hidden"
                    onChange={handleImageChange}
                    accept="image/*"
                  />
                  {errors?.image && (
                    <p className="mt-1 text-sm text-red-500">{errors.image}</p>
                  )}
                </div>
              </div>
              <div className="mt-3 w-full bg-red-500 py-2 px-4 rounded-lg text-white">
                <p className="text-sm">
                  Note that the maximum allowed file size for uploads is 2
                  megabytes (MB).
                </p>
              </div>
              <div className="flex justify-end mt-7">
                <button
                  disabled={loading}
                  onClick={() => setIsModalOpen(true)}
                  className={`px-5 py-2 text-white rounded-md ${
                    loading ? "bg-blue-400" : "bg-blue-500 hover:bg-blue-600"
                  }`}
                >
                  Save
                </button>
              </div>
            </div>
          ) : (
            paPassword && (
              <div className="flex flex-col gap-5">
                <div>
                  <label
                    htmlFor="current_password"
                    className="font-medium text-gray-800"
                  >
                    Current Password
                  </label>
                  <div className="relative">
                    <span
                      onClick={() => setCurrentPassword((prev) => !prev)}
                      className="absolute inset-y-0 right-0 top-3 pr-3 text-gray-600  flex items-center"
                    >
                      {current_password ? <FaRegEye /> : <FaRegEyeSlash />}
                    </span>
                    <input
                      id="current_password"
                      onChange={handleChangePassword}
                      autoComplete="new-password"
                      inputMode="text"
                      value={formDataPass.current_password}
                      name="current_password"
                      type={current_password ? "password" : "text"}
                      className={`focus:ring-2 focus:ring-blue-500 focus:outline-none border w-full py-2 px-4 mt-2 rounded-md ${
                        errors?.current_password
                          ? "border-red-500"
                          : "border-gray-300"
                      }`}
                    />
                  </div>
                  {errors?.current_password && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.current_password[0]}
                    </p>
                  )}
                </div>
                <div>
                  <label
                    className="font-medium text-gray-800"
                    htmlFor="new_password"
                  >
                    New Password
                  </label>
                  <div className="relative">
                    <span
                      onClick={() => setNewPassword((prev) => !prev)}
                      className="absolute inset-y-0 top-2 text-gray-600 right-0 pr-3 flex items-center"
                    >
                      {new_password ? <FaRegEye /> : <FaRegEyeSlash />}
                    </span>
                    <input
                      id="new_password"
                      autoComplete="new-password"
                      inputMode="text"
                      type={new_password ? "password" : "text"}
                      value={formDataPass.new_password}
                      onChange={handleChangePassword}
                      name="new_password"
                      className={`focus:ring-2 focus:ring-blue-500 focus:outline-none border w-full py-2 px-4 mt-2 rounded-md ${
                        errors?.new_password
                          ? "border-red-500"
                          : "border-gray-300"
                      }`}
                    />
                  </div>
                  {errors?.new_password && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.new_password[0]}
                    </p>
                  )}
                </div>
                <div>
                  <label
                    htmlFor="confirm_password"
                    className="font-medium text-gray-800"
                  >
                    Confirm Password
                  </label>
                  <div className="relative">
                    <span
                      onClick={() => setConfirmPassword((prev) => !prev)}
                      className="absolute inset-y-0 text-gray-600 top-2 right-0 pr-3 flex items-center"
                    >
                      {confirm_password ? <FaRegEye /> : <FaRegEyeSlash />}
                    </span>
                    <input
                      id="confirm_password"
                      autoComplete="new-password" // disables browser autofill & eye
                      inputMode="text" // hint for soft keyboard (mobile)
                      type={confirm_password ? "password" : "text"}
                      value={formDataPass.confirm_password}
                      onChange={handleChangePassword}
                      name="confirm_password"
                      className={`focus:ring-2 focus:ring-blue-500 focus:outline-none border w-full py-2 px-4 mt-2 rounded-md ${
                        errors?.confirm_password
                          ? "border-red-500"
                          : "border-gray-300"
                      }`}
                    />
                  </div>
                  {errors?.confirm_password && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.confirm_password[0]}
                    </p>
                  )}
                </div>
                <div className="flex justify-end mt-5">
                  <button
                    disabled={loading}
                    onClick={handleUpdatePassword}
                    className={`px-5 py-2 text-white rounded-md ${
                      loading ? "bg-blue-400" : "bg-blue-500 hover:bg-blue-600"
                    }`}
                  >
                    Save
                  </button>
                </div>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default MyAccount;
