import { useEffect, useState } from "react";
import axiosClient from "../../axiosClient";
import { useStateContext } from "../../contexts/ContextProvider";
import { IoMdDownload } from "react-icons/io";

const AttendanceList = () => {
  const { user } = useStateContext();

  const [listBusiness, setListBusiness] = useState([]);
  const [listAttendance, setListAttendance] = useState([]);
  const [selectedBusinessId, setSelectedBusinessId] = useState("");
  const [selectCalendar, setSelectCalendar] = useState("weekly");

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const fetchBusiness = async () => {
    try {
      const response = await axiosClient.post("/product/fetchBusinesses", {
        user_id: user.user_id,
      });

      if (response.data.data) {
        setListBusiness(response.data.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const UserSummaryTable = async () => {
    try {
      let response;

      const payload = {
        user_id: user.user_id,
        calendar: selectCalendar,
      };

      if (selectedBusinessId > 0) {
        payload.business_id = selectedBusinessId;
      }

      if (selectCalendar === "custom") {
        payload.start_date = startDate;
        payload.end_date = endDate;
      }

      if (user.position === "manager") {
        payload.business_id = user.business_id;

        response = await axiosClient.post("/attendance/index", payload);
      } else {
        response = await axiosClient.post("/attendance/index", payload);
      }

      if (response.data) {
        setListAttendance(response.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchBusiness();
    UserSummaryTable();
    document.title = "Attendance - Muibu";
  }, []);

  useEffect(() => {
    if (selectCalendar !== "custom") {
      UserSummaryTable();
    }
  }, [selectCalendar, selectedBusinessId]);

  useEffect(() => {
    if (selectCalendar === "custom" && startDate && endDate) {
      UserSummaryTable();
    }
  }, [startDate, endDate]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Attendance</h1>

      <div className="w-full bg-white rounded-md p-3 shadow-md flex flex-col lg:flex-row gap-4 justify-between">
        {/* Left Section (Selectors) */}
        <div
          className={`flex flex-col md:flex-row items-start lg:items-center gap-4 lg:gap-7 w-full`}
        >
          {/* Business Selector */}
          <div
            className={`relative w-full sm:w-52 ${
              user.position === "manager" ? "hidden" : ""
            }`}
          >
            <select
              value={selectedBusinessId}
              onChange={(e) => setSelectedBusinessId(e.target.value)}
              className="peer block w-full border border-gray-300 bg-white p-2 pt-4 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="" hidden></option>
              <option value="0">All</option>
              {listBusiness.map((businesses) => (
                <option key={businesses.id} value={businesses.id}>
                  {businesses.business_name}
                </option>
              ))}
            </select>
            <label
              className={`absolute left-2 top-3 text-gray-500 transition-all pointer-events-none peer-focus:text-xs peer-focus:top-1 peer-focus:text-blue-600 ${
                selectedBusinessId ? "text-xs top-[4px] text-blue-600" : ""
              }`}
            >
              Select Business
            </label>
          </div>

          {/* Calendar Selector */}
          <div className="relative w-full sm:w-52">
            <select
              value={selectCalendar}
              onChange={(e) => setSelectCalendar(e.target.value)}
              className="peer block w-full border border-gray-300 bg-white p-2 pt-4 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="day">Day</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
              <option value="yearly">Yearly</option>
              <option value="custom">Custom Range</option>
            </select>
            <label
              className={`absolute left-2 top-3 text-gray-500 transition-all pointer-events-none peer-focus:text-xs peer-focus:top-1 peer-focus:text-blue-600 ${
                selectCalendar ? "text-xs top-[4px] text-blue-600" : ""
              }`}
            >
              Select Date
            </label>
          </div>

          {/* Show custom date pickers if "custom" selected */}
          {selectCalendar === "custom" && (
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-5 w-full sm:w-auto">
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="border border-gray-300 rounded-md py-3 px-2 w-full sm:w-40"
              />
              <span className="self-center hidden sm:block">to</span>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="border border-gray-300 rounded-md py-3 px-2 w-full sm:w-40"
              />
            </div>
          )}
        </div>

        {/* Download Button */}
        <div className="flex justify-end lg:justify-center">
          <button
            className="py-2 px-4 bg-blue-500 rounded-md text-white hover:bg-blue-600 w-full sm:w-auto flex items-center justify-center gap-2"
            title="download"
          >
            <IoMdDownload size={20} />
            <span className="hidden sm:inline">Download</span>
          </button>
        </div>
      </div>

      {/* Attendance Table */}
      <div className="overflow-x-auto bg-white rounded-md shadow-lg mt-6">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-50 text-gray-700 border-b border-gray-300">
            <tr>
              <th className="px-4 py-3 font-medium">Business</th>
              <th className="px-4 py-3 font-medium">Full name</th>
              <th className="px-4 py-3 font-medium">Time rendered</th>
            </tr>
          </thead>
          <tbody>
            {listAttendance.length > 0 ? (
              listAttendance.map((list) => (
                <tr key={list.id} className={`transition hover:bg-gray-100`}>
                  <td className="px-4 py-3 text-gray-700">
                    {list.business_name}
                  </td>
                  <td className="px-4 py-3 text-gray-700">{list.full_name}</td>
                  <td className="px-4 py-3 text-gray-700">
                    {list.rendered_time}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={3}
                  className="px-4 py-6 text-center text-gray-500 italic"
                >
                  No data available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AttendanceList;
