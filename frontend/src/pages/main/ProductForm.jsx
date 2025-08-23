import { useState, useRef, useEffect } from "react";
import noImage from "../../assets/noImage.jpeg";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import axiosClient from "../../axiosClient";
import { useStateContext } from "../../contexts/ContextProvider";
import Loading from "../../components/loading";
import toastify from "../../components/toastify";

const ProductForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useStateContext();

  const [errors, setErrors] = useState([]);
  const [imagePreview, setImagePreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [listBusiness, setListBusiness] = useState([]);
  const [loading, setLoading] = useState(false);
  const [productID, setProductID] = useState(null);

  const product_name = useRef(null);
  const price = useRef(null);
  const quantity = useRef(null);
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
      formData.append("product_name", product_name.current.value);
      formData.append("price", price.current.value ? parseFloat(price.current.value) : '');
      formData.append("quantity", quantity.current.value ? parseInt(quantity.current.value) : "");
      formData.append("business_id", business.current.value);
      formData.append("user_id", user.id);

      if (imageFile) {
        formData.append("image", imageFile);
      }

      if (id) {
        formData.append('id', productID)
        
        const response = await axiosClient.post(`/product/update`, formData, {
          headers: {
            "Content-type": "multipart/form-data",
          },
        });

        if (response.data.message) {
          toastify("success", "Updated successfully!");
          navigate("/product");
        }
      } else {
        const response = await axiosClient.post(`/product/create`, formData, {
          headers: {
            "Content-type": "multipart/form-data",
          },
        });

        if (response.data.message) {
          toastify("success", "Created successfully!");
          navigate("/product");
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
      const response = await axiosClient.post(`/product/fetchBusinesses`, {
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
      const response = await axiosClient.post("/product/find", {
        id: id,
      });

      if (response.data.message) {
        product_name.current.value = response.data.data.product_name;
        price.current.value = response.data.data.price;
        quantity.current.value = response.data.data.quantity;
        business.current.value = response.data.data.business_id;
        setImagePreview(response.data.data.image);
        setImageFile(response.data.data.image);
        setProductID(response.data.data.id)
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
    document.title = 'Product Form - Muibu'
  }, []);

  return (
    <div className="bg-white mx-5 my-7 shadow-md rounded-lg p-6">
      {loading && <Loading />}

      <h2 className="text-2xl font-semibold text-gray-700 mb-6">
        {id ? "Update Product" : "New Product"}
      </h2>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label htmlFor="product_name">Product name</label>
          <input
            type="text"
            id="product_name"
            ref={product_name}
            className={`border border-gray-300 block w-full px-4 py-2 rounded mt-1 focus:outline-none focus:ring-2 focus:ring-blue-400 ${
              errors.product_name ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors?.product_name && (
            <p className="text-red-500 text-sm mt-1">
              {errors.product_name[0]}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="price">Price</label>
          <input
            type="number"
            id="price"
            ref={price}
            className={`border border-gray-300 block py-2 px-4 w-full rounded focus:ring-2 focus:ring-blue-500 focus:outline-none mt-1 ${
              errors.price ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors?.price && (
            <p className="text-red-500 text-sm mt-1">{errors.price[0]}</p>
          )}
        </div>

        <div>
          <label htmlFor="quantity">Quantity</label>
          <input
            type="number"
            id="quantity"
            ref={quantity}
            className={`border border-gray-300 block py-2 px-4 w-full rounded focus:ring-2 focus:ring-blue-500 focus:outline-none mt-1 ${
              errors.quantity ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors?.quantity && (
            <p className="text-red-500 text-sm mt-1">{errors.quantity[0]}</p>
          )}
        </div>

        <div>
          <label htmlFor="quantity">Choose business</label>
          <select
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
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Business Image
          </label>

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
              onClick={() => navigate("/product")}
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

export default ProductForm;
