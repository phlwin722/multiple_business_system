import { useEffect, useState } from "react";
import axiosClient from "../../axiosClient";
import { useStateContext } from "../../contexts/ContextProvider";
import { IoMdDownload } from "react-icons/io";
import { MdOutlineBusiness } from "react-icons/md";
import { MdDateRange } from "react-icons/md";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

const AttendanceList = () => {
  const { user } = useStateContext();

  const [listBusiness, setListBusiness] = useState([]);
  const [listAttendance, setListAttendance] = useState([]);
  const [selectedBusinessId, setSelectedBusinessId] = useState("");
  const [selectCalendar, setSelectCalendar] = useState("weekly");

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const fetchBusiness = async () => {
    try {
      const response = await axiosClient.post("/product/fetchBusinesses", {
        user_id: user.user_id,
      });

      if (response.data.data) {
        setListBusiness(response.data.data);

        setSelectedBusinessId(response.data.data[0].id.toString());
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

      if (selectedBusinessId) {
        payload.business_id = selectedBusinessId;
      }

      if (selectCalendar === "custom") {
        payload.start_date = startDate;
        payload.end_date = endDate;
      }

      if (user.position === "manager") {
        payload.business_id = user.business_id;
      }

      response = await axiosClient.post("/attendance/index", payload);

      if (response.data) {
        setListAttendance(response.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const totalPages = Math.ceil(listAttendance.length / itemsPerPage);

  const paginatedRows = listAttendance.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Helper: Convert image URL to base64
  const toBase64FromUrl = async (url) => {
    try {
      const response = await fetch(url, { mode: "cors" });
      if (!response.ok) {
        throw new Error(
          `Failed to fetch image: ${response.status} ${response.statusText}`
        );
      }
      const blob = await response.blob();
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });
    } catch (err) {
      console.error("Image fetch/convert error:", err);
      return null; // gracefully handle missing logo
    }
  };

  const makeCircularImage = (base64Img, size = 100) => {
    return new Promise((resolve) => {
      const img = new Image();
      img.crossOrigin = "Anonymous";
      img.src = base64Img;
      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext("2d");

        // Draw circle clip
        ctx.beginPath();
        ctx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2, true);
        ctx.closePath();
        ctx.clip();

        // Draw image inside circle
        ctx.drawImage(img, 0, 0, size, size);

        resolve(canvas.toDataURL("image/png"));
      };
    });
  };

  // jsPDF generation function
  // jsPDF generation function
  const generatePDF = async (attendanceData, businessName, logoBase64) => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();

    // Logo size
    const logoSize = 10;
    const spacing = 5; // gap between logo and text
    let logoX = 0;
    let textX = 0;
    const textY = 15;

    // Measure text width
    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    const textWidth = doc.getTextWidth(businessName);

    // Total width = logo + spacing + text
    const totalWidth = logoSize + spacing + textWidth;

    // Left starting X for centering
    const startX = (pageWidth - totalWidth) / 2;

    // Logo X,Y
    logoX = startX;
    const logoY = textY - logoSize / 2; // vertically align with text

    // Text X (after logo + spacing)
    textX = startX + logoSize + spacing;

    // --- Draw Logo ---
    if (logoBase64) {
      try {
        const formatMatch = logoBase64.match(
          /^data:image\/(png|jpeg|jpg|jfif);/i
        );
        let format = "JPEG";
        if (formatMatch) {
          format = formatMatch[1].toLowerCase() === "png" ? "PNG" : "JPEG";
        }
        const circularLogo = await makeCircularImage(logoBase64, 100);
        doc.addImage(circularLogo, "PNG", logoX, logoY, logoSize, logoSize);
      } catch (err) {
        console.error("Error adding image:", err);
      }
    }

    // --- Draw Business Name ---
    doc.text(businessName, textX, 17);

    // --- Add Subtitle or Description ---
    doc.setFontSize(11);
    doc.setFont("helvetica", "normal");
    doc.text("Attendance Report", pageWidth / 2, 35, { align: "center" });

    doc.setFontSize(9);
    doc.text("Generated on: " + new Date().toLocaleString(), 14, 47);

    const columns = [
      { header: "Business Name", dataKey: "business_name" },
      { header: "Full Name", dataKey: "full_name" },
      { header: "Time Rendered", dataKey: "rendered_time" },
    ];

    const rows = attendanceData.map((item) => ({
      business_name: item.business_name,
      full_name: item.full_name,
      rendered_time: item.rendered_time,
    }));

    autoTable(doc, {
      startY: 50,
      head: [columns.map((col) => col.header)],
      body: rows.map((row) => columns.map((col) => row[col.dataKey] || "")),
      styles: { fontSize: 10 },
      headStyles: { fillColor: [0, 102, 204], textColor: [255, 255, 255] },
    });

    // --- Footer with Page Numbers ---
    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(9);
      doc.text(
        `Page ${i} of ${pageCount}`,
        pageWidth - 20,
        doc.internal.pageSize.getHeight() - 10
      );
    }

    doc.save(`${businessName}-Attendance.pdf`);
  };

  // Download button handler
  const handleDownload = async () => {
    try {
      // Find selected business object
      const business = listBusiness.find(
        (b) => b.id.toString() === selectedBusinessId
      );
      if (!business) {
        alert("Please select a business.");
        return;
      }

      // Convert logo image to base64 (from API full URL)
      const logoUrl = business.image.replace("http://127.0.0.1:8002", "");
      const logoBase64 = await toBase64FromUrl(logoUrl);

      // Generate PDF with current attendance data and business info
      generatePDF(listAttendance, business.business_name, logoBase64);
    } catch (error) {
      console.error("Failed to generate PDF:", error);
      alert("Failed to generate PDF, check console for details.");
    }
  };

  useEffect(() => {
    fetchBusiness();
    UserSummaryTable();
    document.title = "Attendance - Muibu";
  }, []);

  useEffect(() => {
    setCurrentPage(1); // Reset to first page
    if (selectCalendar !== "custom") {
      UserSummaryTable();
    }
  }, [selectCalendar, selectedBusinessId]);

  useEffect(() => {
    setCurrentPage(1); // Reset to first page
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
          className={`flex flex-col sm:flex-row  items-start lg:items-center gap-4 lg:gap-7 w-full`}
        >
          {/* Business Selector */}
          <div
            className={`relative w-full sm:w-52 ${
              user.position === "manager" ? "hidden" : ""
            }`}
          >
            <MdOutlineBusiness className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xl pointer-events-none" />
            <select
              value={selectedBusinessId}
              onChange={(e) => setSelectedBusinessId(e.target.value)}
              className="peer block w-full border border-gray-300 bg-white p-2 pt-4 pl-10 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
            >
              {listBusiness.map((businesses) => (
                <option key={businesses.id} value={businesses.id}>
                  {businesses.business_name}
                </option>
              ))}
            </select>
            <label
              className={`absolute left-10 top-3 text-gray-500 transition-all pointer-events-none peer-focus:text-xs peer-focus:top-1 peer-focus:text-blue-600 ${
                selectedBusinessId ? "text-xs top-[4px] text-blue-600" : ""
              }`}
            >
              Select Business
            </label>
          </div>

          {/* Calendar Selector */}
          <div className="relative w-full sm:w-52">
            <MdDateRange className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xl pointer-events-none" />
            <select
              value={selectCalendar}
              onChange={(e) => setSelectCalendar(e.target.value)}
              className="peer block w-full pl-10 border border-gray-300 bg-white p-2 pt-4 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="day">Day</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
              <option value="yearly">Yearly</option>
              <option value="custom">Custom Range</option>
            </select>
            <label
              className={`absolute left-10 top-3 text-gray-500 transition-all pointer-events-none peer-focus:text-xs peer-focus:top-1 peer-focus:text-blue-600 ${
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
            onClick={handleDownload}
            className={`py-2 px-4 rounded-md w-full sm:w-auto flex items-center justify-center gap-2 ${
              paginatedRows.length > 0
                ? "bg-blue-500  text-white hover:bg-blue-600 "
                : "bg-blue-300 cursor-not-allowed text-white"
            }`}
            title="download"
          >
            <IoMdDownload size={20} />
            <span className="hidden sm:inline">Download</span>
          </button>
        </div>
      </div>

      {/* Attendance Table */}
      <div className="overflow-x-auto bg-white rounded-md shadow-lg mt-6">
        <table className="w-full text-sm text-left border-b border-gray-300">
          <thead className="bg-gray-50 text-gray-700 border-b border-gray-300">
            <tr>
              <th className="px-4 py-3 font-medium">Business</th>
              <th className="px-4 py-3 font-medium">Full name</th>
              <th className="px-4 py-3 font-medium">Time rendered</th>
            </tr>
          </thead>
          <tbody>
            {paginatedRows.length > 0 ? (
              paginatedRows.map((list) => (
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
        {paginatedRows.length > 0 && (
          <div className="flex justify-center mt-4 pb-4 flex-wrap gap-1">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className={`px-3 py-1 border rounded text-sm ${
                currentPage === 1
                  ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                  : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
              }`}
            >
              Prev
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`px-3 py-1 border rounded text-sm ${
                  currentPage === page
                    ? "bg-blue-500 text-white border-blue-500"
                    : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
                }`}
              >
                {page}
              </button>
            ))}

            <button
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
              className={`px-3 py-1 border rounded text-sm ${
                currentPage === totalPages
                  ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                  : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
              }`}
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AttendanceList;
