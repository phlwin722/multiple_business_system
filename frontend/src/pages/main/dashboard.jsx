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
      const response = await axiosClient.get(`${URL}/sales/${user.user_id}`);

      if (response.data.data != 0) {
        setCountSales(response.data.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const fetchEmployee = async () => {
    try {
      const response = await axiosClient.get(`${URL}/employee/${user.user_id}`);

      if (response.data.data != 0) {
        setCountEmployee(response.data.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const fetchProduct = async () => {
    try {
      const response = await axiosClient.get(`${URL}/products/${user.user_id}`);

      if (response.data.data != 0) {
        setCountProduct(response.data.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const fetchBusiness = async () => {
    try {
      const response = await axiosClient.get(`${URL}/business/${user.user_id}`);

      if (response.data.data != 0) {
        setCountBusiness(response.data.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const fetchProductList = async () => {
    try {
      const response = await axiosClient.get(
        `${URL}/product-list/${user.user_id}`
      );

      if (response.data.data) {
        setRowsProduct(response.data.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const fetchOutOfStock = async () => {
    try {
      const response = await axiosClient.get(
        `${URL}/product-out-of-stock/${user.user_id}`
      );

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
    document.title = "Dashboard - Muibu"
  }, []);
  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4 text-gray-700 mb-10">
        Dashboard
      </h1>

      <div className="flex grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-5 bg-red-500 rounded-md flex justify-between">
          <div className="flex flex-col">
            <h1 className="text-white text-2xl font-bold">{countBusiness}</h1>
            <p className="text-white font-medium">Businesses</p>
          </div>
          <div>
            <MdOutlineBusiness
              size={40}
              className="text-white flex items-center justify-center"
            />
          </div>
        </div>

        <div className="p-5 rounded-md flex justify-between bg-blue-500">
          <div className="flex flex-col">
            <h1 className="text-white text-2xl font-bold">{countEmployee}</h1>
            <p className="text-white font-medium">Employees</p>
          </div>
          <div>
            <IoPeople
              size={40}
              className="text-white flex items-center justify-center"
            />
          </div>
        </div>

        <div className="p-5 rounded-md bg-green-500 flex justify-between">
          <div className="flex flex-col">
            <h1 className="text-white text-2xl font-bold">{countProduct}</h1>
            <p className="text-white font-medium">Products</p>
          </div>
          <div>
            <FaBoxOpen
              size={40}
              className="text-white flex items-center justify-center"
            />
          </div>
        </div>

        <div className="p-5 flex justify-between rounded-md bg-yellow-500">
          <div className="flex flex-col">
            <h1 className="text-white text-2xl font-bold mr-5">{countSales}</h1>
            <p className="text-white font-medium">Sales</p>
          </div>
          <div>
            <TbCurrencyPeso
              size={40}
              className="text-white flex items-center justify-center"
            />
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-5 mt-4">
        <div className=" bg-white md:col-span-2 rounded-md p-4 shadow-md h-[350px] md:h-[450px] border border-gray-200 overflow-auto">
          <h3 className="text-lg font-semibold mb-2 text-gray-700 ">Sales</h3>
        </div>

        <div className="rounded-md bg-white h-[400px] md:h-[450px] p-4 shadow-md border border-gray-200 overflow-hidden">
          <h3 className="text-lg font-semibold mb-2 text-gray-700 ">Calendar</h3>
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
          <h3 className="text-lg font-semibold mb-2 text-gray-700 ">Out of stocks</h3>
          <div className="overflow-x-auto">
            <TableDashboard rows={rowsOutOfStocks} columns={columnOutOfStocks} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default dashboard;
