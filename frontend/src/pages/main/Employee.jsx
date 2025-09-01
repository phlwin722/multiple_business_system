import Table from "../../components/Table";
import { useState, useEffect } from "react";
import axiosClient from "../../axiosClient";
import { useStateContext } from "../../contexts/ContextProvider";

const Employee = () => {
  const { user } = useStateContext();
  const [rows, setRows] = useState([]);
  const columns = [
    {
      name: "Business",
      key: "business_name",
    },
    {
      name: "Full name",
      key: "full_name",
    },
    {
      name: "Email",
      key: "email",
    },
    {
      name: "Position",
      key: "position",
    },
    {
      name: "Image",
      key: "image",
    },
    {
      name: "Status",
      key: "status",
    },
  ];

  const fetchData = async (business_id = null, search = null) => {
    try {
      let response;
      if (business_id > 0) {
        response = await axiosClient.post("/employee/index", {
          user_id: user.id,
          business_id: business_id,
          full_name: search,
        });
      } else {
        if (user.position === "manager") {
          response = await axiosClient.post("/employee/index", {
            user_id: user.user_id,
            full_name: search,
            business_id: user.business_id,
            position: "teller",
          });
        } else {
          response = await axiosClient.post("/employee/index", {
            user_id: user.user_id,
            full_name: search,
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
    document.title = "Employee - Muibu";
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Employee</h1>
      <Table
        columns={columns}
        rows={rows}
        url={"/employee"}
        fetchData={fetchData}
        type={true}
      />
    </div>
  );
};

export default Employee;
