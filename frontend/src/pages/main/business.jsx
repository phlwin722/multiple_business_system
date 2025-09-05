// pages/business/index.jsx
import Table from "../../components/Table";
import { useState, useEffect } from "react";
import axiosClient from "../../axiosClient";
import { useStateContext } from "../../contexts/ContextProvider";
import { useLocation } from "react-router-dom";

const Business = () => {
  const { user } = useStateContext();
  const location = useLocation();
  const [rows, setRows] = useState([]);

  const columns = [
    {
      name: "Business name",
      key: "business_name",
    },
    {
      name: "Image",
      key: "image",
    },
  ];

  const fetchData = async (business_id = null, search = null) => {
    try {
      const response = await axiosClient.post("/business/index", {
        user_id: user.user_id,
        search: search,
      });

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
    document.title = "Business - Muibu";
  }, []);

  useEffect(() => {
    if (location.state?.toast) {
      window.history.replaceState({}, document.title); // avoids duplicate toast on refresh
    }
  }, [location.state]);

  /* const rows = [
    { id: '1', name: "Acme Corp", industry: "Technology", location: "San Francisco" },
    { id: '2', name: "GreenLeaf", industry: "Agriculture", location: "Iowa" },
    { id: '3', name: "Sunrise Bakery", industry: "Food & Beverage", location: "New York" },
  ]; */
  /* cont rows = [] */

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4 text-gray-700">Businesses</h1>
      <Table
        columns={columns}
        rows={rows}
        url={"/business"}
        fetchData={fetchData}
        type={false}
        archive={false}
      />
    </div>
  );
};

export default Business;
