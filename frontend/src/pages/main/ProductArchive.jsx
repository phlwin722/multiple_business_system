import React from "react";
import Table from "../../components/Table";
import { useState, useEffect } from "react";
import axiosClient from "../../axiosClient";
import { useStateContext } from "../../contexts/ContextProvider";

const ProductArchive = () => {
  const { user } = useStateContext();
  const [rows, setRows] = useState([]);
  const columns = [
    {
      name: "Business",
      key: "business_name",
    },
    {
      name: "Product name",
      key: "product_name",
    },
    {
      name: "Price",
      key: "price",
    },
    {
      name: "Quantity",
      key: "quantity",
    },
    {
      name: "Image",
      key: "image",
    },
  ];

  const fetchData = async (business_id = null, search = null) => {
    try {
      let response;
      if (business_id > 0) {
        response = await axiosClient.post("/product/archive", {
          user_id: user.user_id,
          business_id: business_id,
          product_name: search,
        });
      } else {
        if (user.position === "Manager") {
          response = await axiosClient.post("/product/archive", {
            user_id: user.user_id,
            full_name: search,
            business_id: user.business_id,
            position: "manager",
            product_name: search,
          });
        } else {
          response = await axiosClient.post("/product/archive", {
            user_id: user.user_id,
            product_name: search,
          });
        }
      }

      if (response.data.message) {
        setRows(response.data.data);
      }
    } catch (error) {
      console.log(error);
      toastify("error", "Something went wrong. Please try again.");
    }
  };

  useEffect(() => {
    fetchData();
    document.title = "Product Archive - Muibu";
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-gray-700 text-2xl font-semibold mb-4">Product Archive</h1>
      <Table
        columns={columns}
        rows={rows}
        url={"/product"}
        fetchData={fetchData}
        type={true}
        archive={true}
      />
    </div>
  );
};

export default ProductArchive;
