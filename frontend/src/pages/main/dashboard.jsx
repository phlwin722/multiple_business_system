import { MdOutlineBusiness } from "react-icons/md";
import { IoPeople } from "react-icons/io5";
import { FaBoxOpen } from "react-icons/fa";
import axiosClient from "../../axiosClient";
import { useEffect, useState } from "react";
import { useStateContext } from "../../contexts/ContextProvider";
import { TbCurrencyPeso } from "react-icons/tb";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import TableDashboard from "../../components/TableDashboard";

const dashboard = () => {
  const { user } = useStateContext();
  const [countSales, setCountSales] = useState(0);
  const [countProduct, setCountProduct] = useState(0);
  const [countEmployee, setCountEmployee] = useState(0);
  const [countBusiness, setCountBusiness] = useState(0);
  const [rowsProduct, setRowsProduct] = useState([]);
  const [rowsOutOfStocks, setOutOfStocks] = useState([]);

  const columnProduct = [
    {
      name: "Product Name",
      key: "product_name",
    },
    {
      name: "Business Name",
      key: "business_name",
    },
    {
      name: "Sales",
      key: "quantity_sold",
    },
  ];

  const columnOutOfStocks = [
    {
      name: "Product Name",
      key: "product_name",
    },
    {
      name: "Business Name",
      key: "business_name",
    },
  ];

  const URL = "/dashboard";

  const fetchSales = async () => {
    try {
      let response;
      if (user.position == "Manager") {
        response = await axiosClient.post(`${URL}/sales/${user.user_id}`, {
          business_id: user.business_id,
        });
      } else {
        response = await axiosClient.post(`${URL}/sales/${user.user_id}`);
      }

      if (response.data.data != 0) {
        setCountSales(response.data.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const fetchEmployee = async () => {
    try {
      let response;
      if (user.position == "Manager") {
        response = await axiosClient.post(`${URL}/employee/${user.user_id}`, {
          business_id: user.business_id,
        });
      } else {
        response = await axiosClient.post(`${URL}/employee/${user.user_id}`);
      }

      if (response.data.data != 0) {
        setCountEmployee(response.data.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const fetchProduct = async () => {
    try {
      let response;
      if (user.position == "Manager") {
        response = await axiosClient.post(`${URL}/products/${user.user_id}`, {
          business_id: user.business_id,
        });
      } else {
        response = await axiosClient.post(`${URL}/products/${user.user_id}`);
      }

      if (response.data.data != 0) {
        setCountProduct(response.data.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const fetchBusiness = async () => {
    try {
      let response;
      if (user.position == "Manager") {
        response = await axiosClient.post(`${URL}/business/${user.user_id}`, {
          business_id: user.business_id,
        });
      } else {
        response = await axiosClient.post(`${URL}/business/${user.user_id}`);
      }

      if (response.data.data != 0) {
        setCountBusiness(response.data.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const fetchProductList = async () => {
    try {
      let response;
      if (user.position == "Manager") {
        response = await axiosClient.post(
          `${URL}/product-list/${user.user_id}`,
          {
            business_id: user.business_id,
          }
        );
      } else {
        response = await axiosClient.post(
          `${URL}/product-list/${user.user_id}`
        );
      }

      if (response.data.data) {
        setRowsProduct(response.data.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const fetchOutOfStock = async () => {
    try {
      let response;
      if (user.position == "Manager") {
        response = await axiosClient.post(
          `${URL}/product-out-of-stock/${user.user_id}`,
          {
            business_id: user.business_id,
          }
        );
      } else {
        response = await axiosClient.post(
          `${URL}/product-out-of-stock/${user.user_id}`
        );
      }

      if (response.data.data) {
        setOutOfStocks(response.data.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchBusiness();
    fetchEmployee();
    fetchProduct();
    fetchSales();
    fetchProductList();
    fetchOutOfStock();
    document.title = "Dashboard - Muibu";
  }, []);
  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4 text-gray-700 mb-10">
        Dashboard
      </h1>

       <div
      className={`grid grid-cols-2 gap-4 sm:grid-cols-2 md:${
        user.position === "Manager" ? "grid-cols-3" : "grid-cols-4"
      }`}
    >
      {/* Conditionally render Businesses card if not Manager */}
      {user.position !== "Manager" && (
        <div className="p-5 bg-red-500 rounded-md flex items-center justify-between gap-4 min-w-0">
          <div className="flex flex-col min-w-0">
            <h1 className="text-white text-2xl font-bold truncate">{countBusiness}</h1>
            <p className="text-white font-medium truncate">Businesses</p>
          </div>
          <MdOutlineBusiness size={40} className="text-white flex-shrink-0" />
        </div>
      )}

      {/* Employees Card */}
      <div className="p-5 bg-blue-500 rounded-md flex items-center justify-between gap-4 min-w-0">
        <div className="flex flex-col min-w-0">
          <h1 className="text-white text-2xl font-bold truncate">{countEmployee}</h1>
          <p className="text-white font-medium truncate">Employees</p>
        </div>
        <IoPeople size={40} className="text-white flex-shrink-0" />
      </div>

      {/* Products Card */}
      <div className="p-5 bg-green-500 rounded-md flex items-center justify-between gap-4 min-w-0">
        <div className="flex flex-col min-w-0">
          <h1 className="text-white text-2xl font-bold truncate">{countProduct}</h1>
          <p className="text-white font-medium truncate">Products</p>
        </div>
        <FaBoxOpen size={40} className="text-white flex-shrink-0" />
      </div>

      {/* Sales Card */}
      <div className="p-5 bg-yellow-500 rounded-md flex items-center justify-between gap-4 min-w-0">
        <div className="flex flex-col min-w-0">
          <h1 className="text-white text-2xl font-bold truncate">{countSales}</h1>
          <p className="text-white font-medium truncate">Sales</p>
        </div>
        <TbCurrencyPeso size={40} className="text-white flex-shrink-0" />
      </div>
    </div>

      <div className="grid md:grid-cols-3 gap-5 mt-4">
        <div className=" bg-white md:col-span-2 rounded-md p-4 shadow-md h-[350px] md:h-[450px] border border-gray-200 overflow-auto">
          <h3 className="text-lg font-semibold mb-2 text-gray-700 ">Sales</h3>
        </div>

        <div className="rounded-md bg-white h-[400px] md:h-[450px] p-4 shadow-md border border-gray-200 overflow-hidden">
          <h3 className="text-lg font-semibold mb-2 text-gray-700 ">
            Calendar
          </h3>
          <div className="hidden md:block">
            <FullCalendar
              plugins={[dayGridPlugin]}
              initialView="dayGridMonth"
              height={370}
            />
          </div>
          <div className="md:hidden">
            <FullCalendar
              plugins={[dayGridPlugin]}
              initialView="dayGridMonth"
              height={330}
            />
          </div>
        </div>

        <div className="overflow-x-auto md:col-span-2 rounded-md h-[350px]  bg-white  md:h-[350px] p-4 shadow-md border border-gray-200">
          <h3 className="text-lg text-gray-700 font-semibold mb-2">Products</h3>
          <div className="overflow-x-auto">
            <TableDashboard rows={rowsProduct} columns={columnProduct} />
          </div>
        </div>

        <div className="overflow-x-auto rounded-md h-[350px] bg-white  md:h-[350px]  p-4 shadow-md border border-gray-200">
          <h3 className="text-lg font-semibold mb-2 text-gray-700 ">
            Out of stocks
          </h3>
          <div className="overflow-x-auto">
            <TableDashboard
              rows={rowsOutOfStocks}
              columns={columnOutOfStocks}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default dashboard;
