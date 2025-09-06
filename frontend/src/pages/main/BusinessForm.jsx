import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axiosClient from "../../axiosClient";
import noImage from "../../assets/noImage.jpeg";
import { useStateContext } from "../../contexts/ContextProvider";
import { useParams } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Loading from "../../components/loading";
import toastify from "../../components/toastify";

const BusinessForm = () => {
  const { id } = useParams();

  const navigate = useNavigate();

  const { user } = useStateContext();

  const businessName = useRef(null);
  const fileInputRef = useRef(null);

  const [imageFile, setImageFile] = useState();
  const [errors, setErrors] = useState([]);
  const [imagePreview, setImagePreview] = useState(null);
  const [businessID, setBusinessID] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChangeInput = (ref) => {
    const input = ref.current;
    if (input) {
      const capitalized = input.value.replace(/\b\w/g, (c) => c.toUpperCase());
      if (input.value !== capitalized) {
        input.value = capitalized;
      }
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);

      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      setErrors([]);
      setLoading(true);

      if (id) {
        // update
        const payLoad = new FormData();
        payLoad.append("business_name", businessName.current.value);
        payLoad.append("id", businessID);
        if (imageFile) {
          payLoad.append("image", imageFile);
        }

        const response = await axiosClient.post("/business/update", payLoad, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        if (response.data.message) {
          toastify("success", "Updated successfully!");
          navigate("/business");
        }
      } else {
        // create
        const payLoad = new FormData();
        payLoad.append("business_name", businessName.current.value);
        payLoad.append("user_id", user.id);
        if (imageFile) {
          payLoad.append("image", imageFile);
        }

        const response = await axiosClient.post("/business/create", payLoad, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        if (response.data.message) {
          toastify("success", "Created successfully!");
          navigate("/business");
        }
      }
    } catch (error) {
      if (error.response?.status === 422) {
        setErrors(error.response.data.errors);
      } else if (error.response?.status === 413) {
        setErrors({ image: ["The image must not be greater than 2Mb."] });
      } else {
        console.log(error);
        toastify("error", "Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchData = async (realIDd) => {
    try {
      const response = await axiosClient.post("/business/find", {
        id: realIDd,
      });

      if (response.data.message) {
        businessName.current.value = response.data.data.business_name;
        setBusinessID(response.data.data.id);
        setImagePreview(response.data.data.image);
        setImageFile(response.data.data.image);
      } else {
        navigate("*");
      }
    } catch (error) {
      console.log(error);
      toastify("error", "Something went wrong. Please try again.");
    }
  };

  useEffect(() => {
    if (id) {
      try {
        const decode = atob(id);
        const [code, realID] = decode.split("|");

        if (!realID) {
          throw new Error("Decoded ID is missing");
        }

        fetchData(realID);
      } catch (error) {
        console.error("Invalid ID:", error);
        navigate("*"); // Redirect to 404 or catch-all route
      }
    }
  }, [id]);

  useEffect(() => {
    document.title = "Business Form - Muibu";
  }, []);

  return (
    <div className="bg-white shadow-md rounded-lg p-6 mx-5 my-7 overflow-y-auto">
      <ToastContainer />
      {loading && <Loading />}

      <h2 className="text-2xl font-semibold text-gray-700 mb-6">
        {id ? "Update Business" : "New Business"}
      </h2>
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Name */}
        <div>
          <label
            htmlFor="business_name"
            className="block font-medium text-gray-700 mb-1"
          >
            Business Name
          </label>
          <input
            id="business_name"
            type="text"
            ref={businessName}
            autoComplete="off"
            onChange={() => handleChangeInput(businessName)}
            className={`w-full border px-4 py-2 rounded-md  focus:outline-none focus:ring-2 focus:ring-blue-400 ${
              errors.business_name
                ? "border-red-500 focus:ring-2 focus:ring-blue-500 focus:outline-none focus:border-none"
                : "border-gray-300"
            }`}
          />
          {errors.business_name && (
            <p className="text-red-500 text-xs mt-1">
              {errors.business_name[0]}
            </p>
          )}
        </div>

        {/* Image Upload (Click on Image) */}
        <div>
          <label className="block font-medium text-gray-700 mb-2">
            Business Image
          </label>

          <div
            className={`w-[200px] h-[250px] border border-gray-300 p-1 rounded-md overflow-hidden cursor-pointer hover:opacity-80 transition ${
              errors?.image
                ? "border-red-500 focus:ring-2 focus:ring-blue-500 focus:outline-none focus:border-none"
                : "border-gray-300"
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
            <p className="text-red-500 text-xs mt-1">{errors.image[0]}</p>
          )}
        </div>

        <div className="bg-red-500 py-2 px-4 rounded-lg text-white">
          <p className="text-sm">
            Note that the maximum allowed file size for uploads is 10 megabytes
            (MB).
          </p>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-4">
          <button
            type="button"
            onClick={() => navigate("/business")}
            className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded transition"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className={`text-white px-5 py-2 rounded transition ${
              loading ? "bg-blue-500" : "bg-blue-500 hover:bg-blue-600"
            }`}
          >
            Save
          </button>
        </div>
      </form>
    </div>
  );
};

export default BusinessForm;
