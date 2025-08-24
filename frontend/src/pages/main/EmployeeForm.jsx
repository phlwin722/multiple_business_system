import { useState, useRef, useEffect } from "react";
import noImage from "../../assets/noImage.jpeg";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import axiosClient from "../../axiosClient";
import { useStateContext } from "../../contexts/ContextProvider";
import Loading from "../../components/loading";
import toastify from "../../components/toastify";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";

const EmployeeForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useStateContext();

  const [errors, setErrors] = useState([]);
  const [imagePreview, setImagePreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [listBusiness, setListBusiness] = useState([]);
  const [loading, setLoading] = useState(false);
  const [productID, setProductID] = useState(null);
  const [hidden, setHidden] = useState(true);

  const firstName = useRef(null);
  const lastName = useRef(null);
  const email = useRef(null);
  const password = useRef(null);
  const position = useRef(null);
  const business = useRef(null);

  const fileInputRef = useRef(null);

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

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      setLoading(true);
      setErrors([]);

      const formData = new FormData();
      formData.append("first_name", firstName.current.value);
      formData.append("last_name", lastName.current.value);
      formData.append("email", email.current.value);
      formData.append("position", position.current.value);
      formData.append("business_id", business.current.value);
      formData.append("user_id", user.id);

      if (imageFile) {
        formData.append("image", imageFile);
      }

      if (position.current.value) {
        formData.append("password", password.current.value);
      }

      if (id) {
        formData.append("id", productID);

        const response = await axiosClient.post(`/employee/update`, formData, {
          headers: {
            "Content-type": "multipart/form-data",
          },
        });

        if (response.data.message) {
          toastify("success", "Updated successfully!");
          navigate("/employee");
        }
      } else {
        const response = await axiosClient.post(`/employee/create`, formData, {
          headers: {
            "Content-type": "multipart/form-data",
          },
        });

        if (response.data.message) {
          toastify("success", "Created successfully!");
          navigate("/employee");
        }
      }
    } catch (error) {
      if (error.response.status === 422) {
        setErrors(error.response.data.errors);
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchBusinesses = async () => {
    try {
      const response = await axiosClient.post(`/employee/fetchBusinesses`, {
        user_id: user.id,
      });

      if (response.data.data) {
        setListBusiness(response.data.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const fetchData = async () => {
    try {
      const response = await axiosClient.post("/employee/find", {
        id: id,
      });

      if (response.data.message) {
        firstName.current.value = response.data.data.first_name;
        lastName.current.value = response.data.data.last_name;
        email.current.value = response.data.data.email;
        position.current.value = response.data.data.position;
        business.current.value = response.data.data.business_id;
        setImagePreview(response.data.data.image);
        setImageFile(response.data.data.image);
        setProductID(response.data.data.id);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (id) {
      fetchData();
    }
    fetchBusinesses();

    document.title = "Employee Form = Muibu";
  }, []);

  return (
    <div className="bg-white mx-5 my-7 shadow-md rounded-lg p-6">
      {loading && <Loading />}

      <h2 className="text-2xl font-semibold text-gray-700 mb-6">
        {id ? "Update Employee" : "New Employee"}
      </h2>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="font-medium text-gray-800" htmlFor="firtName">
            First name
          </label>
          <input
            type="text"
            id="firtName"
            ref={firstName}
            className={`border border-gray-300 block w-full px-4 py-2 rounded mt-1 focus:outline-none focus:ring-2 focus:ring-blue-400 ${
              errors.first_name ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors?.first_name && (
            <p className="text-red-500 text-sm mt-1">{errors.first_name[0]}</p>
          )}
        </div>

        <div>
          <label htmlFor="lastName" className="font-medium text-gray-800">
            Last name
          </label>
          <input
            type="text"
            id="lastName"
            ref={lastName}
            className={`border border-gray-300 block py-2 px-4 w-full rounded focus:ring-2 focus:ring-blue-500 focus:outline-none mt-1 ${
              errors.last_name ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors?.last_name && (
            <p className="text-red-500 text-sm mt-1">{errors.last_name[0]}</p>
          )}
        </div>

        <div>
          <label htmlFor="email" className="font-medium text-gray-800">
            Email
          </label>
          <input
            type="text"
            id="email"
            ref={email}
            className={`border border-gray-300 block py-2 px-4 w-full rounded focus:ring-2 focus:ring-blue-500 focus:outline-none mt-1 ${
              errors.email ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors?.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email[0]}</p>
          )}
        </div>

        <div>
          <label htmlFor="password" className="font-medium text-gray-800">
            Password
          </label>
          <div className="relative">
            <span
              onClick={() => setHidden(!hidden)}
              className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-600 cursor-pointer"
            >
              {hidden ? <FaRegEye /> : <FaRegEyeSlash />}
            </span>
            <input
              id="password"
              ref={password}
              className={`border border-gray-300 w-full py-2 px-4 mt-1 rounded focus:ring-2 focus:ring-blue-500 focus:outline-none ${
                errors?.password ? "border-red-500" : "border-gray-300"
              }`}
              type={hidden ? "password" : "text"}
            />
          </div>
          {errors?.password && (
            <p className="text-red-500 text-sm mt-1">{errors.password[0]}</p>
          )}
        </div>

        <div>
          <label htmlFor="position" className="font-medium text-gray-800">
            Choose Position
          </label>
          <select
            id="position"
            ref={position}
            className={`block border mt-1 border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none w-full py-2 px-4 ${
              errors.position ? "border-red-500" : "border-gray-300"
            }`}
          >
            <option value="" hidden>
              -- Select Position --
            </option>
            <option value="admin">Admin</option>
            <option value="teller">Teller</option>
          </select>
          {errors?.position && (
            <p className="text-red-500 text-sm mt-1">{errors.position[0]}</p>
          )}
        </div>

        <div>
          <label htmlFor="business_id" className="font-medium text-gray-800">
            Choose business
          </label>
          <select
            id="business_id"
            ref={business}
            className={`block border mt-1 border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none w-full py-2 px-4 ${
              errors.business_id ? "border-red-500" : "border-gray-300"
            }`}
          >
            {listBusiness.length > 0 ? (
              <>
                <option value="" disabled hidden>
                  -- Select Business --
                </option>
                {listBusiness.map((business) => (
                  <option value={business.id} key={business.id}>
                    {business.business_name}
                  </option>
                ))}
              </>
            ) : (
              <option value=""></option>
            )}
          </select>
          {errors?.business_id && (
            <p className="text-red-500 text-sm mt-1">{errors.business_id[0]}</p>
          )}
        </div>

        {/* Image Upload (Click on Image) */}
        <div>
          <label className="block font-medium text-gray-700 mb-2">Image</label>

          <div
            className={`w-[200px] h-[250px] border border-gray-300 p-1 rounded-md overflow-hidden cursor-pointer hover:opacity-80 transition ${
              errors?.image ? "border-red-500" : "border-gray-300"
            }`}
            onClick={() => fileInputRef.current.click()}
          >
            <img
              src={imagePreview || noImage}
              alt="Click to upload"
              className="w-full h-full object-cover"
            />
          </div>

          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={handleImageChange}
            className="hidden"
          />

          {errors?.image && (
            <p className="text-red-500 text-sm mt-1">{errors.image[0]}</p>
          )}
        </div>

        <div className="bg-red-500 py-2 px-4 rounded-lg text-white">
          <p className="text-sm">
            Note that the maximum allowed file size for uploads is 10 megabytes
            (MB).
          </p>
        </div>

        <div>
          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={() => navigate("/employee")}
              className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-600 text-white px-5 py-2 rounded transition"
            >
              Save
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default EmployeeForm;
