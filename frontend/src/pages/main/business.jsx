// pages/business/index.jsx
import Table from "../../components/Table";
import { useState, useEffect } from "react";
import axiosClient from "../../axiosClient";
import { useStateContext } from "../../contexts/ContextProvider";

const Business = () => {
  const { user } = useStateContext()

  const [rows, setRows] = useState([]);

  const columns = [
    { 
      name: "Business name",
      key: "business_name" 
    },
    { 
      name: "Image", 
      key: "image" 
    },
  ];

  const fetchData = async() => {
    try {
      const response = await axiosClient.post('/bussiness/index', {
        user_id: user.id
      });

      if (response.data.message) {
        setRows(response.data.data);
      }
    } catch (error) {
      console.log(error)
    } 
  }
  useEffect(() => {
    fetchData()
  },[])
  /* const rows = [
    { id: '1', name: "Acme Corp", industry: "Technology", location: "San Francisco" },
    { id: '2', name: "GreenLeaf", industry: "Agriculture", location: "Iowa" },
    { id: '3', name: "Sunrise Bakery", industry: "Food & Beverage", location: "New York" },
  ]; */
  /* cont rows = [] */

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Businesses</h1>
      <Table 
        columns={columns} 
        rows={rows} 
        url={'/bussiness'}
        fetchData={fetchData}
        type={false}
        />
    </div>
  );
};

export default Business;
